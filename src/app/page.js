"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Define your source paths here
  const bgVideoSrc = '/Video.mp4'; // Ensure this file exists
  const welcomeImageSrc = '/IT.webp'; // Ensure this file exists

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== '') {
      setShowModal(true);
      setTimeout(() => {
        router.push(`/game?name=${encodeURIComponent(name)}`);
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Video */}
      {bgVideoSrc && (
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-contain z-[-1] bg-black"
        >
          <source src={bgVideoSrc} type="video/mp4" />
        </video>
      )}

      {/* Transparent Card: Defaults to transparent white background (30% opacity) and on hover transitions to full white */}
      <div className="bg-white bg-opacity-30 hover:bg-opacity-100 transition-all duration-300 p-10 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-indigo-700">
          Fun Challenges for our Annual Dinner
          <br />
          <span className="text-2xl font-normal">UiiT IT Students</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button 
            type="submit"
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded transition transform hover:scale-105"
          >
            Enter
          </button>
        </form>
      </div>

      {/* Modal that appears after submitting the name */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {welcomeImageSrc && (
                <img 
                  src={welcomeImageSrc} 
                  alt="Welcome to the Annual Dinner"
                  className="rounded-lg mb-4 w-[300px] h-[300px] object-cover mx-auto"
                />
              )}
              <p className="text-xl font-semibold text-indigo-700">
                Welcome {name}!
              </p>
              <p className="mt-2 text-gray-600">Get ready for some fun challenges...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
