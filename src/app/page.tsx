export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Duck Counter */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Booba Confesse
          </h1>
          <p className="text-xl text-zinc-400">
            Fais-le avouer la vérité
          </p>
        </header>

        {/* Main confession area - placeholder */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-800 rounded-lg p-8 text-center">
            <p className="text-zinc-400">Confession booth à venir...</p>
          </div>
        </div>

        {/* Parody disclaimer */}
        <footer className="text-center mt-12 text-sm text-zinc-600">
          PARODIE - Ceci est une satire
        </footer>
      </div>
    </main>
  );
}
