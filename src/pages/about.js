import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { DiIntellij, DiMozilla, DiDebian } from 'react-icons/di';
import { FaPiedPiperAlt } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Image from '../components/image';
import Logo from '../components/logo';

const StyledContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 0.1fr;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
`;

const StyledSubContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 0.1fr;
  grid-template-columns: auto 1fr 1fr 1fr 1fr auto;
  grid-column-gap: 2rem;
  font-family: AvenirLTStd-Roman, sans-serif;
  font-weight: bolder;
`;

const StyledLogoContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  margin-top: 2rem;
`;

// eslint-disable-next-line react/prop-types
const SecondPage = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="bio" />
    <h2
      css={css`
        font-family: HelveticaNeueLTStd-Roman, sans-serif;
        font-size: 2.5rem;
        color: #f7b733;
        border-bottom: 3px solid #fc4a1a;
      `}
    >
      Meet the Team
    </h2>
    <StyledContainer>
      <Image
        css={css`
          grid-row: 1 / 2;
          grid-column: 1 / 5;
        `}
      />
    </StyledContainer>
    <h3
      css={css`
        font-family: HelveticaNeueLTStd-Roman, sans-serif;
        font-size: 2rem;
        color: #f7b733;
        border-bottom: 3px solid #fc4a1a;
      `}
    >
      Some of our favorite tech
    </h3>
    <StyledSubContainer>
      <span
        css={css`
          grid-row: 1 / 2;
          grid-column: 2 / 3;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiIntellij
          css={css`
            font-size: 5rem;
            margin-top: 1rem;
            color: #ffffff;
          `}
          title="JetBrains IntelliJ"
        />
      </span>
      <span
        css={css`
          grid-row: 2 / 3;
          grid-column: 2 / 3;
          justify-self: center;
          margin-top: 0;
          font-size: 1.25rem;
        `}
      >
        IntelliJ
      </span>
      <span
        css={css`
          grid-row: 1 / 2;
          grid-column: 3 / 4;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiMozilla
          css={css`
            font-size: 5rem;
            color: #ffffff;
          `}
          title="Mozilla"
        />
      </span>
      <span
        css={css`
          grid-row: 2 / 3;
          grid-column: 3 / 4;
          justify-self: center;
          margin-top: 0;
          font-size: 1.25rem;
        `}
      >
        Mozilla
      </span>
      <span
        css={css`
          grid-row: 1 / 2;
          grid-column: 4 / 5;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiDebian
          css={css`
            font-size: 5rem;
            color: #ffffff;
          `}
          title="Debian"
        />
      </span>
      <span
        css={css`
          grid-row: 2 / 3;
          grid-column: 4 / 5;
          justify-self: center;
          margin-top: 0;
          font-size: 1.25rem;
        `}
      >
        Debian
      </span>
      <span
        css={css`
          grid-row: 1 / 2;
          grid-column: 5 / 6;
          align-self: center;
          justify-self: center;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <FaPiedPiperAlt
          css={css`
            font-size: 5rem;
            color: #ffffff;
          `}
          title="Pied Piper"
        />
      </span>
      <span
        css={css`
          grid-row: 2 / 3;
          grid-column: 5 / 6;
          justify-self: center;
          margin-top: 0;
          font-size: 1.25rem;
        `}
      >
        Pied Piper
      </span>
    </StyledSubContainer>
    <StyledLogoContainer>
      <Logo
        css={css`
          grid-column: 1 / 3;
          grid-row: 1 / 3;
        `}
      />
    </StyledLogoContainer>
  </Layout>
);

export default SecondPage;
