// Colours are not written here. Each name points at a CSS variable defined in
// src/index.css, so changing the palette later means editing that one block.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: v("night"),
        panel: v("panel"),
        chalk: v("chalk"),
        mute: v("mute"),
        edge: v("edge"),
        accent: v("accent"),
        card: v("card"),
        ink: v("ink"),
        red: v("red"),
        blue: v("blue"),
        green: v("green"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
      },
    },
  },
  plugins: [],
};
