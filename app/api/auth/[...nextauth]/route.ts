import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import postgres from "postgres";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      // 1. Preveri / ustvari uporabnika
      const rows = await sql`
        SELECT id, ime, priimek, email, role
        FROM users
        WHERE email = ${user.email}
      `;

      if (rows.length === 0) {
        await sql`
          INSERT INTO users (
            ime,
            priimek,
            email,
            password_hash,
            google_user,
            role
          )
          VALUES (
            ${user.name?.split(" ")[0] ?? ""},
            ${user.name?.split(" ").slice(1).join(" ") ?? ""},
            ${user.email},
            '',
            true,
            'user'
          )
        `;
      }

      // 2. Preberi uporabnika skupaj z role
      const [dbUser] = await sql`
        SELECT id, ime, priimek, email, role
        FROM users
        WHERE email = ${user.email}
      `;

      // 3. Ustvari JWT, ki vključuje role
      const token = jwt.sign(
        {
          id: dbUser.id,
          ime: dbUser.ime,
          priimek: dbUser.priimek,
          email: dbUser.email,
          role: dbUser.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      // 4. Nastavi session cookie
      const cookieStore = await cookies();

      cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return true;
    }
  }
});

export { handler as GET, handler as POST };
