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
  ],
}
