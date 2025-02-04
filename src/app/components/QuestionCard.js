"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

// Confetti Component: Renders multiple small animated circles that burst outward.
const Confetti = () => {
  const pieces = Array.from({ length: 12 });
  return (
    <>
      {pieces.map((_, i) => {
        const angle = Math.random() * 360;
        const distance = Math.random() * 80 + 20;
        const size = Math.random() * 6 + 4;
        const colors = ['#FF008C', '#D309E1', '#9C1AFF', '#7700FF', '#00E1FF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ backgroundColor: color, width: size, height: size }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: distance * Math.cos(angle * (Math.PI / 180)),
              y: distance * Math.sin(angle * (Math.PI / 180)),
              scale: 1.5,
              rotate: 360,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        );
      })}
    </>
  );
};

const QuestionCard = ({ question, onAnswer }) => {
  const [userInput, setUserInput] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Wraps answer submission with a confetti effect.
  const triggerAnswer = (answer) => {
    setShowConfetti(true);
    onAnswer(answer);
    setTimeout(() => {
      setShowConfetti(false);
    }, 1200);
  };

  const handleSubmit = () => {
    if (userInput.trim() !== '') {
      triggerAnswer(userInput);
      setUserInput('');
    }
  };

  const renderOptions = () => {
    if (question.type === 'yesno') {
      return (
        <div className="flex flex-col sm:flex-row justify-around mt-6 gap-3">
          <motion.button 
            onClick={() => triggerAnswer("yes")}
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full transition duration-300 shadow-lg"
          >
            Yes
          </motion.button>
          <motion.button 
            onClick={() => triggerAnswer("no")}
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-full transition duration-300 shadow-lg"
          >
            No
          </motion.button>
        </div>
      );
    } else if (question.type === 'mcq') {
      return (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {question.options.map((option, index) => (
            <motion.button 
              key={index}
              onClick={() => triggerAnswer(option)}
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 sm:px-6 rounded-full transition duration-300 shadow-lg"
            >
              {option}
            </motion.button>
          ))}
        </div>
      );
    } else if (question.type === 'input') {
      return (
        <div className="mt-6 flex flex-col items-center gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition duration-300 shadow-lg"
            onClick={handleSubmit}
          >
            Submit
          </motion.button>
        </div>
      );
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center my-8 px-4">
      {/* Floating Animated Shapes (hidden on mobile for clarity) */}
      <motion.div
        className="absolute hidden sm:block w-24 h-24 bg-purple-500 rounded-full opacity-20"
        animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "-10%", left: "-10%" }}
      />
      <motion.div
        className="absolute hidden sm:block w-28 h-28 bg-blue-500 rounded-full opacity-20"
        animate={{ x: [0, -30, 0], y: [0, -30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "-10%", right: "-10%" }}
      />

      <motion.div
        className="p-4 sm:p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 text-white w-full max-w-md sm:max-w-lg z-10 relative overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ rotate: 1, scale: 1.02 }}
        transition={{ duration: 0.6 }}
      >
        {/* Confetti Burst */}
        {showConfetti && <Confetti />}
        
        {/* Header with Level and Icon */}
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <span className="text-base sm:text-xl font-bold">Level {question.level}</span>
          <motion.svg
            whileHover={{ rotate: 360 }}
            className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.377-2.455a1 1 0 00-1.175 0l-3.377 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.21 9.397c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.97z" />
          </motion.svg>
        </div>
        
        {/* Question Text with reduced margin/padding on small devices */}
        <motion.p
          className="text-lg sm:text-3xl font-semibold text-center mb-1 sm:mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {question.question}
        </motion.p>

        {/* Excitement Tagline */}
        <motion.div
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.p 
            className="text-lg sm:text-2xl font-bold text-yellow-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Let's make this Annual Dinner unforgettable! 🎉
          </motion.p>
        </motion.div>

        {/* Answer Options / Input */}
        {renderOptions()}
      </motion.div>
    </div>
  );
};

export default QuestionCard;
