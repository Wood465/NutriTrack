'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchWithTimeout } from '@/app/lib/fetch-timeout';

/**
 * NAVBAR (Glavna navigacija)
 *
 * Namen komponente:
 * - Prikaze navigacijske povezave po aplikaciji (Domov, About, Meals, Profil).
 * - Prikaze razlicen UI glede na prijavo:
 *   - ce je uporabnik prijavljen: prikaze pozdrav + gumb za odjavo
 *   - ce ni prijavljen: prikaze gumb "Prijava"
 * - Ce je uporabnik admin: prikaze se dodatna povezava "Admin"

 */

export default function Navbar() {
  // pathname uporabimo za highlight aktivne strani v meniju
  const pathname = usePathname();

  // user je null, ce ni prijave; ce je prijava, vsebuje podatke (ime, role, ...)
  const [user, setUser] = useState<any>(null);

  // open kontrolira ali je mobilni meni odprt
  const [open, setOpen] = useState(false);

  // theme je lokalna nastavitev (light/dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  /**
   * 1) Nalozimo uporabnika iz seje
   * - /api/session vrne { user: ... } ali { user: null }
   * - na podlagi tega prikazemo pravilne gumbe (Prijava / Odjava, Admin)
   */
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetchWithTimeout(
          '/api/session',
          { cache: 'no-cache' },
          5000,
        );
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  /**
   * 2) Nalozimo shranjeno temo iz localStorage
   * - Ce najdemo "dark" -> dodamo class "dark" na <html>
   * - Ce najdemo "light" ali nic -> odstranimo class "dark"
   *
   * Opomba:
   * - To je v useEffect, ker localStorage in document obstajata samo v browserju.
   */
  useEffect(() => {
    const saved = localStorage.getItem('theme');

    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);

      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  /**
   * Preklop teme:
   * - zamenja theme state
   * - nastavi/odstrani class "dark" na <html>
   * - shrani izbiro v localStorage
   */
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Glavne povezave (map uporabljamo, da ne ponavljamo JSX-ja)
  const links = [
    { href: '/', label: 'Domov' },
    { href: '/about', label: 'O aplikaciji' },
    { href: '/meals', label: 'Moji obroki' },
    { href: '/profile', label: 'Profil' },
  ];

  return (
    // suppressHydrationWarning: ker temni nacin spreminja HTML class po mount-u,
    // lahko pride do hydration warninga (razlika med server/client renderjem).
    <nav className="sticky top-4 z-40" suppressHydrationWarning>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-2xl border border-gray-200/70 bg-white/95 px-5 py-4 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            {/* Branding / naslov aplikacije */}
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              NutriTrack
            </h1>

            {/* Mobilni gumb za meni */}
            <button
              className="rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:text-gray-200 md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              Menu
            </button>

            {/* Desktop meni (skrit na mobile, viden na md+) */}
            <ul className="hidden items-center gap-6 text-sm font-medium md:flex">
              {/* Glavni linki */}
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-colors hover:text-blue-600 ${
                      pathname === link.href
                        ? 'text-blue-600'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Admin link se prikaze samo admin uporabniku */}
              {user?.role === 'admin' && (
                <li>
                  <Link
                    href="/admin"
                    className={`font-medium transition-colors hover:text-blue-600 ${
                      pathname === '/admin'
                        ? 'text-blue-600'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    Admin
                  </Link>
                </li>
              )}

              {/* Prijava / Odjava blok */}
              {user ? (
                <>
                  {/* Pozdrav */}
                  <li className="ml-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                    Zdravo, {user.ime}
                  </li>

                  {/* Odjava:
                      POST /api/logout in redirect na /login */}
                  <li>
                    <button
                      onClick={async () => {
                        await fetch('/api/logout', { method: 'POST' });
                        window.location.href = '/login';
                      }}
                      className="ml-2 rounded-full border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                      Odjava
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="rounded-full border border-blue-200 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-950/40"
                  >
                    Prijava
                  </Link>
                </li>
              )}

              {/* Toggle teme */}
              <li className="ml-2 flex items-center">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile meni (prikaze se samo ce je open === true) */}
          {open && (
            <ul className="mt-4 space-y-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-800 md:hidden">
              {/* Glavni linki */}
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)} // zapremo meni po kliku
                    className={`block rounded-md px-2 py-1 transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Admin link samo za admin uporabnika */}
              {user?.role === 'admin' && (
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-1 text-blue-700 hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-blue-950/40"
                  >
                    Admin
                  </Link>
                </li>
              )}

              {/* Prijava / Odjava na mobilnem */}
              {user ? (
                <>
                  <li className="text-gray-700 dark:text-gray-200">
                    Zdravo, {user.ime}
                  </li>

                  <li>
                    <button
                      onClick={async () => {
                        await fetch('/api/logout', { method: 'POST' });
                        window.location.href = '/login';
                      }}
                      className="rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40"
                    >
                      Odjava
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="rounded-md border border-blue-200 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-950/40"
                  >
                    Prijava
                  </Link>
                </li>
              )}

              {/* Toggle teme na mobilnem */}
              <li className="pt-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
