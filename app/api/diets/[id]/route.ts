import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/options";
import { Status } from "@prisma/client";

interface UpdateDietBody {
  status: keyof typeof Status;
  notes?: string;
  deliveryStaffId?: string;
}

interface UpdateData {
  status: Status;
  notes?: string;
  preparedAt?: Date;
  assignedTo?: number;
  deliveredBy?: number;
  assignedAt?: Date;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STAFF") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body: UpdateDietBody = await req.json();
    const { status, notes, deliveryStaffId } = body;

    const updateData: UpdateData = {
      status: Status[status as keyof typeof Status],
      notes,
    };

    // Update preparation details
    if (status === "IN_PREPARATION") {
      updateData.preparedAt = new Date();
      updateData.assignedTo = parseInt(session.user.id);
    }

    // Update delivery staff assignment
    if (deliveryStaffId) {
      updateData.deliveredBy = parseInt(deliveryStaffId);
      updateData.assignedAt = new Date();

      // Automatically update status if assigning delivery staff
      if (status === "PENDING" || status === "IN_PREPARATION") {
        updateData.status = Status.READY_FOR_DELIVERY;
      }
    }

    const diet = await db.diet.update({
      where: {
        id: parseInt(params.id),
      },
      data: updateData,
      include: {
        preparedBy: {
          select: { name: true },
        },
        deliveryStaff: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(diet);
  } catch (error) {
    console.error("[DIET_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
