import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./lib/db";
import { loginFormSchema } from "./lib/schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const validatedFields = loginFormSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;

          const user = await prisma.user.findUnique({ where: { username } });

          if (!user || !user.password)
            throw new Error("Username atau password salah.");

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            const { password, ...newUser } = user;
            return newUser as any;
          }
        }

        throw new Error("Username atau password salah.");
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user,
        };
      }

      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: (token as any).user,
      };
    },
  },
});
