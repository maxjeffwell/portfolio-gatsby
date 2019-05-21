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
            fluid(maxWidth: 1260, grayscale: true) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        teamImage2: file(relativePath: { eq: "elephant-developer.png" }) {
          childImageSharp {
            fluid(maxWidth: 1260, grayscale: true) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    `}
    render={data => (
      <>
        <Img fluid={data.teamImage2.childImageSharp.fluid} alt="See my mascot" />
        <Img fluid={data.teamImage.childImageSharp.fluid} alt="See my two dogs" />
      </>
    )}
  />
);
export default Image;
