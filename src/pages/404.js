import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background-color: #fc4a1a;
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e03e16;
  }
`;

function NotFoundPage() {
  return (
    <Layout>
      <SEO title="404: Not found" />
      <Container>
        <ErrorContainer>
          <Title>404: Page Not Found</Title>
          <Description>
            This route doesn&apos;t exist. Head back to the home page to start over.
          </Description>
          <HomeButton to="/">Go Home</HomeButton>
        </ErrorContainer>
      </Container>
    </Layout>
  );
}

export default NotFoundPage;
