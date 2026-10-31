import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ganley: {
          black: '#050505',
          'surface-1': '#0C0A12',
          'surface-2': '#15101E',
          'surface-3': '#1E172B',
          white: '#FFFFFF',
          gray: '#9996A3',
          'gray-light': '#C5C3CD',
          'gray-dark': '#555263',
          'gray-muted': '#2E2B38',
          purple: '#9747FF',
          'purple-light': '#B372FF',
          'purple-dark': '#6C25D9',
          magenta: '#FF2689',
          'magenta-light': '#FF5CA5',
          orange: '#FF9C2B',
          'orange-light': '#FFB55E',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        space: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(100deg, #FF9C2B 0%, #FF2689 48%, #9747FF 100%)',
        'gradient-accent-vertical': 'linear-gradient(180deg, #FF9C2B 0%, #FF2689 50%, #9747FF 100%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(21,16,30,0.6) 0%, rgba(12,10,18,0.9) 100%)',
        'gradient-card-overlay': 'linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.95) 100%)',
        'gradient-hero-overlay': 'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.7) 60%, #050505 100%)',
      },
      boxShadow: {
        'ambient-purple': '0 0 50px -10px rgba(151,71,255,0.25)',
        'ambient-magenta': '0 0 50px -10px rgba(255,38,137,0.2)',
        'card-elevated': '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 1px 1px rgba(255,255,255,0.05)',
        'card-hover': '0 25px 50px -12px rgba(151,71,255,0.2), 0 0 1px 1px rgba(151,71,255,0.3)',
        'pill': '0 4px 20px rgba(151,71,255,0.25)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      letterSpacing: {
        'tightest': '-0.035em',
        'tighter': '-0.025em',
        'tight': '-0.015em',
        'wide-pill': '0.08em',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
