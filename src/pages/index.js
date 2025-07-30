import React from 'react';
import { Link } from 'gatsby';
import ClientOnlyIcon from '../components/ClientOnlyIcon';
import ClientOnlyButton from '../components/ClientOnlyButton';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

import Layout from '../components/layout';
import SEO from '../components/seo';
import CodeSnippet from '../components/CodeSnippet';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const HeroSection = styled.section`
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
    : props.theme?.mode === 'light' 
    ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
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

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: ${props => props.theme?.mode === 'dark' ? '#ffffff' : props.theme?.mode === 'light' ? '#333' : 'var(--text-color)'};
  transition: color 0.3s ease;
  
  .highlight {
    background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666'};
  margin: 20px 0 40px;
  font-weight: 400;
  transition: color 0.3s ease;
  
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const ViewProjectsButton = styled(ClientOnlyButton)`
  && {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 50px !important;
    padding: 16px 40px !important;
    font-size: 1.125rem !important;
    font-weight: 600 !important;
    text-transform: none !important;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
    transition: all 0.3s ease !important;
    
    &:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
    }
  }
`;

const ContentSection = styled.section`
  padding: 80px 0;
  
  @media (max-width: 600px) {
    padding: 60px 0;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Card = styled.div`
  background: ${props => props.theme?.colors?.paper || 'var(--paper-color)'};
  color: ${props => props.theme?.colors?.text || 'var(--text-color)'};
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
  transition: background 0.3s ease, color 0.3s ease;
  
  @media (max-width: 600px) {
    padding: 32px 24px;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: ${props => props.theme?.colors?.text || '#333'};
  display: flex;
  align-items: center;
  gap: 12px;
  transition: color 0.3s ease;
  
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const CardText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666'};
  margin: 0 0 24px 0;
  transition: color 0.3s ease;
`;

const FloatingShape = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
`;

const QuoteBox = styled.div`
  margin: 20px 0;
  padding: 16px 20px;
  background: ${props => props.theme?.mode === 'dark' 
    ? 'rgba(144, 202, 249, 0.1)' 
    : 'rgba(25, 118, 210, 0.05)'};
  border-left: 4px solid ${props => props.theme?.colors?.primary || '#1976d2'};
  border-radius: 4px;
  font-style: italic;
  font-size: 1.25rem;
  line-height: 1.6;
  color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#555'};
  transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
`;

const InfoCard = styled.div`
  background: ${props => props.theme?.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.15) 0%, rgba(233, 30, 99, 0.1) 100%)' 
    : 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)'};
  border-radius: 12px;
  padding: 32px;
  margin-top: 24px;
  transition: background 0.3s ease;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.theme?.mode === 'dark' ? '#f48fb1' : '#e91e63'};
    margin: 0 0 16px 0;
    transition: color 0.3s ease;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: ${props => props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : '#333'};
      transition: color 0.3s ease;
      
      svg {
        color: ${props => props.theme?.mode === 'dark' ? '#f48fb1' : '#e91e63'};
        flex-shrink: 0;
        transition: color 0.3s ease;
      }
    }
  }
