/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        shake: {
          "10%": { transform: "translateX(-5%)" },
          "30%": { transform: "translateX(5%)" },
          "50%": { transform: "translateX(-7.5%)" },
          "70%": { transform: "translateX(7.5%)" },
          "90%": { transform: "translateX(-5%)" },
          "100%": { transform: "translateX(0%)" },
        },
        dance: {
          "20%": { transform: "translateY(-50%)" },
          "40%": { transform: "translateY(5%)" },
          "60%": { transform: "translateY(-25%)" },
          "80%": { transform: "translateY(2.5%)" },
          "90%": { transform: "translateY(-5%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        shake: "shake 250ms ease-in-out",
        dance: "dance 500ms ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-3d"), require("daisyui")],
};
