import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("yourDatabaseName"); // Replace with your DB name
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400,
      });
    }

    await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
