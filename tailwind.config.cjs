const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        'darkPurple': {
          600: '#4B4471',
          700: '#3A325C',
          800: '#201B37',
          900: '#17122B'
        }
      },
      opacity: {
        '8': '.08',
        '15': '.15'
      },
      zIndex: {
        'max': '2147483647'
      }
    },
  },
  plugins: [
    plugin(({ addVariant, matchUtilities, theme }) => {
      matchUtilities(
        { 'animation-delay': (value) => ({ 'animation-delay': value }) },
        { values: theme('transitionDelay') }
      );
      addVariant('no-backdrop-blur', '@supports not (backdrop-filter: blur())')
    }),
  ],
}
