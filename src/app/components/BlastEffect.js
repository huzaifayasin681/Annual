// components/BlastEffect.js
"use client";
import { motion } from 'framer-motion';

const BlastEffect = () => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 rounded-full" />
    </motion.div>
  );
};

export default BlastEffect;
