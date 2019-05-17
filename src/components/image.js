import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const Image = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "coding-companions.png" }) {
          childImageSharp {
            fluid(maxWidth: 960, grayscale: true) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => (
      <Img fluid={data.placeholderImage.childImageSharp.fluid} alt="coding-companions" />
    )}
  />
);
export default Image;
