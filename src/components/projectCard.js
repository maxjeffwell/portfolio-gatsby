import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import Img from 'gatsby-image';

import { FaReact, FaGit } from 'react-icons/fa';
import { DiHeroku, DiTravis } from 'react-icons/di';

const ProjectCard = props => {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 0.1fr 0.25fr auto;
        grid-column-gap: 0.75rem;
        border: 5px solid #121619;
        background-color: #2d3047;
        padding: 2rem 2rem 2rem 2rem;
        border-radius: 5px;
        color: #ffffff;
        & div > img:first-of-type {
          border-radius: 5px;
          border: 2px solid #363636;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }
        & div > img:nth-of-type(2) {
          border-radius: 5px;
          border: 2px solid #363636;
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        }
        .gatsby-image-wrapper {
          margin-top: 0;
        }
        & .gatsby-image-wrapper:nth-of-type(2) {
          @media (max-width: 768px) {
            margin-top: 1rem;
          }
        }
        @media (max-width: 768px) {
          display: inline-block;
        }
      `}
    >
      <Img
        /* eslint-disable-next-line react/destructuring-assignment */
        fluid={props.imageSrcPath}
        title="project screenshot"
        alt="first project screenshot"
      />
      <Img
        /* eslint-disable-next-line react/destructuring-assignment */
        fluid={props.imageSrcPath2}
        title="project screenshot 2"
        alt="second project screenshot"
      />
      <h3
        css={css`
          font-family: AvenirLTStd-Roman, sans-serif;
          font-size: 1.75rem;
          color: #f7b733;
          grid-row: 2 / 3;
          grid-column: 1 / 3;
          justify-self: left;
        `}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.title}
        {` `}
        <small
          css={css`
            font-family: AvenirLTStd-Roman, sans-serif;
            color: #fc4a1a;
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
        `}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.description}
      </p>
      <a
        css={css`
          grid-row: 4 / 5;
          justify-self: self-end;
          font-family: SabonLTStd-Roman, serif;
          font-weight: bold;
          font-size: 1.25rem;
          background-color: #f7b733;
          border: 2px solid #363636;
          border-radius: 5px;
          color: #393939;
          cursor: pointer;
          text-decoration: none;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: 0.25rem;
          &:hover {
            box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.25), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
          }
          @media (max-width: 768px) {
            display: inline-block;
            text-align: center;
          }
        `}
        target="_blank"
        rel="noopener noreferrer"
        type="button"
        text="Source Code"
        /* eslint-disable-next-line react/destructuring-assignment */
        href={props.sourceURL}
      >
        Source Code
      </a>
      {` `}
      <a
        css={css`
          grid-row: 4 / 5;
          justify-self: self-start;
          font-family: SabonLTStd-Roman, serif;
          font-weight: bold;
          font-size: 1.25rem;
          background-color: #f7b733;
          border: 2px solid #363636;
          border-radius: 5px;
          color: #393939;
          cursor: pointer;
          text-decoration: none;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: 0.25rem;
          &:hover {
            box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.25), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
          }
          @media (max-width: 768px) {
            display: inline-block;
            text-align: center;
          }
        `}
        target="_blank"
        rel="noopener noreferrer"
        type="button"
        text="Live App"
        /* eslint-disable-next-line react/destructuring-assignment */
        href={props.hostedURL}
      >
        Live App
      </a>
      <div
        css={css`
          grid-column: 1 / 3;
          grid-row: 5 / 6;
          font-size: 2.5rem;
          justify-self: right;
          justify-content: space-between;
        `}
      >
        <img
          css={css`
            width: 45px;
            height: 45px;
          `}
          /* eslint-disable-next-line react/destructuring-assignment */
          src={props.imageSrcPath3}
          alt="icon"
        />
        {` `}
        <img
          css={css`
            width: 45px;
            height: 45px;
          `}
          /* eslint-disable-next-line react/destructuring-assignment */
          src={props.imageSrcPath4}
          alt="icon"
        />
        {` `}
        <img
          css={css`
            width: 45px;
            height: 45px;
          `}
          /* eslint-disable-next-line react/destructuring-assignment */
          src={props.imageSrcPath5}
          alt="icon"
        />
        {` `}
        <FaReact
          css={css`
            color: #fc4a1a;
          `}
          title="React"
        />
        {` `}
        <FaGit
          css={css`
            color: #fc4a1a;
          `}
          title="Github"
        />
        {` `}
        <DiHeroku
          css={css`
            color: #fc4a1a;
          `}
          title="Heroku"
        />
        <DiTravis
          css={css`
            color: #fc4a1a;
          `}
          title="Travis"
        />
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  /* eslint-disable-next-line react/forbid-prop-types */
  imageSrcPath: PropTypes.object.isRequired,
  /* eslint-disable-next-line react/forbid-prop-types */
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
