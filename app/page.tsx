import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from "@/app/ui/navbar";
 import StatsOverview from './ui/StatsOverview';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col pt-20 p-6">
      <Navbar />

      {/* Glava strani */}
      <div className="flex h-10 shrink-0 items-end rounded-lg bg-blue-500 p-2 md:h-52">
      </div>

      <section>
        <h1 className="text-gray-600 mt-1">
          Pregled tvojega prehranjevanja.
        </h1>
      </section>

      <StatsOverview />
      
    </main>
   

  );
}
