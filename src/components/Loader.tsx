import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const LoaderComponent = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center z-50 bg-gray-800 bg-opacity-50">
      <motion.div
        className="relative w-24 h-24 rounded-full bg-gray-300 overflow-hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {/* Make sure the Logo component is correctly imported */}
        <Logo />
      </motion.div>
      <motion.p
        className="text-white mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Loading Experience...
      </motion.p>
    </div>
  );
};

export default LoaderComponent;
