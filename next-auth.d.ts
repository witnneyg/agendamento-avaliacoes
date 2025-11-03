import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: Array<{
        id: string;
        name: string;
      }>;
    };
  }

  interface User {
    roles?: Array<{
      id: string;
      name: string;
    }>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: Array<{
      id: string;
      name: string;
    }>;
  }
}
