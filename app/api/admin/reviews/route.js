import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Review from "@/lib/models/Review";
import ProfessorCourse from "@/lib/models/ProfessorCourse";

export async function GET() {
  await connectMongodb();

  const reviews = await Review.find({ commentStatus: "pending", comment: { $ne: "" } })
    .populate({
      path: "combo",
      populate: [{ path: "course" }, { path: "professor" }],
    })
    .sort({ createdAt: -1 });

  return NextResponse.json(reviews);
}

export async function PATCH(req) {
  await connectMongodb();

  const { id, action } = await req.json(); // id = review ID, action = "approve" or "reject"

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }

  const updated = await Review.findByIdAndUpdate(
    id,
    { commentStatus: action === "approve" ? "approved" : "rejected" },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
