import { Variants } from 'framer-motion';

const delayBackdrop = 0.3;

export const sideVariants: Variants = {
  closed: (width) => {
    return {
      width: (width / 12) * 1,
    };
  },
  open: (width) => {
    return {
      width: (width / 12) * 2.5,
    };
  },
};
export const sideMobileVariants: Variants = {
  closed: () => {
    return {
      width: 0,
      opacity: 0,
      display: 'none',
    };
  },
  open: (width) => {
    return {
      width: width,
      opacity: 1,
      display: 'block',
    };
  },
};
export const sideTabletVariants: Variants = {
  closed: () => {
    return {
      transition: {
        staggerDirection: 1,
        ease: 'easeInOut',
      },
      width: 0,
      opacity: 0,
      display: 'none',
    };
  },
  open: (width) => {
    return {
      width: width,
      opacity: 1,
      display: 'block',
    };
  },
};
export const backgroundVariants: Variants = {
  closed: () => {
    return {
      opacity: 0,
      transition: {
        ease: 'easeInOut',
        duration: delayBackdrop,
      },
      pointerEvents: 'none',
    };
  },
  open: () => {
    return {
      opacity: 1,
      transition: {
        ease: 'easeInOut',
        duration: delayBackdrop,
      },
      pointerEvents: 'all',
    };
  },
};
