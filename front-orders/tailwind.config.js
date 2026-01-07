/* eslint-disable @typescript-eslint/no-var-requires */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/tailwind-datepicker-react/dist/**/*.js', // <--- Add this line
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-prudential-modern)'],
      },
      colors: {
        primary: {
          // Customize it on globals.css :root
          50: '#DBEFF8',
          100: '#B9D5DD',
          200: '#7ECAF2',
          300: '#60B9E8',
          400: '#3A9BCE',
          500: '#007BC3',
          600: '#2D616F',
          700: '#075D8F',
          800: '#133B46',
          900: '#001F45',
        },
        prudential: {
          // Customize it on globals.css :root
          500: '#0066CC',
        },
        border: {
          100: '#E3E6E7',
        },
        teal: {
          terciary: '#018786',
        },
        dark: '#222222',
        secondary: {
          50: '#DBEFF8',
          100: '#B9D5DD',
          200: '#95B7C2',
          300: '#719AA7',
          400: '#558493',
          500: '#386F7F',
          600: '#2D616F',
          700: '#204E5A',
          800: '#133B46',
          900: '#CA082C ',
        },
        neutral: {
          50: '#F8F9F9',
          100: '#E3E6E7',
          200: '#CFD5D7',
          300: '#B8BFC3',
          400: '#9BA6AC',
          500: '#67747B',
          600: '#4C555A',
          800: '#373538',
        },
        terciary: {
          300: '#EA9CA1',
          900: '#D53943',
        },
        success: {
          300: '#F3F8EC',
          700: '#85BC49',
        },
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: 0.99,
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: 0.4,
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
