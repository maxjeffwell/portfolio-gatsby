import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const Logo = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <StaticQuery
    query={graphql`
      query {
        iapfLogo: file(relativePath: { eq: "iapf.png" }) {
          childImageSharp {
            fluid(maxWidth: 500) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        aspcaLogo: file(relativePath: { eq: "aspca.png" }) {
          childImageSharp {
            fluid(maxWidth: 500) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    `}
    render={data => (
      <>
        <Img
          fluid={data.iapfLogo.childImageSharp.fluid}
          alt="International Anti Poaching Foundation logo"
        />
        <Img
          fluid={data.aspcaLogo.childImageSharp.fluid}
          alt="American Society for the Prevention of Cruelty to Animals logo"
        />
      </>
    )}
  />
);

export default Logo;
