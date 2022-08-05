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
        docSearch: {
          apiKey: "51e0917fff78fade813b4cfeeaa27721",
          indexName: "argos-ci",
        },
      },
    },

    ...(process.env.CI
      ? [
          {
            resolve: "gatsby-plugin-argos",
            options: {
              branch: process.env.BRANCH,
              commit: process.env.COMMIT_REF,
              token: process.env.ARGOS_TOKEN,
            },
          },
        ]
      : []),
  ],
};
