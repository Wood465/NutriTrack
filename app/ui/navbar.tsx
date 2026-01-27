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
    <nav className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 px-6 py-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">NutriTrack</h1>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-blue-600 ${
                  pathname === link.href
                    ? 'border-b-2 border-blue-600 pb-1 text-blue-600'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Admin link */}
          {user?.role === 'admin' && (
            <li>
              <Link
                href="/admin"
                className={`font-medium hover:text-purple-600 ${
                  pathname === '/admin'
                    ? 'border-b-2 border-purple-600 pb-1 text-purple-600'
                    : ''
                }`}
              >
                Admin
              </Link>
            </li>
          )}

          {/* User section */}
          {user ? (
            <>
              <li className="ml-4 font-medium text-gray-700">
                Zdravo, {user.ime}
              </li>
              <li>
                <button
                  onClick={async () => {
                    await fetch('/api/logout', { method: 'POST' });
                    window.location.href = '/login';
                  }}
                  className="text-red-600 hover:underline ml-4"
                >
                  Odjava
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="hover:text-blue-600">
                Prijava
              </Link>
            </li>
          )}

          <li className="ml-4 flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden mt-4 space-y-3 border-t pt-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block ${
                  pathname === link.href ? 'text-blue-600 font-medium' : ''
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
                className="block text-purple-600 font-medium"
              >
                Admin
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li className="text-gray-700">Zdravo, {user.ime}</li>
              <li>
                <button
                  onClick={async () => {
                    await fetch('/api/logout', { method: 'POST' });
                    window.location.href = '/login';
                  }}
                  className="text-red-600 hover:underline"
                >
                  Odjava
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">Prijava</Link>
            </li>
          )}

          <li className="pt-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
