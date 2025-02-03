// components/GameBoard.js
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import emailjs from '@emailjs/browser'; // 1) Import EmailJS
import QuestionCard from './QuestionCard';
import BlastEffect from './BlastEffect';
import AnimatedIcon from './AnimatedIcon';
import questionsData from '../../../public/data/questions';

// HARDCODE your EmailJS credentials here:
const SERVICE_ID = "service_ga194k4";  
const TEMPLATE_ID = "template_geqnw89";  
const PUBLIC_KEY = "9C0d12Bv9KHG4FTt6";    

const GameBoard = () => {
  // Retrieve user's name from query param (assuming you pass "?name=UserName" in the URL)
  const searchParams = useSearchParams();
  const userName = searchParams.get('name') || 'Guest';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBlast, setShowBlast] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFunFact, setShowFunFact] = useState(false);
  const [showInsult, setShowInsult] = useState(false);

  // Array to store user answers
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQuestion = questionsData[currentIndex];

  // 2) Function to send email once game is over
  const sendEmailToAdmin = () => {
    // Create a single string or structure from userAnswers
    // E.g., "Q1: yes\nQ2: no\nQ3: Some input" etc.
    const answersString = userAnswers
      .map(
        (item) =>
          `Q${item.questionId}: ${item.question}\nAnswer: ${item.answer}\n\n`
      )
      .join("");

    // Template params: match your EmailJS template fields
    const templateParams = {
      to_name: "Admin",  // or the admin's name
      from_name: userName,
      score: score,
      answers: answersString,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        console.log("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
      });
  };

  // 3) When gameOver is set to true, we send the email
  useEffect(() => {
    if (gameOver) {
      sendEmailToAdmin();
    }
  }, [gameOver]);

  const goToNextQuestion = () => {
    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback('');
    } else {
      setGameOver(true);
    }
  };

  // 4) Updated handleAnswer to store user answers
  const handleAnswer = (selectedAnswer) => {
    if (gameOver) return;

    // Save user's answer in state
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: selectedAnswer,
      },
    ]);

    // The rest of your logic for correctness, fun facts, insults, etc.
    const qType = currentQuestion.type;

    // Special condition: if the very first yes/no question is answered "no"
    if (
      currentIndex === 0 &&
      qType === 'yesno' &&
      selectedAnswer.toLowerCase() === "no"
    ) {
      setFeedback("Wrong Answer! But hey, you belong to Google and they will hire you soon!");
      setShowInsult(true);
      return;
    }

    // Check if it's an "input" question (open-ended)
    if (qType === 'input') {
      setScore(score + 1);
      setFeedback("Thanks for sharing!");
      setShowFunFact(true);
      setTimeout(() => {
        setShowFunFact(false);
        goToNextQuestion();
      }, 5000);
      return;
    }

    // Normal flow for yes/no or mcq
    if (selectedAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setScore(score + 1);
      setFeedback('Correct!');
      setShowBlast(true);
      setShowIcon(true);
      setTimeout(() => {
        setShowBlast(false);
        setShowIcon(false);
        setShowFunFact(true);
        setTimeout(() => {
          setShowFunFact(false);
          goToNextQuestion();
        }, 5000);
      }, 800);
    } else {
      // Wrong answer
      setFeedback('Wrong Answer!');
      setShowFunFact(true);
      setTimeout(() => {
        setShowFunFact(false);
        goToNextQuestion();
      }, 5000);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setFeedback('');
    setShowInsult(false);
    setUserAnswers([]); // Clear answers on restart
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl relative overflow-hidden">
      {/* Header: Level & Score */}
      <div className="mb-4 flex justify-between">
        <span className="font-semibold">Level {currentQuestion.level}</span>
        <span className="font-semibold">Score: {score}</span>
      </div>

      {/* Timeline / Progress Bar */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-1">
          Question {currentIndex + 1} of {questionsData.length}
        </p>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${((currentIndex + 1) / questionsData.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
          <p className="mb-4">Your final score is: {score}</p>
          <button 
            onClick={restartGame} 
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition transform hover:scale-105"
          >
            Restart Game
          </button>
        </div>
      ) : (
        <>
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
          {feedback && (
            <p className="text-center mt-4 font-semibold">{feedback}</p>
          )}
        </>
      )}
      
      {showBlast && <BlastEffect />}
      {showIcon && <AnimatedIcon />}

      <AnimatePresence>
        {showFunFact && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center p-6">
              <p className="text-2xl text-white font-bold mb-4">
                {currentQuestion.funFact}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInsult && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center p-6">
              <p className="text-2xl text-red-500 font-bold mb-4">
                {feedback}
              </p>
              <button 
                onClick={restartGame}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition transform hover:scale-105"
              >
                Restart Game
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;
