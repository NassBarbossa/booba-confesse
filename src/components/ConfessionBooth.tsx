"use client";

import { useState } from "react";
import { BoobaCharacter } from "./BoobaCharacter";
import { ConfessionInput } from "./ConfessionInput";
import { useLipSync } from "@/lib/useLipSync";

type BoothState = "idle" | "loading" | "playing" | "done";

export function ConfessionBooth() {
  const [state, setState] = useState<BoothState>("idle");
  const [confessionText, setConfessionText] = useState<string>("");
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const mouthShape = useLipSync({
    audioElement,
    isPlaying: state === "playing"
  });

  const handleConfession = async (text: string) => {
    setState("loading");
    setConfessionText(text);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const { audio, contentType } = await response.json();

      // Create audio element
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
        { type: contentType }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      newAudio.crossOrigin = "anonymous";
      setAudioElement(newAudio);

      setState("playing");

      newAudio.onended = () => {
        setState("done");
        URL.revokeObjectURL(audioUrl);
      };

      await newAudio.play();
    } catch (error) {
      console.error("Error generating confession:", error);
      setState("idle");
      alert("Erreur lors de la génération. Réessaie.");
    }
  };

  const handleReset = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    setState("idle");
    setConfessionText("");
  };

  const handleShare = () => {
    const tweetText = encodeURIComponent(
      `Booba avoue enfin la vérité 💀\n\n"${confessionText}"\n\n#BoobaConfesse #Sadek`
    );
    const siteUrl = encodeURIComponent(window.location.origin);

    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}&url=${siteUrl}`,
      "_blank",
      "width=550,height=420"
    );
  };

  return (
    <div className="relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 rounded-lg"
        style={{ backgroundImage: "url('/background.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Character with lip sync */}
        <div className="mb-8">
          <BoobaCharacter mouthShape={state === "playing" ? mouthShape : "closed"} />
        </div>

        {/* Confession text display during playback */}
        {(state === "playing" || state === "done") && confessionText && (
          <div className="mb-6 p-4 bg-black/50 rounded-lg">
            <p className="text-lg text-white italic text-center">
              &quot;{confessionText}&quot;
            </p>
          </div>
        )}

        {/* Input or Result */}
        {state === "idle" && (
          <ConfessionInput onSubmit={handleConfession} />
        )}

        {state === "loading" && (
          <div className="text-center">
            <ConfessionInput onSubmit={() => {}} isLoading={true} />
          </div>
        )}

        {state === "playing" && (
          <div className="text-center">
            <p className="text-xl text-red-400 animate-pulse">
              Booba avoue...
            </p>
          </div>
        )}

        {state === "done" && (
          <div className="text-center space-y-4">
            <button
              onClick={handleShare}
              className="w-full max-w-sm py-4 px-6 bg-black hover:bg-zinc-900
                         border border-zinc-700 rounded-lg font-bold text-lg
                         transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Partager sur X
            </button>

            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-white underline"
            >
              Nouvelle confession
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
