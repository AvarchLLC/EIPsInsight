import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCopy } from 'react-icons/fi';
import { FaLock, FaEthereum } from 'react-icons/fa';
import NextLink from 'next/link';
import { useColorMode } from '@chakra-ui/react';

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  
  const walletAddress = '0x68B1C495096710Ab5D3aD137F5024221aAf35B7d';
  
  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('eips-insight-cookie-consent');
    
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('eips-insight-cookie-consent', 'accepted');
    localStorage.setItem('eips-insight-consent-date', new Date().toISOString());
    
    // Enable analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('eips-insight-cookie-consent', 'declined');
    localStorage.setItem('eips-insight-consent-date', new Date().toISOString());
    
    // Disable analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="fixed bottom-6 left-0 right-0 z-[99999] flex justify-center px-4"
      >
        {/* Premium Glassmorphism Container - Unified Hover */}
        <motion.div 
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative w-full max-w-5xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/10 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 group"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none group-hover:from-blue-500/15 group-hover:to-purple-500/15 transition-all duration-300"></div>
          
          {/* Animated shimmer effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
          </div>
          
          {/* Close Button */}
          <motion.button
            onClick={handleClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-all duration-200 z-10 backdrop-blur-sm"
            style={{ color: isDark ? 'rgb(156 163 175)' : 'rgb(75 85 99)' }}
            aria-label="Close banner"
          >
            <FiX size={18} />
          </motion.button>

          {/* Main Content */}
          <div className="relative flex flex-col md:flex-row items-stretch">
            {/* Left Section - Cookie Consent */}
            <div className="flex-1 md:flex-[0_0_60%] p-4 md:p-5 space-y-3 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-2 bg-gradient-to-br from-blue-500/40 to-blue-600/30 border border-blue-400/50 rounded-xl flex-shrink-0 shadow-lg shadow-blue-500/20"
                >
                  <FaLock className="w-4 h-4 text-blue-200" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 tracking-tight" style={{ color: isDark ? 'white' : 'rgb(17 24 39)' }}>
                    Your Privacy Matters
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90" style={{ color: isDark ? 'rgb(209 213 219)' : 'rgb(55 65 81)' }}>
                    🍪 We use cookies to enhance your experience and understand site usage.{' '}
                    <NextLink 
                      href="/privacy" 
                      className="underline decoration-blue-400/40 underline-offset-2 transition-colors font-medium hover:decoration-blue-400/80"
                      style={{ color: isDark ? 'rgb(96 165 250)' : 'rgb(37 99 235)' }}
                    >
                      Learn more
                    </NextLink>
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex items-center gap-3 pt-2"
              >
                <motion.button
                  onClick={handleAccept}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="px-6 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/40 transition-all duration-200"
                >
                  Accept All Cookies
                </motion.button>
                <motion.button
                  onClick={handleDecline}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-full border backdrop-blur-sm"
                  style={{ 
                    color: isDark ? 'rgb(209 213 219)' : 'rgb(55 65 81)',
                    borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(209,213,219,0.6)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  Decline
                </motion.button>
              </motion.div>
            </div>

            {/* Elegant Divider */}
            <div 
              className="hidden md:block w-px bg-gradient-to-b from-transparent to-transparent self-stretch my-4"
              style={{ 
                background: isDark 
                  ? 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)'
                  : 'linear-gradient(to bottom, transparent, rgba(209,213,219,0.3), transparent)'
              }}
            ></div>

            {/* Right Section - Donation Card */}
            <div className="flex-1 md:flex-[0_0_40%] p-4 md:p-5 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full max-w-sm"
              >
                <div className="text-center mb-3">
                  <h4 className="text-lg font-bold mb-1 tracking-tight" style={{ color: isDark ? 'white' : 'rgb(17 24 39)' }}>
                    💝 Support Our Mission
                  </h4>
                  <p className="text-xs opacity-90" style={{ color: isDark ? 'rgb(156 163 175)' : 'rgb(75 85 99)' }}>
                    Keep EIPs Insight free & open-source
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  {/* QR Code */}
                  <motion.div 
                    whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="relative group/qr flex-shrink-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl blur-xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-2 bg-white dark:bg-white rounded-xl shadow-xl group-hover/qr:shadow-2xl group-hover/qr:shadow-blue-500/40 transition-shadow duration-300 ring-2 ring-white/20 group-hover/qr:ring-blue-400/30">
                      <img
                        src="/qr-wallet.png"
                        alt="Donation QR Code"
                        className="w-20 h-20"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Wallet Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-xs font-semibold tracking-tight" style={{ color: isDark ? 'rgb(209 213 219)' : 'rgb(55 65 81)' }}>
                      Ethereum Address
                    </p>
                    <div className="relative group/wallet">
                      <div 
                        className="backdrop-blur-sm text-xs px-3 py-2.5 rounded-lg font-mono border transition-all duration-200 pr-9 shadow-sm"
                        style={{
                          backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
                          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(209,213,219,0.6)',
                          color: isDark ? 'rgb(229 231 235)' : 'rgb(31 41 55)'
                        }}
                      >
                        <div className="truncate leading-relaxed">
                          {walletAddress.slice(0, 12)}...{walletAddress.slice(-10)}
                        </div>
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-md transition-colors duration-200"
                        style={{ 
                          color: isDark ? 'rgb(156 163 175)' : 'rgb(75 85 99)',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = isDark ? 'rgb(96 165 250)' : 'rgb(37 99 235)';
                          e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(229,231,235,0.5)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = isDark ? 'rgb(156 163 175)' : 'rgb(75 85 99)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title={hasCopied ? 'Copied!' : 'Copy full address'}
                      >
                        <FiCopy size={14} />
                      </button>
                      {hasCopied && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[11px] rounded-lg font-semibold whitespace-nowrap shadow-lg shadow-green-500/50"
                        >
                          ✓ Copied!
                        </motion.div>
                      )}
                    </div>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center gap-1.5 text-xs mt-1.5"
                      style={{ color: isDark ? 'rgb(107 114 128)' : 'rgb(75 85 99)' }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <FaEthereum className="text-sm" style={{ color: isDark ? 'rgb(96 165 250)' : 'rgb(59 130 246)' }} />
                      </motion.div>
                      <span className="font-medium">Ethereum Network</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsentBanner;