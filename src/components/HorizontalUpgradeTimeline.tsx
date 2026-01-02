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
      name: 'Hegotá Upgrade',
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
    <div className={`relative p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl overflow-x-auto ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-3 min-w-max">
        {upgrades.map((upgrade, index) => {
          const isSelected = selectedUpgrade === upgrade.key;
          const isCurrent = index === currentIndex;
          const isBeforeCurrent = index < currentIndex;

          return (
            <React.Fragment key={upgrade.key}>
              {/* Upgrade Node */}
              <MotionBox
                className="flex flex-col items-center cursor-pointer"
                onClick={() => onUpgradeClick(upgrade.key)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 } as any}
              >
                {/* Rectangle Node */}
                <div
                  className={`px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-lg md:rounded-xl font-bold transition-all duration-200 ${
                    isSelected
                      ? `text-white shadow-lg`
                      : isDark
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  style={{
                    backgroundColor: isSelected ? upgrade.color : undefined,
                    boxShadow: isSelected ? `0 4px 20px ${upgrade.color}40` : undefined,
                  }}
                >
                  <div className="text-[10px] sm:text-sm md:text-base whitespace-nowrap">
                    {upgrade.name}
                  </div>
                </div>

                {/* Date */}
                <div className={`mt-1 sm:mt-2 text-[9px] sm:text-xs md:text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {upgrade.date}
                </div>
                
                {/* No individual "We are here" indicator on nodes anymore */}
              </MotionBox>

              {/* Connecting Line */}
              {index < upgrades.length - 1 && (
                <div className="flex-1 h-0.5 sm:h-1 relative mx-1 sm:mx-2 md:mx-4 rounded-full" style={{
                  backgroundColor: isDark ? '#4A5568' : '#E2E8F0',
                  minWidth: '20px'
                }}>
                  {/* Progress line - full green for completed transitions */}
                  {isBeforeCurrent && (
                    <MotionBox
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ backgroundColor: '#10B981' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, ease: "easeOut" } as any}
                    />
                  )}
                  {/* Half-green line for current transition (between Fusaka and Glamsterdam) */}
                  {index === currentTransitionIndex && (
                    <MotionBox
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ backgroundColor: '#10B981' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '50%' }}
                      transition={{ duration: 0.8, ease: "easeOut" } as any}
                    />
                  )}
                  {/* "We are here" indicator on the transition line */}
                  {index === currentTransitionIndex && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
                      <MotionBox
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        } as any}
                      >
                        <div
                          className="text-white text-[8px] xs:text-[9px] sm:text-xs font-bold px-1 xs:px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap"
                          style={{
                            backgroundColor: '#10B981',
                            boxShadow: `0 4px 12px #10B98160`,
                          }}
                        >
                          <span className="hidden sm:inline">🚀 </span>we are here
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
      <div className="absolute -right-1 top-1/2 -translate-y-1/2 hidden sm:block">
        <div
          className="w-0 h-0"
          style={{
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: `12px solid ${isDark ? '#4A5568' : '#E2E8F0'}`,
          }}
        />
      </div>
    </div>
  );
};

export default HorizontalUpgradeTimeline;
