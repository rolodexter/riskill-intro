import { micro, ease } from './timings';
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { ...micro, ease } }
};

// Fade up on enter when in viewport, with optional delay (d)
export const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.5, ease },
  },
  viewport: { once: true, margin: '-80px' },
});
