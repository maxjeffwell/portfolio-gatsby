import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

import Layout from '../components/layout';
import ProjectCard from '../components/projectCard';
import SEO from '../components/seo';
import PageTransition from '../components/PageTransition';
import SocialShare from '../components/SocialShare';
import MotionWrapper from '../components/MotionWrapper';

import GraphQLIcon from '../images/svg-icons/graphql.svg';
import ApolloClientIcon from '../images/svg-icons/apolloclient.svg';
import ReduxIcon from '../images/svg-icons/redux.svg';
import CSSIcon from '../images/svg-icons/css3.svg';
import MongoDBIcon from '../images/svg-icons/mongodb.svg';
import PostgresqlIcon from '../images/svg-icons/postgresql.svg';
import RedisIcon from '../images/svg-icons/redis.svg';
import NPMIcon from '../images/svg-icons/npm.svg';
import VercelIcon from '../images/svg-icons/vercel.svg';
import NodeJSIcon from '../images/svg-icons/nodejs.svg';
import FirebaseIcon from '../images/svg-icons/firebase.svg';
import NeonTechIcon from '../images/svg-icons/neon-tech.svg';

// Helper functions for Typography styles
const getTypographyFontWeight = (variant) => {
  switch (variant) {
    case 'h1':
    case 'h2':
      return 300;
    case 'h4':
    case 'body1':
    case 'body2':
    default:
      return 400;
  }
};

const getTypographyFontSize = (variant) => {
  switch (variant) {
    case 'h1':
      return '6rem';
    case 'h2':
      return '3.75rem';
    case 'h4':
      return '2.125rem';
    case 'body1':
      return '1rem';
    case 'body2':
      return '0.875rem';
    default:
      return '1rem';
  }
};

const getTypographyLineHeight = (variant) => {
  switch (variant) {
    case 'h1':
      return 1.167;
    case 'h2':
      return 1.2;
    case 'h4':
      return 1.235;
    case 'body1':
      return 1.5;
    case 'body2':
      return 1.43;
    default:
      return 1.5;
  }
};

// Simple Typography replacement
const Typography = styled.div`
  margin: 0;
  font-family: inherit;
  font-weight: ${(props) => getTypographyFontWeight(props.variant)};
  font-size: ${(props) => getTypographyFontSize(props.variant)};
  line-height: ${(props) => getTypographyLineHeight(props.variant)};
  color: ${(props) => {
    if (props.theme?.mode === 'dark') {
      if (props.color === 'text.secondary') return 'rgba(255, 255, 255, 0.7)';
      return 'rgba(255, 255, 255, 0.87)';
    }
    if (props.color === 'text.secondary') return 'rgba(0, 0, 0, 0.6)';
    return 'rgba(0, 0, 0, 0.87)';
  }};
  margin-bottom: ${(props) => (props.gutterBottom ? '0.35em' : '0')};
  text-align: ${(props) => props.align || 'inherit'};
  transition: color 0.3s ease;
`;

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
    technologies: ['JavaScript', 'React', 'Node.js', 'Redux', 'MongoDB', 'NPM', 'Git', 'Heroku'],
    techIcons: {
      icon3: ReduxIcon,
      icon4: MongoDBIcon,
      icon5: NPMIcon,
    },
    screenshots: {
      screenshot1: 'educationelly_screenshot1',
      screenshot2: 'educationelly_screenshot2.mp4',
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
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'GraphQL',
      'NPM',
      'Git',
      'Heroku',
      'Redis',
      'PostgreSQL',
    ],
    techIcons: {
      icon3: GraphQLIcon,
      icon4: NPMIcon,
      icon5: RedisIcon,
      icon6: PostgresqlIcon,
    },
    screenshots: {
      screenshot1: 'codetalk_screenshot1.mp4',
      screenshot2: 'codetalk_screenshot2.webm', // Fixed: using webm format
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
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'MongoDB',
      'NPM',
      'Git',
      'Heroku',
      'Apollo Client',
      'GraphQL',
    ],
    techIcons: {
      icon3: MongoDBIcon,
      icon4: NPMIcon,
      icon5: ApolloClientIcon,
      icon6: GraphQLIcon,
    },
    screenshots: {
      screenshot1: 'educationelly_graphql_screenshot1',
      screenshot2: 'educationelly_graphql_screenshot2',
      screenshot3: 'educationelly_graphql_screenshot3',
      screenshot4: 'educationelly_graphql_screenshot4',
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
      'JavaScript',
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
      screenshot1: 'firebook_screenshot1.mp4',
      screenshot2: 'firebook_screenshot2.png',
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
      'JavaScript',
      'React',
      'Git',
      'Vercel',
      'Node.js',
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
      screenshot1: 'bookmarked_screenshot1',
      screenshot2: 'bookmarked_screenshot2.mp4',
    },
  },
];

const StyledContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 16px;
  }

  @media (max-width: 360px) {
    padding: 0 12px;
  }
`;

const StyledBox = styled.div`
  margin-bottom: ${(props) => (props.mb ? `${props.mb * 8}px` : '0')};
  margin-top: ${(props) => (props.mt ? `${props.mt * 8}px` : '0')};
  text-align: ${(props) => props.textAlign || 'inherit'};
  display: ${(props) => props.display || 'block'};
  flex-direction: ${(props) => props.flexDirection || 'column'};
  gap: ${(props) => (props.gap ? `${props.gap * 8}px` : '0')};
  padding: ${(props) => (props.p ? `${props.p * 8}px` : '0')};
  padding-top: ${(props) => (props.pt ? `${props.pt * 8}px` : 'inherit')};
  padding-bottom: ${(props) => (props.pb ? `${props.pb * 8}px` : 'inherit')};
  border-radius: ${(props) => (props.borderRadius ? `${props.borderRadius * 8}px` : '0')};
  overflow: ${(props) => props.overflow || 'visible'};
  position: ${(props) => props.position || 'static'};
  min-height: ${(props) => props.minHeight || 'auto'};
  background-color: ${(props) =>
    props.bgColor === 'hover' ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  left: ${(props) => props.left || 'auto'};
  font-size: ${(props) => props.fontSize || 'inherit'};
  max-width: ${(props) => (props.maxWidth ? `${props.maxWidth}px` : 'none')};
  margin-left: ${(props) => (props.mx === 'auto' ? 'auto' : 'inherit')};
  margin-right: ${(props) => (props.mx === 'auto' ? 'auto' : 'inherit')};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
  align-items: ${(props) => props.alignItems || 'stretch'};
  flex-wrap: ${(props) => props.flexWrap || 'nowrap'};
`;

const GradientText = styled(Typography)`
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%)'
      : 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s ease;
  font-weight: 700 !important; /* Match other page headers */
  font-size: clamp(2.5rem, 8vw, 4rem) !important; /* Consistent with about page */
  line-height: 1.2 !important;

  /* Fallback color for browsers that don't support background-clip */
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1565c0')};

  @supports (background-clip: text) or (-webkit-background-clip: text) {
    color: transparent;
  }
`;

const CustomSelectContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 200px;
  min-width: 150px;

  @media (max-width: 480px) {
    max-width: 100%;
    min-width: 120px;
  }
`;

const CustomSelectButton = styled.button`
  width: 100%;
  padding: 12px 36px 12px 16px;
  border: 1px solid
    ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(42, 42, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;

  &:after {
    content: '▼';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%) ${(props) => (props.open ? 'rotate(180deg)' : 'rotate(0deg)')};
    font-size: 0.7rem;
    transition: transform 0.2s ease;
  }

  &:hover {
    border-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)'};
    background-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(50, 50, 50, 0.95)' : 'rgba(248, 248, 248, 0.95)'};
  }

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.theme?.colors?.primary || (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
  }
`;

const CustomSelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${(props) => (props.theme?.mode === 'dark' ? '#2a2a2a' : '#ffffff')};
  border: 1px solid
    ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'};
  border-radius: 8px;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    max-height: 150px;
  }

  @media (max-width: 480px) {
    max-height: 120px;
    border-radius: 6px;
  }

  /* Custom scrollbar for better mobile experience */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'};
  }
`;

const CustomSelectOption = styled.div`
  padding: 12px 16px;
  font-size: 0.9rem;
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)'};
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:hover,
  &:active {
    background-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.08)'};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 0.875rem;
    min-height: 48px;

    &:first-child {
      border-radius: 6px 6px 0 0;
    }

    &:last-child {
      border-radius: 0 0 6px 6px;
    }
  }
