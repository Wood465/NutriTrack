'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Domov' },
    { href: '/about', label: 'O aplikaciji' },
    { href: '/meals', label: 'Moji obroki' },
    { href: '/profile', label: 'Profil' },
    { href: '/login', label: 'Prijava' },
  ];

  return (
    <nav className="flex items-center justify-between bg-gray-100 text-gray-900 px-8 py-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold tracking-tight">NutriTrack</h1>
      <ul className="flex gap-6">
        {links.map(link => (
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
      </ul>
    </nav>
  );
}
