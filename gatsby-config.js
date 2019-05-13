module.exports = {
  siteMetadata: {
    title: `Jeff Maxwell Developer Portfolio`,
    description: `Jeff Maxwell's developer portfolio made with Gatsby`,
    author: `Jeff Maxwell`,
    createdAt: 2019,
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
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-eslint`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        custom: {
          families: [`LetterGothicStd-Bold`, `LetterGothicStd`],
          urls: [`../public/fonts`],
        },
      },
    },
  ],
};
