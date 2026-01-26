'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch('/api/session', { cache: 'no-cache' });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  const links = [
    { href: '/', label: 'Domov' },
    { href: '/about', label: 'O aplikaciji' },
    { href: '/meals', label: 'Moji obroki' },
    { href: '/profile', label: 'Profil' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-transparent pt-4">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/90 px-5 py-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.4)] backdrop-blur">
          <Link href="/" className="group flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 text-sm font-semibold text-white shadow-md shadow-slate-900/30">
              NT
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-slate-700 transition">
              NutriTrack
            </span>
          </Link>

          {/* Hamburger (mobile) */}
        <button
          className="md:hidden rounded-lg border border-slate-200 px-3 py-2 text-lg text-slate-700 hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-2 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-full px-3 py-1.5 transition ${
                    active
                      ? 'text-slate-900'
                      : 'text-slate-600 hover:text-slate-900'
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
                    ? 'bg-purple-600/10 text-purple-700'
                    : 'text-purple-700/80 hover:text-purple-700 hover:bg-purple-600/10'
                }`}
              >
                Admin
              </Link>
            </li>
          )}

            {/* User section */}
            {user ? (
              <>
              <li className="ml-2 text-sm text-slate-500">Zdravo, {user.ime}</li>
              <li>
                <button
                  onClick={async () => {
                    await fetch('/api/logout', { method: 'POST' });
                    window.location.href = '/login';
                  }}
                  className="rounded-full border border-rose-200 px-3 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  Odjava
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Prijava
              </Link>
            </li>
          )}
        </ul>
        </div>

        {/* Mobile menu */}
        {open && (
          <ul className="mt-3 space-y-2 rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-4 text-sm shadow-lg shadow-slate-200/70 backdrop-blur md:hidden">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 transition ${
                    pathname === link.href
                      ? 'bg-blue-600/10 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                      ? 'bg-purple-600/10 text-purple-700'
                      : 'text-purple-700/80 hover:bg-purple-600/10 hover:text-purple-700'
                  }`}
                >
                  Admin
                </Link>
              </li>
            )}

          {user ? (
            <>
              <li className="px-3 pt-2 text-slate-500">Zdravo, {user.ime}</li>
              <li>
                <button
                  onClick={async () => {
                    await fetch('/api/logout', { method: 'POST' });
                    window.location.href = '/login';
                  }}
                  className="w-full rounded-lg border border-rose-200 px-3 py-2 text-left text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
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
                className="block rounded-lg border border-slate-200 px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
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
