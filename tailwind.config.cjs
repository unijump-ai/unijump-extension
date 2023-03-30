const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-to-b': 'radial-gradient(100% 100% at 50% 0%, var(--tw-gradient-stops))'
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
        '2': '.02',
        '8': '.08',
        '12': '.12',
        '15': '.15',
        '32': '.32',
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
