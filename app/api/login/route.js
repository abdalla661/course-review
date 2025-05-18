import { NextResponse } from "next/server";
import connectMongodb from "@/lib/dbConnection";
import Student from "@/lib/models/Student"; // or your actual User model
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectMongodb();

  try {
    const { email, password } = await req.json();
console.log("🧪 Login Attempt:", email, password);


    const user = await Student.findOne({ email });
if (!user) {
  console.log("❌ User not found:", email);
  return NextResponse.json({ message: "User not found" }, { status: 401 });
}


    const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  console.log("❌ Invalid password for:", email);
  return NextResponse.json({ message: "Invalid password" }, { status: 401 });
}


    // Later: you can set a session/cookie here

    return NextResponse.json({
  message: "Login successful",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    department: user.department, // ✅ include this!
  },
});

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
