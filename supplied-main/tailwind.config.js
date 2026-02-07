/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Border color */
        border: '#1F2A44',
        
        /* Primary accent - liquid blue */
        primary: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        
        /* Secondary accent - violet glow */
        accent: {
          400: '#C4B5FD',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        'accent-soft': 'rgba(139, 92, 246, 0.25)',
        
        /* Status colors */
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        
        /* Semantic base colors - flat structure for Tailwind utilities */
        main: '#070B14',     /* bg-main */
        card: '#0F172A',     /* bg-card */
        elevated: '#111C2D', /* bg-elevated */
        muted: '#94A3B8',    /* text-muted */
        dim: '#64748B',      /* text-dim */
        
        /* Glow effects */
        'glow-blue': 'rgba(59, 130, 246, 0.35)',
        'glow-violet': 'rgba(139, 92, 246, 0.35)',
        
        /* Legacy colors for backward compatibility */
        cyber: {
          50: '#e6f7ff',
          100: '#b3e5ff',
          200: '#80d4ff',
          300: '#4dc2ff',
          400: '#1ab1ff',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#164e63',
          900: '#0a3a4a',
        },
        dark: {
          50: '#1F2A44',
          100: '#0F172A',
          200: '#070B14',
          300: '#080b1f',
          400: '#060817',
          500: '#04050f',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230891b2' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        scan: 'scan 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        decode: 'decode 0.8s ease-out forwards',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        decode: {
          '0%': { opacity: 0, filter: 'blur(10px)' },
          '100%': { opacity: 1, filter: 'blur(0)' },
        }
      },
    },
  },
  plugins: [],
}
