import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email }).select("+password");
        
        if (!user) throw new Error("Invalid email or password");
        
        const isMatch = await bcrypt.compare(credentials!.password, user.password);
        if (!isMatch) throw new Error("Invalid email or password");

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.avatar, handle: user.handle };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.handle = user.handle;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.handle = token.handle;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login", // We will create a custom login page later if needed, or use default
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };