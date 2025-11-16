import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// GET: Get all members of a family
export async function GET(
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

    // Verify user is a member of this family
    const familyMember = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: session.user.id,
          familyId,
        },
      },
    });

    if (!familyMember) {
      return NextResponse.json(
        { success: false, error: 'Not a member of this family' },
        { status: 403 }
      );
    }

    // Get all family members
    const members = await prisma.familyMember.findMany({
      where: { familyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            voiceId: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      members,
    });

  } catch (error) {
    console.error('Get family members error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch family members' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a member from family (admin only)
export async function DELETE(
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
    const { searchParams } = new URL(request.url);
    const memberIdToRemove = searchParams.get('memberId');

    if (!memberIdToRemove) {
      return NextResponse.json(
        { success: false, error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Verify user is an admin of this family
    const adminMember = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: session.user.id,
          familyId,
        },
      },
    });

    if (!adminMember || adminMember.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only admins can remove members' },
        { status: 403 }
      );
    }

    // Prevent removing yourself
    if (memberIdToRemove === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Use the leave family endpoint to remove yourself' },
        { status: 400 }
      );
    }

    // Remove the member
    await prisma.familyMember.delete({
      where: {
        userId_familyId: {
          userId: memberIdToRemove,
          familyId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Member removed successfully',
    });

  } catch (error) {
    console.error('Remove family member error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove family member' },
      { status: 500 }
    );
  }
}
