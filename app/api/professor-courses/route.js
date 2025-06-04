import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import ProfessorCourse from "@/lib/models/ProfessorCourse";
import Professor from "@/lib/models/Professor";
import Course from "@/lib/models/Course";
// export async function GET(req) {
//   await connectMongodb();

//   const { searchParams } = new URL(req.url);
//   const departmentId = searchParams.get("departmentId");

//   const filter = departmentId ? { department: departmentId } : {};

//   const combos = await ProfessorCourse.find(filter)
//     .populate("professor")
//     .populate("course");

//   return NextResponse.json(combos);
// }

export async function POST(req) {
  await connectMongodb();
  const body = await req.json();

  try {
    const combo = await ProfessorCourse.create(body);
const populated = await ProfessorCourse.findById(combo._id)
  .populate("professor")
  .populate("course");

return NextResponse.json({ success: true, data: populated }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

import Review from "@/lib/models/Review";

// export async function GET(req) {
//   await connectMongodb();

//   const { searchParams } = new URL(req.url);
//   const departmentId = searchParams.get("departmentId");
//   const studentId = searchParams.get("studentId"); // ✅ Add this

//   const combos = await ProfessorCourse.find()
//     .populate("professor")
//     .populate("course");

//   const filteredCombos = departmentId
//     ? combos.filter((combo) => combo.course?.department?.toString() === departmentId)
//     : combos;
// //const studentId = searchParams.get("studentId");

// const enrichedCombos = await Promise.all(
//   combos.map(async (combo) => {
//     const reviews = await Review.find({ combo: combo._id });

//     const count = reviews.length;
//     const avg =
//       count === 0
//         ? null
//         : (
//             (reviews.reduce((s, r) => s + r.gradingFairness, 0) +
//               reviews.reduce((s, r) => s + r.organization, 0) +
//               reviews.reduce((s, r) => s + r.availability, 0) +
//               reviews.reduce((s, r) => s + r.teachingQuality, 0)) /
//             (count * 4)
//           ).toFixed(1);

//     // 🔍 Check if this student already reviewed
//     const alreadyReviewed = studentId
//       ? await Review.exists({ combo: combo._id, student: studentId })
//       : false;

//     const comboObj = combo.toObject();
//     comboObj.reviewCount = count;
//     comboObj.avgRating = avg;
//     comboObj.hasReviewed = alreadyReviewed;

//     return comboObj;
//   })
// );

//   return NextResponse.json(enrichedCombos);
// }
export async function GET(req) {
  await connectMongodb();

  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId");
  const studentId = searchParams.get("studentId");

  const combos = await ProfessorCourse.find()
    .populate({
      path: "course",
      match: departmentId ? { department: departmentId } : {},
    })
    .populate("professor");

  const filteredCombos = combos.filter((combo) => combo.course !== null);

  const enrichedCombos = await Promise.all(
    filteredCombos.map(async (combo) => {
      const reviews = await Review.find({ combo: combo._id });

      const count = reviews.length;
      const avg =
        count === 0
          ? null
          : (
              (reviews.reduce((s, r) => s + r.gradingFairness, 0) +
                reviews.reduce((s, r) => s + r.organization, 0) +
                reviews.reduce((s, r) => s + r.availability, 0) +
                reviews.reduce((s, r) => s + r.teachingQuality, 0)) /
              (count * 4)
            ).toFixed(1);

      const alreadyReviewed = studentId
        ? await Review.exists({ combo: combo._id, student: studentId })
        : false;

      const comboObj = combo.toObject();
      comboObj.reviewCount = count;
      comboObj.avgRating = avg;
      comboObj.hasReviewed = alreadyReviewed;

      return comboObj;
    })
  );

  return NextResponse.json(enrichedCombos);
}