`;

const Projects = ({ data }) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    technologies: [],
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleTechnologyChange = useCallback(
    (value) => {
      handleFilterChange({
        ...filters,
        technologies: value ? [value] : [],
      });
      setDropdownOpen(false);
    },
    [filters, handleFilterChange]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      if (filters.technologies.length > 0) {
        return filters.technologies.some((tech) => project.technologies.includes(tech));
      }
      return true;
    });
  }, [filters]);

  const enhancedProjects = useMemo(() => {
    if (!data?.allImageFile?.edges && !data?.allVideoFile?.edges) return filteredProjects;

    // Create maps for faster lookups
    const imageMap = new Map();
    const videoMap = new Map();

    // Process image files
    if (data.allImageFile?.edges) {
      data.allImageFile.edges.forEach((edge) => {
        if (edge.node.relativePath) {
          imageMap.set(edge.node.relativePath, edge.node.childImageSharp);
        }
      });
    }

    // Process video files
    if (data.allVideoFile?.edges) {
      data.allVideoFile.edges.forEach((edge) => {
        if (edge.node.relativePath) {
          videoMap.set(edge.node.relativePath, edge.node.publicURL);
        }
      });
    }

    return filteredProjects.map((project) => {
      // Find image files (remove video extensions for matching)
      const screenshot1File = Array.from(imageMap.entries()).find(([path]) =>
        path.includes(project.screenshots.screenshot1.replace('.webm', '').replace('.mp4', ''))
      );
      const screenshot2File = Array.from(imageMap.entries()).find(([path]) =>
        path.includes(project.screenshots.screenshot2.replace('.webm', '').replace('.mp4', ''))
      );

      // Find video files
      const videoFile1 = Array.from(videoMap.entries()).find(([path]) =>
        path.includes(project.screenshots.screenshot1)
      );
      const videoFile2 = Array.from(videoMap.entries()).find(([path]) =>
        path.includes(project.screenshots.screenshot2)
      );

      return {
        ...project,
        imageSrcPath: screenshot1File?.[1],
        imageSrcPath2: screenshot2File?.[1],
        imageSrcPath3: screenshot2File?.[1],
        imageSrcPath4: screenshot2File?.[1],
        videoSrcPath:
          project.screenshots.screenshot1.endsWith('.webm') ||
          project.screenshots.screenshot1.endsWith('.mp4')
            ? videoFile1?.[1]
            : null,
        videoSrcPath2:
          project.screenshots.screenshot2.endsWith('.webm') ||
          project.screenshots.screenshot2.endsWith('.mp4')
            ? videoFile2?.[1]
            : null,
        techIcon3: project.techIcons.icon3 || null,
        techIcon4: project.techIcons.icon4 || null,
        techIcon5: project.techIcons.icon5 || null,
        techIcon6: project.techIcons.icon6 || null,
      };
    });
  }, [filteredProjects, data]);

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="React Node.js Portfolio | Jeff Maxwell JavaScript Developer"
          description="Jeff Maxwell's React and Node.js development portfolio. Explore JavaScript projects, full stack web applications, and modern development examples showcasing React, Node.js, GraphQL, and API development skills."
          pathname="/projects/"
          keywords={[
            `react developer portfolio`,
            `node.js developer projects`,
            `javascript developer portfolio`,
            `full stack developer projects`,
            `react node.js examples`,
            `javascript development portfolio`,
            `web development projects`,
            `react project showcase`,
            `node.js applications`,
            `modern javascript development`,
          ]}
        />
        <StyledContainer>
          <MotionWrapper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <StyledBox as="section" mb={6} textAlign="center">
              <GradientText variant="h1" component="h1" align="center" gutterBottom>
                React & Node.js Developer Portfolio - JavaScript Projects
              </GradientText>
              <Typography
                theme={theme}
                variant="h2"
                component="h2"
                align="center"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: theme?.mode === 'dark' ? '#ffffff' : '#333',
                }}
              >
                JavaScript & React Development Project Showcase
              </Typography>
              <Typography
                theme={theme}
                variant="body1"
                align="center"
                color="text.secondary"
                paragraph
                style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)' }}
              >
                A collection of full stack developer projects showcasing React, Node.js, and
                JavaScript development. Learn more{' '}
                <Link
                  to="/about/"
                  title="Learn more about Jeff Maxwell's development approach and philosophy"
                  style={{
                    color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  about my approach
                </Link>{' '}
                or{' '}
                <Link
                  to="/contact/"
                  title="Get in touch with Jeff Maxwell to discuss your next project"
                  style={{
                    color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                  }}
                >
                  discuss your project
                </Link>
                .
              </Typography>
            </StyledBox>
          </MotionWrapper>

          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <StyledBox mb={2}>
              <Typography
                theme={theme}
                variant="h3"
                component="h3"
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: theme?.mode === 'dark' ? '#ffffff' : '#333',
                  textAlign: 'center',
                }}
              >
                Filter JavaScript & React Projects by Technology
              </Typography>
            </StyledBox>
            <StyledBox display="flex" alignItems="center" justifyContent="flex-end" mb={3}>
              <CustomSelectContainer ref={dropdownRef}>
                <CustomSelectButton
                  theme={theme}
                  open={dropdownOpen}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="Filter projects by technology"
                  aria-expanded={dropdownOpen}
                >
                  {filters.technologies[0] || 'All Projects'}
                </CustomSelectButton>
                {dropdownOpen && (
                  <CustomSelectDropdown theme={theme}>
                    <CustomSelectOption theme={theme} onClick={() => handleTechnologyChange('')}>
                      All Projects
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('JavaScript')}
                    >
                      JavaScript
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('React')}
                    >
                      React
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Node.js')}
                    >
                      Node.js
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('GraphQL')}
                    >
                      GraphQL
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('MongoDB')}
                    >
                      MongoDB
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('PostgreSQL')}
                    >
                      PostgreSQL
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Redis')}
                    >
                      Redis
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Apollo Client')}
                    >
                      Apollo Client
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Redux')}
                    >
                      Redux
                    </CustomSelectOption>
                    <CustomSelectOption theme={theme} onClick={() => handleTechnologyChange('Git')}>
                      Git
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Heroku')}
                    >
                      Heroku
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Vercel')}
                    >
                      Vercel
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Firebase')}
                    >
                      Firebase
                    </CustomSelectOption>
                    <CustomSelectOption theme={theme} onClick={() => handleTechnologyChange('NPM')}>
                      NPM
                    </CustomSelectOption>
                    <CustomSelectOption theme={theme} onClick={() => handleTechnologyChange('CSS')}>
                      CSS
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Google Cloud')}
                    >
                      Google Cloud
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Firebase Studio')}
                    >
                      Firebase Studio
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Firebase Firestore')}
                    >
                      Firebase Firestore
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Cloud Firestore')}
                    >
                      Cloud Firestore
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Neon')}
                    >
                      Neon
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Neon Serverless Postgres')}
                    >
                      Neon Serverless Postgres
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Neon Database')}
                    >
                      Neon Database
                    </CustomSelectOption>
                  </CustomSelectDropdown>
                )}
              </CustomSelectContainer>
            </StyledBox>
          </MotionWrapper>

          <StyledBox mb={3}>
            <Typography
              theme={theme}
              variant="h2"
              component="h2"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                fontWeight: 600,
                marginBottom: '24px',
                color: theme?.mode === 'dark' ? '#ffffff' : '#333',
                textAlign: 'center',
              }}
            >
              JavaScript Developer Projects - React & Node.js Applications
            </Typography>
          </StyledBox>
          <StyledBox as="section">
            {filteredProjects.length === 0 ? (
              <StyledBox textAlign="center" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
                <Typography
                  theme={theme}
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: '1.125rem' }}
                >
                  No projects match your current filters. Try adjusting your search criteria.
                </Typography>
              </StyledBox>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {enhancedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.title}
                    date={project.date}
                    description={project.description}
                    sourceURL={project.sourceURL}
                    hostedURL={project.hostedURL}
                    technologies={project.technologies}
                    imageSrcPath={project.imageSrcPath}
                    imageSrcPath2={project.imageSrcPath2}
                    videoSrcPath={project.videoSrcPath}
                    videoSrcPath2={project.videoSrcPath2}
                    techIcon3={project.techIcon3}
                    techIcon4={project.techIcon4}
                    techIcon5={project.techIcon5}
                    techIcon6={project.techIcon6}
                  />
                ))}
              </div>
            )}
          </StyledBox>

          {/* Social Sharing Section */}
          <StyledBox as="section">
            <SocialShare
              url={
                typeof window !== 'undefined' && window.location
                  ? window.location.href
                  : 'https://el-jefe.me/projects/'
              }
              title="Jeff Maxwell's Development Projects Portfolio"
              description="Explore Jeff Maxwell's featured development projects showcasing React, Node.js, and modern web technologies. View live demos and source code."
            />
          </StyledBox>
        </StyledContainer>
        <div style={{ height: '80px' }} />
      </PageTransition>
    </Layout>
  );
};

Projects.propTypes = {
  data: PropTypes.shape({
    allImageFile: PropTypes.shape({
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
    }),
    allVideoFile: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            relativePath: PropTypes.string.isRequired,
            publicURL: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
    }),
  }).isRequired,
};

export default Projects;

export const pageQuery = graphql`
  query {
    allImageFile: allFile(
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
              formats: [AUTO, WEBP]
              transformOptions: { cropFocus: CENTER }
              breakpoints: [400, 600, 800, 1200, 1600]
              sizes: "(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 400px"
            )
          }
        }
      }
    }
    allVideoFile: allFile(
      filter: { sourceInstanceName: { eq: "images" }, extension: { regex: "/(webm|mp4)/" } }
    ) {
      edges {
        node {
          relativePath
          publicURL
        }
      }
    }
  }
`;
