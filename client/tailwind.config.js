export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c9933b',
          hover: '#b07e2c',
        },
        dark: {
          DEFAULT: '#0f172a',
          lighter: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
