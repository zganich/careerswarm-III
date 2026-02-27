import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#080808',
        surface: {
          DEFAULT: '#111111',
          2: '#1a1a1a',
          3: '#202020',
        },
        border: {
          DEFAULT: '#252525',
          light: '#333333',
        },
        amber: {
          DEFAULT: '#d4922a',
          dim: '#a36e1a',
          glow: 'rgba(212,146,42,0.08)',
        },
        cream: {
          DEFAULT: '#f0ebe0',
          dim: '#a09080',
          faint: '#3a3530',
        },
        cs: {
          green: '#27ae60',
          red: '#c0392b',
          yellow: '#f39c12',
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        mono: ['DM Mono', 'monospace'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeUp: 'fadeUp 0.8s ease forwards',
        scroll: 'scroll 30s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
