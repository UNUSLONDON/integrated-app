/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#121A24",
        surface: "#1E2A3A",
        primary: "#FF6B2B",
        accent: "#3B82F6",
        darkText: "#94A3B8",
        lightText: "#E2E8F0"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: [],
}
