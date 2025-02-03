// components/AnimatedIcon.js
"use client";
import { motion } from 'framer-motion';

const AnimatedIcon = () => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1.5, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </motion.div>
);

export default AnimatedIcon;
