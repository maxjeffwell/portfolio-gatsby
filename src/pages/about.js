import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { DiIntellij, DiMozilla, DiDebian } from 'react-icons/di';
import { FaPiedPiperAlt } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Image from '../components/image';
import Logo from '../components/logo';

const StyledContainer = styled.div`
  display: grid;
  grid-template-rows: 0.1fr 1fr 0.1fr;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
`;

const StyledSubContainer = styled.div`
  display: grid;
  grid-template-rows: 0.1fr 1fr auto;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  grid-auto-flow: row;
  grid-column-gap: 1.25rem;
  font-family: AvenirLTStd-Roman, sans-serif;
  font-weight: bolder;
`;

const StyledLogoContainer = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  margin-top: 2rem;
`;

const AboutPage = () => (
  <Layout>
    <SEO
      title="About"
      description="Meet Jeff Maxwell and his development team. Learn about the technologies, tools, and creative process behind his full stack web development work."
      pathname="/about/"
      keywords={[
        `about jeff maxwell`,
        `development team`,
        `web developer bio`,
        `technology stack`,
        `development tools`,
        `full stack developer profile`,
      ]}
    />
    <main role="main">
      <StyledContainer>
        <header>
          <h1
            css={css`
              grid-column: 1 / 3;
              grid-row: 1 / 2;
              font-family: HelveticaNeueLTStd-Roman, sans-serif;
              font-size: 2.5rem;
              color: #f7b733;
              border-bottom: 3px solid #fc4a1a;
              margin-bottom: 1rem;
            `}
          >
            Meet the Development Team
          </h1>
        </header>
        <section aria-labelledby="team-images">
          <h2 id="team-images" className="sr-only">
            Team Photos
          </h2>
          <Image
            css={css`
              grid-row: 2 / 3;
              grid-column: 2 / 5;
            `}
          />
        </section>
      </StyledContainer>

      <section aria-labelledby="tech-stack">
        <StyledSubContainer>
          <h2
            id="tech-stack"
            css={css`
              grid-row: 1 / 2;
              grid-column: 1 / 5;
              font-family: HelveticaNeueLTStd-Roman, sans-serif;
              font-size: 2rem;
              color: #f7b733;
              border-bottom: 3px solid #fc4a1a;
              margin-bottom: 1rem;
            `}
          >
            Technology Stack & Tools
          </h2>
          <span
            css={css`
              grid-row: 2 / 3;
              grid-column: 1 / 2;
              align-self: center;
              justify-self: center;
            `}
          >
            <DiIntellij
              css={css`
                font-size: 5rem;
                margin-top: 1rem;
                color: #ffffff;
                @media (max-width: 480px) {
                  font-size: 3.5rem;
                }
              `}
              title="JetBrains IntelliJ"
            />
          </span>
          <span
            css={css`
              grid-row: 3 / 4;
              grid-column: 1 / 2;
              justify-self: center;
              margin-top: 0;
              font-size: 1.25rem;
            `}
          >
            IntelliJ
          </span>
          <span
            css={css`
              grid-row: 2 / 3;
              grid-column: 2 / 3;
              align-self: center;
              justify-self: center;
            `}
          >
            <DiMozilla
              css={css`
                font-size: 5rem;
                color: #ffffff;
                @media (max-width: 480px) {
                  font-size: 3.5rem;
                }
              `}
              title="Mozilla"
            />
          </span>
          <span
            css={css`
              grid-row: 3 / 4;
              grid-column: 2 / 3;
              justify-self: center;
              margin-top: 0;
              font-size: 1.25rem;
            `}
          >
            Mozilla
          </span>
          <span
            css={css`
              grid-row: 2 / 3;
              grid-column: 3 / 4;
              align-self: center;
              justify-self: center;
            `}
          >
            <DiDebian
              css={css`
                font-size: 5rem;
                color: #ffffff;
                @media (max-width: 480px) {
                  font-size: 3.5rem;
                }
              `}
              title="Debian"
            />
          </span>
          <span
            css={css`
              grid-row: 3 / 4;
              grid-column: 3 / 4;
              justify-self: center;
              margin-top: 0;
              font-size: 1.25rem;
            `}
          >
            Debian
          </span>
          <span
            css={css`
              grid-row: 2 / 3;
              grid-column: 4 / 5;
              align-self: center;
              justify-self: center;
            `}
          >
            <FaPiedPiperAlt
              css={css`
                font-size: 5rem;
                color: #ffffff;
                @media (max-width: 480px) {
                  font-size: 3.5rem;
                }
              `}
              title="Pied Piper"
            />
          </span>
          <span
            css={css`
              grid-row: 3 / 4;
              grid-column: 4 / 5;
              justify-self: center;
              margin-top: 0;
              font-size: 1.25rem;
            `}
          >
            Pied Piper
          </span>
        </StyledSubContainer>
      </section>

      <section aria-labelledby="supported-organizations">
        <h2 id="supported-organizations" className="sr-only">
          Supported Organizations
        </h2>
        <StyledLogoContainer>
          <Logo
            css={css`
              grid-column: 1 / 3;
              grid-row: 1 / 3;
            `}
          />
        </StyledLogoContainer>
      </section>
    </main>
  </Layout>
);

export default AboutPage;
