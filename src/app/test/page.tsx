"use client";

import { useState } from "react";
import { BoobaCharacter, MouthShape } from "@/components/BoobaCharacter";

const mouthShapes: MouthShape[] = ["closed", "small", "o"];

export default function TestPage() {
  const [currentMouth, setCurrentMouth] = useState<MouthShape>("closed");

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-2xl font-bold text-center mb-8">Test Lip Sync</h1>

      <div className="max-w-md mx-auto">
        <BoobaCharacter mouthShape={currentMouth} />

        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {mouthShapes.map((shape) => (
            <button
              key={shape}
              onClick={() => setCurrentMouth(shape)}
              className={`px-4 py-2 rounded ${
                currentMouth === shape
                  ? "bg-blue-600"
                  : "bg-zinc-700 hover:bg-zinc-600"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>

        <p className="text-center mt-4 text-zinc-400">
          Current: <span className="text-white font-bold">{currentMouth}</span>
        </p>
      </div>
    </main>
  );
}
