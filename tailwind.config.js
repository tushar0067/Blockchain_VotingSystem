/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Include paths to all of your pages and components that use Tailwind CSS
    './pages/**/*.{js,ts,jsx,tsx}',    // All files in the pages directory
    './components/**/*.{js,ts,jsx,tsx}', // All files in the components directory (if applicable)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

