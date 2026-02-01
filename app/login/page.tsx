"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import { signIn } from "next-auth/react";

/**
 * LOGIN PAGE (Prijava)
 *
 * Namen strani:
 * - Uporabniku omogoca prijavo na 2 nacina:
 *   1) Prijava z e-posto + geslom (klic na /api/login)
 *   2) Prijava z Googlom (NextAuth: signIn("google"))
 *
 * Kako deluje:
 * - Uporabnik vnese email in geslo -> klikne "Prijava"
 * - Posljemo POST zahtevek na /api/login
 * - Ce je napaka -> prikazemo sporocilo (error)
 * - Ce je vse OK -> preusmerimo uporabnika na domov ("/")
 */

export default function LoginPage() {
  // Controlled input fields: vrednost inputa je vezana na state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // error: uporabniku prikazemo napako iz backend-a ali "fallback" napako
  const [error, setError] = useState("");

  /**
   * Prijava z e-posto in geslom
   * - POST /api/login z { email, password }
   * - Backend vrne res.ok ali error message
   */
  async function handleLogin() {
    // Pred vsakim poskusom pocistimo napako, da se ne prikazuje stara
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // Ce backend vrne napako, jo prikazemo uporabniku
    if (!res.ok) {
      setError(data.error || "Nepricakovana napaka");
      return;
    }

    // Uspeh: po prijavi preusmerimo na domov (uporabnik vidi svoj dashboard)
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen">
      {/* Navigacija na vrhu strani */}
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Leva stran: vizualni "hero" z opisom */}
          <div className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12">
            <div className="max-w-md space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
                Dobrodosli nazaj
              </p>
              <h1 className="text-3xl font-semibold md:text-4xl">Prijava</h1>
              <p className="text-base text-blue-100 md:text-lg">
                Dostopi do svojih obrokov, statistike in ciljev v eni prijavi.
              </p>
            </div>
          </div>

          {/* Desna stran: obrazec za prijavo */}
          <div className="rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Prijavi se v racun
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Vnesi e-posto in geslo ter nadaljuj.
            </p>

            {/* Napaka se prikaze samo, ce imamo error string */}
            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Form je tu zaradi strukture, submit preprečimo, ker klik obdelamo rocno */}
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Email input */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  E-posta
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="vnesi e-posto"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </div>

              {/* Password input */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Geslo
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="vnesi geslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </div>

              {/* Gumb za email/geslo prijavo */}
              <button
                type="button"
                onClick={handleLogin}
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Prijava
              </button>
            </form>

            {/* Alternativa: Google sign-in + link do registracije */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                ali
                <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              </div>

              {/* Google prijava preko NextAuth */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                Prijava z Googlom
              </button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Nimas racuna?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
                >
                  Registracija
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
