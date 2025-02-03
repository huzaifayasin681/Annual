"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

const QuestionCard = ({ question, onAnswer }) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
    if (userInput.trim() !== '') {
      onAnswer(userInput); // Pass the typed value to GameBoard
      setUserInput('');    // Clear after submission
    }
  };

  const renderOptions = () => {
    if (question.type === 'yesno') {
      return (
        <div className="flex justify-around mt-6">
          <motion.button 
            onClick={() => onAnswer("yes")}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full transition duration-300 shadow-lg"
          >
            Yes
          </motion.button>
          <motion.button 
            onClick={() => onAnswer("no")}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full transition duration-300 shadow-lg"
          >
            No
          </motion.button>
        </div>
      );
    } else if (question.type === 'mcq') {
      return (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {question.options.map((option, index) => (
            <motion.button 
              key={index}
              onClick={() => onAnswer(option)}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-full transition duration-300 shadow-lg"
            >
              {option}
            </motion.button>
          ))}
        </div>
      );
    } else if (question.type === 'input') {
      // NEW: An open-ended question with a text input
      return (
        <div className="mt-6 flex flex-col items-center gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 rounded border border-gray-300 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
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
    <motion.div
      className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with level and decorative icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold">Level {question.level}</span>
        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.377-2.455a1 1 0 00-1.175 0l-3.377 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.21 9.397c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      </div>
      
      {/* Question text */}
      <p className="text-2xl font-semibold text-center mb-4">{question.question}</p>

      {/* Excitement Tagline (optional) */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p className="text-xl font-bold text-yellow-300">
          Let's make this Annual Dinner unforgettable! 🎉
        </p>
      </motion.div>

      {/* Render Answer Options / Input */}
      {renderOptions()}
    </motion.div>
  );
};

export default QuestionCard;
