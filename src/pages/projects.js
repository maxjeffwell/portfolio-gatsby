import React from 'react';
import styled from 'styled-components';
import ClientOnlyButton from '../components/ClientOnlyButton';
import ClientOnlyIcon from '../components/ClientOnlyIcon';

import Layout from '../components/layout';
import SEO from '../components/seo';

const PageContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
`;

const ColorSection = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative;
  
  &.blue {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  }
  
  &.yellow {
    background: linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%);
  }
  
  &.purple {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  &.green {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 32px 0;
  opacity: 0.95;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ProjectCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 500px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    color: #333;
    margin: 0 0 12px 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  p {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 16px 0;
  }
  
  .tech-stack {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
`;

const TechBadge = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const StyledButton = styled(ClientOnlyButton)`
  && {
    border-radius: 8px !important;
    padding: 8px 16px !important;
    font-size: 0.85rem !important;
    text-transform: none !important;
    font-weight: 500 !important;
    min-width: auto !important;
    
    &.primary {
      background: #1976d2 !important;
      color: white !important;
      
      &:hover {
        background: #1565c0 !important;
      }
    }
    
    &.secondary {
      background: transparent !important;
      color: #1976d2 !important;
      border: 1px solid #1976d2 !important;
      
      &:hover {
        background: rgba(25, 118, 210, 0.04) !important;
      }
    }
  }
`;

const DateBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 16px;
`;

const Projects = () => {
  return (
    <Layout>
      <SEO
        title="Projects | React & Node.js Developer - Jeff Maxwell"
        description="Explore my React, Node.js, and GraphQL projects. Full stack web development solutions including e-learning platforms and social networks."
        pathname="/projects/"
        keywords={[
          'react projects',
          'node.js projects',
          'web development portfolio',
          'javascript projects',
          'full stack projects',
        ]}
      />
      <PageContainer>
        {/* Top Left - educationELLy */}
        <ColorSection className="blue">
          <DateBadge>(2020-2025)</DateBadge>
          <SectionTitle>educationELLy</SectionTitle>
          <SectionText>
            A full-stack web application for managing English Language Learner (ELL) students.
            Built with React/Redux frontend and Node.js/Express/MongoDB backend, featuring 
            secure JWT authentication and comprehensive student profile management.
          </SectionText>
          <ProjectCard>
            <h3>educationELLy</h3>
            <p>Collaborative platform for ELL and mainstream teachers to track student information, 
               English proficiency levels, and academic progress.</p>
            <div className="tech-stack">
              <TechBadge>React</TechBadge>
              <TechBadge>Redux</TechBadge>
              <TechBadge>MongoDB</TechBadge>
              <TechBadge>Node.js</TechBadge>
            </div>
            <div className="buttons">
              <StyledButton 
                className="primary"
                component="a"
                href="https://github.com/maxjeffwell/full-stack-capstone-client"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </StyledButton>
              <StyledButton 
                className="secondary"
                component="a"
                href="https://educationelly-client-71a1b1901aaa.herokuapp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </StyledButton>
            </div>
          </ProjectCard>
        </ColorSection>

        {/* Top Right - Code Talk */}
        <ColorSection className="yellow">
          <DateBadge>(2020-2025)</DateBadge>
          <SectionTitle>Code Talk</SectionTitle>
          <SectionText>
            Real-time collaborative code editor and messaging platform. Multiple developers 
            can write code together while communicating seamlessly. Built with React and 
            GraphQL, featuring WebSocket subscriptions for live updates.
          </SectionText>
          <ProjectCard>
            <h3>Code Talk</h3>
            <p>Perfect for remote pair programming, code reviews, or team collaboration sessions 
               with integrated instant messaging and room-based organization.</p>
            <div className="tech-stack">
              <TechBadge>React</TechBadge>
              <TechBadge>GraphQL</TechBadge>
              <TechBadge>PostgreSQL</TechBadge>
              <TechBadge>Redis</TechBadge>
            </div>
            <div className="buttons">
              <StyledButton 
                className="primary"
                component="a"
                href="https://github.com/maxjeffwell/code-talk-graphql-client"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </StyledButton>
              <StyledButton 
                className="secondary"
                component="a"
                href="https://code-talk-client-c46118c24c30.herokuapp.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </StyledButton>
            </div>
          </ProjectCard>
        </ColorSection>

        {/* Bottom Left - FireBook */}
        <ColorSection className="purple">
          <DateBadge>(2020-2025)</DateBadge>
          <SectionTitle>FireBook</SectionTitle>
          <SectionText>
            Feature-rich bookmark manager that transforms how users save and organize 
            their favorite websites. Powered by Firebase with secure authentication, 
            real-time synchronization, and personal bookmark collections.
          </SectionText>
          <ProjectCard>
            <h3>FireBook</h3>
            <p>A secure, scalable, and user-friendly application that works seamlessly 
               across devices while maintaining the simplicity of its original educational goals.</p>
            <div className="tech-stack">
              <TechBadge>React</TechBadge>
              <TechBadge>Firebase</TechBadge>
              <TechBadge>Cloud Firestore</TechBadge>
              <TechBadge>CSS</TechBadge>
            </div>
            <div className="buttons">
              <StyledButton 
                className="primary"
                component="a"
                href="https://github.com/maxjeffwell/bookmarks-capstone-api"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </StyledButton>
              <StyledButton 
                className="secondary"
                component="a"
                href="https://marmoset-c2870.firebaseapp.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </StyledButton>
            </div>
          </ProjectCard>
        </ColorSection>

        {/* Bottom Right - Bookmarked */}
        <ColorSection className="green">
          <DateBadge>(2020-2025)</DateBadge>
          <SectionTitle>Bookmarked</SectionTitle>
          <SectionText>
            Modern bookmark manager built with React Hooks. Users can save, organize, 
            and manage their favorite web links with features like ratings, favorites, 
            and smart filtering.
          </SectionText>
          <ProjectCard>
            <h3>Bookmarked</h3>
            <p>Uses React's Context API and useReducer for state management, Emotion for styling, 
               and connects to a REST API backend for data persistence.</p>
            <div className="tech-stack">
              <TechBadge>React</TechBadge>
              <TechBadge>Node.js</TechBadge>
              <TechBadge>MongoDB</TechBadge>
              <TechBadge>Vercel</TechBadge>
            </div>
            <div className="buttons">
              <StyledButton 
                className="primary"
                component="a"
                href="https://github.com/maxjeffwell/bookmarks-react-hooks"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </StyledButton>
              <StyledButton 
                className="secondary"
                component="a"
                href="https://bookmarks-react-hooks.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </StyledButton>
            </div>
          </ProjectCard>
        </ColorSection>
      </PageContainer>
    </Layout>
  );
};

export default Projects;