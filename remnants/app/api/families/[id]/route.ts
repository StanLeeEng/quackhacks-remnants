import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

// GET: Get family details by ID
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

    // Get family details
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                voiceId: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        _count: {
          select: {
            audioLibrary: true,
          },
        },
      },
    });

    if (!family) {
      return NextResponse.json(
        { success: false, error: 'Family not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      family,
    });

  } catch (error) {
    console.error('Get family error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch family details' },
      { status: 500 }
    );
  }
}

// DELETE: Leave or delete family
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

    // Get user's membership
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

    // Check if user is the creator/admin
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        members: true,
      },
    });

    if (!family) {
      return NextResponse.json(
        { success: false, error: 'Family not found' },
        { status: 404 }
      );
    }

    // If user is the creator and there are other members, transfer ownership or prevent deletion
    if (family.createdById === session.user.id && family.members.length > 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot leave family as creator while other members exist. Transfer ownership first.' },
        { status: 400 }
      );
    }

    // If user is the only member or not the creator, allow leaving
    if (family.createdById === session.user.id && family.members.length === 1) {
      // Delete the entire family if creator is the only member
      await prisma.family.delete({
        where: { id: familyId },
      });

      return NextResponse.json({
        success: true,
        message: 'Family deleted successfully',
      });
    } else {
      // Remove user from family
      await prisma.familyMember.delete({
        where: {
          userId_familyId: {
            userId: session.user.id,
            familyId,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully left family',
      });
    }

  } catch (error) {
    console.error('Delete family error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to leave family' },
      { status: 500 }
    );
  }
}
