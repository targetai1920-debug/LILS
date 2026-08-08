import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': 'var(--brand-blue)',
        'brand-blue-dark': 'var(--brand-blue-dark)',
        'brand-cream': 'var(--brand-cream)',
        'brand-beige': 'var(--brand-beige)',
        'brand-black': 'var(--brand-black)',
        'brand-white': 'var(--brand-white)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        brand: '2rem',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.94)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 420ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slide-up': 'slide-up 480ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        float: 'float 4.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
