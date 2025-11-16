import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Message presets
const MESSAGE_PRESETS = [
  {
    type: "birthday",
    label: "Birthday Wishes",
    samples: [
      "Happy birthday {name}! Wishing you a day filled with love and laughter.",
      "Hope your special day is as wonderful as you are, {name}!",
      "Happy birthday! May all your wishes come true this year.",
    ],
  },
  {
    type: "encouragement",
    label: "Words of Encouragement",
    samples: [
      "I believe in you, {name}. You've got this!",
      "Keep pushing forward. I'm so proud of how far you've come.",
      "You're stronger than you know, and I'm always here for you.",
    ],
  },
  {
    type: "love",
    label: "Love & Appreciation",
    samples: [
      "I love you so much, {name}. You mean the world to me.",
      "Just wanted to remind you how special you are to me.",
      "Thinking of you and sending all my love.",
    ],
  },
  {
    type: "gratitude",
    label: "Thank You",
    samples: [
      "Thank you for everything, {name}. I'm so grateful for you.",
      "I just wanted to say thank you for being there for me.",
      "Your kindness means more to me than words can say.",
    ],
  },
];

// GET: Return available presets
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      presets: MESSAGE_PRESETS,
    });
  } catch (error) {
    console.error("Error fetching presets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}

// POST: Generate voice message
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { voiceId, messageType, customMessage, recipientName } = body;

    if (!voiceId) {
      return NextResponse.json(
        { success: false, error: "Voice ID is required" },
        { status: 400 }
      );
    }

    // Generate the message text
    let messageText: string;

    if (customMessage) {
      // Use custom message
      messageText = customMessage;
    } else if (messageType) {
      // Use preset message
      const preset = MESSAGE_PRESETS.find((p) => p.type === messageType);
      if (!preset) {
        return NextResponse.json(
          { success: false, error: "Invalid message type" },
          { status: 400 }
        );
      }

      // Pick a random sample
      const sample =
        preset.samples[Math.floor(Math.random() * preset.samples.length)];

      // Replace {name} placeholder with recipient name
      messageText = sample.replace(
        "{name}",
        recipientName || "there"
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Either messageType or customMessage is required",
        },
        { status: 400 }
      );
    }

    // Check if ElevenLabs API key is configured
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    // Generate speech using ElevenLabs text-to-speech
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: messageText,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error("ElevenLabs TTS error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to generate voice audio" },
        { status: 500 }
      );
    }

    // Convert audio to base64
    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    return NextResponse.json({
      success: true,
      message: messageText,
      audio: base64Audio,
      contentType: "audio/mpeg",
    });

  } catch (error) {
    console.error("Error generating message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate message" },
      { status: 500 }
    );
  }
}
