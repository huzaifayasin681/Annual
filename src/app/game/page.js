"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GameBoard from '../components/GameBoard';

// Force dynamic rendering so it won't attempt to prerender
export const dynamic = "force-dynamic";
// Changging Hase beern made

export default function GamePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  return (
    <Suspense fallback={<div>Loading your game...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {name && (
            <h2 className="text-2xl text-center font-bold mb-6 text-white">
              Welcome, {name}! Get ready for the challenge!
            </h2>
          )}
          <GameBoard />
        </div>
      </div>
    </Suspense>
  );
}
