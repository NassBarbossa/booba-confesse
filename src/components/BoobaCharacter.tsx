"use client";

import Image from "next/image";

export type MouthShape = "closed" | "small" | "medium" | "wide" | "o" | "ee";

interface BoobaCharacterProps {
  mouthShape?: MouthShape;
}

const mouthImages: Record<MouthShape, string> = {
  closed: "/booba/mouth-closed.png",
  small: "/booba/mouth-open-small.png",
  medium: "/booba/mouth-open-medium.png",
  wide: "/booba/mouth-open-wide.png",
  o: "/booba/mouth-o.png",
  ee: "/booba/mouth-ee.png",
};

export function BoobaCharacter({ mouthShape = "closed" }: BoobaCharacterProps) {
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

      {/* Mouth overlay */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-20 h-12">
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
