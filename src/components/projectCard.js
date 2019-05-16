import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

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
        &:nth-of-type(3) {
          img:nth-of-type(2) {
            align-self: center;
          }
        }
      `}
    >
      {/* eslint-disable-next-line react/destructuring-assignment */}
      <img
        css={css`
          border-radius: 5px;
          border: 2px solid #363636;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        `}
        /* eslint-disable-next-line react/destructuring-assignment */
        src={props.imageSrcPath}
        alt="Project"
      />
      <img
        css={css`
          border-radius: 5px;
          border: 2px solid #363636;
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        `}
        /* eslint-disable-next-line react/destructuring-assignment */
        src={props.imageSrcPath2}
        alt="Project"
      />
      <h3
        css={css`
          font-family: AvenirLTStd-Roman, sans-serif;
          font-size: 1.5rem;
          color: #f7b733;
          grid-row: 2 / 3;
          grid-column: 1 / 3;
        `}
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.title}
        {` `}
        <small
          css={css`
            font-family: AvenirLTStd-Roman, sans-serif;
            color: #fc4a1a;
            font-size: 1rem;
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
          align-self: self-end;
          justify-self: self-end;
          font-family: SabonLTStd-Roman, serif;
          font-weight: bold;
          font-size: 1.25rem;
          background-color: #f7b733;
          height: fit-content;
          width: fit-content;
          border: 2px solid #363636;
          border-radius: 5px;
          color: #393939;
          cursor: pointer;
          text-decoration: none;
          padding-left: 1rem;
          padding-right: 1rem;
          &:hover {
            box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.25), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
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
          align-self: self-start;
          justify-self: self-start;
          font-family: SabonLTStd-Roman, serif;
          font-weight: bold;
          font-size: 1.25rem;
          background-color: #f7b733;
          height: fit-content;
          width: fit-content;
          border: 2px solid #363636;
          border-radius: 5px;
          color: #393939;
          cursor: pointer;
          text-decoration: none;
          padding-left: 1rem;
          padding-right: 1rem;
          &:hover {
            box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.25), 0 17px 50px 0 rgba(0, 0, 0, 0.19);
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
          font-size: 2rem;
          align-self: center;
          justify-self: center;
          justify-content: space-between;
        `}
      >
        <img
          css={css`
            width: 31px;
            height: 32px;
          `}
          /* eslint-disable-next-line react/destructuring-assignment */
          src={props.imageSrcPath3}
          alt="icon"
        />
        {` `}
        <img
          css={css`
            width: 31px;
            height: 32px;
          `}
          /* eslint-disable-next-line react/destructuring-assignment */
          src={props.imageSrcPath4}
          alt="icon"
        />
        {` `}
        <img
          css={css`
            width: 31px;
            height: 32px;
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
        />
        {` `}
        <FaGit
          css={css`
            color: #fc4a1a;
          `}
        />
        {` `}
        <DiHeroku
          css={css`
            color: #fc4a1a;
          `}
        />
        <DiTravis
          css={css`
            color: #fc4a1a;
          `}
        />
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  imageSrcPath: PropTypes.string.isRequired,
  imageSrcPath2: PropTypes.string.isRequired,
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
