import React from 'react';
import PropTypes from 'prop-types';

const ProjectCard = props => {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      <img src={props.imageSrcPath} alt="Project" />
      <h4>
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.title}
        {/* eslint-disable-next-line react/destructuring-assignment */}
        <small>{props.date}</small>
      </h4>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      <p>{props.description}</p>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      <button type="button" text="Source Code" URL={props.sourceURL} />
      {/* eslint-disable-next-line react/button-has-type,react/destructuring-assignment */}
      <button type="button" text="Hosted App" URL={props.hostedURL} />
    </div>
  );
};

ProjectCard.propTypes = {
  imageSrcPath: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sourceURL: PropTypes.string.isRequired,
  hostedURL: PropTypes.string.isRequired,
};

export default ProjectCard;
