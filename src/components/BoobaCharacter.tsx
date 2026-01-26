"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type MouthShape = "closed" | "small" | "medium" | "wide" | "o" | "ee";

interface BoobaCharacterProps {
  mouthShape?: MouthShape;
  isAnimating?: boolean;
}

const mouthImages: Record<MouthShape, string> = {
  closed: "/booba/mouth-closed.png",
  small: "/booba/mouth-open-small.png",
  medium: "/booba/mouth-open-medium.png",
  wide: "/booba/mouth-open-wide.png",
  o: "/booba/mouth-o.png",
  ee: "/booba/mouth-ee.png",
};

export function BoobaCharacter({
  mouthShape = "closed",
  isAnimating = false
}: BoobaCharacterProps) {
  const [currentMouth, setCurrentMouth] = useState<MouthShape>(mouthShape);

  useEffect(() => {
    if (!isAnimating) {
      setCurrentMouth(mouthShape);
      return;
    }

    // Random mouth animation when animating (will be replaced by audio-driven)
    const interval = setInterval(() => {
      const shapes: MouthShape[] = ["closed", "small", "medium", "wide", "o", "ee"];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      setCurrentMouth(randomShape);
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating, mouthShape]);

  return (
    <div className="relative w-64 h-80 mx-auto">
      {/* Base character */}
      <Image
        src="/booba/character.png"
        alt="Booba"
        fill
        className="object-contain"
        priority
      />

      {/* Mouth overlay - positioned on face area */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-20 h-12">
        <Image
          src={mouthImages[currentMouth]}
          alt="mouth"
          fill
          className="object-contain transition-opacity duration-75"
        />
      </div>
    </div>
  );
}
