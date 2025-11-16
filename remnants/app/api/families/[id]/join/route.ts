import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: familyId } = await params;
    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return NextResponse.json(
        { success: false, error: 'Invite code is required' },
        { status: 400 }
      );
    }

    // Verify family exists and invite code matches
    const family = await prisma.family.findUnique({
      where: { id: familyId },
    });

    if (!family) {
      return NextResponse.json(
        { error: 'Family not found' },
        { status: 404 }
      );
    }

    if (family.inviteCode !== inviteCode) {
      return NextResponse.json(
        { success: false, error: 'Invalid invite code' },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: session.user.id,
          familyId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'User is already a member of this family' },
        { status: 400 }
      );
    }

    // Add user to family
    const familyMember = await prisma.familyMember.create({
      data: {
        userId: session.user.id,
        familyId,
        role: 'MEMBER',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        family: true,
      },
    });

    return NextResponse.json({
      success: true,
      familyMember,
      message: 'Successfully joined family',
    }, { status: 201 });

  } catch (error) {
    console.error('Join family error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to join family' },
      { status: 500 }
    );
  }
}
