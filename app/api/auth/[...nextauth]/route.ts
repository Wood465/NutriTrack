import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import postgres from "postgres";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Povezava na PostgreSQL bazo
// URL baze pride iz .env (POSTGRES_URL)
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/**
 * NextAuth handler
 *
 * Namen:
 * - prijava uporabnika z Google računom
 * - uporabnika shrani v bazo (če še ne obstaja)
 * - ustvari lasten JWT, ki vsebuje tudi vlogo (role)
 * - JWT shrani v httpOnly cookie ("session")
 */
const handler = NextAuth({
  // OAuth provider (Google login)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Session se NE hrani v bazi, ampak v JWT
  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * signIn callback
     *
     * Kliče se ob vsaki uspešni Google prijavi
     */
    async signIn({ user }) {
      // Če uporabnik nima emaila, zavrnemo prijavo
      if (!user.email) return false;

      // 1. Preveri, ali uporabnik že obstaja v bazi
      const rows = await sql`
        SELECT id, ime, priimek, email, role
        FROM users
        WHERE email = ${user.email}
      `;

      // Če uporabnik še ne obstaja, ga ustvarimo
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

      // 2. Ponovno preberemo uporabnika iz baze (z role)
      const [dbUser] = await sql`
        SELECT id, ime, priimek, email, role
        FROM users
        WHERE email = ${user.email}
      `;

      // 3. Ustvarimo lasten JWT token
      // V token vključimo tudi vlogo (role)
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

      // 4. JWT shranimo v httpOnly cookie
      // httpOnly = JS na frontendu ne more brati cookieja
      const cookieStore = await cookies();

      cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dni
      });

      // Prijava uspešna
      return true;
    },
  },
});

// Handler podpira GET in POST (zahteva NextAuth)
export { handler as GET, handler as POST };
