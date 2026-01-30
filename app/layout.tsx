import type { Metadata } from "next";
import "@/app/ui/global.css";

export const metadata: Metadata = {
  title: "NutriTrack",
  description: "NutriTrack — aplikacija za beleženje obrokov in kalorij.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen text-gray-900 antialiased bg-[radial-gradient(1200px_circle_at_top,_rgba(59,130,246,0.18),_transparent_60%),radial-gradient(900px_circle_at_bottom,_rgba(14,165,233,0.12),_transparent_60%),linear-gradient(to_bottom,_#f8fafc,_#eef6ff)] dark:text-gray-100 dark:bg-[radial-gradient(1200px_circle_at_top,_rgba(30,64,175,0.35),_transparent_60%),radial-gradient(900px_circle_at_bottom,_rgba(15,23,42,0.6),_transparent_60%),linear-gradient(to_bottom,_#0f172a,_#111827)]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

