"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";
import { signIn } from "next-auth/react";

/**
 * LoginPage
 *
 * Namen:
 * - prijava uporabnika z emailom in geslom
 * - prijava z Google računom
 */
export default function LoginPage() {
  // State za email, geslo in morebitno napako
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /**
   * Ročna prijava (email + geslo)
   * - kliče /api/login
   * - ob napaki prikaže sporočilo
   * - ob uspehu preusmeri na /
   */
  async function handleLogin() {
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // Če prijava ni uspela
    if (!res.ok) {
      setError(data.error || "Nepričakovana napaka");
      return;
    }

    // Uspešna prijava → domov
    window.location.href = "/";
  }

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white dark:bg-slate-950 dark:text-white">
      {/* Dekorativni background elementi */}
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:opacity-0" />

      {/* Navigacija */}
      <Navbar />

      {/* Login card */}
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-slate-800 bg-white dark:bg-slate-900/90 dark:bg-slate-900/80 p-8 shadow-xl shadow-slate-200/70 dark:shadow-black/30 backdrop-blur">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />

            <div className="relative space-y-6">
              {/* Naslov */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                  Prijava
                </div>
                <h1 className="mt-4 text-3xl font-semibold">
                  Dobrodošel nazaj
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Vpiši se in nadaljuj s spremljanjem prehrane.
                </p>
              </div>

              {/* Prikaz napake */}
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {/* Login forma */}
              <form
                className="space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    E-pošta
                  </label>
                  <input
                    type="email"
                    placeholder="vnesi e-pošto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Geslo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Geslo
                  </label>
                  <input
                    type="password"
                    placeholder="vnesi geslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Prijava z emailom */}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-white shadow-lg shadow-blue-200/70 transition hover:bg-blue-700"
                >
                  Prijava
                </button>

                {/* Prijava z Google računom */}
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:bg-slate-800/60"
                >
                  Prijava z Googlom
                </button>

                {/* Link na registracijo */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Nimaš računa?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Registracija
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

