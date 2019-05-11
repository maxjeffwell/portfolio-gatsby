import React from 'react';
import styled from '@emotion/styled';

import Layout from '../components/layout';
import ProjectCard from '../components/projectCard';
import project1Screenshot from '../images/educationELLy_screenshot.png';
import project2Screenshot from '../images/code-talk_screenshot.png';
import project3Screenshot from '../images/bookmarked_screenshot.png';

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
    'Code Talk is a code collaboration tool with real-time text editing and real-time messaging features.',
  sourceURL: 'https://github.com/maxjeffwell/code-talk-graphql-client',
  hostedURL: 'https://jmaxwell-code-talk-client.herokuapp.com/',
};

const project3 = {
  title: 'Bookmarked',
  date: '2019-04-30',
  description:
    "Bookmarked is a lightweight bookmark manager that gives users convenient access to create and edit their bookmarks in a single page application. Additional functionality allows users to filter their bookmarks by rating and favorite status. It was built as an exploration of Reac's Context API and its use in complex state management. Furthermore, useState and useReducer hooks manage local state and state transitions, respectively. Data fetching is achieved by means of a custom React hook and side effects are implemented with the useEffect hook. Consequently, Bookmarked is composed entirely of React function components.",
  sourceURL: 'https://github.com/maxjeffwell/bookmarks-react-hooks',
  hostedURL: 'https://jmaxwell-bookmark-manager.herokuapp.com/',
};

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
`;

export default () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Layout>
    <StyledContainer>
      <ProjectCard
        imageSrcPath={project1Screenshot}
        title={project1.title}
        date={project1.date}
        description={project1.description}
        sourceURL={project1.sourceURL}
        hostedURL={project1.hostedURL}
      />
      <ProjectCard
        imageSrcPath={project2Screenshot}
        title={project2.title}
        date={project2.date}
        description={project2.description}
        sourceURL={project2.sourceURL}
        hostedURL={project2.hostedURL}
      />
      <ProjectCard
        imageSrcPath={project3Screenshot}
        title={project3.title}
        date={project3.date}
        description={project3.description}
        sourceURL={project3.sourceURL}
        hostedURL={project3.hostedURL}
      />
    </StyledContainer>
  </Layout>
);
