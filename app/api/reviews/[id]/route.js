import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Review from "@/lib/models/Review";
import ProfessorCourse from "@/lib/models/ProfessorCourse";  // 🔥 Fix the missing import

export async function DELETE(req, { params }) {
  await connectMongodb();
  const deleted = await Review.findByIdAndDelete(params.id);
  if (!deleted) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Deleted" });
}
export async function PATCH(req, { params }) {
  await connectMongodb();
  const id = params.id;
  const update = await req.json();

  const existingReview = await Review.findById(id);
  if (!existingReview) {
    return NextResponse.json({ message: "Review not found" }, { status: 404 });
  }

  // If comment changed, set status to pending
  if (update.comment && update.comment !== existingReview.comment) {
    update.commentStatus = "pending";
  }

  const updatedReview = await Review.findByIdAndUpdate(id, update, { new: true });

  // 🔥 Recalculate average ratings for the combo (ProfessorCourse)
  const comboId = updatedReview.combo;
  const allReviews = await Review.find({ combo: comboId });

  const totalRatings = {
    gradingFairness: 0,
    organization: 0,
    availability: 0,
    teachingQuality: 0,
  };
  let count = 0;

  allReviews.forEach((r) => {
    totalRatings.gradingFairness += r.gradingFairness;
    totalRatings.organization += r.organization;
    totalRatings.availability += r.availability;
    totalRatings.teachingQuality += r.teachingQuality;
    count++;
  });

  const avgRatings = {
    gradingFairness: (totalRatings.gradingFairness / count).toFixed(1),
    organization: (totalRatings.organization / count).toFixed(1),
    availability: (totalRatings.availability / count).toFixed(1),
    teachingQuality: (totalRatings.teachingQuality / count).toFixed(1),
  };

  // 🔥 Update combo (ProfessorCourse) with new averages
  await ProfessorCourse.findByIdAndUpdate(comboId, { averageRatings: avgRatings });

  return NextResponse.json({ message: "Review updated", data: updatedReview });
}


