import React from 'react';
import SocialShare from '../SocialShare';
import { Container, ContentSection } from './styles';

const SocialShareSection = () => {
  const url =
    typeof window !== 'undefined' && window.location ? window.location.href : 'https://el-jefe.me';

  return (
    <ContentSection as="section" aria-labelledby="social-share" id="share">
      <Container>
        <SocialShare
          url={url}
          title="Jeff Maxwell - Full Stack React & Node.js Developer"
          description="Experienced full stack developer specializing in React, Node.js, and modern web technologies. View my portfolio and get in touch!"
        />
      </Container>
    </ContentSection>
  );
};

export default SocialShareSection;
