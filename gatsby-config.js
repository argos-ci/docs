module.exports = {
  plugins: [
    {
      resolve: 'smooth-doc',
      options: {
        name: 'Argos CI DOC',
        author: 'Jeremy Sfez',
        description: 'The fancy screenshot testing app.',
        siteUrl: 'https://argos-ci.com',
        githubRepositoryURL: 'https://github.com/argos-ci',
        navItems: [{ title: 'Docs', url: '/docs/' }],
        sections: [
          'Overview',
          'Screenshots stabilization',
          'Static stacks',
          'CI config',
          'FAQ',
        ],
        // docSearch: {
        //   apiKey: 'XX',
        //   indexName: 'XXX',
        // },
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: '324671858',
      },
    },
  ],
}
