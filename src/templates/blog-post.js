import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/layout';
import Seo from '../components/seo';
import { useTheme } from '../context/ThemeContext';

const ArticleContainer = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => props.theme?.colors?.primary || '#1976d2'};
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
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)'};
  line-height: 1.2;
  transition: color 0.3s ease;

  @media (max-width: 600px) {
    font-size: 1.875rem;
  }
`;

const ArticleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
  font-size: 0.95rem;
  transition: color 0.3s ease;
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
  background-color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(144, 202, 249, 0.15)' : 'rgba(25, 118, 210, 0.1)'};
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ArticleContent = styled.div`
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.8)'};
  font-size: 1.125rem;
  line-height: 1.8;
  transition: color 0.3s ease;

  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-top: 48px;
    margin-bottom: 16px;
    color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.87)'};
  }

  h3 {
    font-size: 1.375rem;
    font-weight: 600;
    margin-top: 32px;
    margin-bottom: 12px;
    color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'};
  }

  p {
    margin-bottom: 24px;
  }

  a {
    color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
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
    background-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
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
    border-left: 4px solid ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    background-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
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
  border-top: 1px solid
    ${(props) => (props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};

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
  background-color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
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
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  margin-bottom: 4px;
  transition: color 0.3s ease;
`;

const NavTitle = styled.span`
  display: block;
  font-weight: 500;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  transition: color 0.3s ease;
`;

function BlogPostTemplate({ data }) {
  const { theme } = useTheme();
  const post = data.markdownRemark;
  const { previous, next } = data;

  // Gatsby's transformer-remark generates trusted HTML from local markdown files
  // This is the standard pattern for Gatsby blogs - content is build-time, not user-input
  const trustedHtml = post.html;

  return (
    <Layout>
      <ArticleContainer>
        <BackLink to="/blog/" theme={theme}>
          Back to all posts
        </BackLink>

        <ArticleHeader>
          <ArticleTitle theme={theme}>{post.frontmatter.title}</ArticleTitle>
          <ArticleMeta theme={theme}>
            <time dateTime={post.frontmatter.rawDate}>{post.frontmatter.date}</time>
            <span>&bull;</span>
            <span>{post.timeToRead} min read</span>
          </ArticleMeta>
          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
            <TagsContainer>
              {post.frontmatter.tags.map((tag) => (
                <Tag key={tag} theme={theme}>
                  {tag}
                </Tag>
              ))}
            </TagsContainer>
          )}
        </ArticleHeader>

        <ArticleContent
          theme={theme}
          // Content is generated at build-time from trusted local markdown files
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: trustedHtml }}
        />

        <PostNavigation theme={theme}>
          {previous && (
            <NavLink to={`/blog${previous.fields.slug}`} theme={theme} data-direction="previous">
              <NavLabel theme={theme}>Previous</NavLabel>
              <NavTitle theme={theme}>{previous.frontmatter.title}</NavTitle>
            </NavLink>
          )}
          {!previous && <div />}
          {next && (
            <NavLink to={`/blog${next.fields.slug}`} theme={theme} data-direction="next">
              <NavLabel theme={theme}>Next</NavLabel>
              <NavTitle theme={theme}>{next.frontmatter.title}</NavTitle>
            </NavLink>
          )}
        </PostNavigation>
      </ArticleContainer>
    </Layout>
  );
}

export const Head = ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Seo
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
  );
};

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
