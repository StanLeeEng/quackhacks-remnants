import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';

const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Preset messages templates
const PRESET_MESSAGES = {
  birthday: [
    "Happy Birthday! May this special day be filled with joy, laughter, and wonderful memories. Wishing you all the best in the year ahead!",
    "Wishing you the happiest of birthdays! Hope your day is as amazing as you are. Cheers to another fantastic year!",
    "Happy Birthday to you! May all your dreams and wishes come true. Have a wonderful celebration!",
  ],
  anniversary: [
    "Happy Anniversary! Congratulations on another year of love, laughter, and beautiful memories together.",
    "Wishing you both a wonderful anniversary! Here's to many more years of happiness together.",
  ],
  congratulations: [
    "Congratulations on your amazing achievement! Your hard work and dedication truly paid off. So proud of you!",
    "Way to go! Congratulations on this incredible accomplishment. You deserve all the success!",
  ],
  thankyou: [
    "Thank you so much for everything you do. Your kindness and support mean the world to me.",
    "I just wanted to say thank you from the bottom of my heart. You're truly appreciated!",
  ],
  holiday: [
    "Happy Holidays! Wishing you and your loved ones a season filled with joy, peace, and happiness.",
    "Season's Greetings! May this holiday season bring you warmth, love, and wonderful memories.",
  ],
  justbecause: [
    "Just wanted to send you a special message to brighten your day. You're amazing and appreciated!",
    "Thinking of you and wanted to share some positive vibes. Hope this brings a smile to your face!",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voiceId, messageType, customMessage, recipientName } = body;

    if (!voiceId) {
      return NextResponse.json(
        { error: 'Voice ID is required' },
        { status: 400 }
      );
    }

    // Determine message to use
    let messageText: string;
    
    if (customMessage) {
      messageText = customMessage;
    } else if (messageType && PRESET_MESSAGES[messageType as keyof typeof PRESET_MESSAGES]) {
      const messages = PRESET_MESSAGES[messageType as keyof typeof PRESET_MESSAGES];
      messageText = messages[Math.floor(Math.random() * messages.length)];
    } else {
      return NextResponse.json(
        { error: 'Either customMessage or valid messageType is required' },
        { status: 400 }
      );
    }

    // Add recipient name if provided
    if (recipientName) {
      messageText = `${recipientName}, ${messageText}`;
    }

    // Generate audio with cloned voice
    const audioStream = await elevenLabs.generate({
      voice: voiceId,
      text: messageText,
      model_id: "eleven_multilingual_v2",
    });

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    // Convert to base64 for easy transmission
    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      audio: audioBase64,
      message: messageText,
      contentType: 'audio/mpeg',
      messageType: messageType || 'custom',
    });

  } catch (error) {
    console.error('Message generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}

// Get available preset message types
export async function GET() {
  return NextResponse.json({
    success: true,
    presets: Object.keys(PRESET_MESSAGES).map(key => ({
      type: key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      samples: PRESET_MESSAGES[key as keyof typeof PRESET_MESSAGES],
    })),
  });
}
