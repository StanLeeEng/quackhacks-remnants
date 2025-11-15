import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Upload new audio recording
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const audioFile = formData.get('audioFile') as File;
    const uploadedById = formData.get('uploadedById') as string;
    const familyId = formData.get('familyId') as string;
    const tags = formData.get('tags') as string; // Comma-separated
    const isPublic = formData.get('isPublic') === 'true';

    if (!title || !audioFile || !uploadedById || !familyId) {
      return NextResponse.json(
        { error: 'Title, audio file, uploader ID, and family ID are required' },
        { status: 400 }
      );
    }

    // TODO: Upload audio file to storage (Vercel Blob/S3)
    // For now, using placeholder URL
    const audioUrl = `placeholder_url_for_${Date.now()}_${audioFile.name}`;
    
    // Get file metadata
    const fileSize = audioFile.size;
    const mimeType = audioFile.type;

    // Parse tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    // Create audio recording in database
    const audioRecording = await prisma.audioRecording.create({
      data: {
        title,
        description,
        audioUrl,
        fileSize,
        mimeType,
        tags: tagArray,
        isPublic,
        uploadedById,
        familyId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        family: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      audioRecording,
    }, { status: 201 });

  } catch (error) {
    console.error('Audio upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload audio' },
      { status: 500 }
    );
  }
}

// Get audio recordings for a family
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get('familyId');
    const userId = searchParams.get('userId');

    if (!familyId) {
      return NextResponse.json(
        { error: 'Family ID is required' },
        { status: 400 }
      );
    }

    // Verify user is member of family
    if (userId) {
      const isMember = await prisma.familyMember.findUnique({
        where: {
          userId_familyId: {
            userId,
            familyId,
          },
        },
      });

      if (!isMember) {
        return NextResponse.json(
          { error: 'User is not a member of this family' },
          { status: 403 }
        );
      }
    }

    const audioRecordings = await prisma.audioRecording.findMany({
      where: {
        familyId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      audioRecordings,
    });

  } catch (error) {
    console.error('Fetch audio error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio recordings' },
      { status: 500 }
    );
  }
}
