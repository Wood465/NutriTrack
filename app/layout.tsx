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
        className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 text-gray-900 antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
