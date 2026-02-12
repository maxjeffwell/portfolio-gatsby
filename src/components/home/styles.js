import styled from 'styled-components';
import { Link } from 'gatsby';

// CSS variable references for hero section (used in HeroSection.js styled components)
// Background: use .dark-mode & selector; Title color: use var(--text-color)

// Layout Components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
  }
`;

export const ContentSection = styled.section`
  padding: 80px 0;

  @media (max-width: 600px) {
    padding: 60px 0;
  }
`;

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
  gap: 48px;
  align-items: start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

// Card Components
export const Card = styled.div`
  background: var(--paper-color);
  color: var(--text-color);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 28px;
  }

  @media (max-width: 600px) {
    padding: 24px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    border-radius: 12px;
  }

  @media (max-width: 360px) {
    padding: 16px 12px;
    border-radius: 8px;
  }
`;

export const CardTitle = styled.h2`
  font-size: clamp(1.375rem, 4vw, 1.875rem);
  font-weight: 700;
  margin: 0 0 clamp(16px, 4vw, 24px) 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.3;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const CardText = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-secondary-color);
  margin: 0 0 24px 0;
`;

export const CardLink = styled(Link)`
  color: #e91e63;
  text-transform: none;
  font-size: clamp(1.25rem, 4vw, 1.375rem);
  font-weight: 500;
  padding: 8px 16px;
  display: inline-block;
  text-decoration: none;

  &:hover {
    color: #ad1457;
  }
`;

// Quote and Info Components
export const QuoteBox = styled.div`
  margin: 20px 0;
  padding: 16px 20px;
  background: rgba(25, 118, 210, 0.05);
  border-left: 4px solid var(--primary-color);
  border-radius: 4px;
  font-size: 1.375rem;
  line-height: 1.6;
  color: var(--text-secondary-color);

  .dark-mode & {
    background: rgba(144, 202, 249, 0.1);
  }
`;

export const InfoCard = styled.div`
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-radius: 12px;

  .dark-mode & {
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.15) 0%, rgba(233, 30, 99, 0.1) 100%);
  }
  padding: 32px;
  margin-top: 24px;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;

  h3 {
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    font-weight: 600;
    color: var(--accent-pink);
    margin: 0 0 16px 0;
      line-height: 1.3;
    word-wrap: break-word;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
      color: var(--text-color);
          font-size: clamp(0.9rem, 2.5vw, 1rem);
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: break-word;

      svg {
        color: var(--accent-pink);
        flex-shrink: 0;
              margin-top: 2px;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 20px;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
  }

  @media (max-width: 360px) {
    padding: 14px;
    border-radius: 6px;
  }
`;

export const InfoText = styled.p`
  margin-top: 16px;
  font-size: 1.0625rem;
  line-height: 1.5;
`;

// Gradient Text Wrapper
export const GradientTypingWrapper = styled.span`
  font-weight: inherit;
  background: linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: var(--primary-color);

  .dark-mode & {
    background: linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%);
    background-clip: text;
    -webkit-background-clip: text;
  }
  display: inline-block;

  /* Only make text transparent when browser supports background-clip */
  @supports (background-clip: text) or (-webkit-background-clip: text) {
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
`;
