import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Course from "@/lib/models/Course";

export async function DELETE(_, { params }) {
  await connectMongodb();

  try {
    const deleted = await Course.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, data: deleted });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
