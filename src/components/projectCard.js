import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku, DiTravis } from 'react-icons/di';
import { useTheme } from '../context/ThemeContext';

const ProjectCard = (props) => {
  const { theme } = useTheme();

  return (
    <article
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 0.1fr 0.25fr auto;
        grid-column-gap: 0.75rem;
        border: 5px solid ${theme.colors.border};
        background-color: ${theme.colors.secondary};
        padding: 2rem 2rem 2rem 2rem;
        border-radius: 5px;
        color: ${theme.colors.text};
        transition: all ${theme.transitions.normal};
        [data-gatsby-image-wrapper] {
          margin-top: 0;
        }
        & [data-gatsby-image-wrapper]:nth-of-type(2) {
          @media (max-width: 768px) {
            margin-top: 1rem;
          }
        }
        @media (max-width: 768px) {
          display: inline-block;
        }
      `}
    >
      <GatsbyImage
        /* eslint-disable-next-line react/destructuring-assignment */
        image={getImage(props.imageSrcPath)}
        alt={`${props.title} - Screenshot 1`}
        loading="lazy"
        css={css`
          transition: opacity 0.3s ease-in-out;
          border-radius: 5px;
          border: 2px solid ${theme.colors.border};
        `}
      />
      <GatsbyImage
        /* eslint-disable-next-line react/destructuring-assignment */
        image={getImage(props.imageSrcPath2)}
        alt={`${props.title} - Screenshot 2`}
        loading="lazy"
        css={css`
          transition: opacity 0.3s ease-in-out;
          border-radius: 5px;
          border: 2px solid ${theme.colors.border};
        `}
      />
      <h3
        css={css`
          font-family: AvenirLTStd-Roman, sans-serif;
          font-size: 1.75rem;
          color: ${theme.colors.accentSecondary};
          grid-row: 2 / 3;
          grid-column: 1 / 3;
          justify-self: left;
          margin-top: 1rem;
          margin-bottom: 1rem;
        `}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.title}
        {` `}
        <small
          css={css`
            font-family: AvenirLTStd-Roman, sans-serif;
            color: ${theme.colors.accent};
            font-size: 1.25rem;
            @media (max-width: 768px) {
              display: inline-block;
            }
          `}
        >
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {props.date}
        </small>
      </h3>
      <p
        css={css`
          font-family: SabonLTStd-Roman, serif;
          font-size: 1.25rem;
          grid-row: 3 / 4;
          grid-column: 1 / 3;
          margin-bottom: 1rem;
        `}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.description}
      </p>
      <div
        css={css`
          grid-row: 4 / 5;
          grid-column: 1 / 3;
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          @media (max-width: 768px) {
            flex-direction: column;
            gap: 0.5rem;
          }
        `}
      >
        <a
          css={css`
            font-family: SabonLTStd-Roman, serif;
            font-weight: bold;
            font-size: 1.25rem;
            background-color: ${theme.colors.accentSecondary};
            border: 2px solid ${theme.colors.border};
            border-radius: 5px;
            color: ${theme.colors.textInverse};
            text-decoration: none;
            padding: 0.5rem 1rem;
            transition: all 0.2s ease-in-out;
            &:hover {
              box-shadow: ${theme.shadows.hover};
              transform: translateY(-2px);
            }
            &:focus {
              outline: 2px solid ${theme.colors.accentSecondary};
              outline-offset: 2px;
            }
            @media (max-width: 768px) {
              text-align: center;
            }
          `}
          target="_blank"
          rel="noopener noreferrer"
          /* eslint-disable-next-line react/destructuring-assignment */
          href={props.sourceURL}
          aria-label={`View source code for ${props.title}`}
        >
          Source Code
        </a>
        <a
          css={css`
            font-family: SabonLTStd-Roman, serif;
            font-weight: bold;
            font-size: 1.25rem;
            background-color: ${theme.colors.accentSecondary};
            border: 2px solid ${theme.colors.border};
            border-radius: 5px;
            color: ${theme.colors.textInverse};
            text-decoration: none;
            padding: 0.5rem 1rem;
            transition: all 0.2s ease-in-out;
            &:hover {
              box-shadow: ${theme.shadows.hover};
              transform: translateY(-2px);
            }
            &:focus {
              outline: 2px solid ${theme.colors.accentSecondary};
              outline-offset: 2px;
            }
            @media (max-width: 768px) {
              text-align: center;
            }
          `}
          target="_blank"
          rel="noopener noreferrer"
          /* eslint-disable-next-line react/destructuring-assignment */
          href={props.hostedURL}
          aria-label={`View live demo of ${props.title}`}
        >
          Live Demo
        </a>
      </div>
      <footer>
        <h4 className="sr-only">Technologies Used</h4>
        <div
          css={css`
            grid-column: 1 / 3;
            grid-row: 5 / 6;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            align-items: center;
            justify-content: flex-end;
            margin-top: 1rem;
            @media (max-width: 768px) {
              justify-content: center;
            }
          `}
          role="list"
          aria-label="Technologies used in this project"
        >
          <img
            css={css`
              width: 45px;
              height: 45px;
            `}
            /* eslint-disable-next-line react/destructuring-assignment */
            src={props.imageSrcPath3}
            alt={`Technology icon`}
            role="listitem"
          />
          <img
            css={css`
              width: 45px;
              height: 45px;
            `}
            /* eslint-disable-next-line react/destructuring-assignment */
            src={props.imageSrcPath4}
            alt={`Technology icon`}
            role="listitem"
          />
          <img
            css={css`
              width: 45px;
              height: 45px;
            `}
            /* eslint-disable-next-line react/destructuring-assignment */
            src={props.imageSrcPath5}
            alt={`Technology icon`}
            role="listitem"
          />
          <FaReact
            css={css`
              color: ${theme.colors.accent};
              font-size: 2.5rem;
            `}
            aria-label="React framework"
            role="listitem"
          />
          <FaGit
            css={css`
              color: ${theme.colors.accent};
              font-size: 2.5rem;
            `}
            aria-label="Git version control"
            role="listitem"
          />
          <DiHeroku
            css={css`
              color: ${theme.colors.accent};
              font-size: 2.5rem;
            `}
            aria-label="Heroku deployment platform"
            role="listitem"
          />
          <DiTravis
            css={css`
              color: ${theme.colors.accent};
              font-size: 2.5rem;
            `}
            aria-label="Travis CI"
            role="listitem"
          />
        </div>
      </footer>
    </article>
  );
};

ProjectCard.propTypes = {
  /* eslint-disable-next-line react/forbid-prop-types */
  imageSrcPath: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  imageSrcPath2: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sourceURL: PropTypes.string.isRequired,
  hostedURL: PropTypes.string.isRequired,
  imageSrcPath3: PropTypes.string.isRequired,
  imageSrcPath4: PropTypes.string.isRequired,
  imageSrcPath5: PropTypes.string.isRequired,
};

export default ProjectCard;
