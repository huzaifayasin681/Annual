import React from 'react';
import GameBoard from '@/app/components/GameBoard';
import WelcomeBanner from '@/app/components/WelcomeBanner';

export default function GamePage({ searchParams }) {
  // Get 'name' from the query string
  const name = searchParams?.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Conditionally render the welcome message only if 'name' exists */}
        {name && <WelcomeBanner name={name} />}
        <GameBoard />
      </div>
    </div>
  );
}
