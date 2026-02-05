import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import ClientOnlyIcon from '../ClientOnlyIcon';
import { Container, ContentSection, TwoColumnGrid, Card, CardTitle, CardText } from './styles';

const TechnologiesSection = ({ theme }) => {
  return (
    <ContentSection theme={theme} as="section" aria-labelledby="technologies-heading" id="technologies">
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 600,
              color: theme?.mode === 'dark' ? '#ffffff' : '#333',
              margin: '0 0 16px 0',
            }}
          >
            Web Developer Portfolio - Modern JavaScript Technologies
          </h3>
          <p
            style={{
              fontSize: '1.25rem',
              color: theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666',
              margin: '0 0 32px 0',
              textAlign: 'center',
            }}
          >
            Explore my expertise across the full development stack. Want to{' '}
            <Link
              to="/contact/"
              title="Contact Jeff Maxwell to discuss your next project"
              style={{
                color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              start a project
            </Link>{' '}
            or learn more{' '}
            <Link
              to="/about/"
              title="Learn more about Jeff's development experience"
              style={{
                color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              about my experience
            </Link>
            ?
          </p>
        </div>
        <TwoColumnGrid>
          {/* Frontend Technologies */}
          <Card theme={theme} as="article">
            <CardTitle theme={theme} as="h2" id="technologies-heading">
              <ClientOnlyIcon
                iconName="React"
                fontSize="110px"
                style={{ marginRight: '8px', color: '#61dafb' }}
              />{' '}
              JavaScript Developer Frontend Technologies
            </CardTitle>
            <CardText theme={theme}>
              My frontend expertise encompasses the latest React ecosystem, including React 18 with
              Concurrent Features, Server Components, and Suspense for optimal performance. I
              leverage modern state management solutions like Zustand, Redux Toolkit, and React
              Query for efficient data fetching and caching strategies. Curious about my{' '}
              <Link
                to="/about/"
                title="Learn about my technical background and expertise"
                style={{
                  color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                technical background
              </Link>
              ?
              <br />
              <br />
              Advanced CSS techniques include CSS Grid, Flexbox, and custom properties (CSS
              variables) for maintainable styling systems. I implement design systems using
              Storybook, ensuring consistent UI components across large-scale applications. Build
              tools like Vite, Webpack, and Parcel are integral to my development process, enabling
              optimized bundle sizes and lightning-fast development experiences. See these
              technologies in action in my{' '}
              <Link
                to="/projects/"
                title="Browse my React and frontend development projects"
                style={{
                  color: theme?.mode === 'dark' ? '#90caf9' : '#1565c0',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                React projects
              </Link>
              .
            </CardText>
          </Card>

          {/* Backend & Infrastructure */}
          <Card theme={theme} as="article">
            <CardTitle theme={theme} as="h2">
              <ClientOnlyIcon
                iconName="NodeJS"
                fontSize="110px"
                style={{ marginRight: '8px', color: '#68a063' }}
              />{' '}
              Node.js Developer Backend & Infrastructure
            </CardTitle>
            <CardText theme={theme}>
              On the backend, I specialize in Node.js microservices architecture using Express.js,
              Fastify, and NestJS frameworks. Database expertise includes PostgreSQL for relational
              data, MongoDB for document storage, and Redis for caching and session management. I
              implement robust API designs following OpenAPI specifications and GraphQL schemas.
              <br />
              <br />
              Cloud infrastructure experience spans AWS services (EC2, Lambda, S3, RDS), Docker
              containerization, and Kubernetes orchestration. CI/CD pipelines using GitHub Actions,
              Jenkins, and GitLab CI ensure reliable deployments with comprehensive testing coverage
              including unit, integration, and end-to-end testing suites with Cypress and
              Playwright. Interested in working together?{' '}
              <Link
                to="/contact/"
                title="Get in touch for your next development project"
                style={{
                  color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                Let&#39;s discuss your project
              </Link>{' '}
              or{' '}
              <Link
                to="/projects/"
                title="View my backend and infrastructure projects"
                style={{
                  color: theme?.mode === 'dark' ? '#f48fb1' : '#e91e63',
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                }}
              >
                see my backend projects
              </Link>
              .
            </CardText>
          </Card>
        </TwoColumnGrid>
      </Container>
    </ContentSection>
  );
};

TechnologiesSection.propTypes = {
  theme: PropTypes.shape({
    mode: PropTypes.string,
    colors: PropTypes.object,
  }),
};

TechnologiesSection.defaultProps = {
  theme: null,
};

export default TechnologiesSection;
