import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/db"; // <-- Add this import

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace with your admin check logic
        if (
          credentials.username === "admin" &&
          credentials.password === "admin123"
        ) {
          return { id: "admin", name: "Admin", email: "admin@example.com" };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Save the user's email to MongoDB
        const client = await clientPromise;
        const db = client.db("yourDatabaseName"); // replace with your DB name
        await db
          .collection("googleUsers")
          .updateOne(
            { email: user.email },
            { $set: { email: user.email, name: user.name, image: user.image } },
            { upsert: true }
          );
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// This file handles authentication using NextAuth.js.
// It sets up Google authentication and can be extended to include other providers.
