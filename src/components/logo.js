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
              ...GatsbyImageSharpFluid
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
        <Img fluid={data.iapfLogo.childImageSharp.fluid} alt="iapf-logo" />
        <Img fluid={data.aspcaLogo.childImageSharp.fluid} alt="aspca-logo" />
      </>
    )}
  />
);

export default Logo;
