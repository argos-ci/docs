module.exports = {
  plugins: [
    {
      resolve: 'smooth-doc',
      options: {
        name: 'Argos CI DOC',
        description: 'How to install and use Argos CI.',
        author: 'Jeremy Sfez',
        siteUrl: 'https://argos-ci.com',
        githubRepositoryURL: 'https://github.com/argos-ci',
        sections: [
          'Overview',
          'Screenshots stabilization',
          'Static stacks',
          'CI config',
          'FAQ',
        ],
      },
    },
    ...(process.env.CI
      ? [
          {
            resolve: 'gatsby-plugin-argos',
            options: {
              branch: process.env.GITHUB_REF_NAME,
              commit: process.env.GITHUB_SHA,
              token: process.env.ARGOS_TOKEN,
            },
          },
        ]
      : []),
  ],
}
