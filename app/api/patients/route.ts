import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const patients = await db.patient.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        roomnumber: true,
        floornumber: true,
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
