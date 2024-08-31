import { Role } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) {
          const role = auth.user.role;
          if (nextUrl.pathname.startsWith("/dashboard")) {
            return true;
          } else if (
            nextUrl.pathname.startsWith("/user") ||
            (nextUrl.pathname.startsWith("/agenda") && role === Role.ADMIN)
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
  },
} satisfies NextAuthConfig;
