import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        {/* <AcmeLogo /> */}
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
         <h1 className="text-3xl font-bold text-blue-600 md:text-4xl">
          NutriTrack
        </h1>
        <p className="text-gray-700 md:text-lg leading-relaxed">
          Aplikacija za beleženje obrokov, kalorij in spremljanje prehrane skozi dan ali teden. Uporabnik ima možnost dodajanje obrokov (ime, količina, kalorije), prikaz vnosa v grafu, ogled zgodovine, dodajanje slik, urejanje profila. Admin lahko dodaja živila v bazo, urejanje podatkov, pregled uporabnikov in njihovih dnevnikov
        </p>

                  <Link
          href="/login"
          className="flex items-center gap-2 self-start rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
        >
         
          <span>Log in</span>
        </Link>

        </div>
              <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/Solata2.png"
            alt="Healthy food and tracking app"
            width={500}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </main>
  );
}
