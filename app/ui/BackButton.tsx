'use client';

import Link from 'next/link';

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-block mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
    >
       Nazaj na Domov
    </Link>
  );
}

