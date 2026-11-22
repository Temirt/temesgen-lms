/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#14213D',     // Deep Navy Blue
          secondary: '#6C63FF',   // Purple
          accent: '#3B82F6',      // Bright Blue
          bg: '#F8FAFC',          // Light Gray
          card: '#FFFFFF',        // White
          text: '#172033',        // Dark Navy
          muted: '#64748B',       // Muted slate
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
