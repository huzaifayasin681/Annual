"use client";
import React from 'react';

export default function WelcomeBanner({ name }) {
  return (
    <h2 className="text-2xl text-center font-bold mb-6 text-white">
      Welcome, {name}! Get ready for the challenge!
    </h2>
  );
}
