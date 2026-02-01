'use client';

import { usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
    document.documentElement.classList.remove('route-leaving');
  }, [pathname]);

  return (
    <div key={key} className="page-transition">
      {children}
    </div>
  );
}
