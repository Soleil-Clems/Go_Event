/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          "scrollbar-width": "thin", 
          "scrollbar-color": "silver white",  
          "&::-webkit-scrollbar": {
            width: "8px",  
          },
          "&::-webkit-scrollbar-track": {
            background: "white", 
          },
          "&::-webkit-scrollbar-thumb": {
            background: "silver", 
            "border-radius": "100px",  
            border: "2px solid white",  
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "gray",  
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
