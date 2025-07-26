import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from '@emotion/styled';

const StyledGatsbyImage = styled(GatsbyImage)`
  picture {
    color: #f7b733;
  }
`;

function MyLogo() {
  const data = useStaticQuery(graphql`
    query {
      myLogo: file(relativePath: { eq: "logo_elephant_100x100.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 100
            height: 85
            quality: 95
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
    }
  `);

  const logoImage = getImage(data.myLogo);

  return (
    <StyledGatsbyImage
      image={logoImage}
      alt="Jeff Maxwell portfolio logo featuring an elephant design"
      loading="eager"
      style={{
        transition: 'opacity 0.3s ease-in-out',
      }}
    />
  );
}

export default MyLogo;
