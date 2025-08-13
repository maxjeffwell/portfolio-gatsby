// Keyword tracking configuration for SEO optimization
export const keywordConfig = {
  // Primary target keywords by page
  pages: {
    home: {
      primary: [
        'full stack developer',
        'react developer',
        'node.js developer',
        'javascript developer',
        'web developer portfolio',
      ],
      secondary: [
        'mern stack developer',
        'frontend developer',
        'backend developer',
        'react specialist',
        'modern web development',
      ],
      longTail: [
        'experienced react developer',
        'full stack javascript developer',
        'hire react developer',
        'professional web developer',
      ],
    },

    projects: {
      primary: [
        'react projects',
        'node.js projects',
        'web development portfolio',
        'javascript projects',
        'full stack projects',
      ],
      secondary: [
        'graphql projects',
        'mern stack examples',
        'react portfolio',
        'web app development',
        'api development',
      ],
      longTail: [
        'react project examples',
        'node.js portfolio projects',
        'full stack web applications',
        'javascript portfolio examples',
      ],
    },

    about: {
      primary: [
        'full stack developer experience',
        'react developer skills',
        'web developer background',
        'javascript programmer',
      ],
      secondary: [
        'software engineer',
        'web development expertise',
        'technical skills',
        'programming experience',
      ],
      longTail: [
        'experienced full stack web developer',
        'react and node.js specialist',
        'professional web developer bio',
      ],
    },

    contact: {
      primary: [
        'hire full stack developer',
        'react developer for hire',
        'freelance web developer',
        'web development services',
      ],
      secondary: [
        'contact web developer',
        'hire react specialist',
        'web development consultation',
        'custom web applications',
      ],
      longTail: [
        'hire experienced react developer',
        'full stack developer for startup',
        'professional web development services',
        'custom web application development',
      ],
    },
  },

  // Technical skill keywords
  skills: {
    frontend: [
      'React',
      'JavaScript ES6+',
      'HTML5',
      'CSS3',
      'Responsive Design',
      'TypeScript',
      'Material-UI',
      'Emotion',
      'Gatsby',
      'JAMstack',
    ],
    backend: [
      'Node.js',
      'Express.js',
      'GraphQL',
      'REST APIs',
      'MongoDB',
      'PostgreSQL',
      'Authentication',
      'JWT',
      'Microservices',
    ],
    tools: ['Git', 'Docker', 'AWS', 'Netlify', 'Heroku', 'Webpack', 'ESLint', 'Jest', 'Cypress'],
  },

  // Industry and domain keywords
  industries: [
    'web development',
    'software development',
    'e-learning platforms',
    'social networks',
    'e-commerce',
    'content management',
    'api development',
    'database design',
  ],

  // Location-based keywords (adjust as needed)
  locations: [
    'remote developer',
    'us developer',
    'english speaking developer',
    'timezone flexible developer',
  ],

  // Competitor analysis keywords
  competitive: [
    'best react developer',
    'top full stack developer',
    'experienced web developer',
    'professional javascript developer',
    'expert react programmer',
  ],
};

// Helper function to get keywords for a specific page
export const getPageKeywords = (pageName) => {
  const pageConfig = keywordConfig.pages[pageName];
  if (!pageConfig) return [];

  return [...pageConfig.primary, ...pageConfig.secondary, ...pageConfig.longTail];
};

// Helper function to get all technical skills as keywords
export const getTechnicalKeywords = () => {
  return [
    ...keywordConfig.skills.frontend,
    ...keywordConfig.skills.backend,
    ...keywordConfig.skills.tools,
  ];
};

// Helper function to generate meta description with keywords
export const generateMetaDescription = (pageName, customDescription) => {
  const pageKeywords = keywordConfig.pages[pageName];
  if (!pageKeywords || customDescription) return customDescription;

  const templates = {
    home: `Jeff Maxwell - ${pageKeywords.primary[0]} specializing in ${pageKeywords.primary[1]}, ${pageKeywords.primary[2]}, and modern ${pageKeywords.primary[4]} development.`,
    projects: `Explore ${pageKeywords.primary[0]} and ${pageKeywords.primary[1]} showcasing ${pageKeywords.primary[2]} expertise in ${pageKeywords.primary[3]}.`,
    about: `Learn about Jeff Maxwell's ${pageKeywords.primary[0]} and ${pageKeywords.primary[1]} in modern ${pageKeywords.primary[2]}.`,
    contact: `${pageKeywords.primary[0]} Jeff Maxwell for ${pageKeywords.primary[2]} and custom ${pageKeywords.primary[3]}.`,
  };

  return templates[pageName] || customDescription;
};

export default keywordConfig;
