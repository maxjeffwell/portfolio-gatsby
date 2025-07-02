import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      teamImage: file(relativePath: { eq: "code-companions.png" }) {
        childImageSharp {
  gatsbyImageData(width: 1260, placeholder: BLURRED, transformOptions: {grayscale: true})
        }
      }
      teamImage2: file(relativePath: { eq: "elephant-developer.png" }) {
        childImageSharp {
  gatsbyImageData(width: 1260, placeholder: BLURRED, transformOptions: {grayscale: true})
        }
      }
    }
  `);

  const teamImage = getImage(data.teamImage);
  const teamImage2 = getImage(data.teamImage2);

  return (
    <>
      <GatsbyImage image={teamImage2} alt="See my mascot" />
      <GatsbyImage image={teamImage} alt="See my two dogs" />
    </>
  );
};
export default Image;
