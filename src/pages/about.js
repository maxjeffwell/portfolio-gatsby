import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { DiIntellij, DiFirefox, DiLinux, DiChrome, DiGit } from 'react-icons/di';
import { FaPiedPiper } from 'react-icons/fa';

import ElementaryIcon from '../images/elementary.svg';
import Layout from '../components/layout';
import SEO from '../components/seo';

const StyledContainer = styled.div`
  display: grid;
  grid-template-rows: 0.1fr 1fr;
  grid-row-gap: 2rem;
`;

const SecondPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="bio" />
    <h2
      css={css`
        font-family: HelveticaNeueLTStd-Roman, sans-serif;
        grid-row: 1 / 2;
        color: #f5f5f5;
      `}
    >
      Meet the Team:
    </h2>
    <h2
      css={css`
        font-family: HelveticaNeueLTStd-Roman, sans-serif;
        grid-row: 2 / 3;
        color: #f5f5f5;
      `}
    >
      Some of my favorite tech:
    </h2>
    <StyledContainer>
      <p
        css={css`
          grid-row: 2 / 3;
          grid-column: 2 / 3;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiIntellij
          css={css`
            font-size: 4rem;
            margin-top: 1rem;
          `}
        />
      </p>
      <p
        css={css`
          grid-row: 2 / 3;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiFirefox
          css={css`
            font-size: 4rem;
          `}
        />
      </p>
      <p
        css={css`
          grid-row: 2 / 3;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiChrome
          css={css`
            font-size: 4rem;
          `}
        />
      </p>
      <p
        css={css`
          grid-row: 2 / 3;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiLinux
          css={css`
            font-size: 4rem;
          `}
        />
      </p>
      <p
        css={css`
          grid-row: 2 / 3;
          width: 68px;
          height: 50px;
        `}
      >
        <img src={ElementaryIcon} alt="icon" css={css``} />
      </p>
      <p
        css={css`
          grid-row: 2 / 3;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiGit
          css={css`
            font-size: 4rem;
          `}
        />
      </p>
      <p
        css={css`
          grid-row: 2 / 3;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <FaPiedPiper
          css={css`
            font-size: 4rem;
          `}
        />
      </p>
    </StyledContainer>
  </Layout>
);

export default SecondPage;
