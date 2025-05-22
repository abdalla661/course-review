import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Admin from "@/lib/models/Admin";
import Student from "@/lib/models/Student";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectMongodb();
  const { email, password } = await req.json();

  // 1. Try Admin
  const admin = await Admin.findOne({ email }).select("+password");
  if (admin && await bcrypt.compare(password, admin.password)) {
    const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET);
    return NextResponse.json({
      user: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        isAdmin: true,
      },
      token,
    });
  }

  // 2. Try Student
  const student = await Student.findOne({ email }).select("+password");
  if (student && await bcrypt.compare(password, student.password)) {
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
    return NextResponse.json({
      user: {
        _id: student._id,
        email: student.email,
        name: student.name,
        department: student.department,
        isAdmin: false,
      },
      token,
    });
  }

  return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
}
