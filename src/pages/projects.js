import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Box,
  Grid,
  Paper,
  useTheme,
  Fade,
  NoSsr,
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
    technologies: ['React', 'GraphQL', 'Zeit', 'Git', 'Heroku', 'Netlify'],
    techIcons: {
      icon3: GraphQLIcon,
      icon4: ZeitIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'project2Screenshot',
      screenshot2: 'project2Screenshot2',
    },
  },
  {
    id: 'project3',
    title: 'Simply Conceptual',
    date: '2018-10-24',
    year: '2018',
    description:
      'Simply Conceptual offers spaced repetition learning software specifically geared towards learning programming concepts. It was built to gain experience with PostgreSQL as well as to satisfy my curiosity about the spaced repetition learning technique and its application in a programming context.',
    sourceURL: 'https://github.com/maxjeffwell/spaced-repetition-client',
    hostedURL: 'https://simplyconceptual.herokuapp.com/',
    technologies: ['React', 'CSS', 'PostgreSQL', 'Git', 'Heroku'],
    techIcons: {
      icon3: CSSIcon,
      icon4: PostgresqlIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'project3Screenshot',
      screenshot2: 'project3Screenshot2',
    },
  },
  {
    id: 'project4',
    title: 'BookTank',
    date: '2018-05-31',
    year: '2018',
    description:
      'BookTank is an application that allows users to maintain and organize their personal library catalogue. Users search for books via the Google Books API and receive formatted results that can be saved to user-created folders.',
    sourceURL: 'https://github.com/maxjeffwell/bookfinder-react-capstone',
    hostedURL: 'https://mysterious-tundra-22728.herokuapp.com/',
    technologies: ['React', 'CSS', 'MongoDB', 'Git', 'Heroku'],
    techIcons: {
      icon3: CSSIcon,
      icon4: MongoDBIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'project4Screenshot',
      screenshot2: 'project4Screenshot2',
    },
  },
  {
    id: 'project5',
    title: 'News Flash API',
    date: '2018-02-28',
    year: '2018',
    description:
      'News Flash connects users with current, topical political news. Users search by topic or by politician and receive a list of recent related news articles from major news media outlets.',
    sourceURL: 'https://github.com/maxjeffwell/news-flash-jQuery',
    hostedURL: 'https://maxjeffwell.github.io/news-flash-jQuery/',
    technologies: ['JavaScript', 'jQuery', 'CSS', 'HTML', 'Git', 'GitHub Pages'],
    techIcons: {
      icon3: CSSIcon,
      icon4: NPMIcon,
      icon5: GraphQLIcon,
    },
    screenshots: {
      screenshot1: 'project5Screenshot',
      screenshot2: 'project5Screenshot2',
    },
  },
];

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
}));

const Projects = ({ data }) => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    technologies: [],
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      if (filters.technologies.length > 0) {
        return filters.technologies.some((tech) => project.technologies.includes(tech));
      }
      return true;
    });
  }, [filters]);

  const enhancedProjects = useMemo(() => {
    return filteredProjects.map((project) => ({
      ...project,
      imageSrcPath: data.allImageSharp.edges.find(
        (edge) => edge.node.fluid.src.includes(project.screenshots.screenshot1)
      )?.node,
      imageSrcPath2: data.allImageSharp.edges.find(
        (edge) => edge.node.fluid.src.includes(project.screenshots.screenshot2)
      )?.node,
      imageSrcPath3: project.techIcons.icon3,
      imageSrcPath4: project.techIcons.icon4,
      imageSrcPath5: project.techIcons.icon5,
    }));
  }, [filteredProjects, data]);

  return (
    <Layout>
      <SEO
        title="Projects"
        description="Explore Jeff Maxwell's portfolio of web development projects showcasing expertise in React, Node.js, GraphQL, and modern JavaScript. View live demos and source code."
        pathname="/projects/"
        keywords={[
          `web development projects`,
          `React applications`,
          `full stack projects`,
          `JavaScript portfolio`,
          `GraphQL applications`,
          `open source projects`,
          `Jeff Maxwell projects`,
        ]}
      />
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <GradientText variant="h2" component="h1" align="center" gutterBottom>
            Featured Projects
          </GradientText>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            A collection of my work demonstrating modern web development
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6">
              Filter Projects (Total: {filteredProjects.length})
            </Typography>
            <NoSsr>
              <Select
                value={filters.technologies[0] || ''}
                onChange={(e) =>
                  handleFilterChange({
                    ...filters,
                    technologies: e.target.value ? [e.target.value] : [],
                  })
                }
                displayEmpty
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="">All Projects</MenuItem>
                <MenuItem value="React">React</MenuItem>
                <MenuItem value="JavaScript">JavaScript</MenuItem>
                <MenuItem value="GraphQL">GraphQL</MenuItem>
              </Select>
            </NoSsr>
          </Box>
        </Paper>

        {filteredProjects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No projects match your current filters. Try adjusting your search criteria.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {enhancedProjects.map((project, index) => (
              <Fade key={project.id} in timeout={800 + index * 200}>
                <Grid item xs={12}>
                  <ProjectCard
                    title={project.title}
                    date={project.date}
                    description={project.description}
                    sourceURL={project.sourceURL}
                    hostedURL={project.hostedURL}
                    imageSrcPath={project.imageSrcPath}
                    imageSrcPath2={project.imageSrcPath2}
                    imageSrcPath3={project.imageSrcPath3}
                    imageSrcPath4={project.imageSrcPath4}
                    imageSrcPath5={project.imageSrcPath5}
                  />
                </Grid>
              </Fade>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

Projects.propTypes = {
  data: PropTypes.shape({
    allImageSharp: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            fluid: PropTypes.shape({
              src: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Projects;

export const pageQuery = graphql`
  query {
    allImageSharp {
      edges {
        node {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid
            src
          }
        }
      }
    }
  }
`;