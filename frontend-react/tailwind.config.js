/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mfu: {
          red: '#B11F24',
          gold: '#F6B81A',
        },
      },
    },
  },
  plugins: [],
}

