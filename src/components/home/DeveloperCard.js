import React from 'react';
import { Link } from 'gatsby';
import ClientOnlyIcon from '../ClientOnlyIcon';
import { Card, CardTitle, CardText, CardLink } from './styles';

const DeveloperCard = () => {
  return (
    <Card as="article">
      <CardTitle as="h2">
        <ClientOnlyIcon
          iconName="Paws"
          fontSize="140px"
          style={{ marginRight: '8px', color: '#007bff' }}
        />{' '}
        Full Stack Developer Beyond the Code
      </CardTitle>
      <CardText>
        When I&#39;m not crafting pixel-perfect interfaces or debugging complex algorithms,
        you&#39;ll find me negotiating dinner arrangements with my demanding project managers —
        they&#39;re surprisingly good at code reviews! My approach to development extends beyond
        just writing code; it&#39;s about understanding user needs, anticipating edge cases, and
        building solutions that scale gracefully.
        <br />
        <br />
        I&#39;m passionate about continuous learning, whether it&#39;s exploring emerging
        frameworks like Next.js and Astro, optimizing performance bottlenecks with advanced webpack
        configurations, or contributing to open-source projects that benefit the developer
        community. My experience spans across various industries, from e-learning platforms and
        social networking applications to enterprise-level APIs and microservices architectures.
        View my{' '}
        <Link
          to="/projects/"
          title="Explore my portfolio of full stack development projects"
          style={{
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          complete project portfolio
        </Link>{' '}
        to see these diverse applications in action.
        <br />
        <br />
        When not coding, I enjoy participating in code reviews and staying current with industry
        trends through tech conferences and developer meetups. This balance of technical expertise
        and community involvement keeps me grounded and continuously improving my craft. Want to{' '}
        <Link
          to="/contact/"
          title="Contact Jeff Maxwell for your next development project"
          style={{
            color: 'var(--accent-pink)',
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          work together
        </Link>{' '}
        or learn more about my{' '}
        <Link
          to="/about/"
          title="Learn more about Jeff's development philosophy and approach"
          style={{
            color: 'var(--accent-pink)',
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          development philosophy
        </Link>
        ?
      </CardText>
      <CardLink to="/about/" title="Learn more about Jeff Maxwell's development approach">
        Meet my development team and learn more about me →
      </CardLink>
    </Card>
  );
};

export default DeveloperCard;
