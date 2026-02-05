import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const StyledCard = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s ease;
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(45, 45, 45, 0.9) 100%)'
      : 'white'};
  box-shadow:
    0 3px 3px -2px rgba(0, 0, 0, 0.2),
    0 3px 4px 0 rgba(0, 0, 0, 0.14),
    0 1px 8px 0 rgba(0, 0, 0, 0.12);

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }

  &:focus {
    outline: 2px solid ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    outline-offset: 2px;
  }
`;

const ColoredBar = styled.div`
  height: 4px;
  background: linear-gradient(90deg, #26c6da, #00acc1, #00838f);
`;

const CardContent = styled.div`
  flex-grow: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  line-height: 1.3;
  transition: color 0.3s ease;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const CardDate = styled.time`
  font-size: 0.875rem;
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)'};
  margin-bottom: 16px;
  transition: color 0.3s ease;
`;

const CardExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  margin-bottom: 16px;
  flex-grow: 1;
  transition: color 0.3s ease;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  color: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

function BlogCard({ title, date, excerpt, tags, slug }) {
  const { theme } = useTheme();

  return (
    <StyledCard to={`/blog${slug}`} theme={theme}>
      <ColoredBar />
      <CardContent>
        <CardTitle theme={theme}>{title}</CardTitle>
        <CardDate theme={theme}>{date}</CardDate>
        <CardExcerpt theme={theme}>{excerpt}</CardExcerpt>
        {tags && tags.length > 0 && (
          <TagsContainer>
            {tags.map((tag) => (
              <Tag key={tag} theme={theme}>
                {tag}
              </Tag>
            ))}
          </TagsContainer>
        )}
      </CardContent>
    </StyledCard>
  );
}

BlogCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  slug: PropTypes.string.isRequired,
};

BlogCard.defaultProps = {
  tags: [],
};

export default BlogCard;
