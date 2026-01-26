import { DuckCounter } from "@/components/DuckCounter";
import { ConfessionBooth } from "@/components/ConfessionBooth";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Duck Counter */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Booba Confesse
          </h1>
          <p className="text-xl text-zinc-400 mb-6">
            Fais-le avouer la vérité
          </p>
          <DuckCounter />
        </header>

        {/* Main confession booth */}
        <div className="max-w-2xl mx-auto">
          <ConfessionBooth />
        </div>

        {/* Parody disclaimer */}
        <footer className="text-center mt-12 text-sm text-zinc-600">
          PARODIE - Ceci est une satire
        </footer>
      </div>
    </main>
  );
}
