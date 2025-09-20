/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extend với colors từ SCSS variables để consistency
        'navy': '#0F172A',
        'light-slate': '#BFBECB',
        'slate': '#a0a0a0',
        'white-custom': '#E6F1FF',
        'green-custom': '#72E2AE',
      },
      fontFamily: {
        'primary': ['Radio Canada', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'md': '18px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      screens: {
        'mobile': {'max': '480px'},
        'tablet': {'max': '768px'},
        'desktop': '1024px',
        'large': '1200px',
      },
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      zIndex: {
        'dropdown': '100',
        'modal': '1000',
        'tooltip': '2000',
      }
    },
  },
  plugins: [],
  // Cấu hình để tránh conflict với SCSS
  corePlugins: {
    preflight: false, // Tắt reset CSS của Tailwind để không conflict với SCSS reset
  },
}