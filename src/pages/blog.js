import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/layout';
import Seo from '../components/seo';
import BlogCard from '../components/blogCard';
import { useTheme } from '../context/ThemeContext';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%)'
      : 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.3s ease;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const PageDescription = styled.p`
  font-size: 1.25rem;
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  line-height: 1.6;
  transition: color 0.3s ease;

  @media (max-width: 600px) {
    font-size: 1.1rem;
    margin-bottom: 24px;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(350px, 100%), 1fr));
  gap: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
  transition: color 0.3s ease;
`;

function BlogPage({ data }) {
  const { theme } = useTheme();
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <PageContainer>
        <PageTitle theme={theme}>K8s Cluster Journal</PageTitle>
        <PageDescription theme={theme}>
          Documenting my Kubernetes homelab journey - from initial cluster setup to running
          production workloads with GPUs, GitOps, and self-hosted AI.
        </PageDescription>

        {posts.length > 0 ? (
          <PostsGrid>
            {posts.map((post) => (
              <BlogCard
                key={post.fields.slug}
                title={post.frontmatter.title}
                date={post.frontmatter.date}
                excerpt={post.frontmatter.excerpt || post.excerpt}
                tags={post.frontmatter.tags || []}
                slug={post.fields.slug}
              />
            ))}
          </PostsGrid>
        ) : (
          <EmptyState theme={theme}>
            <p>No posts yet. Check back soon!</p>
          </EmptyState>
        )}
      </PageContainer>
    </Layout>
  );
}

export const Head = () => (
  <Seo
    title="K8s Cluster Journal"
    description="Documenting my Kubernetes homelab journey - cluster setup, GitOps, GPU workloads, and self-hosted AI."
    pathname="/blog/"
    keywords={['kubernetes', 'homelab', 'k8s', 'gitops', 'self-hosted', 'devops']}
  />
);

export const query = graphql`
  query BlogListQuery {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt(pruneLength: 160)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          excerpt
          tags
        }
      }
    }
  }
`;

export default BlogPage;
