/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react';
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/components/(button|input|avatar|dropdown|navbar|tab).js',
  ],
  theme: {
    extend: {
      screens: {
        xxs: '360px',
        xs: '480px',
      },
      backgroundColor: {
        base: '#191e25',
        'base-light': '#2e3440',
        'base-lighter': '#4c566a',
        accent: '#3c82f2',
      },
      textColor: {
        base: '#f8f9fa',
        'base-dark': '#dee2e6',
        'base-darker': '#adb5bd',
        accent: '#3c82f2',
      },
      borderColor: {
        base: '#454d56',
        'base-light': '#545b63',
      },
    },
  },

  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: {
              DEFAULT: '#0b0b0d',
            },
            primary: {
              foreground: '#E7E9FF',
              DEFAULT: '#5D43E7',
            },
          },
        },
      },
    }),
  ],
};
