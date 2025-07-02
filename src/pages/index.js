import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { FaRegArrowAltCircleRight } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { useTheme } from '../context/ThemeContext';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  grid-row-gap: 1rem;
`;
const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.accentSecondary};
  text-decoration: none;
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1.75rem;
  line-height: 1.2;
  transition: color ${(props) => props.theme.transitions.normal};

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

function IndexPage() {
  const { theme } = useTheme();

  return (
    <Layout>
        <SEO
        title="Home"
        description="Jeff Maxwell - Full Stack Web Developer specializing in React, Node.js, and modern web development. Explore my portfolio of innovative projects and development solutions."
        pathname="/"
        keywords={[
          `full stack developer`,
          `web developer`,
          `react developer`,
          `node.js developer`,
          `javascript developer`,
          `portfolio`,
          `Jeff Maxwell`,
          `frontend development`,
          `backend development`,
          `web development`,
        ]}
      />
      <StyledContainer role="main">
        <header>
          <h1
            css={css`
              grid-row: 1 / 2;
              grid-column: 1 / 2;
              font-family: HelveticaNeueLTStd-Bd, sans-serif;
              font-size: 2.5rem;
              margin-bottom: 1.5rem;
              background: ${theme.gradients.accent};
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: ${theme.animations.slideInLeft};
              line-height: 1.2;
              @media (max-width: 768px) {
                font-size: 2rem;
              }
              @media (max-width: 480px) {
                font-size: 1.75rem;
              }
            `}
          >
            My name&apos;s Jeff. I&apos;m a full stack web developer working with Node and React.
          </h1>
        </header>
        <section
          aria-labelledby="intro-heading"
          css={css`
            grid-row: 2 / 3;
            grid-column: 1 / 2;
          `}
        >
          <h2 id="intro-heading" className="sr-only">
            About My Development Approach
          </h2>
          <p
            css={css`
              color: ${theme.colors.text};
              font-family: HelveticaNeueLTStd-Roman, sans-serif;
              font-size: 1.75rem;
              margin-bottom: 1.5rem;
              line-height: 1.5;
              animation: ${theme.animations.fadeIn};
              animation-delay: 0.2s;
              animation-fill-mode: both;
              position: relative;
              &::before {
                content: '';
                position: absolute;
                left: -1rem;
                top: 0;
                bottom: 0;
                width: 4px;
                background: ${theme.gradients.accent};
                border-radius: 2px;
                opacity: 0.7;
              }
              padding-left: 1.5rem;
            `}
          >
            I commit early and often, implement content-driven design strategies, and value
            readable, maintainable code.
          </p>
          <p
            css={css`
              color: ${theme.colors.text};
              font-family: HelveticaNeueLTStd-Roman, sans-serif;
              font-size: 1.75rem;
              margin-bottom: 2rem;
              line-height: 1.5;
              animation: ${theme.animations.fadeIn};
              animation-delay: 0.4s;
              animation-fill-mode: both;
            `}
          >
            Currently focused on modern web technologies including React, GraphQL, and JAMstack
            architecture.
          </p>
          <nav 
            aria-label="Portfolio navigation"
            css={css`
              animation: ${theme.animations.slideUp};
              animation-delay: 0.6s;
              animation-fill-mode: both;
            `}
          >
            <div
              css={css`
                position: relative;
                display: inline-block;
                margin-bottom: 2rem;
              `}
            >
              <StyledLink
                to="/projects/"
                theme={theme}
                css={css`
                  position: relative;
                  display: inline-block;
                  padding: 1rem 2rem;
                  background: ${theme.gradients.accent};
                  border-radius: 50px;
                  text-decoration: none;
                  font-weight: bold;
                  color: ${theme.colors.textInverse} !important;
                  box-shadow: ${theme.shadows.medium};
                  transition: all ${theme.transitions.normal};
                  overflow: hidden;
                  
                  &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                      90deg,
                      transparent,
                      rgba(255, 255, 255, 0.2),
                      transparent
                    );
                    transition: left ${theme.transitions.slow};
                  }
                  
                  &:hover {
                    transform: translateY(-3px);
                    box-shadow: ${theme.shadows.hover};
                    
                    &::before {
                      left: 100%;
                    }
                  }
                  
                  &:focus {
                    outline: 2px solid ${theme.colors.accentSecondary};
                    outline-offset: 4px;
                  }
                `}
              >
                View my development projects
              </StyledLink>
            </div>
            
            <div
              css={css`
                text-align: center;
              `}
            >
              <StyledLink
                to="/projects/"
                theme={theme}
                aria-label="Go to projects page"
                css={css`
                  display: inline-block;
                  position: relative;
                  &:focus {
                    outline: 2px solid ${theme.colors.accentSecondary};
                    outline-offset: 4px;
                    border-radius: 50%;
                  }
                `}
              >
                <FaRegArrowAltCircleRight
                  css={css`
                    color: ${theme.colors.accent};
                    font-size: 3.5rem;
                    display: block;
                    margin: 0 auto;
                    transition: all ${theme.transitions.bounce};
                    cursor: pointer;
                    
                    &:hover {
                      transform: scale(1.15) rotate(5deg);
                      filter: drop-shadow(0 8px 16px rgba(252, 74, 26, 0.3));
                    }
                  `}
                  aria-hidden="true"
                />
              </StyledLink>
            </div>
          </nav>
        </section>
        <section
          aria-labelledby="personal-heading"
          css={css`
            grid-row: 3 / 4;
            grid-column: 1 / 2;
            animation: ${theme.animations.slideInRight};
            animation-delay: 0.8s;
            animation-fill-mode: both;
          `}
        >
          <h2 id="personal-heading" className="sr-only">
            Personal Information
          </h2>
          <p
            css={css`
              color: ${theme.colors.text};
              font-family: HelveticaNeueLTStd-Roman, sans-serif;
              font-size: 1.75rem;
              margin-bottom: 2rem;
              line-height: 1.5;
              position: relative;
              padding: 1.5rem;
              background: ${theme.gradients.subtle};
              border-radius: 12px;
              border-left: 4px solid ${theme.colors.accentSecondary};
              backdrop-filter: blur(10px);
              
              &::before {
                content: '"';
                position: absolute;
                top: -0.5rem;
                left: 1rem;
                font-size: 4rem;
                color: ${theme.colors.accentSecondary};
                opacity: 0.3;
                font-family: serif;
              }
            `}
          >
            When I&apos;m not debugging in dev tools or mastering CSS Grid, I can be found
            negotiating dinner menus with my two dogs or exploring vintage internet archives.
          </p>
          <nav aria-label="About page navigation">
            <p>
              <StyledLink
                to="/about/"
                theme={theme}
                css={css`
                  &:focus {
                    outline: 2px solid ${theme.colors.accentSecondary};
                    outline-offset: 2px;
                  }
                `}
              >
                Meet my development team and learn more about me
              </StyledLink>
            </p>
            <StyledLink
              to="/about/"
              theme={theme}
              aria-label="Go to about page"
              css={css`
                display: inline-block;
                margin-top: 1rem;
                &:focus {
                  outline: 2px solid ${theme.colors.accentSecondary};
                  outline-offset: 2px;
                  border-radius: 50%;
                }
              `}
            >
              <FaRegArrowAltCircleRight
                css={css`
                  color: ${theme.colors.accent};
                  font-size: 3.5rem;
                  display: block;
                  margin: 1rem auto 2rem;
                  transition: transform 0.2s ease-in-out;
                  &:hover {
                    transform: scale(1.1);
                  }
                `}
                aria-hidden="true"
              />
            </StyledLink>
          </nav>
        </section>
      </StyledContainer>
    </Layout>
  );
}

export default IndexPage;
