import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address } = body;

    if (!name || !phone || !address) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const pantry = await db.pantry.create({
      data: {
        name,
        phone,
        address,
      },
    });

    return NextResponse.json(pantry);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
