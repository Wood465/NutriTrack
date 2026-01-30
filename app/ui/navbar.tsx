'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    async function loadUser() {
      const res = await fetch('/api/session', { cache: 'no-cache' });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

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

  const links = [
    { href: '/', label: 'Domov' },
    { href: '/about', label: 'O aplikaciji' },
    { href: '/meals', label: 'Moji obroki' },
    { href: '/profile', label: 'Profil' },
  ];

  return (
    <nav className="sticky top-4 z-40">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-2xl border border-gray-200/70 bg-white/95 px-5 py-4 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              NutriTrack
            </h1>

            <button
              className="md:hidden rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:text-gray-200"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              Menu
            </button>

            <ul className="hidden items-center gap-6 text-sm font-medium md:flex">
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

              {user ? (
                <>
                  <li className="ml-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                    Zdravo, {user.ime}
                  </li>
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

          {open && (
            <ul className="mt-4 space-y-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-800 md:hidden">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
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

