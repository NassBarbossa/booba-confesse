import { TranslatorBooth } from "@/components/TranslatorBooth";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Booba Traducteur
          </h1>
          <p className="text-zinc-400">
            Ce que Booba veut vraiment dire
          </p>
        </header>

        {/* Main translator */}
        <TranslatorBooth />

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-zinc-600">
          PARODIE - Ceci est une satire
        </footer>
      </div>
    </main>
  );
}
