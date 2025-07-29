import React from 'react';
import { 
  FaGithub, 
  FaPhone, 
  FaGlobe, 
  FaLightbulb, 
  FaComputer, 
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa6';
import { 
  IoComputer,
  IoCheckmarkCircle,
  IoArrowForward,
  IoArrowBack 
} from 'react-icons/io5';
import { 
  MdLightbulb,
  MdComputer,
  MdCheckCircle,
  MdArrowForward,
  MdArrowBack,
  MdLanguage
} from 'react-icons/md';

const iconMap = {
  // Social icons
  'GitHub': FaGithub,
  'Language': MdLanguage,
  'Phone': FaPhone,
  
  // UI icons
  'LightbulbOutlined': MdLightbulb,
  'Computer': MdComputer,
  'CheckCircle': MdCheckCircle,
  'ArrowForward': MdArrowForward,
  'ArrowBack': MdArrowBack,
  
  // Fallback icons
  'default': FaGlobe
};

const ClientOnlyIcon = ({ iconName, fontSize = 'medium', style = {}, ...props }) => {
  const IconComponent = iconMap[iconName] || iconMap.default;
  
  // Map fontSize to actual sizes
  const sizeMap = {
    'small': '16px',
    'medium': '20px', 
    'large': '24px',
    'inherit': 'inherit'
  };
  
  const size = sizeMap[fontSize] || fontSize;
  
  return (
    <IconComponent 
      {...props}
      style={{
        fontSize: size,
        width: size,
        height: size,
        ...style
      }}
    />
  );
};

export default ClientOnlyIcon;