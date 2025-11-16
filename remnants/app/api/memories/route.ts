import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// GET: Fetch all memories (audio recordings) shared with the user
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get only audio recordings shared with this user by other family members
    const memories = await prisma.audioRecording.findMany({
      where: {
        sharedWith: {
          some: {
            sharedWithId: session.user.id,
          },
        },
        // Exclude audio uploaded by the user themselves
        uploadedById: {
          not: session.user.id,
        },
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        family: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      memories: memories,
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch memories" },
      { status: 500 }
    );
  }
}

// POST: Create a new memory (save generated audio)
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { 
      title, 
      description, 
      audioUrl, 
      familyId, 
      usedVoiceId,
      duration,
      sharedWithUserIds 
    } = body;

    if (!title || !audioUrl || !familyId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user is a member of the family
    const familyMember = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId: session.user.id,
          familyId: familyId,
        },
      },
    });

    if (!familyMember) {
      return NextResponse.json(
        { success: false, error: "Not a member of this family" },
        { status: 403 }
      );
    }

    // Create the audio recording
    const memory = await prisma.audioRecording.create({
      data: {
        title,
        description: description || "",
        audioUrl,
        duration,
        usedVoiceId,
        uploadedById: session.user.id,
        familyId: familyId,
        tags: [],
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Share with specific users if specified, otherwise share with all family members
    let targetUserIds = sharedWithUserIds;
    
    if (!targetUserIds || targetUserIds.length === 0) {
      // Get all family members except the creator
      const allMembers = await prisma.familyMember.findMany({
        where: {
          familyId: familyId,
          userId: {
            not: session.user.id,
          },
        },
        select: {
          userId: true,
        },
      });
      targetUserIds = allMembers.map(m => m.userId);
    }

    // Create shared audio records
    if (targetUserIds && targetUserIds.length > 0) {
      await Promise.all(
        targetUserIds.map((userId: string) =>
          prisma.sharedAudio.create({
            data: {
              audioId: memory.id,
              sharedWithId: userId,
              sharedById: session.user.id,
              canDownload: true,
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      memory: memory,
    });
  } catch (error) {
    console.error("Error creating memory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create memory" },
      { status: 500 }
    );
  }
}
