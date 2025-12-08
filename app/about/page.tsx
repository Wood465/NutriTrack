import BackButton from '../ui/BackButton';

export default function AboutPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">O aplikaciji</h1>

      <p className="text-gray-700">
        NutriTrack pomaga spremljati, kaj poješ vsak dan.  
        Aplikacija ostane preprosta, da hitro vidiš obroke, kalorije in napredek.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Kaj lahko delaš</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Dodajaš obroke in hrano.</li>
          <li>Vidiš kalorije in osnovna hranila.</li>
          <li>Pregledaš pretekle dneve.</li>
          <li>Urediš že dodane vnose.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Kaj želi doseči</h2>
        <p className="text-gray-700">
          NutriTrack ti da pregled nad prehrano brez nepotrebnih menijev.  
          Ideja je, da hitro vneseš obrok in takoj vidiš, kaj to pomeni za tvoj dan.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Komu je namenjena</h2>
        <p className="text-gray-700">
          Uporabna je za vsakogar, ki želi razumeti svoje prehranske navade  
          in imeti osnovne podatke na enem mestu – brez kompliciranja.
        </p>
      </section>

      <BackButton />
    </main>
  );
}
