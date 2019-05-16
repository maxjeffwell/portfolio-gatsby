import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { DiIntellij, DiMozilla, DiLinux, DiDebian } from 'react-icons/di';
import { FaPiedPiperAlt } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';

const StyledContainer = styled.div`
  display: grid;
  grid-template-rows: 0.1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-row-gap: 1rem;
`;

const SecondPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="bio" />
    <h2
      css={css`
        font-family: HelveticaNeueLTStd-Roman, sans-serif;
        grid-row: 1 / 2;
        color: #f7b733;
      `}
    >
      Meet the Team:
    </h2>
    <h2
      css={css`
        font-family: HelveticaNeueLTStd-Roman, sans-serif;
        grid-row: 2 / 3;
        color: #f7b733;
      `}
    >
      Some of my favorite tech:
    </h2>
    <StyledContainer>
      <p
        css={css`
          grid-row: 3 / 4;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiIntellij
          css={css`
            font-size: 4rem;
            margin-top: 1rem;
          `}
          title="JetBrains IntelliJ"
        />
      </p>
      <p
        css={css`
          grid-row: 3 / 4;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiMozilla
          css={css`
            font-size: 4rem;
            align-self: center;
            justify-self: center;
          `}
          title="Mozilla"
        />
      </p>
      <p
        css={css`
          grid-row: 3 / 4;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiDebian
          css={css`
            font-size: 4rem;
          `}
          title="Debian"
        />
      </p>
      <p
        css={css`
          grid-row: 3 / 4;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiLinux
          css={css`
            font-size: 4rem;
          `}
          title="Linux"
        />
      </p>
      <p
        css={css`
          grid-row: 3 / 4;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <FaPiedPiperAlt
          css={css`
            font-size: 4rem;
          `}
          title="Pied Piper"
        />
      </p>
    </StyledContainer>
  </Layout>
);

export default SecondPage;
