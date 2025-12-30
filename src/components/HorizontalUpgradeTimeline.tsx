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

  return (
    <div className={`relative p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between gap-3">
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
                  className={`px-6 py-4 rounded-xl font-bold transition-all duration-200 ${
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
                  <div className="text-sm md:text-base whitespace-nowrap">
                    {upgrade.name}
                  </div>
                </div>

                {/* Date */}
                <div className={`mt-2 text-xs md:text-sm font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {upgrade.date}
                </div>
                
                {/* "We are here" indicator */}
                {isCurrent && (
                  <MotionBox
                    className="mt-2"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } as any}
                  >
                    <div
                      className="text-white text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: upgrade.color,
                        boxShadow: `0 4px 12px ${upgrade.color}60`,
                      }}
                    >
                      🚀 we are here
                    </div>
                  </MotionBox>
                )}
              </MotionBox>

              {/* Connecting Line */}
              {index < upgrades.length - 1 && (
                <div className="flex-1 h-1 relative mx-2 md:mx-4 rounded-full overflow-hidden" style={{
                  backgroundColor: isDark ? '#4A5568' : '#E2E8F0'
                }}>
                  {/* Progress line */}
                  {isBeforeCurrent && (
                    <MotionBox
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ backgroundColor: '#10B981' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, ease: "easeOut" } as any}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Arrow indicator */}
      <div className="absolute -right-1 top-1/2 -translate-y-1/2">
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
