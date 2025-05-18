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
      },
      backgroundImage: {
        "custom-gradient":
          " linear-gradient(180deg, rgba(13, 13, 13, 0.62) 5.5%, rgba(23, 23, 23, 0.05) 76.33%, rgba(26, 26, 26, 0) 93.93%)",
      },
    },
    fontFamily: {
      TT: ["BackwardsSans", "sans"],
      arial: ["Arial"],
    },
    backgroundImage: {
      "custom-gradient":
        "linear-gradient(180deg, rgba(13, 13, 13, 0.62) 5.5%, rgba(23, 23, 23, 0.05) 76.33%, rgba(26, 26, 26, 0) 93.93%)",
    },
  },
  plugins: [],
};
