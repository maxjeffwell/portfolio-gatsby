import React from 'react';
import { Link } from 'gatsby';
import ClientOnlyIcon from '../ClientOnlyIcon';
import CanvasCodeSnippet from '../CanvasCodeSnippet';
import { Card, CardTitle, CardText, InfoCard, InfoText } from './styles';

const CODE_EXAMPLE = `const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    setIsDark(stored === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggleTheme };
};`;

const CodePhilosophyCard = () => {
  return (
    <Card as="article" id="development-philosophy">
      <CardTitle as="h2">
        <ClientOnlyIcon
          iconName="Computer"
          fontSize="110px"
          style={{ marginRight: '8px', color: '#007bff' }}
        />{' '}
        React Developer Code Philosophy
      </CardTitle>
      <CardText>
        Clean, readable, and maintainable — here&#39;s how I approach modern React development. I
        believe in writing code that tells a story, where each function has a single responsibility
        and complex logic is broken down into digestible, testable pieces. This philosophy extends
        to my component architecture, where I prioritize composition over inheritance and leverage
        React&#39;s built-in patterns for performance:
        <br />
        <br />
        My development workflow incorporates modern tooling including ESLint and Prettier for code
        consistency, and comprehensive testing with Jest and React Testing Library. I implement
        responsive design with CSS-in-JS solutions like Styled
        Components and Emotion, ensuring cross-browser compatibility and mobile-first approaches
        that deliver exceptional user experiences across all devices and screen sizes. Learn more
        about my{' '}
        <Link
          to="/about/"
          title="Discover my development workflow and methodologies"
          style={{
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          development methodologies
        </Link>{' '}
        and process.
      </CardText>

      <CanvasCodeSnippet
        title="Custom Hook Example"
        animated
        animationSpeed={25}
        code={CODE_EXAMPLE}
      />

      <InfoCard>
        <h3>Why I Like This Pattern</h3>
        <ul>
          <li>✓ Separation of concerns — logic stays in the hook</li>
          <li>✓ Reusable across multiple components</li>
          <li>✓ Easy to test in isolation</li>
          <li>✓ Performance optimized with useCallback</li>
        </ul>
        <InfoText>
          This approach is used throughout my{' '}
          <Link
            to="/projects/"
            title="View my complete portfolio of development projects"
            style={{
              color: 'var(--accent-pink)',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            portfolio projects
          </Link>{' '}
          to ensure maintainable and scalable React applications. On the backend, I apply similar
          patterns, ensuring clean separation of concerns between frontend and server logic. By
          extracting logic into custom hooks, I create reusable pieces that can be easily unit
          tested, reduce component complexity, and follow the single responsibility principle. This
          development approach has proven invaluable in large-scale applications where state
          management and side effects need to be carefully orchestrated across multiple components.{' '}
          <Link
            to="/contact/"
            title="Hire Jeff Maxwell for your next development project"
            style={{
              color: 'var(--accent-pink)',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            Let&#39;s discuss your project
          </Link>
          .
        </InfoText>
      </InfoCard>
    </Card>
  );
};

export default CodePhilosophyCard;
