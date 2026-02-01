"use client";

import { useState, useRef } from "react";
import { BoobaCharacter } from "./BoobaCharacter";
import { useLipSync } from "@/lib/useLipSync";

type BoothState = "idle" | "loading" | "playing" | "done";

export function TranslatorBooth() {
  const [state, setState] = useState<BoothState>("idle");
  const [text, setText] = useState("");
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const characterRef = useRef<HTMLDivElement>(null);

  const mouthShape = useLipSync({
    audioElement,
    isPlaying: state === "playing",
  });

  const handleGenerate = async () => {
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

      // Create audio blob
      const blob = new Blob(
        [Uint8Array.from(atob(audio), (c) => c.charCodeAt(0))],
        { type: contentType }
      );
      setAudioBlob(blob);

      const audioUrl = URL.createObjectURL(blob);
      const newAudio = new Audio(audioUrl);
      newAudio.crossOrigin = "anonymous";
      setAudioElement(newAudio);

      setState("playing");

      newAudio.onended = () => {
        setState("done");
      };

      await newAudio.play();
    } catch (error) {
      console.error("Error generating:", error);
      setState("idle");
      alert("Erreur lors de la génération. Réessaie.");
    }
  };

  const handleDownloadVideo = async () => {
    if (!audioBlob) return;

    setIsGeneratingVideo(true);

    try {
      // Convert audio blob to base64
      const audioBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.readAsDataURL(audioBlob);
      });

      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          audioBase64,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate video");
      }

      const videoBlob = await response.blob();
      const url = URL.createObjectURL(videoBlob);

      // Download
      const a = document.createElement("a");
      a.href = url;
      a.download = `booba-traducteur-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating video:", error);
      alert("Erreur lors de la génération vidéo.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleReset = () => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    setAudioBlob(null);
    setState("idle");
    setText("");
  };

  const handleReplay = () => {
    if (audioElement) {
      audioElement.currentTime = 0;
      setState("playing");
      audioElement.play();
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Character */}
      <div ref={characterRef} className="mb-8">
        <BoobaCharacter mouthShape={state === "playing" ? mouthShape : "closed"} />
      </div>

      {/* Subtitle during playback */}
      {(state === "playing" || state === "done") && text && (
        <div className="mb-6 p-4 bg-black/70 rounded-lg">
          <p className="text-lg text-white text-center">
            &quot;{text}&quot;
          </p>
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
          <button
            onClick={handleGenerate}
            disabled={!text.trim()}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700
                       disabled:cursor-not-allowed rounded-lg font-bold text-lg
                       transition-colors"
          >
            Générer
          </button>
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
          <p className="text-xl text-red-400 animate-pulse">Booba traduit...</p>
        </div>
      )}

      {/* Done state - actions */}
      {state === "done" && (
        <div className="space-y-3">
          <button
            onClick={handleDownloadVideo}
            disabled={isGeneratingVideo}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700
                       rounded-lg font-bold text-lg transition-colors flex items-center
                       justify-center gap-2"
          >
            {isGeneratingVideo ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Génération vidéo...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger MP4
              </>
            )}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleReplay}
              className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg
                         font-medium transition-colors"
            >
              Rejouer
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg
                         font-medium transition-colors"
            >
              Nouveau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
