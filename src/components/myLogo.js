import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import { useTheme } from '../context/ThemeContext';

const StyledLogoContainer = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  filter: brightness(0) saturate(100%) invert(21%) sepia(15%) saturate(350%) hue-rotate(158deg) brightness(95%) contrast(85%);

  &:hover {
    transform: scale(1.05);
    filter: brightness(0) saturate(100%) invert(18%) sepia(18%) saturate(400%) hue-rotate(158deg) brightness(90%) contrast(90%);
  }

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }
`;

function MyLogo() {
  const { theme } = useTheme();
  
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      file(relativePath: { eq: "elephant_noun_project.png" }) {
        publicURL
      }
    }
  `);

  return (
    <StyledLogoContainer theme={theme}>
      <img
        src={data.file.publicURL}
        alt="Jeff Maxwell portfolio elephant logo"
        width="60"
        height="60"
        loading="eager"
        role="img"
        aria-label="Jeff Maxwell portfolio elephant logo"
        style={{ 
          objectFit: 'contain',
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </StyledLogoContainer>
  );
}

export default MyLogo;
