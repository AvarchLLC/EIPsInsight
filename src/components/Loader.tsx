import React from 'react';
import { motion } from 'framer-motion';

const LoaderComponent = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center z-50 bg-gray-800 bg-opacity-50">
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gray-300 overflow-hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }} // Slower scale transition
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-blue-300"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{
            duration: 1, // Slower width transition
            delay: 0.3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut" // Optional: adds an easing effect to the animation
          }}
        />
      </motion.div>
      <motion.p
        className="text-white mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1, // Slower text opacity transition
          delay: 0.3,
          repeat: Infinity,
          repeatType: "reverse" // Makes the text fade in and out
        }}
      >
        Loading Experience...
      </motion.p>
    </div>
  );
};

export default LoaderComponent;
