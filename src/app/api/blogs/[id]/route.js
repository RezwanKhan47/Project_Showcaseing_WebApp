import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(request) {
  const { params } = await request;
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ success: true });
}
