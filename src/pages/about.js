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
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
`;

const StyledLogoContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 0.75fr 1fr;
  grid-columnn-gap: 3rem;
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
      <p
        css={css`
          grid-row: 1 / 2;
          grid-column: 2 / 3;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiIntellij
          css={css`
            font-size: 5rem;
            margin-top: 1rem;
          `}
          title="JetBrains IntelliJ"
        />
      </p>
      <p
        css={css`
          grid-row: 1 / 2;
          grid-column: 3 / 4;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiMozilla
          css={css`
            font-size: 5rem;
          `}
          title="Mozilla"
        />
      </p>
      <p
        css={css`
          grid-row: 1 / 2;
          grid-column: 4 / 5;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <DiDebian
          css={css`
            font-size: 5rem;
          `}
          title="Debian"
        />
      </p>
      <p
        css={css`
          grid-row: 1 / 2;
          grid-column: 5 / 6;
        `}
      >
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <FaPiedPiperAlt
          css={css`
            font-size: 5rem;
          `}
          title="Pied Piper"
        />
      </p>
    </StyledSubContainer>
    <StyledLogoContainer>
      <Logo
        css={css`
          grid-row: 1 / 2;
          grid-column: 1 / 3;
        `}
      />
    </StyledLogoContainer>
  </Layout>
);

export default SecondPage;
