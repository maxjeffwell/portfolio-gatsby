import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { FaRegArrowAltCircleRight } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

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
  // eslint-disable-next-line react/jsx-filename-extension
  const { theme } = useTheme();

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <ThemeProvider>
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
              font-size: 2rem;
              margin-bottom: 1rem;
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
              margin-bottom: 1rem;
              line-height: 1.4;
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
              margin-bottom: 1rem;
              line-height: 1.4;
            `}
          >
            Currently focused on modern web technologies including React, GraphQL, and JAMstack
            architecture.
          </p>
          <nav aria-label="Portfolio navigation">
            <p>
              <StyledLink
                to="/projects/"
                theme={theme}
                css={css`
                  &:focus {
                    outline: 2px solid ${theme.colors.accentSecondary};
                    outline-offset: 2px;
                  }
                `}
              >
                View my development projects
              </StyledLink>
            </p>
            <StyledLink
              to="/projects/"
              theme={theme}
              aria-label="Go to projects page"
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
        <section
          aria-labelledby="personal-heading"
          css={css`
            grid-row: 3 / 4;
            grid-column: 1 / 2;
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
              margin-bottom: 1rem;
              line-height: 1.4;
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
    </ThemeProvider>
  );
}

export default IndexPage;
