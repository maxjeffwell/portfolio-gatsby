import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BlogCard from '../components/blogCard';
import PageTransition from '../components/PageTransition';
import SocialShare from '../components/SocialShare';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  line-height: 1.2;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  .dark-mode & {
    background: linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%);
    background-clip: text;
    -webkit-background-clip: text;
  }
`;

const PageDescription = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary-color);
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  line-height: 1.6;

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
  color: var(--text-secondary-color);
`;

function BlogPage({ data }) {
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="K8s Cluster Journal"
          description="Documenting my Kubernetes homelab journey - cluster setup, GitOps, GPU workloads, and self-hosted AI."
          pathname="/blog/"
          keywords={['kubernetes', 'homelab', 'k8s', 'gitops', 'self-hosted', 'devops']}
        />
        <PageContainer>
          <PageTitle>K8s Cluster Journal</PageTitle>
          <PageDescription>
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
            <EmptyState>
              <p>No posts yet. Check back soon!</p>
            </EmptyState>
          )}

          <SocialShare
            url={
              typeof window !== 'undefined' && window.location
                ? window.location.href
                : 'https://el-jefe.me/blog/'
            }
            title="K8s Cluster Journal - Jeff Maxwell"
            description="Documenting my Kubernetes homelab journey - cluster setup, GitOps, GPU workloads, and self-hosted AI."
          />
        </PageContainer>
      </PageTransition>
    </Layout>
  );
}

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
