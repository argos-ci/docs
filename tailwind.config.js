const { createPlugin } = require("windy-radix-palette");

const radixColors = createPlugin();

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./docs/**/*.{js,jsx,ts,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        mauve: {
          css: {
            "--tw-prose-body": theme("colors.mauve.12"),
            "--tw-prose-headings": theme("colors.mauve.12"),
            "--tw-prose-lead": theme("colors.mauve.7"),
            "--tw-prose-links": theme("colors.mauve.12"),
            "--tw-prose-bold": theme("colors.mauve.12"),
            "--tw-prose-counters": theme("colors.mauve.10"),
            "--tw-prose-bullets": theme("colors.mauve.10"),
            "--tw-prose-hr": theme("colors.mauve.6"),
            "--tw-prose-quotes": theme("colors.mauve.11"),
            "--tw-prose-quote-borders": theme("colors.mauve.6"),
            "--tw-prose-captions": theme("colors.mauve.7"),
            "--tw-prose-code": theme("colors.mauve.12"),
            "--tw-prose-pre-code": theme("colors.mauve.2"),
            "--tw-prose-pre-bg": theme("colors.mauve.9"),
            "--tw-prose-th-borders": theme("colors.mauve.3"),
            "--tw-prose-td-borders": theme("colors.mauve.2"),
          },
        },
      }),
      textColor: {
        DEFAULT: radixColors.alias("mauve.12"),
        low: radixColors.alias("mauve.11"),
        hover: radixColors.alias("mauve.10"),
      },
      borderColor: {
        DEFAULT: radixColors.alias("mauve.6"),
        base: radixColors.alias("mauve.6"),
        alert: radixColors.alias("mauve.8"),
      },
    },
  },
  plugins: [radixColors.plugin, require("@tailwindcss/typography")],
};
