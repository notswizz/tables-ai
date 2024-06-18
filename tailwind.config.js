// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        '112': '200px', // Custom height between h-96 (24rem) and h-128 (32rem)
      },
    },
  },
  plugins: [],
};
