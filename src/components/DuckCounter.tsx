"use client";

import { useEffect, useState } from "react";

export function DuckCounter() {
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    const duckDate = new Date(process.env.NEXT_PUBLIC_DUCK_DATE || "2025-01-15");
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - duckDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setDays(diffDays);
  }, []);

  return (
    <div className="bg-red-900/50 border border-red-500 rounded-lg px-6 py-4 inline-block">
      <p className="text-sm text-red-300 uppercase tracking-wide">
        Jours depuis que Booba a fui
      </p>
      <p className="text-5xl font-bold text-red-500">{days}</p>
    </div>
  );
}
