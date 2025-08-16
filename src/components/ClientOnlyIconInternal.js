import React from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import { MdLanguage, MdLightbulb, MdArrowBack } from 'react-icons/md';
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
    gatsby: file(relativePath: { eq: "svg-icons/gatsby_logo.svg" }) {
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
    darkModeToggle: file(relativePath: { eq: "svg-icons/dark_mode_toggle.svg" }) {
      publicURL
    }
    email: file(relativePath: { eq: "svg-icons/email.svg" }) {
      publicURL
    }
    githubCharacter: file(relativePath: { eq: "svg-icons/github_character.svg" }) {
      publicURL
    }
    telephone: file(relativePath: { eq: "svg-icons/telephone.svg" }) {
      publicURL
    }
    burger: file(relativePath: { eq: "svg-icons/burger.svg" }) {
      publicURL
    }
    sourceCode: file(relativePath: { eq: "svg-icons/source_code.svg" }) {
      publicURL
    }
    twitter: file(relativePath: { eq: "svg-icons/twitter.svg" }) {
      publicURL
    }
    linkedin: file(relativePath: { eq: "svg-icons/linkedin.svg" }) {
      publicURL
    }
    facebook: file(relativePath: { eq: "svg-icons/facebook.svg" }) {
      publicURL
    }
    reddit: file(relativePath: { eq: "svg-icons/reddit.svg" }) {
      publicURL
    }
    send: file(relativePath: { eq: "svg-icons/send.svg" }) {
      publicURL
    }
    done: file(relativePath: { eq: "svg-icons/done.svg" }) {
      publicURL
    }
    react: file(relativePath: { eq: "svg-icons/react.svg" }) {
      publicURL
    }
    nodejs: file(relativePath: { eq: "svg-icons/nodejs.svg" }) {
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
  background: transparent;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    background: transparent;
  }
`;

// SVG component that fetches and renders SVG content
const SvgIcon = ({ url, size, style, ...props }) => {
  const [svgContent, setSvgContent] = React.useState('');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (url && isClient && typeof window !== 'undefined') {
      fetch(url)
        .then((response) => response.text())
        .then((content) => setSvgContent(content))
        .catch((err) => console.warn('Failed to load SVG:', err));
    }
  }, [url, isClient]);

  // Return placeholder during SSR
  if (!isClient) {
    return (
      <StyledSvgIcon size={size} style={style} {...props}>
        <div style={{ width: '100%', height: '100%', background: 'transparent' }} />
      </StyledSvgIcon>
    );
  }

  return (
    <StyledSvgIcon
      size={size}
      style={style}
      {...props}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

const ClientOnlyIconInternal = ({ iconName, fontSize = 'medium', style = {}, ...props }) => {
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

  if (iconName === 'DarkModeToggle') {
    return <SvgIcon url={data.darkModeToggle?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Email') {
    return <SvgIcon url={data.email?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'GitHubCharacter') {
    return <SvgIcon url={data.githubCharacter?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Telephone') {
    return <SvgIcon url={data.telephone?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'Burger') {
    return <SvgIcon url={data.burger?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'SourceCode') {
    return <SvgIcon url={data.sourceCode?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'twitter') {
    return <SvgIcon url={data.twitter?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'linkedin') {
    return <SvgIcon url={data.linkedin?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'facebook') {
    return <SvgIcon url={data.facebook?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'reddit') {
    return <SvgIcon url={data.reddit?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'send') {
    return <SvgIcon url={data.send?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'done') {
    return <SvgIcon url={data.done?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'React') {
    return <SvgIcon url={data.react?.publicURL} size={size} style={style} {...props} />;
  }

  if (iconName === 'NodeJS') {
    return <SvgIcon url={data.nodejs?.publicURL} size={size} style={style} {...props} />;
  }

  // Handle remaining react-icons
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

export default ClientOnlyIconInternal;