const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      mb: { max: "545px" },
      sm: { max: "639px" },
      md: { max: "767px" },
      lg: { max: "1023px" },
      xg: { max: "1174px" },
      xl: { max: "1310px" },
      "2xl": { max: "1535px" },
    },
    extend: {
      colors: {
        primary: "#265ef7",
      },
    },
  },
  plugins: [
  ],
});
