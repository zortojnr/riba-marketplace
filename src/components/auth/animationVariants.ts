import type { Variants } from 'framer-motion';

// Logo container variants
export const containerVariants: Variants = {
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
};

// Background gradient animation
export const backgroundVariants: Variants = {
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
};

// Text animation variants
export const textVariants: Variants = {
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
};

// Loading indicator variants
export const loadingVariants: Variants = {
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
};

// Progress bar variants
export const progressBarVariants: Variants = {
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
};

// Progress fill animation
export const progressFillVariants = (duration: number) => ({
  initial: {
    width: "0%"
  } as const,
  animate: {
    width: "100%",
    transition: {
      duration: duration / 1000,
      ease: "linear"
    }
  } as const
});

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