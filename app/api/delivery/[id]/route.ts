import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/options";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'DELIVERY') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status, deliveryNotes } = body;

    const diet = await db.diet.findUnique({
      where: { id: parseInt(params.id) },
      select: { deliveredBy: true }
    });

    if (diet?.deliveredBy?.toString() !== session.user.id) {
      return new NextResponse("Not assigned to this delivery", { status: 403 });
    }

    const updateData: any = {
      status,
      deliveryNotes,
    };

    if (status === 'OUT_FOR_DELIVERY') {
      updateData.deliveryStartedAt = new Date();
    }

    if (status === 'DELIVERY_COMPLETED' || status === 'DELIVERY_FAILED') {
      updateData.deliveryCompletedAt = new Date();
    }

    const updated = await db.diet.update({
      where: {
        id: parseInt(params.id),
      },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[DELIVERY_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
