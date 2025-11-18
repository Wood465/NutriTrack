import BackButton from '../ui/BackButton';

export default function AboutPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">O aplikaciji</h1>

      <p className="text-gray-700">
        NutriTrack spremlja tvojo prehrano in ti pomaga razumeti, kaj poješ čez dan. 
        Cilj je jasen pregled nad obroki brez zapletenih nastavitev.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Kaj omogoča</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Beleženje obrokov in živil.</li>
          <li>Prikaz kalorij in hranil.</li>
          <li>Pregled zgodovine prehrane.</li>
          <li>Preprosto dodajanje in urejanje vnosev.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Zakaj NutriTrack</h2>
        <p className="text-gray-700">
          Aplikacija ostane lahka in pregledna.  
          S tem se izogneš preveč zapletenim zaslonom in hitreje najdeš podatke, ki te zanimajo.
        </p>
      </section>

      <BackButton />
    </main>
  );
}
