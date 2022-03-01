/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const path = require("path");

module.exports = {
  nextConfig,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "./styles/variables.module.scss";`,
  },
  i18n: {
    locales: ["en", "id", "pseudo"],
    defaultLocale: "en",
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};
