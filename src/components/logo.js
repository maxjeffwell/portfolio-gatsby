import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

function Logo() {
  const data = useStaticQuery(graphql`
    query {
      iapfLogo: file(relativePath: { eq: "iapf.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 500
            quality: 90
            placeholder: "none"
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
      aspcaLogo: file(relativePath: { eq: "aspca.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 500
            quality: 90
            placeholder: "none"
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
    }
  `);

  const iapfImage = getImage(data.iapfLogo);
  const aspcaImage = getImage(data.aspcaLogo);

  return (
    <>
      <GatsbyImage
        image={iapfImage}
        alt="International Anti Poaching Foundation logo"
        loading="lazy"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      <GatsbyImage
        image={aspcaImage}
        alt="American Society for the Prevention of Cruelty to Animals logo"
        loading="lazy"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </>
  );
}

export default Logo;
