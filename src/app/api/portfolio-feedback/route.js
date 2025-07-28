import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  // Get all feedbacks for this project
  const feedbacks = await db
    .collection("portfolioFeedback")
    .find({ projectId })
    .toArray();

  // Get all user emails from feedbacks
  const userEmails = feedbacks.map((f) => f.user);

  // Fetch user info for these emails
  const users = await db
    .collection("googleUsers")
    .find({ email: { $in: userEmails } })
    .toArray();

  // Map email to user info
  const userMap = {};
  users.forEach((u) => {
    userMap[u.email] = { name: u.name, image: u.image };
  });

  // Attach name and image to each feedback
  const feedbacksWithUser = feedbacks.map((f) => ({
    ...f,
    name: userMap[f.user]?.name || "Anonymous",
    image: userMap[f.user]?.image || "/default-avatar.jpg",
  }));

  return NextResponse.json(feedbacksWithUser);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, stars, comment, name, image } = await request.json();
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("portfolioFeedback").insertOne({
    projectId,
    user: session.user.email,
    name,
    image,
    stars,
    comment,
    updatedAt: new Date(),
  });
  return NextResponse.json({ success: true });
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { feedbackId, stars, comment } = await request.json();
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db
    .collection("portfolioFeedback")
    .updateOne(
      { _id: new ObjectId(feedbackId), user: session.user.email },
      { $set: { stars, comment, updatedAt: new Date() } }
    );
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const feedbackId = url.searchParams.get("feedbackId");
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  await db.collection("portfolioFeedback").deleteOne({
    _id: new ObjectId(feedbackId),
    user: session.user.email,
  });
  return NextResponse.json({ success: true });
}
