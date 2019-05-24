import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { FaRegArrowAltCircleRight } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 1fr;
  grid-row-gap: 1rem;
`;
const StyledLink = styled(Link)`
  color: #f7b733;
  text-decoration: none;
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1.75rem;
  line-height: 1.2;
`;

const IndexPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO
      title="Home"
      keywords={[
        `gatsby`,
        `application`,
        `react`,
        `portfolio Site`,
        `Javascript`,
        `Frontend Developer`,
        `Backend Developer`,
        `Full Stack Developer`,
        `Jeff Maxwell`,
        `maxjeffwell@gmail.com`,
      ]}
    />
    <StyledContainer>
      <h1
        css={css`
          grid-row: 1 / 2;
          grid-column: 1 / 2;
          font-family: HelveticaNeueLTStd-Bd, sans-serif;
          font-size: 2rem;
        `}
      >
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        My name's Jeff. I'm a full stack web developer working with Node and React.
      </h1>
      <div
        css={css`
          grid-row: 2 / 3;
          grid-column: 1 / 2;
        `}
      >
        <p
          css={css`
            color: #ffffff;
            font-family: HelveticaNeueLTStd-Roman, sans-serif;
            font-size: 1.75rem;
          `}
        >
          I commit early and often, implement content-driven design strategies, and value readable,
          maintainable code.
        </p>
        <p
          css={css`
            color: #ffffff;
            font-family: HelveticaNeueLTStd-Roman, sans-serif;
            font-size: 1.75rem;
          `}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Right now, I'm learning GraphQL, React Hooks, and Gatsby.
        </p>
        <p>
          <StyledLink to="/projects/" aria-label="Check out my development projects">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Click here for a brief list of my most recent projects
          </StyledLink>
        </p>
        <StyledLink to="/projects/" aria-label="Check out my development projects">
          <div
            css={css`
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
            `}
          >
            <FaRegArrowAltCircleRight
              css={css`
                grid-column: 2 / 3;
                align-self: center;
                justify-self: center;
                color: #fc4a1a;
                font-size: 3.5rem;
                padding-top: 1rem;
              `}
            />
          </div>
        </StyledLink>
      </div>
      <div
        css={css`
          grid-row: 3 / 4;
          grid-column: 1 / 2;
        `}
      >
        <p
          css={css`
            color: #ffffff;
            font-family: HelveticaNeueLTStd-Roman, sans-serif;
            font-size: 1.75rem;
          `}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          When I'm not inceptioning myself in the dev tools' component tree or attempting to bend
          CSS Grid to my will, I can be found either skillfully negotiating dinner menu selection
          with my two dogs or scouring Usenet in remembrance of Internet things past.
        </p>
        <p>
          <StyledLink
            to="/about/"
            aria-label="Click here to learn more about me and my development team"
          >
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Click here to check out renderings of my two sidekicks and the mascot that make up my
            development team
          </StyledLink>
        </p>
        <StyledLink
          to="/about/"
          aria-label="Click here to learn more about me and my development team"
        >
          <div
            css={css`
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
            `}
          >
            <FaRegArrowAltCircleRight
              css={css`
                grid-column: 2 / 3;
                align-self: center;
                justify-self: center;
                color: #fc4a1a;
                font-size: 3.5rem;
                padding-top: 1rem;
                margin-bottom: 2rem;
              `}
            />
          </div>
        </StyledLink>
      </div>
    </StyledContainer>
  </Layout>
);

export default IndexPage;
