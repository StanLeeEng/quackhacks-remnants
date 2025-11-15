import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';

const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audioFile') as File;
    const name = formData.get('name') as string;

    if (!audioFile || !name) {
      return NextResponse.json(
        { error: 'Audio file and name are required' },
        { status: 400 }
      );
    }

    // Convert audio to File format for ElevenLabs
    const buffer = await audioFile.arrayBuffer();
    const file = new File([buffer], audioFile.name, { type: audioFile.type });

    // Clone voice with ElevenLabs
    const voice = await elevenLabs.voices.add({
      name: `${name}'s Voice`,
      description: `Voice clone for ${name}`,
      files: [file],
    });

    // TODO: Save to database
    // const user = await prisma.user.update({
    //   where: { id: userId },
    //   data: { voiceId: voice.voice_id }
    // });

    return NextResponse.json({
      success: true,
      voiceId: voice.voice_id,
      message: 'Voice successfully cloned!',
    }, { status: 201 });

  } catch (error) {
    console.error('Voice upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice recording' },
      { status: 500 }
    );
  }
}
