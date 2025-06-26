import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

export const authOptions = {
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
}

export default NextAuth(authOptions)