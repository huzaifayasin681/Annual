// components/GameBoard.js
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";
import QuestionCard from "./QuestionCard";
import BlastEffect from "./BlastEffect";
import AnimatedIcon from "./AnimatedIcon";
import questionsData from "../../../public/data/questions";

// HARDCODE your EmailJS credentials here:
const SERVICE_ID = "service_ga194k4";
const TEMPLATE_ID = "template_geqnw89";
const PUBLIC_KEY = "9C0d12Bv9KHG4FTt6";

const GameBoard = () => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name") || "Guest";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBlast, setShowBlast] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFunFact, setShowFunFact] = useState(false);
  const [showInsult, setShowInsult] = useState(false);

  // Array to store user answers
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQuestion = questionsData[currentIndex];

  // 1) Function to send email once game is over
  const sendEmailToAdmin = () => {
    const answersString = userAnswers
      .map(
        (item) =>
          `Q${item.questionId}: ${item.question}\nAnswer: ${item.answer}\n\n`
      )
      .join("");

    const templateParams = {
      to_name: "Admin",
      from_name: userName,
      score: score,
      answers: answersString,
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        console.log("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
      });
  };

  // 2) When gameOver is set to true, we send the email
  useEffect(() => {
    if (gameOver) {
      sendEmailToAdmin();
    }
  }, [gameOver]);

  const goToNextQuestion = () => {
    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback("");
    } else {
      setGameOver(true);
    }
  };

  // 3) Updated handleAnswer to store user answers
  const handleAnswer = (selectedAnswer) => {
    if (gameOver) return;

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: selectedAnswer,
      },
    ]);

    const qType = currentQuestion.type;

    // Special condition: if the very first yes/no question is answered "no"
    if (
      currentIndex === 0 &&
      qType === "yesno" &&
      selectedAnswer.toLowerCase() === "no"
    ) {
      setFeedback(
        "Wrong Answer! But hey, you belong to Google and they will hire you soon!"
      );
      setShowInsult(true);
      return;
    }

    // If it's an "input" question
    if (qType === "input") {
      setScore((prev) => prev + 1);
      setFeedback("Thanks for sharing!");
      setShowFunFact(true);
      setTimeout(() => {
        setShowFunFact(false);
        goToNextQuestion();
      }, 3000);
      return;
    }

    // Normal flow for yes/no or mcq
    if (selectedAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setScore((prev) => prev + 1);
      setFeedback("Correct!");
      setShowBlast(true);
      setShowIcon(true);
      setTimeout(() => {
        setShowBlast(false);
        setShowIcon(false);
        setShowFunFact(true);
        setTimeout(() => {
          setShowFunFact(false);
          goToNextQuestion();
        }, 3000);
      }, 800);
    } else {
      // Wrong answer
      setFeedback("Wrong Answer!");
      setShowFunFact(true);
      setTimeout(() => {
        setShowFunFact(false);
        goToNextQuestion();
      }, 3000);
    }
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameOver(false);
    setFeedback("");
    setShowInsult(false);
    setUserAnswers([]);
  };

  // Check if we are on the last question AND if that question is an input
  const isLastQuestionInput =
    currentIndex === questionsData.length - 1 && currentQuestion?.type === "input";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #6D28D9, #3B82F6)",
            "linear-gradient(135deg, #3B82F6, #EC4899)",
            "linear-gradient(135deg, #EC4899, #F59E0B)",
            "linear-gradient(135deg, #F59E0B, #6D28D9)"
          ],
        }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "loop" }}
      />

      <div className="relative max-w-xl mx-auto w-full p-4 z-10">
        <div className="bg-white p-8 rounded-lg shadow-2xl relative overflow-hidden">
          {/* Header: Level & Score with subtle floating animation */}
          {!gameOver && (
            <motion.div
              className="mb-4 flex justify-between"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <motion.span
                className="font-semibold text-lg"
                whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(59,130,246,0.8)" }}
              >
                Level {currentQuestion.level}
              </motion.span>
              <motion.span
                className="font-semibold text-lg"
                whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(16,185,129,0.8)" }}
              >
                Score: {score}
              </motion.span>
            </motion.div>
          )}

          {/* Timeline / Progress Bar */}
          {!gameOver && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Question {currentIndex + 1} of {questionsData.length}
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <motion.div
                  className="bg-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentIndex + 1) / questionsData.length) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
            </div>
          )}

          {gameOver ? (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-extrabold mb-2 text-indigo-700">
                Game Over!
              </h3>
              <p className="mb-4 text-lg">
                Your final score is: <strong>{score}</strong>
              </p>

              {/* Thanks Message from Devneloper Team */}
              <div className="p-6 bg-indigo-100 rounded-lg shadow-md inline-block">
                <p className="text-xl font-semibold text-indigo-700">
                  Thank you for playing!
                </p>
                <p className="text-md mt-2 text-indigo-600">
                  The{" "}
                  <span className="font-bold">Devneloper Team</span> appreciates your time.
                  We hope you had fun and learned something new.
                </p>
              </div>

              <motion.button
                onClick={restartGame}
                whileHover={{ scale: 1.1 }}
                className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition transform hover:scale-105"
              >
                Restart Game
              </motion.button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Highlight if last question is input */}
                  {isLastQuestionInput ? (
                    <div className="p-4 border-4 border-dashed border-indigo-500 rounded-lg bg-indigo-50 transition-all">
                      <QuestionCard
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                      />
                    </div>
                  ) : (
                    <QuestionCard
                      question={currentQuestion}
                      onAnswer={handleAnswer}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {feedback && (
                <motion.p
                  className="text-center mt-4 font-semibold text-lg text-indigo-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {feedback}
                </motion.p>
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
                  <motion.button
                    onClick={restartGame}
                    whileHover={{ scale: 1.1 }}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition transform hover:scale-105"
                  >
                    Restart Game
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
