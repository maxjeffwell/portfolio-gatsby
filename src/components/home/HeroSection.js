import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import SimpleTypingAnimation from '../SimpleTypingAnimation';
import StaggeredAnimation from '../StaggeredAnimation';
import { Container, QuoteBox, GradientTypingWrapper } from './styles';

const HeroSectionWrapper = styled.section`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 80px 0 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;

  .dark-mode & {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  @media (max-width: 600px) {
    padding: 60px 0 40px;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: var(--text-color);

  .highlight {
    background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  color: var(--text-secondary-color);
  margin: 20px 0 40px;
  font-weight: 600;

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const HeroIntro = styled.p`
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin: 0 0 clamp(12px, 3vw, 16px) 0;
  color: var(--text-secondary-color);
  font-weight: 700;
`;

const HeroQuote = styled.p`
  font-size: clamp(1.125rem, 3vw, 1.375rem);
  line-height: 1.6;
  color: var(--text-muted-color);
  margin-bottom: clamp(24px, 6vw, 40px);
  padding: 0 8px;
`;

const CtaButton = styled(Link)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 40px;
  font-size: 1.125rem;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
`;

const HeroSection = () => {
  return (
    <HeroSectionWrapper as="section" aria-labelledby="hero-title" id="home">
      <Container>
        <StaggeredAnimation>
          <HeroIntro>My name&#39;s Jeff</HeroIntro>
          <HeroTitle as="h1" id="hero-title">
            I&#39;m a{' '}
            <GradientTypingWrapper>
              <SimpleTypingAnimation
                texts={[
                  'Node.js Expert',
                  'React Specialist',
                  'Full Stack Developer',
                  'JavaScript Enthusiast',
                  'Problem Solver',
                ]}
                typeSpeed={60}
                deleteSpeed={30}
                delayBetweenTexts={2000}
                startDelay={1000}
                loop
              />
            </GradientTypingWrapper>
          </HeroTitle>
          <HeroSubtitle>
            Full Stack Web Developer crafting exceptional React & Node.js applications with modern
            technologies
          </HeroSubtitle>

          <QuoteBox>
            I believe in <strong>clean, maintainable code</strong> and{' '}
            <strong>user-centered design</strong>. As a developer, I focus on crafting every line
            with performance, accessibility, and scalability in mind. Check out my{' '}
            <Link
              to="/projects/"
              title="View my featured development projects and portfolio"
              style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              featured projects
            </Link>{' '}
            to see these principles in action, or{' '}
            <Link
              to="/about/"
              title="Learn more about my development background and experience"
              style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              read more about my approach
            </Link>
            .
          </QuoteBox>

          <HeroQuote>
            "Code is like humor. When you have to explain it, it's bad." — That's why I focus on
            intuitive, self-documenting solutions. Ready to discuss your next project?{' '}
            <Link
              to="/contact/"
              title="Get in touch to discuss your next project"
              style={{
                color: 'var(--primary-color)',
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              Let&#39;s connect
            </Link>
            .
          </HeroQuote>

          <CtaButton to="/projects/" title="View my featured development projects">
            View My Projects →
          </CtaButton>
        </StaggeredAnimation>
      </Container>
    </HeroSectionWrapper>
  );
};

export default HeroSection;