`;


const IndexPage = () => {
  const { theme } = useTheme();
  
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
      
      {/* Hero Section */}
      <HeroSection theme={theme}>
        <Container>
          <HeroContent>
            <p style={{ 
              fontSize: 'clamp(1.375rem, 3vw, 1.5rem)', 
              margin: '0 0 16px 0', 
              color: theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#666',
              transition: 'color 0.3s ease',
              fontWeight: 500
            }}>
              My name's Jeff 😊
            </p>
            <HeroTitle theme={theme}>
              I'm a <span className="highlight">Node.js Expert</span>
            </HeroTitle>
            <HeroSubtitle theme={theme}>
              crafting exceptional web experiences
            </HeroSubtitle>
            
            <QuoteBox theme={theme}>
              I believe in <strong>clean, maintainable code</strong> and <strong>user-centered design</strong>. 
              Every line I write is crafted with performance, accessibility, and scalability in mind.
            </QuoteBox>
            
            <p style={{ 
              fontStyle: 'italic', 
              fontSize: '1.25rem',
              lineHeight: '1.6',
              color: theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#777', 
              marginBottom: '40px',
              transition: 'color 0.3s ease'
            }}>
              "Code is like humor. When you have to explain it, it's bad." — That's why I focus on intuitive, self-documenting solutions.
            </p>
            
            <ViewProjectsButton
              component={Link}
              to="/projects/"
              endIcon={<ClientOnlyIcon iconName="ArrowForward" />}
            >
              View My Projects
            </ViewProjectsButton>
          </HeroContent>
          
          {/* Floating shapes */}
          <FloatingShape style={{
            width: '200px',
            height: '200px',
            background: 'rgba(25, 118, 210, 0.1)',
            top: '10%',
            left: '-50px',
          }} />
          <FloatingShape style={{
            width: '150px',
            height: '150px',
            background: 'rgba(233, 30, 99, 0.1)',
            bottom: '20%',
            right: '-50px',
            animationDelay: '2s',
          }} />
          <FloatingShape style={{
            width: '100px',
            height: '100px',
            background: 'rgba(102, 126, 234, 0.1)',
            top: '30%',
            right: '10%',
            animationDelay: '4s',
          }} />
        </Container>
      </HeroSection>
      
      {/* Content Section */}
      <ContentSection>
        <Container>
          <TwoColumnGrid>
            {/* Beyond the Code */}
            <Card theme={theme}>
              <CardTitle theme={theme}>
                <span style={{ fontSize: '1.5rem' }}>🐾</span>
                Beyond the Code
              </CardTitle>
              <CardText theme={theme}>
                When I'm not crafting pixel-perfect interfaces or 
                debugging complex algorithms, you'll find me 
                negotiating dinner arrangements with my two 
                demanding canine project managers — they're 
                surprisingly good at code reviews!
              </CardText>
              <ClientOnlyButton
                component={Link}
                to="/about/"
                variant="text"
                style={{ 
                  color: '#e91e63',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  padding: '8px 16px',
                }}
              >
                Meet my development team and learn more about me →
              </ClientOnlyButton>
            </Card>
            
            {/* Code Philosophy */}
            <Card theme={theme}>
              <CardTitle theme={theme}>
                <ClientOnlyIcon iconName="Computer" style={{ fontSize: '1.5rem', color: theme?.colors?.primary || '#1976d2' }} />
                Code Philosophy
              </CardTitle>
              <CardText theme={theme}>
                Clean, readable, and maintainable — here's how I approach 
                modern React development:
              </CardText>
              
              <CodeSnippet
                title="Custom Hook Example"
                animated={true}
                animationSpeed={25}
                code={`const useTheme = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    setIsDark(stored === 'dark');
  }, []);
  
  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }, [isDark]);
  
  return { isDark, toggleTheme };
};`}
              />
              
              <InfoCard theme={theme}>
                <h3>Why I Like This Pattern</h3>
                <ul>
                  <li>
                    <ClientOnlyIcon iconName="CheckCircle" fontSize="small" />
                    Separation of concerns — logic stays in the hook
                  </li>
                  <li>
                    <ClientOnlyIcon iconName="CheckCircle" fontSize="small" />
                    Reusable across multiple components
                  </li>
                  <li>
                    <ClientOnlyIcon iconName="CheckCircle" fontSize="small" />
                    Easy to test in isolation
                  </li>
                  <li>
                    <ClientOnlyIcon iconName="CheckCircle" fontSize="small" />
                    Performance optimized with useCallback
                  </li>
                </ul>
              </InfoCard>
            </Card>
          </TwoColumnGrid>
        </Container>
      </ContentSection>
    </Layout>
  );
};

export default IndexPage;
