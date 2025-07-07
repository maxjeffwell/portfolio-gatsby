import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku, DiTravis } from 'react-icons/di';
import { useTheme } from '../context/ThemeContext';

const ProjectCard = ({
  imageSrcPath,
  imageSrcPath2,
  imageSrcPath3,
  imageSrcPath4,
  imageSrcPath5,
  title,
  date,
  description,
  sourceURL,
  hostedURL,
}) => {
  const { theme } = useTheme();

  return (
    <article
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr auto auto auto;
        grid-column-gap: 1.5rem;
        grid-row-gap: 1.5rem;
        background: ${theme.gradients.secondary};
        padding: 2.5rem;
        border-radius: 20px;
        color: ${theme.colors.text};
        transition: all ${theme.transitions.normal};
        position: relative;
        overflow: hidden;
        box-shadow: ${theme.shadows.medium};

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${theme.gradients.accent};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform ${theme.transitions.normal};
        }

        &::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(252, 74, 26, 0.03) 0%, transparent 70%);
          opacity: 0;
          transition: opacity ${theme.transitions.slow};
          pointer-events: none;
        }

        &:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: ${theme.shadows.hover};

          &::before {
            transform: scaleX(1);
          }

          &::after {
            opacity: 1;
          }
        }

        [data-gatsby-image-wrapper] {
          margin-top: 0;
          border-radius: 12px;
          overflow: hidden;
          transition: transform ${theme.transitions.normal};

          &:hover {
            transform: scale(1.05);
          }
        }

        & [data-gatsby-image-wrapper]:nth-of-type(2) {
          @media (max-width: 768px) {
            margin-top: 1rem;
          }
        }

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
          grid-row-gap: 1rem;
          padding: 2rem;
        }
      `}
    >
      <GatsbyImage
        image={getImage(imageSrcPath)}
        alt={`${title} - Screenshot 1`}
        loading="lazy"
        css={css`
          transition: opacity 0.3s ease-in-out;
          border-radius: 5px;
          border: 2px solid ${theme.colors.border};
        `}
      />
      <GatsbyImage
        image={getImage(imageSrcPath2)}
        alt={`${title} - Screenshot 2`}
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
        {title}
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
          {date}
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
        {description}
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
            position: relative;
            display: inline-block;
            font-family: SabonLTStd-Roman, serif;
            font-weight: bold;
            font-size: 1.125rem;
            background: ${theme.gradients.accent};
            border: none;
            border-radius: 25px;
            color: ${theme.colors.textInverse};
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            transition: all ${theme.transitions.normal};
            overflow: hidden;
            box-shadow: ${theme.shadows.small};

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
              );
              transition: left ${theme.transitions.slow};
            }

            &:hover {
              transform: translateY(-3px) scale(1.05);
              box-shadow: ${theme.shadows.hover};

              &::before {
                left: 100%;
              }
            }

            &:focus {
              outline: 2px solid ${theme.colors.accentSecondary};
              outline-offset: 3px;
              transform: translateY(-2px);
            }

            &:active {
              transform: translateY(0) scale(0.98);
            }

            @media (max-width: 768px) {
              text-align: center;
              width: 100%;
            }
          `}
          target="_blank"
          rel="noopener noreferrer"
          href={sourceURL}
          aria-label={`View source code for ${title}`}
        >
          Source Code
        </a>
        <a
          css={css`
            position: relative;
            display: inline-block;
            font-family: SabonLTStd-Roman, serif;
            font-weight: bold;
            font-size: 1.125rem;
            background: transparent;
            border: 2px solid ${theme.colors.accentSecondary};
            border-radius: 25px;
            color: ${theme.colors.accentSecondary};
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            transition: all ${theme.transitions.normal};
            overflow: hidden;

            &::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 0;
              height: 100%;
              background: ${theme.gradients.accent};
              transition: width ${theme.transitions.normal};
              z-index: -1;
            }

            &:hover {
              color: ${theme.colors.textInverse};
              transform: translateY(-3px) scale(1.05);
              box-shadow: ${theme.shadows.medium};

              &::before {
                width: 100%;
              }
            }

            &:focus {
              outline: 2px solid ${theme.colors.accentSecondary};
              outline-offset: 3px;
              transform: translateY(-2px);
            }

            &:active {
              transform: translateY(0) scale(0.98);
            }

            @media (max-width: 768px) {
              text-align: center;
              width: 100%;
            }
          `}
          target="_blank"
          rel="noopener noreferrer"
          href={hostedURL}
          aria-label={`View live demo of ${title}`}
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
          <LazyImage
            src={imageSrcPath3}
            alt="Technology icon"
            width="45px"
            height="45px"
            objectFit="contain"
            radius="4px"
            block={false}
            fadeDelay="100ms"
            css={css`
              flex-shrink: 0;
            `}
            role="listitem"
          />
          <LazyImage
            src={imageSrcPath4}
            alt="Technology icon"
            width="45px"
            height="45px"
            objectFit="contain"
            radius="4px"
            block={false}
            fadeDelay="200ms"
            css={css`
              flex-shrink: 0;
            `}
            role="listitem"
          />
          <LazyImage
            src={imageSrcPath5}
            alt="Technology icon"
            width="45px"
            height="45px"
            objectFit="contain"
            radius="4px"
            block={false}
            fadeDelay="300ms"
            css={css`
              flex-shrink: 0;
            `}
            role="listitem"
          />
          {typeof window !== 'undefined' && (
            <FaReact
              css={css`
                color: ${theme.colors.accent};
                font-size: 2.5rem;
              `}
              aria-label="React framework"
              role="listitem"
            />
          )}
          {typeof window !== 'undefined' && (
            <FaGit
              css={css`
                color: ${theme.colors.accent};
                font-size: 2.5rem;
              `}
              aria-label="Git version control"
              role="listitem"
            />
          )}
          {typeof window !== 'undefined' && (
            <DiHeroku
              css={css`
                color: ${theme.colors.accent};
                font-size: 2.5rem;
              `}
              aria-label="Heroku deployment platform"
              role="listitem"
            />
          )}
          {typeof window !== 'undefined' && (
            <DiTravis
              css={css`
                color: ${theme.colors.accent};
                font-size: 2.5rem;
              `}
              aria-label="Travis CI"
              role="listitem"
            />
          )}
        </div>
      </footer>
    </article>
  );
};

ProjectCard.propTypes = {
  imageSrcPath: PropTypes.object.isRequired,
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
