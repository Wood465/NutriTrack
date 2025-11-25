'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  
   const [user, setUser] = useState<any>(null);

 

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
    <nav className="flex items-center justify-between bg-gray-100 text-gray-900 px-8 py-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold tracking-tight">NutriTrack</h1>

      <ul className="flex gap-6 items-center">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition-colors hover:text-blue-600 ${
                pathname === link.href
                  ? 'border-b-2 border-blue-600 pb-1 text-blue-600'
                  : ''
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}

        {/* Desni del navbara */}
{user ? (
  <>
    <li className="ml-4 font-medium text-gray-700">
      Zdravo, {user.ime}
    </li>
    <li>
      <button
        onClick={async () => {
          await fetch("/api/logout", { method: "POST" });
          window.location.href = "/login"; // preusmeritev
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

      </ul>
    </nav>
  );
}
