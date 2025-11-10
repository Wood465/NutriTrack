export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>NutriTrack</title>
        <meta name="description" content="NutriTrack — aplikacija za beleženje obrokov in kalorij." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
