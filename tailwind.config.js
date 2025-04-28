/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#000080', // Dark blue
          800: '#000066',
          700: '#00004D',
          600: '#000033',
          500: '#00001A',
          DEFAULT: '#000080',
        },
        dark: {
          900: '#000000', // Pure black
          800: '#0D0D0D',
          700: '#1A1A1A',
          600: '#262626',
          500: '#333333',
          DEFAULT: '#000000',
        },
        accent: {
          500: '#3B82F6', // Blue accent
          400: '#60A5FA',
          300: '#93C5FD',
          DEFAULT: '#3B82F6',
        },
        success: '#10B981', // Green for success states
        warning: '#F59E0B', // Amber for warnings
        error: '#EF4444',   // Red for errors
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #000000, #000080)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        nav: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}