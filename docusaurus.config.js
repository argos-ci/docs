// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/nightOwl");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Argos",
  tagline:
    "Argos is a visual testing solution that fits in your workflow to avoid visual regression. Takes screenshots on each commit and be notified if something changes.",
  url: "https://docs.argos-ci.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.png",
  organizationName: "argos-ci",
  projectName: "docs.argos-ci.com",
  deploymentBranch: "main",
  trailingSlash: false,
  i18n: { defaultLocale: "en", locales: ["en"] },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: false,
          editUrl: "https://github.com/argos-ci/docs.argos-ci.com/blob/main",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
      },
      navbar: {
        title: "",
        logo: {
          alt: "Argos Logo",
          src: "img/logo-nav-light.svg",
          srcDark: "img/logo-nav-dark.svg",
          href: "/installation",
        },
        items: [
          {
            to: "https://app.argos-ci.com/",
            position: "left",
            label: "Go to app",
          },
          {
            type: "search",
            position: "right",
          },
          {
            href: "https://github.com/argos-ci",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        appId: "S8JDA82FPQ",
        apiKey: "51e0917fff78fade813b4cfeeaa27721",
        indexName: "argos-ci",
        searchPagePath: "false",
      },
    }),
};

module.exports = config;
