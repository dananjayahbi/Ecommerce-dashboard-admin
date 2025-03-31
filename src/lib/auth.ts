import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db";
// Import your providers...

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Your providers...
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    // Other custom pages if you have them
  },
  callbacks: {
    // Your callbacks...
  },
};
