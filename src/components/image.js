import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

function Image() {
  const data = useStaticQuery(graphql`
    query {
      teamImage: file(relativePath: { eq: "code-companions.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 1260
            quality: 95
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
            transformOptions: { grayscale: true }
            breakpoints: [480, 768, 1024, 1200]
          )
        }
      }
      teamImage2: file(relativePath: { eq: "elephant-developer.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 1260
            quality: 95
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
            transformOptions: { grayscale: true }
            breakpoints: [480, 768, 1024, 1200]
          )
        }
      }
    }
  `);

  const teamImage = getImage(data.teamImage);
  const teamImage2 = getImage(data.teamImage2);

  return (
    <>
      <GatsbyImage
        image={teamImage2}
        alt="See my mascot"
        loading="eager"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      <GatsbyImage
        image={teamImage}
        alt="See my two dogs"
        loading="lazy"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </>
  );
}
export default Image;
