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
          'black-secondary': '#0D0B13',
          'black-card': '#0F0D18',
          'black-surface': '#13111E',
          'black-border': '#1E1B2E',
          purple: '#9747FF',
          'purple-light': '#B06AFF',
          'purple-dark': '#7429E0',
          magenta: '#FF2689',
          orange: '#FF9C2B',
          gray: '#A5A3AD',
          'gray-dark': '#6B6880',
          'gray-muted': '#3A3750',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        space: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(90deg, #FF9C2B 0%, #FF2689 48%, #9747FF 100%)',
        'gradient-diagonal': 'linear-gradient(135deg, #FF9C2B 0%, #FF2689 50%, #9747FF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0B13 0%, #050505 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 0%, rgba(5,5,5,0.95) 70%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 40px rgba(151,71,255,0.2)',
        'glow-purple': '0 0 30px rgba(151,71,255,0.3)',
        'glow-magenta': '0 0 20px rgba(255,38,137,0.2)',
        'inner-purple': 'inset 0 1px 0 rgba(151,71,255,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(151,71,255,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(151,71,255,0.4)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      backdropBlur: {
        'glass': '20px',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};

export default config;

