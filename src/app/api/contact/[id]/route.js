import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  const client = await clientPromise;
  const db = client.db("yourDatabaseName");
  const { id } = params;
  try {
    await db.collection("contact").deleteOne({ _id: new ObjectId(id) });
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response("Failed to delete", { status: 500 });
  }
}
