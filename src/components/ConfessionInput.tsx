"use client";

import { useState } from "react";

interface ConfessionInputProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  maxLength?: number;
}

export function ConfessionInput({
  onSubmit,
  isLoading = false,
  maxLength = 200
}: ConfessionInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="mb-4">
        <label
          htmlFor="confession"
          className="block text-lg font-medium mb-2 text-zinc-300"
        >
          Fais avouer Booba...
        </label>
        <textarea
          id="confession"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxLength))}
          placeholder="J'ai peur de Sadek..."
          className="w-full h-24 md:h-32 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg
                     text-base text-white placeholder-zinc-500 resize-none
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          disabled={isLoading}
        />
        <p className="text-right text-sm text-zinc-500 mt-1">
          {text.length}/{maxLength}
        </p>
      </div>

      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700
                   disabled:cursor-not-allowed rounded-lg font-bold text-lg
                   transition-colors duration-200"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Booba avoue...
          </span>
        ) : (
          "Fais-le avouer"
        )}
      </button>
    </form>
  );
}
