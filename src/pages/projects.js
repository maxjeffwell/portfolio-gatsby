import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Container, Typography, Select, MenuItem, Box, Paper, NoSsr } from '@mui/material';
import { styled } from '@mui/material/styles';

import Layout from '../components/layout';
import ProjectCard from '../components/projectCard';
import SEO from '../components/seo';

import GraphQLIcon from '../images/graphql.svg';
import ApolloClientIcon from '../images/apolloclient.svg';
import ReduxIcon from '../images/redux.svg';
import CSSIcon from '../images/css3.svg';
import MongoDBIcon from '../images/mongodb.svg';
import PostgresqlIcon from '../images/postgresql.svg';
import RedisIcon from '../images/redis.svg';
import NPMIcon from '../images/npm.svg';
import VercelIcon from '../images/vercel.svg';
import NodeJSIcon from '../images/nodejs.svg';
import FirebaseIcon from '../images/firebase.svg';
import NeonTechIcon from '../images/neon-tech.svg';

const projectsData = [
  {
    id: 'project1',
    date: '2018-2025',
    title: 'educationELLy',
    year: '2025',
    description:
      'educationELLy is a full-stack web application for managing English Language Learner (ELL) students in\n' +
      '  educational settings. It provides a collaborative platform for ELL and mainstream teachers to track\n' +
      '  student information, English proficiency levels, and academic progress.\n' +
      '\n' +
      '  Built with React/Redux frontend and Node.js/Express/MongoDB backend, it features secure JWT\n' +
      '  authentication, comprehensive student profile management (demographics, language details, academic\n' +
      '  status), and a responsive interface with real-time data access for improved teacher collaboration and\n' +
      '  student support.',
    sourceURL: 'https://github.com/maxjeffwell/full-stack-capstone-client',
    hostedURL: 'https://educationelly-client-71a1b1901aaa.herokuapp.com/',
    technologies: ['React', 'Redux', 'MongoDB', 'NPM', 'Git', 'Heroku'],
    techIcons: {
      icon3: ReduxIcon,
      icon4: MongoDBIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'educationELLy_screenshot',
      screenshot2: 'educationELLy_screenshot2',
    },
  },
  {
    id: 'project2',
    title: 'Code Talk',
    date: '2018-2025',
    year: '2025',
    description:
      'Code Talk is a real-time collaborative code editor and messaging platform that enables developers to write\n' +
      '   code together while communicating seamlessly. Built with React and GraphQL, it features live\n' +
      '  collaborative editing where multiple users can work on the same code simultaneously, integrated instant\n' +
      '  messaging with room-based organization, and secure JWT authentication. The app leverages WebSocket\n' +
      '  subscriptions for real-time updates, Redis pub/sub for scalability, and includes performance optimizations\n' +
      '   like virtualized lists and code splitting. Perfect for remote pair programming, code reviews, or team\n' +
      '  collaboration sessions.',
    sourceURL: 'https://github.com/maxjeffwell/code-talk-graphql-client',
    hostedURL: 'https://code-talk-client-c46118c24c30.herokuapp.com/',
    technologies: ['React', 'GraphQL', 'NPM', 'Git', 'Heroku', 'Redis', 'PostgreSQL'],
    techIcons: {
      icon3: GraphQLIcon,
      icon4: NPMIcon,
      icon5: RedisIcon,
      icon6: PostgresqlIcon,
    },
    screenshots: {
      screenshot1: 'code-talk_screenshot',
      screenshot2: 'code-talk_screenshot2',
    },
  },
  {
    id: 'project3',
    title: 'educationELLy (GraphQL version)',
    date: '2021-2025',
    year: '2025',
    description:
      'educationELLy GraphQL is an education management system for English Language Learner (ELL) students. It\n' +
      '  features a React frontend with Apollo Client for GraphQL integration and a Node.js backend with Apollo\n' +
      '  Server, Express, and MongoDB. The app provides user authentication, full CRUD operations for managing ELL\n' +
      '  student records (including personal info, educational details, native language, proficiency levels), and\n' +
      '  role-based access control for teachers and administrators to track and manage their ELL student\n' +
      '  population.',
    sourceURL: 'https://github.com/maxjeffwell/educationELLy-graphql-client',
    hostedURL: 'https://educationelly-client-graphql-176ac5044d94.herokuapp.com/',
    technologies: ['React', 'MongoDB', 'NPM', 'Git', 'Heroku', 'Apollo Client', 'GraphQL'],
    techIcons: {
      icon3: MongoDBIcon,
      icon4: NPMIcon,
      icon5: ApolloClientIcon,
      icon6: GraphQLIcon,
    },
    screenshots: {
      screenshot1: 'educationELLy_screenshot',
      screenshot2: 'educationELLy_screenshot2',
    },
  },
  {
    id: 'project4',
    title: 'FireBook',
    date: '2018-2025',
    year: '2025',
    description:
      'FireBook is a feature-rich web application that transforms how users save and organize their favorite\n' +
      "  websites. Originally developed as a frontend-only application for Thinkful's Engineering Immersion\n" +
      '  program, it has evolved into a full-stack solution powered by Firebase, offering secure authentication,\n' +
      '  real-time synchronization, and personal bookmark collections. FireBook exemplifies how traditional web technologies can be enhanced with modern cloud services to create\n' +
      '   a secure, scalable, and user-friendly application that works seamlessly across devices while maintaining\n' +
      '  the simplicity of its original educational goals.',
    sourceURL: 'https://github.com/maxjeffwell/bookmarks-capstone-api',
    hostedURL: 'https://marmoset-c2870.firebaseapp.com',
    technologies: [
      'React',
      'CSS',
      'PostgreSQL',
      'Git',
      'NPM',
      'Google Cloud',
      'Firebase',
      'Firebase Studio',
      'Firebase Firestore',
      'Cloud Firestore',
    ],
    techIcons: {
      icon3: CSSIcon,
      icon4: FirebaseIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'bookmarked_screenshot',
      screenshot2: 'bookmarked_screenshot2',
    },
  },
  {
    id: 'project5',
    title: 'Bookmarked',
    date: '2020-2025',
    year: '2025',
    description:
      'Bookmarked is a modern bookmark manager application built with React Hooks. It lets users save, organize,\n' +
      '  and manage their favorite web links with features like ratings, favorites, and smart filtering. The app\n' +
      "  uses React's Context API and useReducer for state management, Emotion for styling, and connects to a REST\n" +
      '  API backend for data persistence. Users can add bookmarks with titles, URLs, and descriptions, rate them\n' +
      '  on a 5-star scale, mark favorites, and filter their collection by rating or favorite status.',
    sourceURL: 'https://github.com/maxjeffwell/bookmarks-react-hooks',
    hostedURL: 'https://bookmarks-react-hooks.vercel.app/',
    technologies: [
      'React',
      'Git',
      'Vercel',
      'NodeJS',
      'Neon',
      'Neon Serverless Postgres',
      'Neon Database',
    ],
    techIcons: {
      icon3: NPMIcon,
      icon4: VercelIcon,
      icon5: NodeJSIcon,
      icon6: NeonTechIcon,
    },
    screenshots: {
      screenshot1: 'bookmarked_screenshot',
      screenshot2: 'bookmarked_screenshot2',
    },
  },
];

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
  WebkitFontSmoothing: 'antialiased',
}));

