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
    sourceURLs: [
      {
        url: 'https://github.com/maxjeffwell/full-stack-capstone-client',
        label: 'Source Code (Frontend)',
      },
      {
        url: 'https://github.com/maxjeffwell/full-stack-capstone-server',
        label: 'Source Code (Backend)',
      },
    ],
    deployments: [
      { url: 'https://educationelly-client-71a1b1901aaa.herokuapp.com/', label: 'Heroku' },
      { url: 'https://marmoset.el-jefe.me', label: 'Docker/NAS' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/educationelly-client/general',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/educationelly-server/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'Redux',
      'MongoDB',
      'JWT',
      'NPM',
      'Git',
      'Docker',
      'Heroku',
    ],
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
    sourceURLs: [
      {
        url: 'https://github.com/maxjeffwell/code-talk-graphql-client',
        label: 'Source Code (Frontend)',
      },
      {
        url: 'https://github.com/maxjeffwell/code-talk-graphql-server',
        label: 'Source Code (Backend)',
      },
    ],
    deployments: [
      { url: 'https://code-talk-client-c46118c24c30.herokuapp.com/', label: 'Heroku' },
      { url: 'https://code-talk.el-jefe.me', label: 'Docker/NAS' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/code-talk-graphql-client/general',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/code-talk-graphql-server/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'GraphQL',
      'JWT',
      'WebSocket',
      'NPM',
      'Git',
      'Docker',
      'Heroku',
      'Redis',
      'PostgreSQL',
    ],
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
    sourceURLs: [
      {
        url: 'https://github.com/maxjeffwell/educationELLy-graphql-client',
        label: 'Source Code (Frontend)',
      },
      {
        url: 'https://github.com/maxjeffwell/educationELLy-graphql-server',
        label: 'Source Code (Backend)',
      },
    ],
    deployments: [
      { url: 'https://educationelly-client-graphql-176ac5044d94.herokuapp.com/', label: 'Heroku' },
      { url: 'https://educationelly.el-jefe.me', label: 'Docker/NAS' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/educationelly-graphql-client/general',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/educationelly-graphql-server/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'JavaScript',
      'React',
      'Apollo Client',
      'Node.js',
      'Express',
      'MongoDB',
      'Apollo Server',
      'GraphQL',
      'NPM',
      'Git',
      'Docker',
      'Heroku',
    ],
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
      'FireBook is an intelligent bookmark management platform built with React and Firebase that\n' +
      '  automatically enriches saved links with metadata, screenshots, and AI-generated tags. The app features\n' +
      '  Google OAuth authentication, real-time Firestore synchronization, and Firebase Cloud Functions that\n' +
      '  capture webpage screenshots using Puppeteer, extract metadata (titles, descriptions, favicons), and\n' +
      '  generate contextual tags via Google Natural Language API. Users can search bookmarks with Algolia\n' +
      '  instant search, organize collections with collaborative sharing (viewer/editor permissions), edit\n' +
      '  bookmarks in-app, and import/export data as JSON. Built with Vite, Tailwind CSS, and deployed on\n' +
      '  Firebase Hosting with Docker support, FireBook demonstrates serverless architecture, cloud automation,\n' +
      '  and modern React development patterns.',
    sourceURL: 'https://github.com/maxjeffwell/bookmarks-capstone-api',
    deployments: [
      { url: 'https://marmoset-c2870.firebaseapp.com', label: 'Firebase' },
      { url: 'https://firebook.el-jefe.me', label: 'Docker/NAS' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/firebook/general',
        label: 'Docker Hub',
      },
    ],
    technologies: [
      'React',
      'Vite',
      'Firebase',
      'Google Cloud',
      'Tailwind CSS',
      'Firestore',
      'Algolia',
      'Puppeteer',
      'JavaScript',
      'Docker',
      'Git',
      'NPM',
    ],
    screenshots: {
      screenshot1: 'firebook_screenshot1.png',
      screenshot2: 'firebook_screenshot2.png',
    },
  },
  {
    id: 'project5',
    title: 'Bookmarked',
    date: '2020-2025',
    year: '2025',
    description:
      'Bookmarked is an AI-powered bookmark manager built with React Hooks and LangChain. It features intelligent\n' +
      '  auto-tagging that uses OpenAI GPT-4o-mini to automatically generate 3-5 relevant tags for each bookmark by\n' +
      '  analyzing titles, URLs, and descriptions. The app includes individual and batch tag generation, PostgreSQL-\n' +
      '  backed caching to minimize API costs, and full-text search capabilities. Built with React Context API and\n' +
      '  useReducer for state management, it connects to a Neon PostgreSQL database with a normalized tags schema.\n' +
      '  Users can save bookmarks, rate them on a 5-star scale, mark favorites, filter by rating or tags, and benefit\n' +
      '  from smart AI categorization that learns from bookmark content. The dual-deployment architecture supports both\n' +
      '  Vercel serverless functions and Express backend, with cost optimization achieving 60-70% cache hit rates.',
    sourceURL: 'https://github.com/maxjeffwell/bookmarks-react-hooks',
    deployments: [
      { url: 'https://bookmarks-react-hooks.vercel.app/', label: 'Vercel' },
      { url: 'https://bookmarked.el-jefe.me', label: 'Docker/NAS' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/bookmarks-react-hooks-client/general',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/bookmarks-react-hooks-server/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'JavaScript',
      'React',
      'Context API',
      'Emotion',
      'Node.js',
      'PostgreSQL',
      'Neon',
      'LangChain',
      'OpenAI',
      'Git',
      'Docker',
      'Vercel',
    ],
    screenshots: {
      screenshot1: 'bookmarked_screenshot1.mp4',
      screenshot2: 'bookmarked_screenshot2.mp4',
    },
  },
  {
    id: 'project6',
    title: 'IntervalAI',
    date: '2025',
    year: '2025',
    description:
      'IntervalAI is a neural-enhanced spaced repetition learning system that uses machine learning to optimize\n' +
      '  vocabulary review timing for maximum retention. The app combines the proven SM-2 algorithm with an 8-layer\n' +
      '  neural network (961 parameters) that learns individual user patterns, achieving 96.1% improvement over\n' +
      '  baseline methods. Built with React/Redux frontend and Node.js/Express/MongoDB backend, it features\n' +
      '  WebGPU-accelerated ML inference (<1ms), real-time predictions of optimal review intervals, TensorFlow.js\n' +
      '  for machine learning, and built-in A/B testing to compare algorithm performance. Perfect for language\n' +
      '  learners seeking personalized, scientifically-optimized study schedules.',
    sourceURLs: [
      {
        url: 'https://github.com/maxjeffwell/spaced-repetition-capstone-client',
        label: 'Source Code (Frontend)',
      },
      {
        url: 'https://github.com/maxjeffwell/spaced-repetition-capstone-server',
        label: 'Source Code (Backend)',
      },
    ],
    deployments: [
      { url: 'https://spaced-repetition-capstone-client.onrender.com/', label: 'Render' },
      { url: 'https://intervalai.el-jefe.me', label: 'Docker/NAS' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/spaced-repetition-capstone-client/general',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/spaced-repetition-capstone-server/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'Redux',
      'MongoDB',
      'NPM',
      'Git',
      'Docker',
      'Render',
      'TensorFlow.js',
      'WebGPU',
    ],
    screenshots: {
      screenshot1: 'intervalai_screenshot1.mp4',
      screenshot2: 'intervalai_screenshot2.mp4',
    },
  },
  {
    id: 'project7',
    title: 'Pop!_Portfolio',
    date: '2025',
    year: '2025',
    description:
      'Pop!_Portfolio (Portfolio Orchestration Platform) is a Kubernetes-based orchestration platform that\n' +
      '  manages and monitors all portfolio applications as containerized workloads. Built with React and Node.js,\n' +
      '  it provides real-time pod status tracking, resource metrics visualization (CPU, memory, network),\n' +
      '  centralized log aggregation with search and filtering, and deployment controls for managing applications\n' +
      '  through a web dashboard. The platform features automated health monitoring with liveness and readiness\n' +
      '  probes, service discovery, intelligent load balancing, and horizontal pod autoscaling. Using the\n' +
      '  Kubernetes API client, Socket.io for real-time updates, and Material-UI for the interface, it\n' +
      '  demonstrates cloud-native development practices and modern DevOps workflows with integrated Prometheus\n' +
      '  and Grafana monitoring.',
    sourceURL: 'https://github.com/maxjeffwell/portfolio-orchestration-platform',
    deployments: [
      { url: 'https://pop-portfolio.el-jefe.me/login', label: 'Kubernetes' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/portfolio-dashboard/general',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/portfolio-api/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'Kubernetes',
      'Docker',
      'Material-UI',
      'Socket.io',
      'Helm',
      'Prometheus',
      'Grafana',
      'Vite',
      'Git',
      'NPM',
    ],
    screenshots: {
      screenshot1: 'pop_screenshot1.png',
      screenshot2: 'pop_screenshot2.png',
    },
  },
  {
    id: 'project8',
    title: 'PodRick',
    date: '2025',
    year: '2025',
    description:
      'Automated DevOps platform implementing GitOps workflows for portfolio applications. Features CI/CD\n' +
      '  pipelines with GitHub Actions for automated build, test, and deployment processes, automated\n' +
      '  Kubernetes deployments with rollback capabilities, and infrastructure-as-code management with Helm\n' +
      '  charts. The platform provides centralized management of all portfolio applications with Docker\n' +
      '  registry integration, post-deployment health monitoring, and real-time status tracking. Built with\n' +
      '  Node.js, React/Vite, and Express, it includes a GitOps sync service that continuously monitors the\n' +
      '  repository and automatically applies changes to the Kubernetes cluster. With support for multiple\n' +
      '  environments (dev, staging, production), automated rollback on failure, and integration with\n' +
      '  Prometheus and Grafana for monitoring, PodRick demonstrates modern DevOps best practices including\n' +
      '  immutable infrastructure, semantic versioning, and blue-green deployments.',
    sourceURL: 'https://github.com/maxjeffwell/devops-portfolio-manager',
    deployments: [
      { url: 'https://podrick.el-jefe.me/applications', label: 'Kubernetes' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/devops-portfolio-dashboard',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/devops-portfolio-api/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'Kubernetes',
      'Docker',
      'Helm',
      'GitHub Actions',
      'Argo CD',
      'Prometheus',
      'Grafana',
      'Vite',
      'Git',
      'NPM',
    ],
    screenshots: {
      screenshot1: 'podrick_screenshot1.png',
      screenshot2: 'podrick_screenshot2.png',
    },
  },
  {
    id: 'project9',
    title: 'TenantFlow',
    date: '2025',
    year: '2025',
    description:
      'Multi-tenant Kubernetes platform enabling isolated deployment of portfolio applications in separate\n' +
      '  namespaces. Ideal for client demos, A/B testing, and staging environments. Features namespace isolation,\n' +
      '  resource quotas, and per-tenant monitoring. Built with React, Vite, Node.js, and Kubernetes, the platform\n' +
      '  provides isolated instances of educationELLy-graphql and educationELLy applications running in different\n' +
      '  namespaces. Each tenant environment is completely isolated with its own resources, ensuring secure and\n' +
      '  efficient multi-tenancy. Utilizes Helm charts for deployment management, Nginx Ingress for routing, and\n' +
      '  Docker for containerization, demonstrating cloud-native architecture patterns and Kubernetes best practices\n' +
      '  for multi-tenant applications.',
    sourceURL: 'https://github.com/maxjeffwell/k8s-multi-tenant-platform',
    deployments: [
      { url: 'https://tenantflow.el-jefe.me/', label: 'Kubernetes' },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/k8s-platform-frontend/general',
        label: 'Docker Hub (Frontend)',
      },
      {
        url: 'https://hub.docker.com/repository/docker/maxjeffwell/k8s-platform-backend/general',
        label: 'Docker Hub (Backend)',
      },
    ],
    technologies: [
      'Kubernetes',
      'Docker',
      'Vite',
      'React',
      'Node.js',
      'Helm',
      'Nginx Ingress',
      'JavaScript',
      'Git',
      'NPM',
    ],
    screenshots: {
      screenshot1: 'tenant_screenshot1.mp4',
      screenshot2: 'tenant_screenshot2.mp4',
    },
  },
  {
    id: 'project10',
    title: 'Vertex Platform',
    date: '2025',
    year: '2025',
    description:
      'Enterprise-grade microservices platform demonstrating platform engineering and service-oriented\n' +
      '  architecture. Currently implements authentication and analytics services with plans to orchestrate\n' +
      '  educationELLy, Code Talk, FireBook, and IntervalAI applications. The auth service provides JWT-based\n' +
      '  authentication with PostgreSQL and Redis for session management, while the analytics service captures\n' +
      '  events with Kafka streaming and stores time-series data in InfluxDB. Built with Node.js and Express,\n' +
      '  the platform uses Docker Compose for local development with MongoDB, Redis, Kafka, Zookeeper, and\n' +
      '  InfluxDB infrastructure services. Features shared platform modules for logging, error handling, and\n' +
      '  middleware, demonstrating microservices patterns including service decomposition, event-driven\n' +
      '  architecture, and centralized authentication. The project showcases domain-driven design, API\n' +
      '  development best practices, and modern DevOps workflows with Docker containerization.',
    sourceURL: 'https://github.com/maxjeffwell/microservices-platform',
    deployments: [
      { url: '', label: 'Kubernetes' },
    ],
    technologies: [
      'JavaScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'InfluxDB',
      'Kafka',
      'JWT',
      'Docker',
      'Git',
      'NPM',
    ],
    screenshots: {
      screenshot1: 'vertex_screenshot1',
      screenshot2: 'vertex_screenshot2',
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
      };
    });
  }, [filteredProjects, data]);

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="React Node.js Portfolio | Jeff Maxwell JavaScript Developer"
          description="Explore Jeff Maxwell's React and Node.js projects. Full stack JavaScript applications showcasing modern web development and API design."
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
              <GradientText as="h1" variant="h1" align="center" gutterBottom>
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
                      onClick={() => handleTechnologyChange('Context API')}
                    >
                      Context API
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Node.js')}
                    >
                      Node.js
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Express')}
                    >
                      Express
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
                      onClick={() => handleTechnologyChange('WebSocket')}
                    >
                      WebSocket
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Apollo Client')}
                    >
                      Apollo Client
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Apollo Server')}
                    >
                      Apollo Server
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Redux')}
                    >
                      Redux
                    </CustomSelectOption>
                    <CustomSelectOption theme={theme} onClick={() => handleTechnologyChange('JWT')}>
                      JWT
                    </CustomSelectOption>
                    <CustomSelectOption theme={theme} onClick={() => handleTechnologyChange('Git')}>
                      Git
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Docker')}
                    >
                      Docker
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
                      onClick={() => handleTechnologyChange('Render')}
                    >
                      Render
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
                      onClick={() => handleTechnologyChange('Emotion')}
                    >
                      Emotion
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Google Cloud')}
                    >
                      Google Cloud
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Neon')}
                    >
                      Neon
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('OpenAI')}
                    >
                      OpenAI
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Kubernetes')}
                    >
                      Kubernetes
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('LangChain')}
                    >
                      LangChain
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Material-UI')}
                    >
                      Material-UI
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Socket.io')}
                    >
                      Socket.io
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Helm')}
                    >
                      Helm
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Prometheus')}
                    >
                      Prometheus
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Grafana')}
                    >
                      Grafana
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Vite')}
                    >
                      Vite
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Tailwind CSS')}
                    >
                      Tailwind CSS
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Algolia')}
                    >
                      Algolia
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Puppeteer')}
                    >
                      Puppeteer
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Firestore')}
                    >
                      Firestore
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('GitHub Actions')}
                    >
                      GitHub Actions
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Argo CD')}
                    >
                      Argo CD
                    </CustomSelectOption>
                    <CustomSelectOption
                      theme={theme}
                      onClick={() => handleTechnologyChange('Nginx Ingress')}
                    >
                      Nginx Ingress
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
                    sourceURLs={project.sourceURLs}
                    hostedURL={project.hostedURL}
                    deployments={project.deployments}
                    technologies={project.technologies}
                    imageSrcPath={project.imageSrcPath}
                    imageSrcPath2={project.imageSrcPath2}
                    videoSrcPath={project.videoSrcPath}
                    videoSrcPath2={project.videoSrcPath2}
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
