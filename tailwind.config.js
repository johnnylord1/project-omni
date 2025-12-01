/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        surface: 'var(--color-surface)',
        background: 'var(--color-background)',
        'on-surface': 'var(--color-on-surface)',
        'on-primary': 'var(--color-on-primary)',
        'surface-variant': 'var(--color-surface-variant)',
        outline: 'var(--color-outline)',
      },
      borderRadius: {
        'md': 'var(--radius-md)',
        'full': 'var(--radius-full)',
      },
    },
  },
  plugins: [],
}

