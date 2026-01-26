"use client";

import { useState, useEffect, useRef } from "react";

type MouthShape = "closed" | "small" | "medium" | "wide" | "o" | "ee";

interface UseLipSyncOptions {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export function useLipSync({ audioElement, isPlaying }: UseLipSyncOptions): MouthShape {
  const [mouthShape, setMouthShape] = useState<MouthShape>("closed");
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement || !isPlaying) {
      setMouthShape("closed");
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Create audio context and analyser
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      // Map volume to mouth shape
      let shape: MouthShape;
      if (average < 10) {
        shape = "closed";
      } else if (average < 40) {
        shape = "small";
      } else if (average < 80) {
        shape = "medium";
      } else if (average < 120) {
        shape = "wide";
      } else {
        // Add some variety for high volumes
        shape = Math.random() > 0.5 ? "wide" : "o";
      }

      setMouthShape(shape);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioElement, isPlaying]);

  return mouthShape;
}
