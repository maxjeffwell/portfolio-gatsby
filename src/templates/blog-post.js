import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/layout';
import SEO from '../components/seo';
// Prism syntax highlighting theme - only needed on blog post pages
import 'prismjs/themes/prism-tomorrow.css';

const ArticleContainer = styled.article`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (min-width: 1200px) {
    max-width: 1000px;
  }

  @media (min-width: 1400px) {
    max-width: 1100px;
  }

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 32px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &::before {
    content: '\u2190';
  }
`;

const ArticleHeader = styled.header`
  margin-bottom: 40px;
`;

const ArticleTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-color);
  line-height: 1.2;

  @media (max-width: 600px) {
    font-size: 1.875rem;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  color: var(--text-muted-color);
  font-size: 0.95rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: var(--primary-subtle-bg);
  color: var(--primary-color);
`;

const ArticleContent = styled.div`
  color: var(--text-color);
  font-size: 1.125rem;
  line-height: 1.8;

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-top: 48px;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  h3 {
    font-size: 1.375rem;
    font-weight: 600;
    margin-top: 32px;
    margin-bottom: 12px;
    color: var(--text-color);
  }

  p {
    margin-bottom: 24px;
  }

  a {
    color: var(--primary-color);
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      opacity: 0.8;
    }
  }

  ul,
  ol {
    margin-bottom: 24px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
  }

  code {
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.9em;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: var(--tag-bg);
  }

  pre {
    margin: 24px 0;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.9rem;
    line-height: 1.6;

    code {
      padding: 0;
      background: transparent;
    }
  }

  blockquote {
    margin: 24px 0;
    padding: 16px 24px;
    border-left: 4px solid var(--primary-color);
    background-color: var(--secondary-nav-bg);
    font-style: italic;

    p:last-child {
      margin-bottom: 0;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 24px 0;
  }

  @media (max-width: 600px) {
    font-size: 1rem;

    h2 {
      font-size: 1.5rem;
      margin-top: 32px;
    }

    h3 {
      font-size: 1.25rem;
      margin-top: 24px;
    }

    pre {
      padding: 16px;
      font-size: 0.85rem;
      margin-left: -16px;
      margin-right: -16px;
      border-radius: 0;
    }
  }
`;

const PostNavigation = styled.nav`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 60px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const NavLink = styled(Link)`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  text-decoration: none;
  background-color: var(--secondary-nav-bg);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--hover-bg);
  }

  &[data-direction='next'] {
    text-align: right;
  }
`;

const NavLabel = styled.span`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted-color);
  margin-bottom: 4px;
`;

const NavTitle = styled.span`
  display: block;
  font-weight: 500;
  color: var(--primary-color);
`;

function BlogPostTemplate({ data }) {
  const post = data.markdownRemark;
  const { previous, next } = data;

  // Gatsby's transformer-remark generates trusted HTML from local markdown files
  // This is the standard pattern for Gatsby blogs - content is build-time, not user-input
  const trustedHtml = post.html;

  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.excerpt || post.excerpt}
        pathname={`/blog${post.fields.slug}`}
        keywords={post.frontmatter.tags || []}
        article={{
          publishedTime: post.frontmatter.rawDate,
          modifiedTime: post.frontmatter.rawDate,
          tags: post.frontmatter.tags || [],
        }}
      />
      <ArticleContainer>
        <BackLink to="/blog/">Back to all posts</BackLink>

        <ArticleHeader>
          <ArticleTitle>{post.frontmatter.title}</ArticleTitle>
          <ArticleMeta>
            <time dateTime={post.frontmatter.rawDate}>{post.frontmatter.date}</time>
            <span>&bull;</span>
            <span>{post.timeToRead} min read</span>
          </ArticleMeta>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <TagsContainer>
              {post.frontmatter.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          )}
        </ArticleHeader>

        <ArticleContent
          // Content is generated at build-time from trusted local markdown files
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: trustedHtml }}
        />

        <PostNavigation>
          {previous && (
            <NavLink to={`/blog${previous.fields.slug}`} data-direction="previous">
              <NavLabel>Previous</NavLabel>
              <NavTitle>{previous.frontmatter.title}</NavTitle>
            </NavLink>
          )}
          {!previous && <div />}
          {next && (
            <NavLink to={`/blog${next.fields.slug}`} data-direction="next">
              <NavLabel>Next</NavLabel>
              <NavTitle>{next.frontmatter.title}</NavTitle>
            </NavLink>
          )}
        </PostNavigation>
      </ArticleContainer>
    </Layout>
  );
}

export const query = graphql`
  query BlogPostBySlug($id: String!, $previousPostId: String, $nextPostId: String) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 160)
      timeToRead
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        rawDate: date
        excerpt
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;

export default BlogPostTemplate;
