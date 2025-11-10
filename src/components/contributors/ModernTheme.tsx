import { extendTheme } from '@chakra-ui/react';

// Modern aesthetic theme configuration for contributors dashboard
const modernContributorsTheme = {
  colors: {
    brand: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      200: '#91D5FF',
      300: '#69C0FF', 
      400: '#40A9FF',
      500: '#1890FF',
      600: '#096DD9',
      700: '#0050B3',
      800: '#003A8C',
      900: '#002766',
    },
    accent: {
      50: '#FFF0F6',
      100: '#FFD6E7',
      200: '#FFADD2',
      300: '#FF85C0',
      400: '#FF5CAE',
      500: '#FF339C',
      600: '#FF1A8A',
      700: '#E6005C',
      800: '#CC0052',
      900: '#B30047',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    }
  },
  fonts: {
    heading: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    body: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  radii: {
    sm: '0.375rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3)',
    glow: '0 0 0 1px rgba(66, 153, 225, 0.5), 0 0 20px rgba(66, 153, 225, 0.3)',
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: 'gray.200',
          _dark: {
            borderColor: 'gray.600',
          },
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-2px)',
            shadow: 'lg',
          }
        }
      },
      variants: {
        elevated: {
          container: {
            bg: 'white',
            _dark: { bg: 'gray.800' },
            shadow: 'xl',
            borderRadius: '2xl',
          }
        },
        gradient: {
          container: {
            bgGradient: 'linear(to-br, blue.400, purple.500)',
            color: 'white',
            border: 'none',
          }
        }
      }
    },
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: 'medium',
        transition: 'all 0.2s ease',
        _focus: {
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
        }
      },
      variants: {
        gradient: {
          bgGradient: 'linear(to-r, blue.400, purple.500)',
          color: 'white',
          _hover: {
            bgGradient: 'linear(to-r, blue.500, purple.600)',
            transform: 'translateY(-1px)',
            shadow: 'lg',
          }
        }
      }
    },
    Tabs: {
      variants: {
        modern: {
          tablist: {
            borderBottom: '2px solid',
            borderColor: 'gray.200',
            _dark: { borderColor: 'gray.600' },
          },
          tab: {
            borderRadius: 'lg',
            fontWeight: 'medium',
            _selected: {
              bg: 'blue.500',
              color: 'white',
              borderColor: 'blue.500',
            },
            _hover: {
              bg: 'blue.50',
              _dark: { bg: 'gray.700' },
            }
          }
        }
      }
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
        fontWeight: 'medium',
      }
    },
    Progress: {
      baseStyle: {
        track: {
          borderRadius: 'full',
        },
        filledTrack: {
          borderRadius: 'full',
        }
      }
    }
  },
  styles: {
    global: {
      'html, body': {
        fontFamily: 'Inter, system-ui, sans-serif',
        lineHeight: 'tall',
      },
      '*::placeholder': {
        color: 'gray.400',
      },
      '*, *::before, *::after': {
        borderColor: 'gray.200',
        _dark: {
          borderColor: 'gray.600',
        }
      }
    }
  }
};

// Enhanced color palettes for charts
export const chartColorPalettes = {
  primary: [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140', '#a8edea', '#fed6e3'
  ],
  gradient: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ],
  semantic: {
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#3B82F6',
    neutral: '#6B7280'
  },
  contributor: {
    core: '#F59E0B',      // Gold for core contributors
    regular: '#3B82F6',    // Blue for regular contributors
    occasional: '#10B981', // Green for occasional contributors
    oneTime: '#8B5CF6',   // Purple for one-time contributors
  }
};

// Animation presets
export const animations = {
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// Chart theme configurations
export const echartThemes = {
  light: {
    backgroundColor: '#ffffff',
    textStyle: {
      color: '#2D3748',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    grid: {
      borderColor: '#E2E8F0'
    }
  },
  dark: {
    backgroundColor: '#1A202C',
    textStyle: {
      color: '#E2E8F0',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    grid: {
      borderColor: '#4A5568'
    }
  }
};

export default modernContributorsTheme;