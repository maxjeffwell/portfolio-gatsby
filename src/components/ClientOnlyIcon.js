import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import {
  MdLightbulb,
  MdArrowBack,
  MdLanguage,
} from 'react-icons/md';
import { FaGlobe } from 'react-icons/fa';

// GraphQL query for SVG icons
const GET_SVG_ICONS = graphql`
  query {
    github: file(relativePath: { eq: "svg-icons/github.svg" }) {
      publicURL
    }
    wellfound: file(relativePath: { eq: "svg-icons/wellfound.svg" }) {
      publicURL
    }
    phone: file(relativePath: { eq: "svg-icons/phone.svg" }) {
      publicURL
    }
    gatsby: file(relativePath: { eq: "svg-icons/gatsby-logo.svg" }) {
      publicURL
    }
    arrowForward: file(relativePath: { eq: "svg-icons/arrow_forward.svg" }) {
      publicURL
    }
    computer: file(relativePath: { eq: "svg-icons/computer.svg" }) {
      publicURL
    }
    checkCircle: file(relativePath: { eq: "svg-icons/check_circle.svg" }) {
      publicURL
    }
    paws: file(relativePath: { eq: "svg-icons/paws.svg" }) {
      publicURL
    }
    codeTerminal: file(relativePath: { eq: "svg-icons/code-terminal.svg" }) {
      publicURL
    }
    coffee: file(relativePath: { eq: "svg-icons/coffee.svg" }) {
      publicURL
    }
    dog: file(relativePath: { eq: "svg-icons/dog.svg" }) {
      publicURL
    }
  }
`;

// Styled wrapper for SVG icons to ensure proper sizing
const StyledSvgIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size};
  height: ${(props) => props.size};

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

// SVG component that fetches and renders SVG content
const SvgIcon = ({ url, size, style, ...props }) => {
  const [svgContent, setSvgContent] = React.useState('');

  React.useEffect(() => {
    if (url && typeof window !== 'undefined') {
      fetch(url)
        .then((response) => response.text())
        .then((content) => setSvgContent(content))
        .catch((err) => console.warn('Failed to load SVG:', err));
    }
  }, [url]);

  return (
    <StyledSvgIcon
      size={size}
      style={style}
      {...props}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

const ClientOnlyIcon = ({ iconName, fontSize = 'medium', style = {}, ...props }) => {
  // Get SVG URLs from GraphQL
  const data = useStaticQuery(GET_SVG_ICONS);

  // Map fontSize to actual sizes
  const sizeMap = {
    small: '16px',
    medium: '20px',
    large: '24px',
    inherit: 'inherit',
  };

  const size = sizeMap[fontSize] || fontSize;

  // Handle custom SVG icons using GraphQL URLs
  if (iconName === 'GitHub') {
    return <SvgIcon url={data.github?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'wellfound') {
    return <SvgIcon url={data.wellfound?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Phone') {
    return <SvgIcon url={data.phone?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Gatsby') {
    return <SvgIcon url={data.gatsby?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'ArrowForward') {
    return <SvgIcon url={data.arrowForward?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Computer') {
    return <SvgIcon url={data.computer?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'CheckCircle') {
    return <SvgIcon url={data.checkCircle?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Paws') {
    return <SvgIcon url={data.paws?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'CodeTerminal') {
    return <SvgIcon url={data.codeTerminal?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Coffee') {
    return <SvgIcon url={data.coffee?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Dog') {
    return <SvgIcon url={data.dog?.publicURL} size={size} style={style} {...props} />;
  }

  // Handle remaining react-icons (keeping only what's needed)
  const iconMap = {
    Language: MdLanguage,
    LightbulbOutlined: MdLightbulb,
    ArrowBack: MdArrowBack,
    default: FaGlobe,
  };

  const IconComponent = iconMap[iconName] || iconMap.default;

  return (
    <IconComponent
      {...props}
      style={{
        fontSize: size,
        width: size,
        height: size,
        ...style,
      }}
    />
  );
};

export default ClientOnlyIcon;
