import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        church: {
          primary: '#1a237e',
          'primary-light': '#283593',
          'primary-dark': '#0d1642',
          secondary: '#f5c242',
          'secondary-light': '#f7d46e',
          'secondary-dark': '#d4a820',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
          muted: '#64748b',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
