import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
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

const projectsData = [
  {
    id: 'project1',
    title: 'educationELLy',
    date: '2019-01-30',
    year: '2019',
    description:
      "educationELLy aims to engage regular classroom teachers in the English language learning process by providing them with quick access to relevant information about the ELL students in their classes. By making ELL student information accessible to mainstream teachers and ELL teachers alike, educationELLy keeps an ELL student's teachers updated on his or her English language proficiency and provides a centralized platform through which all teachers can participate in the feedback process.",
    sourceURL: 'https://github.com/maxjeffwell/full-stack-capstone-client',
    hostedURL: 'https://jmaxwell-fullstack-client.herokuapp.com/',
    technologies: ['React', 'Redux', 'MongoDB', 'NPM', 'Git', 'Heroku', 'Travis CI'],
    techIcons: {
      icon3: ReduxIcon,
      icon4: MongoDBIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'project1Screenshot',
      screenshot2: 'project1Screenshot2',
    },
  },
  {
    id: 'project2',
    title: 'Code Talk',
    date: '2019-03-24',
    year: '2019',
    description:
      'Code Talk is a code collaboration tool with real-time text editing and real-time messaging features. It emerged from a fascination with GraphQL subscriptions as well as from the immediate satisfaction inherent to real-time applications.',
    sourceURL: 'https://github.com/maxjeffwell/code-talk-graphql-client',
    hostedURL: 'https://jmaxwell-code-talk-client.herokuapp.com/',
    technologies: ['React', 'GraphQL', 'PostgreSQL', 'Redis', 'Git', 'Heroku', 'Travis CI'],
    techIcons: {
      icon3: GraphQLIcon,
      icon4: PostgresqlIcon,
      icon5: RedisIcon,
    },
    screenshots: {
      screenshot1: 'project2Screenshot',
      screenshot2: 'project2Screenshot2',
    },
  },
  {
    id: 'project3',
    title: 'Bookmarked',
    date: '2019-05-10',
    year: '2019',
    description:
      "Bookmarked is a lightweight bookmark manager that gives users convenient access to create and edit their bookmarks in a single page application. Additional functionality allows users to filter their bookmarks by rating and favorite status. It was built as an exploration of React's Context API and its use in complex state management.",
    sourceURL: 'https://github.com/maxjeffwell/bookmarks-react-hooks',
    hostedURL: 'https://jmaxwell-bookmark-manager.herokuapp.com/',
    technologies: ['React', 'Vercel', 'CSS', 'NPM', 'Git', 'Heroku', 'Travis CI'],
    techIcons: {
      icon3: ZeitIcon,
      icon4: CSSIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'project3Screenshot',
      screenshot2: 'project3Screenshot2',
    },
  },
];

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 2rem;
`;

const ProjectsPage = ({ data }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    technologies: [],
    dateRange: '',
  });

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const titleMatch = project.title.toLowerCase().includes(searchLower);
        const descriptionMatch = project.description.toLowerCase().includes(searchLower);
        if (!titleMatch && !descriptionMatch) {
          return false;
        }
      }

      // Technology filter
      if (filters.technologies.length > 0) {
        const hasMatchingTech = filters.technologies.some((tech) =>
          project.technologies.includes(tech)
        );
        if (!hasMatchingTech) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange) {
        if (filters.dateRange === '2021') {
          // For 2021+ projects (none exist yet, but future-proofing)
          if (parseInt(project.year) < 2021) {
            return false;
          }
        } else {
          // Exact year match
          if (project.year !== filters.dateRange) {
            return false;
          }
        }
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <SEO
        title="Projects"
        description="Explore Jeff Maxwell's web development projects featuring React, Node.js, GraphQL, and modern JavaScript applications. View live demos and source code. Filter by technology and search projects."
        pathname="/projects/"
        keywords={[
          `web development projects`,
          `react applications`,
          `node.js projects`,
          `graphql`,
          `javascript portfolio`,
          `full stack development`,
          `educationELLy`,
          `code talk`,
          `bookmarked`,
          `project search`,
          `filter projects`,
        ]}
      />
      <main role="main">
        <header>
          <h1 className="sr-only">My Development Projects</h1>
        </header>

        <div>
          <h3>Filter Projects (Total: {filteredProjects.length})</h3>
          <select onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="">All Projects</option>
            <option value="React">React</option>
            <option value="JavaScript">JavaScript</option>
            <option value="GraphQL">GraphQL</option>
          </select>
        </div>

        {filteredProjects.length === 0 ? (
          <div
            css={css`
              text-align: center;
              padding: 3rem 1rem;
              color: #666;
              font-family: SabonLTStd-Roman, serif;
              font-size: 1.25rem;
              animation: fadeIn 0.4s ease-out;
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          >
            No projects match your current filters. Try adjusting your search criteria.
          </div>
        ) : (
          <StyledContainer>
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={`${project.id}-${filters.searchTerm}-${filters.technologies.join(',')}-${filters.dateRange}`}
                css={css`
                  grid-row: ${index + 1} / ${index + 2};
                  animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                  animation-delay: ${index * 0.1}s;
                  animation-fill-mode: both;
                  opacity: 0;
                  transform: translateY(30px);
                  
                  @keyframes slideInUp {
                    0% {
                      opacity: 0;
                      transform: translateY(30px) scale(0.95);
                    }
                    60% {
                      opacity: 0.8;
                      transform: translateY(-5px) scale(1.02);
                    }
                    100% {
                      opacity: 1;
                      transform: translateY(0) scale(1);
                    }
                  }
                  
                  &:hover {
                    animation-play-state: paused;
                  }
                `}
                imageSrcPath={data[project.screenshots.screenshot1]}
                imageSrcPath2={data[project.screenshots.screenshot2]}
                title={project.title}
                date={project.date}
                description={project.description}
                sourceURL={project.sourceURL}
                hostedURL={project.hostedURL}
                imageSrcPath3={project.techIcons.icon3}
                imageSrcPath4={project.techIcons.icon4}
                imageSrcPath5={project.techIcons.icon5}
              />
            ))}
          </StyledContainer>
        )}
      </main>
    </Layout>
  );
};

export const query = graphql`
  query {
    project1Screenshot: file(relativePath: { eq: "educationELLy_screenshot.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 500
          quality: 95
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          breakpoints: [480, 768, 1024, 1200]
        )
      }
    }
    project1Screenshot2: file(relativePath: { eq: "educationELLy_screenshot2.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 500
          quality: 95
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          breakpoints: [480, 768, 1024, 1200]
        )
      }
    }
    project2Screenshot: file(relativePath: { eq: "code-talk_screenshot.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 500
          quality: 95
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          breakpoints: [480, 768, 1024, 1200]
        )
      }
    }
    project2Screenshot2: file(relativePath: { eq: "code-talk_screenshot2.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 500
          quality: 95
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          breakpoints: [480, 768, 1024, 1200]
        )
      }
    }
    project3Screenshot: file(relativePath: { eq: "bookmarked_screenshot.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 506
          quality: 95
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          breakpoints: [480, 768, 1024, 1200]
        )
      }
    }
    project3Screenshot2: file(relativePath: { eq: "bookmarked_screenshot2.png" }) {
      childImageSharp {
        gatsbyImageData(
          width: 500
          quality: 95
          placeholder: BLURRED
          formats: [AUTO, WEBP, AVIF]
          breakpoints: [480, 768, 1024, 1200]
        )
      }
    }
  }
`;

ProjectsPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProjectsPage;
