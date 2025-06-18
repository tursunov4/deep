/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    "menu-selected",
    {
      pattern: /bg-*/,
    },
    {
      pattern: /max-h-*/,
    },
    {
      pattern: /text-*/,
    },
  ],
  theme: {
    screens: {
      desktop: "1100px",
    },
    extend: {
      colors: {
        "black-general": "#101010",
        customGray: "#6D6D6D",
      },
      backgroundImage: {
        "custom-header":
          "linear-gradient(to bottom, #1A1A1A 0%, #2F2F2F 40%, #4A4A4A 70%, #F0F0F0 100%)",
      },
    },
    fontFamily: {
      TT: ["BackwardsSans", "sans"],
      arial: ["Arial"],
    },
    backgroundImage: {
      "custom-gradient":
        " linear-gradient(180deg, rgba(13, 13, 13, 0.62) 5.5%, rgba(23, 23, 23, 0.05) 88%, rgba(26, 26, 26, 0) 100%)",
    },
  },
  plugins: [],
};
