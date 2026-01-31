import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import postgres from 'postgres';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

/**
 * NEXTAUTH ROUTE (Google prijava)
 *
 * Namen:
 * - Omogoca prijavo z Google racunom preko NextAuth.
 * - Ob prvi prijavi ustvari uporabnika v bazi (role = 'user', google_user = true).
 * - Pri vsaki prijavi ustvari NAS "session" JWT (z role) in ga shrani v httpOnly cookie "session".
 *
 * Zakaj to delamo:
 * - NextAuth poskrbi za Google OAuth flow.
 * - Aplikacija pa uporablja lasten JWT cookie ("session") za ostale API-je (/api/session, /api/admin, ...),
 *   zato ob Google sign-in ustvarimo enako sejo kot pri klasicni prijavi.
 *
 * Kako deluje signIn callback:
 * 1) Preveri, da Google vrne email.
 * 2) Ce uporabnik v bazi ne obstaja -> ga ustvari.
 * 3) Prebere uporabnika iz baze (tudi role).
 * 4) Ustvari JWT token z id + ime + email + role.
 * 5) Nastavi cookie "session" (httpOnly), ki ga potem uporabljajo ostali endpointi.
 */

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const handler = NextAuth({
  providers: [
    // Google OAuth provider (clientId/secret sta v .env)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // NextAuth seje so JWT (ne DB session)
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    /**
     * signIn callback se sprozi, ko se uporabnik prijavi z Googlom.
     * Tukaj:
     * - sinhroniziramo uporabnika z bazo
     * - ustvarimo lasten JWT cookie "session"
     */
    async signIn({ user }) {
      // Google mora vrniti email, ker je to nas unikatni identifikator
      if (!user.email) return false;

      /**
       * 1) Preverimo ali uporabnik ze obstaja v bazi
       * - ce ne obstaja -> ga ustvarimo kot "google_user"
       */
      const rows = await sql`
        SELECT id, ime, priimek, email, role
        FROM users
        WHERE email = ${user.email}
      `;

      if (rows.length === 0) {
        // Ime in priimek dobimo iz user.name (preprosta delitev po presledku)
        const firstName = user.name?.split(' ')[0] ?? '';
        const lastName = user.name?.split(' ').slice(1).join(' ') ?? '';

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
            ${firstName},
            ${lastName},
            ${user.email},
            '',
            true,
            'user'
          )
        `;
      }

      /**
       * 2) Preberemo uporabnika iz baze (da dobimo tocne podatke + role)
       * - pomembno: role lahko kasneje admin spremeni
       */
      const [dbUser] = await sql`
        SELECT id, ime, priimek, email, role
        FROM users
        WHERE email = ${user.email}
      `;

      /**
       * 3) Ustvarimo nas JWT, ki ga uporablja aplikacija
       * - vsebuje role, zato lahko frontend in backend preverjata pravice
       */
      const token = jwt.sign(
        {
          id: dbUser.id,
          ime: dbUser.ime,
          priimek: dbUser.priimek,
          email: dbUser.email,
          role: dbUser.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      /**
       * 4) Nastavimo cookie "session"
       * - httpOnly: JS ga ne more prebrati (varneje)
       * - secure: samo HTTPS v produkciji
       * - maxAge: 7 dni
       */
      const cookieStore = await cookies();
      cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      // True pomeni: dovoli prijavo
      return true;
    },
  },
});

export { handler as GET, handler as POST };
