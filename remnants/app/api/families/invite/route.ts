import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Find family by invite code (public endpoint for joining)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteCode = searchParams.get('code');

    if (!inviteCode) {
      return NextResponse.json(
        { success: false, error: 'Invite code is required' },
        { status: 400 }
      );
    }

    // Find family by invite code
    const family = await prisma.family.findUnique({
      where: { inviteCode },
      select: {
        id: true,
        name: true,
        description: true,
        inviteCode: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!family) {
      return NextResponse.json(
        { success: false, error: 'Invalid invite code' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      family,
    });

  } catch (error) {
    console.error('Find family by invite error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to find family' },
      { status: 500 }
    );
  }
}
