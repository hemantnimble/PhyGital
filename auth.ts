import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { saltAndHashPassword } from "./utils/helper";
import Google from "next-auth/providers/google"
import { UserRole } from "@prisma/client";

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        name: {
          label: "Name",
          type: "text",
          placeholder: "name",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "email"
        },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const name = credentials.name as string;
        const email = credentials.email as string;
        const hash = saltAndHashPassword(credentials.password);

        let user: any = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              name,
              email,
              hashedPassword: hash,
            },
          });
        } else {
          const isMatch = bcrypt.compareSync(
            credentials.password as string,
            user.hashedPassword
          );
          if (!isMatch) {
            throw new Error("Incorrect password.");
          }
        }

        return user;
      }
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        session.user.name = token.name
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.user.roles = token.roles || [UserRole.USER]
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.id = user.id || '';
        token.name = user.name || ''; 
        token.email = user.email || '';
        token.image = user.image || ''; 
        token.roles = user.roles || [UserRole.USER];
      }
      return token;
    },

  },
});