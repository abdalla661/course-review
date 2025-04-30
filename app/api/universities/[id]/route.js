
import connectMongodb from "@/lib/dbConnection";
import University from "@/lib/models/University"; // adjust if your path is different

export async function GET(request, { params }) {
  await connectMongodb();

  const { id } = params;

  try {
    const university = await University.findById(id).lean();
    if (!university) {
      return new Response(JSON.stringify({ message: "University not found" }), { status: 404 });
    }
    // Only return the fields you need
    return new Response(
      JSON.stringify({
        _id: university._id,
        name: university.name,
        emailDomains: university.emailDomains,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error", error: error.message }), { status: 500 });
  }
}