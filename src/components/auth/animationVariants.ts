import { Variants } from 'framer-motion';

export const logoAnimationVariants: Variants = {
  // Logo container variants
  container: {
    initial: {
      scale: 0,
      opacity: 0,
      rotate: -270,
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96],
        rotate: {
          duration: 1.5,
          ease: "easeInOut"
        }
      }
    },
    exit: {
      scale: 1.8,
      opacity: 0,
      rotate: 180,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  },

  // Background gradient animation
  background: {
    initial: {
      opacity: 0,
      scale: 1.1
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.6,
        ease: "easeIn"
      }
    }
  },

  // Text animation variants
  text: {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.6,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  },

  // Loading indicator variants
  loading: {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 10
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  },

  // Progress bar variants
  progressBar: {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.3
      }
    }
  },

  // Progress fill animation
  progressFill: (duration: number) => ({
    initial: {
      width: "0%"
    },
    animate: {
      width: "100%",
      transition: {
        duration: duration / 1000,
        ease: "linear"
      }
    }
  }),

  // Floating particles animation
  particle: (delay: number, duration: number) => ({
    initial: {
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0
    },
    animate: {
      opacity: [0, 0.6, 0],
      scale: [0, 1, 0.5],
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      transition: {
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  })
};

// Stagger animation for multiple elements
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Smooth entrance for auth form
export const authFormVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};