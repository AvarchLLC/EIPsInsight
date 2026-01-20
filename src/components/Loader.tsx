import React from 'react';
import { motion } from 'framer-motion';
import { useColorModeValue } from '@chakra-ui/react';
import Logo from './Logo';

const LoaderComponent = () => {
  const bgOverlay = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(2, 6, 23, 0.7)');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(15, 23, 42, 0.9)');
  const cardBorder = useColorModeValue('rgba(209, 213, 219, 0.8)', 'rgba(51, 65, 85, 0.8)');
  const spinnerBorder = useColorModeValue('rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.3)');
  const spinnerActive = useColorModeValue('rgba(59, 130, 246, 0.9)', 'rgba(96, 165, 250, 0.9)');
  const textColor = useColorModeValue('rgba(55, 65, 81, 0.9)', 'rgba(241, 245, 249, 0.9)');
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.4)');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: bgOverlay }}
    >
      <div 
        className="flex flex-col items-center rounded-2xl border px-8 py-6 shadow-xl"
        style={{ 
          backgroundColor: cardBg,
          borderColor: cardBorder,
          boxShadow: `0 20px 25px -5px ${shadowColor}, 0 10px 10px -5px ${shadowColor}`
        }}
      >
        {/* Logo with circular spinner around it */}
        <div className="relative mb-3 flex items-center justify-center">
          {/* Spinner ring on the circumference */}
          <motion.div
            className="w-20 h-20 rounded-full border-[3px]"
            style={{
              borderColor: spinnerBorder,
              borderTopColor: spinnerActive,
            }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {/* Centered logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo />
          </div>
        </div>

        {/* Calm label */}
        <p 
          className="mt-2 text-xs sm:text-sm tracking-wide"
          style={{ color: textColor }}
        >
          Loading experience…
        </p>
      </div>
    </div>
  );
};

export default LoaderComponent;
