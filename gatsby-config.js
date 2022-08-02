/* eslint-env node */

module.exports = {
  plugins: [
    {
      resolve: "smooth-doc",
      options: {
        name: "Argos",
        author: "Smooth Code",
        description: "Argos documentation.",
        siteUrl: "https://docs.argos-ci.com",
        githubRepositoryURL: "https://github.com/argos-ci/docs.argos-ci.com",
        baseDirectory: __dirname,
        githubDefaultBranch: "main",
        navItems: [{ title: "Docs", url: "/" }],
        sections: [
          "Overview",
          "Screenshots stabilization",
          "Static stacks",
          "CI config",
          "FAQ",
        ],
      },
    },
    ...(process.env.CI
      ? [
          {
            resolve: "gatsby-plugin-argos",
            options: {
              branch: process.env.GITHUB_REF_NAME,
              commit: process.env.GITHUB_SHA,
              token: process.env.ARGOS_TOKEN,
            },
          },
        ]
      : []),
  ],
};
