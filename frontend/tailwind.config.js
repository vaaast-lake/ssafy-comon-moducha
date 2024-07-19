/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors:{
      'tea':'#CCD5AE',
      'beige':'#E9EDC9',
      'cornsilk':'#FEFAE0',
      'papaya':'#FAEDCD',
      'wood':'#D4A373',
    },
    extend: {},
  },
  plugins: [daisyui],
};
