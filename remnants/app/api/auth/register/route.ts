import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { ElevenLabsClient } from 'elevenlabs';

const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const voiceMemo = formData.get('voiceMemo') as File;

    if (!email || !password || !name || !voiceMemo) {
      return NextResponse.json(
        { error: 'Email, password, name, and voice memo are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Clone voice from voice memo
    const buffer = await voiceMemo.arrayBuffer();
    const file = new File([buffer], voiceMemo.name, { type: voiceMemo.type });

    const voice = await elevenLabs.voices.add({
      name: `${name}'s Voice`,
      description: `Voice clone for ${name}`,
      files: [file],
    });

    // TODO: Upload voice memo to storage (Vercel Blob/S3)
    // For now, we'll store a placeholder URL
    const voiceMemoUrl = `placeholder_url_for_${email}_voice_memo`;

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        voiceId: voice.voice_id,
        voiceMemoUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        voiceId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
      message: 'User registered successfully with voice clone',
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
