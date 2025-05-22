import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectMongodb();
  const { email, password } = await req.json();

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: admin._id, isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return NextResponse.json({
    user: { _id: admin._id, name: admin.name, email: admin.email, isAdmin: true },
    token,
  });
}
