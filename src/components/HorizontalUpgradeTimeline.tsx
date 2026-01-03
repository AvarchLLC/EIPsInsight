import React from 'react';
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface TimelineUpgrade {
  name: string;
  key: 'pectra' | 'fusaka' | 'glamsterdam' | 'hegota';
  date: string;
  color: string;
  bgColor: string;
  isPast: boolean;
}

interface HorizontalUpgradeTimelineProps {
  selectedUpgrade: 'pectra' | 'fusaka' | 'glamsterdam' | 'hegota';
  onUpgradeClick: (upgrade: 'pectra' | 'fusaka' | 'glamsterdam' | 'hegota') => void;
}

const MotionBox = motion(Box);

const HorizontalUpgradeTimeline: React.FC<HorizontalUpgradeTimelineProps> = ({
  selectedUpgrade,
  onUpgradeClick,
}) => {
  const isDark = useColorModeValue(false, true);

  const upgrades: TimelineUpgrade[] = [
    {
      name: 'Previous Upgrades',
      key: 'pectra', // Using pectra as fallback for non-interactive node
      date: '2015-2024',
      color: '#6B7280',
      bgColor: '#F3F4F6',
      isPast: true,
    },
    {
      name: 'Pectra',
      key: 'pectra',
      date: 'May 7, 2025',
      color: '#DC2626',
      bgColor: '#FEE2E2',
      isPast: true,
    },
    {
      name: 'Fusaka',
      key: 'fusaka',
      date: 'Dec 3, 2025',
      color: '#10B981',
      bgColor: '#D1FAE5',
      isPast: true,
    },
    {
      name: 'Glamsterdam',
      key: 'glamsterdam',
      date: '2026',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      isPast: false,
    },
    {
      name: 'Hegotá',
      key: 'hegota',
      date: 'TBD',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      isPast: false,
    },
  ];

  const currentIndex = upgrades.findIndex(u => u.key === 'fusaka');
  const currentTransitionIndex = currentIndex; // Between Fusaka and Glamsterdam

  return (
    <div className={`relative p-4 sm:p-6 md:p-8 rounded-2xl overflow-x-auto ${isDark ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' : 'bg-gradient-to-br from-white to-gray-50'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
      <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 min-w-max px-2 sm:px-4">
        {upgrades.map((upgrade, index) => {
          const isSelected = selectedUpgrade === upgrade.key;
          const isCurrent = index === currentIndex;
          const isBeforeCurrent = index < currentIndex;

          return (
            <React.Fragment key={upgrade.key}>
              {/* Upgrade Node */}
              <MotionBox
                className={`flex flex-col items-center relative z-10 ${index === 0 ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => index > 0 && onUpgradeClick(upgrade.key)}
                whileHover={index > 0 ? { scale: 1.08, y: -4 } : {}}
                whileTap={index > 0 ? { scale: 0.95 } : {}}
                transition={{ duration: 0.2, ease: "easeOut" } as any}
              >
                {/* Rectangle Node */}
                <div
                  className={`relative px-3 sm:px-5 md:px-8 py-2.5 sm:py-3.5 md:py-5 rounded-xl md:rounded-2xl font-bold transition-all duration-300 ${
                    index === 0
                      ? isDark
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400 opacity-70'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 opacity-80'
                      : isSelected
                      ? `text-white shadow-2xl ring-4 ring-opacity-30`
                      : isDark
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 hover:from-gray-600 hover:to-gray-700'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-white hover:to-gray-100'
                  }`}
                  style={{
                    backgroundColor: isSelected && index > 0 ? upgrade.color : undefined,
                    boxShadow: isSelected && index > 0 ? `0 8px 30px ${upgrade.color}50, 0 4px 12px ${upgrade.color}30` : undefined,
                    borderColor: isSelected && index > 0 ? upgrade.color : undefined,
                  }}
                >
                  <div className="text-xs sm:text-base md:text-lg lg:text-xl whitespace-nowrap font-extrabold">
                    {upgrade.name}
                  </div>
                  {isBeforeCurrent && index > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white shadow-md" />
                  )}
                </div>

                {/* Date */}
                <div className={`mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold tracking-wide ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {upgrade.date}
                </div>
              </MotionBox>

              {/* Connecting Line */}
              {index < upgrades.length - 1 && (
                <div className="flex-1 h-1 sm:h-1.5 md:h-2 relative mx-2 sm:mx-3 md:mx-6 rounded-full shadow-inner" style={{
                  backgroundColor: isDark ? '#374151' : '#E5E7EB',
                  minWidth: '30px',
                  maxWidth: '200px'
                }}>
                  {/* Progress line - full green for completed transitions */}
                  {isBeforeCurrent && (
                    <MotionBox
                      className="absolute top-0 left-0 h-full rounded-full shadow-lg"
                      style={{ 
                        backgroundColor: '#10B981',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, ease: "easeOut" } as any}
                    />
                  )}
                  {/* Half-green line for current transition (between Fusaka and Glamsterdam) */}
                  {index === currentTransitionIndex && (
                    <MotionBox
                      className="absolute top-0 left-0 h-full rounded-full shadow-lg"
                      style={{ 
                        backgroundColor: '#10B981',
                        boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: '50%' }}
                      transition={{ duration: 1, ease: "easeOut" } as any}
                    />
                  )}
                  {/* "We are here" indicator on the transition line */}
                  {index === currentTransitionIndex && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
                      <MotionBox
                        animate={{ 
                          scale: [1, 1.15, 1],
                          y: [0, -2, 0]
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        } as any}
                      >
                        <div
                          className="relative text-white text-[8px] sm:text-[10px] md:text-xs font-extrabold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full whitespace-nowrap shadow-xl border border-white/30"
                          style={{
                            backgroundColor: '#10B981',
                            boxShadow: `0 4px 12px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.2)`,
                          }}
                        >
                          <span className="hidden sm:inline mr-0.5 md:mr-1">🚀</span>
                          <span className="tracking-tight">We are here</span>
                          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#10B981' }} />
                        </div>
                      </MotionBox>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Arrow indicator */}
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:block">
        <MotionBox
          animate={{ x: [0, 4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } as any}
        >
          <div
            className="w-0 h-0"
            style={{
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              borderLeft: `16px solid ${isDark ? '#6B7280' : '#D1D5DB'}`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </MotionBox>
      </div>
    </div>
  );
};

export default HorizontalUpgradeTimeline;
