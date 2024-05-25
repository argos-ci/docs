// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Argos",
  tagline:
    "Argos is a visual testing solution that fits in your workflow to avoid visual regression. Takes screenshots on each commit and be notified if something changes.",
  url: "https://argos-ci.com",
  baseUrl: process.env.VERCEL_ENV === "production" ? "/docs" : "/",
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
          sidebarCollapsible: true,
          editUrl: "https://github.com/argos-ci/docs.argos-ci.com/blob/main",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          // Remove redirect and orphan pages from sitemap
          ignorePatterns: ["/docs/", "/docs/search"],
        },
        googleTagManager: {
          containerId: "GTM-NLJR9K93",
        },
      }),
    ],
  ],
  plugins: [
    function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/installation",
            to: "/getting-started",
          },
          {
            from: "/quickstart",
            to: "/getting-started",
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
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "",
        logo: {
          alt: "Argos CI",
          src: "img/logo-nav-light.svg",
          srcDark: "img/logo-nav-dark.svg",
          href: "/getting-started",
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
            href: "https://argos-ci.com/discord",
            position: "right",
            className: "header-link discord-header-link",
            "aria-label": "Argos Discord channel",
          },
        ],
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.nightOwl,
      },
      algolia: {
        appId: "S8JDA82FPQ",
        apiKey: "a772ca710e0e36d90ad9b9eccce92f8f",
        indexName: "argos-ci",
      },
    }),
};

module.exports = config;
