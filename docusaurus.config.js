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
  organizationName: "Argos",
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
      image: "img/social.png",
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "",
        logo: {
          alt: "Argos CI",
          src: "img/logo-nav-light.svg",
          srcDark: "img/logo-nav-dark.svg",
          href: "/installation",
        },
        items: [
          {
            type: "search",
            position: "right",
          },
          {
            to: "https://app.argos-ci.com/",
            position: "left",
            label: "Sign in or start for free",
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
        apiKey: "a772ca710e0e36d90ad9b9eccce92f8f",
        indexName: "argos-ci",
      },
    }),
};

module.exports = config;
