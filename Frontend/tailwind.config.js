const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enables dark mode based on class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Specifies the files Tailwind should scan for class names
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)', // Custom border radius
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // You can add custom colors here if needed
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Add any required plugins
};

// Function to add CSS variables for colors
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({
    ":root": newVars,
  });
}

// Include the color variables function in the plugins
module.exports.plugins.push(addVariablesForColors);
