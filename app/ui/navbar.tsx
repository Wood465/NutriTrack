'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';

// Tipiziran user namesto `any` (brez spremembe funkcionalnosti)
type SessionUser = {
  id?: string | number;
  ime?: string | null;
  role?: string | null; // npr. 'admin'
};

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Navigacijske povezave (enkrat ustvarjene)
  const links = useMemo(
    () => [
      { href: '/', label: 'Domov' },
      { href: '/about', label: 'O aplikaciji' },
      { href: '/meals', label: 'Moji obroki' },
      { href: '/profile', label: 'Profil' },
    ],
    []
  );

  useEffect(() => {
    let isMounted = true; // prepreči setState po unmountu

    async function loadUser() {
      try {
        // Uporabi no-store (bolj "prav" kot no-cache za vedno svež session v Next fetch)
        const res = await fetch('/api/session', { cache: 'no-store' });
        const data = await res.json();

        if (!isMounted) return;
        setUser((data?.user ?? null) as SessionUser | null);
      } catch {
        // Če session endpoint faila, se obnašamo kot da user ni prijavljen
        if (!isMounted) return;
        setUser(null);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  // Helper: označi active link (če hočeš, lahko kasneje razširiš na "startsWith")
  function isActive(href: string) {
    return pathname === href;
  }

  // Logout handler (da ne podvajaš kode)
  async function handleLogout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      // Tvoj obstoječi flow: hard redirect na /login
      window.location.href = '/login';
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-transparent pt-4">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/90 px-5 py-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.4)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 text-sm font-semibold text-white shadow-md shadow-slate-900/30">
              NT
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-slate-700 dark:text-white dark:group-hover:text-slate-200">
              NutriTrack
            </span>
          </Link>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden rounded-lg border border-slate-200 px-3 py-2 text-lg text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            ☰
          </button>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-2 text-sm">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                  className={`relative rounded-full px-3 py-1.5 transition ${
                      active
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                >
                  {link.label}
                    {active && (
                      <span className="pointer-events-none absolute -bottom-1.5 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Admin link */}
            {user?.role === 'admin' && (
              <li>
                <Link
                  href="/admin"
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    pathname === '/admin'
                      ? 'bg-purple-600/10 text-purple-700 dark:text-purple-200'
                      : 'text-purple-700/80 hover:text-purple-700 hover:bg-purple-600/10 dark:text-purple-200/80 dark:hover:text-purple-100'
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={toggleTheme}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Preklopi temo"
              >
                {mounted ? (theme === 'dark' ? 'Svetli način' : 'Temni način') : 'Tema'}
              </button>
            </li>

            {/* User section */}
            {user ? (
              <>
                <li className="ml-2 text-sm text-slate-500 dark:text-slate-300">
                  Zdravo, {user.ime ?? 'Uporabnik'}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-rose-200 px-3 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:border-rose-400/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                  >
                    Odjava
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Prijava
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile menu */}
        {open && (
          <ul className="mt-3 space-y-2 rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-4 text-sm shadow-lg shadow-slate-200/70 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/90">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)} // zapre meni po kliku
                  className={`block rounded-lg px-3 py-2 transition ${
                    pathname === link.href
                      ? 'bg-blue-600/10 text-blue-700 dark:text-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {user?.role === 'admin' && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 transition ${
                    pathname === '/admin'
                      ? 'bg-purple-600/10 text-purple-700 dark:text-purple-200'
                      : 'text-purple-700/80 hover:bg-purple-600/10 hover:text-purple-700 dark:text-purple-200/80 dark:hover:text-purple-100'
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={toggleTheme}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                {mounted ? (theme === 'dark' ? 'Svetli način' : 'Temni način') : 'Tema'}
              </button>
            </li>

            {user ? (
              <>
                <li className="px-3 pt-2 text-slate-500 dark:text-slate-300">
                  Zdravo, {user.ime ?? 'Uporabnik'}
                </li>
                <li>
                  <button
                    onClick={async () => {
                      // Zapri meni in odjavi (ohrani funkcionalnost)
                      setOpen(false);
                      await handleLogout();
                    }}
                    className="w-full rounded-lg border border-rose-200 px-3 py-2 text-left text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:border-rose-400/40 dark:text-rose-200 dark:hover:bg-rose-500/10"
                  >
                    Odjava
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-slate-200 px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Prijava
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}
