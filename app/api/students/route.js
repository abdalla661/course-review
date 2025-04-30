import connectMongodb from "@/lib/dbConnection";
import Student from "@/lib/models/Student";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function POST(request) {
  await connectMongodb();

  try {
    const body = await request.json();

    const {
      fullName,
      email,
      password,
      university,
      faculty,
      department
    } = body;

    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Create the student with the hashed password
    const student = await Student.create({
      name: fullName,
      email,
      password: hashedPassword,
      university,
      faculty,
      department
    });

    // 3. Create a JWT token
    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    return new Response(
      JSON.stringify({
        success: true,
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          university: student.university,
          faculty: student.faculty,
          department: student.department,
          createdAt: student.createdAt
        },
        token
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}