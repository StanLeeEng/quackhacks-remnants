import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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

    const formData = await req.formData();
    const audioFile = formData.get("audioFile") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: "No audio file provided" },
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

    // Convert blob to buffer for ElevenLabs
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a voice clone with ElevenLabs
    const voiceName = `${session.user.name || session.user.email}_${Date.now()}`;
    
    // Determine file extension based on audio type
    const audioType = audioFile.type || "audio/webm";
    let fileName = "voice-sample";
    let mimeType = audioType;
    
    if (audioType.includes("webm")) {
      fileName = "voice-sample.webm";
      mimeType = "audio/webm";
    } else if (audioType.includes("mpeg") || audioType.includes("mp3")) {
      fileName = "voice-sample.mp3";
      mimeType = "audio/mpeg";
    } else if (audioType.includes("wav")) {
      fileName = "voice-sample.wav";
      mimeType = "audio/wav";
    }
    
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append("name", voiceName);
    elevenLabsFormData.append("files", new Blob([buffer], { type: mimeType }), fileName);
    elevenLabsFormData.append("description", `Voice clone for ${session.user.name || session.user.email}`);

    const cloneResponse = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: elevenLabsFormData,
    });

    if (!cloneResponse.ok) {
      const errorText = await cloneResponse.text();
      console.error("ElevenLabs error:", {
        status: cloneResponse.status,
        statusText: cloneResponse.statusText,
        error: errorText
      });
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to create voice clone: ${cloneResponse.status} - ${errorText.substring(0, 200)}` 
        },
        { status: 500 }
      );
    }

    const cloneData = await cloneResponse.json();
    const voiceId = cloneData.voice_id;

    if (!voiceId) {
      console.error("No voice_id in response:", cloneData);
      return NextResponse.json(
        { success: false, error: "No voice ID returned from ElevenLabs" },
        { status: 500 }
      );
    }

    // Save voice ID to the user's profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        voiceId: voiceId,
      },
    });

    return NextResponse.json({
      success: true,
      voiceId: voiceId,
    });
  } catch (error) {
    console.error("Error saving voice:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: `Failed to save voice recording: ${errorMessage}` },
      { status: 500 }
    );
  }
}
