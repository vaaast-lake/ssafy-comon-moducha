/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tea: '#26BB69',
        beige: '#E9EDC9',
        cornsilk: '#FEFAE0',
        papaya: '#FAEDCD',
        wood: '#D4A373',
        teabg: '#E6F9E4',
        disabled: '#626262',
      },
    },
  },
  plugins: [daisyui],
};
