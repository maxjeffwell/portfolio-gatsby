import React from 'react';
import { Link } from 'gatsby';
import ClientOnlyIcon from '../components/ClientOnlyIcon';
import ClientOnlyButton from '../components/ClientOnlyButton';
import styled from 'styled-components';

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

const ProjectCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
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
  
  .tech-icons {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    justify-content: center;
  }
  
  .buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
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
  margin: 0;
  opacity: 0.95;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;


const IndexPage = () => {
  const projects = [
    {
      title: "Bookmarked",
      description: "A modern bookmark manager application built with React Hooks. It lets users save, organize, and manage their favorite web links with features like ratings, favorites, and smart filtering.",
      tech: ["React", "Node.js", "MongoDB"],
      liveUrl: "https://bookmarked-demo.vercel.app",
      sourceUrl: "https://github.com/maxjeffwell/bookmarked"
    }
  ];

  return (
    <Layout>
      <SEO
        title="Home"
        description="Full Stack React & Node.js Developer. Modern web applications, innovative projects, and scalable solutions. View portfolio and hire freelance."
        pathname="/"
        keywords={[
          'full stack developer',
          'react developer',
          'node.js developer',
          'javascript developer',
          'web developer portfolio',
        ]}
      />
      <PageContainer>
        {/* Top Left - Blue Section */}
        <ColorSection className="blue">
          <SectionTitle>Developer's Journey</SectionTitle>
          <SectionText>
            I'm a React-focused full stack developer who believes in building beautiful, functional web applications. 
            My journey started with curiosity about how websites work and evolved into a passion for creating 
            seamless user experiences through clean, maintainable code.
          </SectionText>
        </ColorSection>

        {/* Top Right - Red/Orange Section */}
        <ColorSection className="yellow">
          <SectionTitle>Advanced</SectionTitle>
          <SectionText>
            I use a React-centric approach with tools like TypeScript, Next.js, and modern state management.
            My focus is on performance optimization, accessibility, and creating scalable architectures 
            that grow with your business needs.
          </SectionText>
        </ColorSection>

        {/* Bottom Left - Purple Section */}
        <ColorSection className="purple">
          <SectionTitle>Jeff Maxwell</SectionTitle>
          <SectionText>
            Let's build something amazing together. I'm passionate about turning complex problems 
            into simple, elegant solutions. Whether you need a new application, performance optimization, 
            or technical consultation, I'm here to help bring your vision to life.
          </SectionText>
        </ColorSection>

        {/* Bottom Right - Project Section */}
        <ColorSection className="green">
          <SectionTitle>My Bookmark</SectionTitle>
          {projects.map((project) => (
            <ProjectCard key={project.title}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-icons">
                {project.tech.map((tech) => (
                  <span key={tech} style={{
                    background: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="buttons">
                <StyledButton 
                  className="primary"
                  component="a"
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code
                </StyledButton>
                <StyledButton 
                  className="secondary"
                  component="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </StyledButton>
              </div>
            </ProjectCard>
          ))}
        </ColorSection>
      </PageContainer>
    </Layout>
  );
};

export default IndexPage;
