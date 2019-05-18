import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const Image = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <StaticQuery
    query={graphql`
      query {
        teamImage: file(relativePath: { eq: "code-companions.png" }) {
          childImageSharp {
            fluid(maxWidth: 960, grayscale: true) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => <Img fluid={data.teamImage.childImageSharp.fluid} alt="code-companions" />}
  />
);
export default Image;
