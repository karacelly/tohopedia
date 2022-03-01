module.exports = {
  locales: ["en", "id", "pseudo"],
  pseudoLocale: "pseudo",
  sourceLocale: "en",
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "src/translations/locales/{locale}/messages",
      include: ["src/pages", "src/components"],
    },
  ],
  format: "po",
};
