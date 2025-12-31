/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#13c8ec",
        "background-light": "#f6f8f8",
        "background-dark": "#101f22",
        "surface-dark": "#1c2527",
        "surface-dark-highlight": "#2a364d",
        "border-dark": "#3b4f54",
        "text-subtle": "#9db4b9",
        "text-secondary": "#9db4b9",
        "text-muted": "#94a3b8",
        "sidebar-dark": "#05070e",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
}