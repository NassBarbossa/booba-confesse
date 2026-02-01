"use client";

import Image from "next/image";

export type MouthShape = "closed" | "small" | "o";

interface BoobaCharacterProps {
  mouthShape?: MouthShape;
}

const mouthImages: Record<MouthShape, string> = {
  closed: "/booba/mouth-closed.png",
  small: "/booba/mouth-open-small.png",
  o: "/booba/mouth-o.png",
};

export function BoobaCharacter({ mouthShape = "closed" }: BoobaCharacterProps) {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Base character */}
      <Image
        src="/booba/character.png"
        alt="Booba"
        fill
        className="object-contain"
        priority
      />

      {/* Mouth overlay - positioned on face */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-20 md:w-32 md:h-24">
        <Image
          src={mouthImages[mouthShape]}
          alt="mouth"
          fill
          className="object-contain transition-opacity duration-75"
        />
      </div>
    </div>
  );
}
