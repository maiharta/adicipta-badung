import { Role } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 3 * 60,
  },
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname === "/change-password";
      if (isAuthProtected) {
        if (isLoggedIn) {
          const role = auth.user.role;
          if (
            nextUrl.pathname === "/dashboard" ||
            nextUrl.pathname === "/change-password"
          ) {
            return true;
          } else if (
            nextUrl.pathname.startsWith("/dashboard/user") &&
            role === Role.ADMIN
          ) {
            return true;
          } else if (
            nextUrl.pathname.startsWith("/dashboard/agenda") &&
            (role === Role.ADMIN || role === Role.INPUTER)
          ) {
            return true;
          }

          return false;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user: (user as any).user,
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
} satisfies NextAuthConfig;
