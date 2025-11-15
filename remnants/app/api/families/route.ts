import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create a new family
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, createdById } = body;

    if (!name || !createdById) {
      return NextResponse.json(
        { error: 'Name and creator ID are required' },
        { status: 400 }
      );
    }

    // Create family with creator as admin
    const family = await prisma.family.create({
      data: {
        name,
        description,
        createdById,
        members: {
          create: {
            userId: createdById,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      family,
    }, { status: 201 });

  } catch (error) {
    console.error('Family creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create family' },
      { status: 500 }
    );
  }
}

// Get all families for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const families = await prisma.family.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            audioLibrary: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      families,
    });

  } catch (error) {
    console.error('Fetch families error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch families' },
      { status: 500 }
    );
  }
}
