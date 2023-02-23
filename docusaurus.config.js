// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/nightOwl");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Argos",
  tagline:
    "Argos is a visual testing solution that fits in your workflow to avoid visual regression. Takes screenshots on each commit and be notified if something changes.",
  url: "https://argos-ci.com",
  baseUrl: process.env.CONTEXT === "production" ? "/docs" : "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.png",
  organizationName: "Argos",
  projectName: "docs",
  deploymentBranch: "main",
  trailingSlash: false,
  i18n: { defaultLocale: "en", locales: ["en"] },
  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": "argos-ci.com",
    },
  ],
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
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/getting-started",
            to: "/installation",
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social.png",
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
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
            label: "Go to Argos app",
          },
          {
            href: "https://github.com/argos-ci",
            position: "right",
            className: "header-link github-header-link",
            "aria-label": "GitHub repository",
          },
          {
            href: "https://discord.gg/WjzGrQGS4A",
            position: "right",
            className: "header-link discord-header-link",
            "aria-label": "Argos Discord channel",
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
