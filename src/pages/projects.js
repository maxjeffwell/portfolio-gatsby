import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import ProjectCard from '../components/projectCard';
import SEO from '../components/seo';

import GraphQLIcon from '../images/graphql.svg';
import ReduxIcon from '../images/redux.svg';
import ZeitIcon from '../images/zeit.svg';
import CSSIcon from '../images/css3.svg';
import MongoDBIcon from '../images/mongodb.svg';
import PostgresqlIcon from '../images/postgresql.svg';
import RedisIcon from '../images/redis.svg';
import NPMIcon from '../images/npm.svg';

const project1 = {
  title: 'educationELLy',
  date: '2019-01-30',
  description:
    "educationELLy aims to engage regular classroom teachers in the English language learning process by providing them with quick access to relevant information about the ELL students in their classes. By making ELL student information accessible to mainstream teachers and ELL teachers alike, educationELLy keeps an ELL student's teachers updated on his or her English language proficiency and provides a centralized platform through which all teachers can participate in the feedback process.",
  sourceURL: 'https://github.com/maxjeffwell/full-stack-capstone-client',
  hostedURL: 'https://jmaxwell-fullstack-client.herokuapp.com/',
};

const project2 = {
  title: 'Code Talk',
  date: '2019-03-24',
  description:
    'Code Talk is a code collaboration tool with real-time text editing and real-time messaging features. It emerged from a fascination with GraphQL subscriptions as well as from the immediate satisfaction inherent to real-time applications.',
  sourceURL: 'https://github.com/maxjeffwell/code-talk-graphql-client',
  hostedURL: 'https://jmaxwell-code-talk-client.herokuapp.com/',
};

const project3 = {
  title: 'Bookmarked',
  date: '2019-05-10',
  description:
    "Bookmarked is a lightweight bookmark manager that gives users convenient access to create and edit their bookmarks in a single page application. Additional functionality allows users to filter their bookmarks by rating and favorite status. It was built as an exploration of React's Context API and its use in complex state management.",
  sourceURL: 'https://github.com/maxjeffwell/bookmarks-react-hooks',
  hostedURL: 'https://jmaxwell-bookmark-manager.herokuapp.com/',
};

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 2rem;
`;

// eslint-disable-next-line react/prop-types
export default ({ data }) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <SEO title="projects" keywords={[`educationELLy`, `code talk`, `bookmarked`]} />
    <StyledContainer>
      <ProjectCard
        css={css`
          grid-row: 1 / 2;
        `}
        imageSrcPath={data.project1Screenshot.childImageSharp.fluid}
        imageSrcPath2={data.project1Screenshot2.childImageSharp.fluid}
        title={project1.title}
        date={project1.date}
        description={project1.description}
        sourceURL={project1.sourceURL}
        hostedURL={project1.hostedURL}
        imageSrcPath3={ReduxIcon}
        imageSrcPath4={MongoDBIcon}
        imageSrcPath5={NPMIcon}
      />
      <ProjectCard
        css={css`
          grid-row: 2 / 3;
        `}
        imageSrcPath={data.project2Screenshot.childImageSharp.fluid}
        imageSrcPath2={data.project2Screenshot2.childImageSharp.fluid}
        title={project2.title}
        date={project2.date}
        description={project2.description}
        sourceURL={project2.sourceURL}
        hostedURL={project2.hostedURL}
        imageSrcPath3={GraphQLIcon}
        imageSrcPath4={PostgresqlIcon}
        imageSrcPath5={RedisIcon}
      />
      <ProjectCard
        css={css`
          grid-row: 3 / 4;
        `}
        imageSrcPath={data.project3Screenshot.childImageSharp.fluid}
        imageSrcPath2={data.project3Screenshot2.childImageSharp.fluid}
        title={project3.title}
        date={project3.date}
        description={project3.description}
        sourceURL={project3.sourceURL}
        hostedURL={project3.hostedURL}
        imageSrcPath3={ZeitIcon}
        imageSrcPath4={CSSIcon}
        imageSrcPath5={NPMIcon}
      />
    </StyledContainer>
  </Layout>
);

export const query = graphql`
  query {
    project1Screenshot: file(relativePath: { eq: "educationELLy_screenshot.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    project1Screenshot2: file(relativePath: { eq: "educationELLy_screenshot2.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    project2Screenshot: file(relativePath: { eq: "code-talk_screenshot.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    project2Screenshot2: file(relativePath: { eq: "code-talk_screenshot2.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    project3Screenshot: file(relativePath: { eq: "bookmarked_screenshot.png" }) {
      childImageSharp {
        fluid(maxWidth: 506) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    project3Screenshot2: file(relativePath: { eq: "bookmarked_screenshot2.png" }) {
      childImageSharp {
        fluid(maxWidth: 500) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
