import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { IoIosArrowDropright } from 'react-icons/io';

import Layout from '../components/layout';
import SEO from '../components/seo';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 1fr 0.1fr;
  grid-row-gap: 2rem;
`;
const StyledLink = styled(Link)`
  color: #f7b733;
  text-decoration: none;
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1.5rem;
  line-height: 1;
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
          font-family: HelveticaNeueLTStd-Bd, sans-serif;
          font-size: 2.25rem;
        `}
      >
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        My name's Jeff. I'm a full stack web developer working with Node and React.
      </h1>
      <div
        css={css`
          grid-row: 2 / 3;
        `}
      >
        <p
          css={css`
            color: #ffffff;
            font-family: HelveticaNeueLTStd-Roman, sans-serif;
            font-size: 1.5rem;
          `}
        >
          I commit early and often, implement content-driven design strategies, and value readable,
          maintainable code.
        </p>
        <p
          css={css`
            color: #ffffff;
            font-family: HelveticaNeueLTStd-Roman, sans-serif;
            font-size: 1.5rem;
          `}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Right now, I'm familiarizing myself with GraphQL, React Hooks, and Gatsby.
        </p>
        <p>
          <StyledLink to="/projects/">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Click here for a brief list of my most recent projects
            {` `}
            <IoIosArrowDropright
              css={css`
                color: #fc4a1a;
                font-size: 1.5rem;
              `}
            />
          </StyledLink>
        </p>
      </div>
      <div
        css={css`
          grid-row: 3 / 4;
        `}
      >
        <p
          css={css`
            color: #ffffff;
            font-family: HelveticaNeueLTStd-Roman, sans-serif;
            font-size: 1.5rem;
          `}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          When I'm not inceptioning myself in the dev tools' component tree or attempting to bend
          CSS Grid to my will, I can be found either skillfully negotiating dinner menu selection
          with my two dogs or scouring Usenet in remembrance of Internet things past.
        </p>
        <p>
          <StyledLink to="/about/">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Click here to check out a rendering of my two sidekicks and the mascot that make up my
            development team
            {` `}
            <IoIosArrowDropright
              css={css`
                color: #fc4a1a;
                font-size: 1.5rem;
              `}
            />
          </StyledLink>
        </p>
      </div>
    </StyledContainer>
  </Layout>
);

export default IndexPage;