const Projects = ({ data }) => {
  const [filters, setFilters] = useState({
    technologies: [],
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleTechnologyChange = useCallback(
    (e) => {
      handleFilterChange({
        ...filters,
        technologies: e.target.value ? [e.target.value] : [],
      });
    },
    [filters, handleFilterChange]
  );

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      if (filters.technologies.length > 0) {
        return filters.technologies.some((tech) => project.technologies.includes(tech));
      }
      return true;
    });
  }, [filters]);

  const enhancedProjects = useMemo(() => {
    if (!data?.allFile?.edges) return filteredProjects;

    // Create a map for faster lookups
    const imageMap = new Map();
    data.allFile.edges.forEach((edge) => {
      if (edge.node.relativePath) {
        imageMap.set(edge.node.relativePath, edge.node.childImageSharp);
      }
    });

    return filteredProjects.map((project) => ({
      ...project,
      imageSrcPath: Array.from(imageMap.entries()).find(([path]) =>
        path.includes(project.screenshots.screenshot1)
      )?.[1],
      imageSrcPath2: Array.from(imageMap.entries()).find(([path]) =>
        path.includes(project.screenshots.screenshot2)
      )?.[1],
      imageSrcPath3: project.techIcons.icon3 || '',
      imageSrcPath4: project.techIcons.icon4 || '',
      imageSrcPath5: project.techIcons.icon5 || '',
      imageSrcPath6: project.techIcons.icon6 || '',
    }));
  }, [filteredProjects, data]);

  return (
    <Layout>
      <SEO
        title="Projects"
        description="React & Node.js portfolio projects. Full stack web apps, GraphQL APIs, and modern JavaScript solutions. Live demos and source code available."
        pathname="/projects/"
        keywords={[
          `react projects`,
          `node.js projects`,
          `web development portfolio`,
          `javascript projects`,
          `full stack projects`,
          `graphql projects`,
          `mern stack examples`,
          `react portfolio`,
          `web app development`,
          `api development`,
          `react project examples`,
          `node.js portfolio projects`,
          `full stack web applications`,
          `javascript portfolio examples`,
          `Jeff Maxwell projects`,
        ]}
      />
      <Container maxWidth="lg">
        <Box component="section" sx={{ mb: 6 }}>
          <GradientText variant="h2" component="h1" align="center" gutterBottom>
            Featured Projects
          </GradientText>
          <Typography variant="h5" component="h2" align="center" color="text.secondary" paragraph>
            A collection of my work demonstrating modern web development
          </Typography>
        </Box>

        <Box component="section">
          <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
            Filter Projects
          </Typography>
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                Total Projects: {filteredProjects.length}
              </Typography>
              <NoSsr>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Filter by Technology:
                  </Typography>
                  <Select
                    id="technology-filter"
                    name="technologyFilter"
                    value={filters.technologies[0] || ''}
                    onChange={handleTechnologyChange}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                    inputProps={{
                      'aria-label': 'Filter projects by technology',
                      id: 'technology-filter-input',
                      name: 'technologyFilterInput',
                    }}
                  >
                    <MenuItem value="">All Projects</MenuItem>
                    <MenuItem value="React">React</MenuItem>
                    <MenuItem value="JavaScript">JavaScript</MenuItem>
                    <MenuItem value="GraphQL">GraphQL</MenuItem>
                  </Select>
                </Box>
              </NoSsr>
            </Box>
          </Paper>
        </Box>

        <Box component="section">
          {filteredProjects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                No projects match your current filters. Try adjusting your search criteria.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {enhancedProjects.map((project) => (
                <Box key={project.id}>
                  <ProjectCard
                    title={project.title}
                    date={project.date}
                    description={project.description}
                    sourceURL={project.sourceURL}
                    hostedURL={project.hostedURL}
                    technologies={project.technologies}
                    imageSrcPath={project.imageSrcPath}
                    imageSrcPath2={project.imageSrcPath2}
                    imageSrcPath3={project.imageSrcPath3}
                    imageSrcPath4={project.imageSrcPath4}
                    imageSrcPath5={project.imageSrcPath5}
                    imageSrcPath6={project.imageSrcPath6}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

Projects.propTypes = {
  data: PropTypes.shape({
    allFile: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            relativePath: PropTypes.string.isRequired,
            childImageSharp: PropTypes.shape({
              gatsbyImageData: PropTypes.object.isRequired,
            }),
          }).isRequired,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Projects;

export const pageQuery = graphql`
  query {
    allFile(
      filter: { sourceInstanceName: { eq: "images" }, extension: { regex: "/(jpg|jpeg|png)/" } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            gatsbyImageData(
              width: 800
              height: 450
              quality: 90
              placeholder: BLURRED
              formats: [AUTO, WEBP]
              transformOptions: { cropFocus: CENTER }
              breakpoints: [400, 600, 800, 1200, 1600]
              sizes: "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
            )
          }
        }
      }
    }
  }
`;
