import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, mealtime, ingredients, instructions } = body;

    if (!patientId || !mealtime || !ingredients || !instructions) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // First create or get the diet chart for the patient
    const dietChart = await db.dietChart.create({
      data: {
        patientId: parseInt(patientId),
        status: "ACTIVE",
      }
    });

    // Then create the diet
    const diet = await db.diet.create({
      data: {
        patientId: parseInt(patientId),
        dietChartId: dietChart.id,
        mealtime,
        ingredients,
        instructions,
        status: "PENDING"
      }
    });

    return NextResponse.json(diet);
  } catch (error) {
    console.error('Diet creation error:', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
