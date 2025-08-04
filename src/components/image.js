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
            width: 800
            height: 800
            quality: 90
            formats: [AUTO, WEBP]
            transformOptions: { grayscale: true }
            breakpoints: [300, 400, 500, 600, 800]
            sizes: "(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
          )
        }
      }
      teamImage2: file(relativePath: { eq: "elephant_developer.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 800
            height: 800
            quality: 90
            formats: [AUTO, WEBP]
            transformOptions: { grayscale: true }
            breakpoints: [300, 400, 500, 600, 800]
            sizes: "(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
          )
        }
      }
      teamImage3: file(relativePath: { eq: "el_jefe.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 800
            quality: 90
            formats: [AUTO, WEBP]
            transformOptions: { grayscale: true }
            breakpoints: [300, 400, 500, 600, 800]
            sizes: "(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
          )
        }
      }
    }
  `);

  const teamImage = getImage(data.teamImage);
  const teamImage2 = getImage(data.teamImage2);
  const teamImage3 = getImage(data.teamImage3);

  if (imageType === 'dogs') {
    return (
      <GatsbyImage
        image={teamImage}
        alt="Jeff Maxwell's two dogs - code companions and loyal debugging partners"
        loading="eager"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
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
        alt="Jeff Maxwell's development mascot - an elephant symbolizing memory and reliability in coding"
        loading="eager"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
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

  if (imageType === 'developer') {
    return (
      <GatsbyImage
        image={teamImage3}
        alt="Jeff Maxwell in developer persona - professional portrait showing leadership in software development"
        loading="eager"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
        style={{
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          willChange: 'opacity',
        }}
        imgStyle={{
          objectFit: 'cover',
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
        alt="Jeff Maxwell's development mascot - an elephant symbolizing memory and reliability in coding"
        loading="eager"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      <GatsbyImage
        image={teamImage}
        alt="Jeff Maxwell's two dogs - code companions and loyal debugging partners"
        loading="eager"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      <GatsbyImage
        image={teamImage3}
        alt="Jeff Maxwell in developer persona - professional portrait showing leadership in software development"
        loading="eager"
        sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 500px"
        style={{
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </>
  );
}

Image.propTypes = {
  imageType: PropTypes.oneOf(['dogs', 'mascot', 'developer']),
};

Image.defaultProps = {
  imageType: null,
};

export default Image;
