module.exports = {
  siteMetadata: {
    title: 'Jeff Maxwell Developer Portfolio',
    description: `Jeff Maxwell's developer portfolio made with Gatsby`,
    author: 'Jeff Maxwell',
    createdAt: 2019,
    siteUrl: 'https://www.jeffmaxwell.dev',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-developer-portfolio`,
        short_name: `portfolio`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: 'src/images/elephant_noun_project.png', // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-eslint`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        custom: {
          families: [
            'AvenirLTStd-Roman',
            'HelveticaNeueLTStd-Bd',
            'HelveticaNeueLTStd-Roman',
            'SabonLTStd-Roman',
          ],
        },
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: '/src/images',
        },
      },
    },
  ],
};
