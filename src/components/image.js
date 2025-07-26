import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

function Image({ imageType }) {
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

  if (imageType === 'dogs') {
    return (
      <GatsbyImage
        image={teamImage}
        alt="See my two dogs"
        loading="lazy"
        style={{
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          willChange: 'opacity',
        }}
        imgStyle={{
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
    );
  }

  if (imageType === 'mascot') {
    return (
      <GatsbyImage
        image={teamImage2}
        alt="See my mascot"
        loading="eager"
        style={{
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          willChange: 'opacity',
        }}
        imgStyle={{
          objectFit: 'contain',
          objectPosition: 'center',
        }}
      />
    );
  }

  // Default behavior (fallback)
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

Image.propTypes = {
  imageType: PropTypes.oneOf(['dogs', 'mascot']),
};

Image.defaultProps = {
  imageType: null,
};

export default Image;
