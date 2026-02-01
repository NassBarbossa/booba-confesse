"use client";

import { useState } from "react";
import { BoobaCharacter } from "./BoobaCharacter";
import { useLipSync } from "@/lib/useLipSync";

type BoothState = "idle" | "loading" | "playing" | "generating" | "done";

export function TranslatorBooth() {
  const [state, setState] = useState<BoothState>("idle");
  const [text, setText] = useState("");
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const mouthShape = useLipSync({
    audioElement,
    isPlaying: state === "playing",
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setState("loading");
    setVideoUrl(null);

    try {
      // Appel direct à l'API qui génère le MP4
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate video");
      }

      // Recevoir le MP4 directement
      const videoBlob = await response.blob();
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      setState("done");

    } catch (error) {
      console.error("Error generating:", error);
      setState("idle");
      alert("Erreur lors de la génération. Réessaie.");
    }
  };

  const handlePreview = async () => {
    if (!text.trim()) return;

    setState("loading");

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

      const audioBlob = new Blob(
        [Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))],
        { type: contentType }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);
      setAudioElement(newAudio);

      setState("playing");

      newAudio.onended = () => {
        setState("idle");
        URL.revokeObjectURL(audioUrl);
      };

      await newAudio.play();
    } catch (error) {
      console.error("Error:", error);
      setState("idle");
      alert("Erreur. Réessaie.");
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `booba-traducteur-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    setState("idle");
    setText("");
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Character with background */}
      <div className="mb-8 relative rounded-lg overflow-hidden">
        <img
          src="/booba/background.png"
          alt="Studio"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="w-[70%]">
            <BoobaCharacter mouthShape={state === "playing" ? mouthShape : "closed"} />
          </div>
        </div>
      </div>

      {/* Video preview when done */}
      {state === "done" && videoUrl && (
        <div className="mb-6">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg"
            autoPlay
          />
        </div>
      )}

      {/* Input - idle state */}
      {state === "idle" && (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ce que Booba veut vraiment dire..."
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg
                       text-white placeholder-zinc-500 resize-none focus:outline-none
                       focus:border-red-500 transition-colors"
            rows={3}
          />
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={!text.trim()}
              className="flex-1 py-4 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800
                         disabled:cursor-not-allowed rounded-lg font-bold text-lg
                         transition-colors"
            >
              Preview
            </button>
            <button
              onClick={handleGenerate}
              disabled={!text.trim()}
              className="flex-1 py-4 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700
                         disabled:cursor-not-allowed rounded-lg font-bold text-lg
                         transition-colors"
            >
              Générer MP4
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {state === "loading" && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-zinc-400">Génération en cours...</p>
        </div>
      )}

      {/* Playing state */}
      {state === "playing" && (
        <div className="text-center">
          <p className="text-xl text-red-400 animate-pulse">Booba parle...</p>
        </div>
      )}

      {/* Done state - actions */}
      {state === "done" && (
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            className="w-full py-4 bg-green-600 hover:bg-green-700
                       rounded-lg font-bold text-lg transition-colors flex items-center
                       justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger MP4
          </button>

          <button
            onClick={handleReset}
            className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg
                       font-medium transition-colors"
          >
            Nouvelle traduction
          </button>
        </div>
      )}
    </div>
  );
}
