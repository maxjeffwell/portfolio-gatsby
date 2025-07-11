
import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { FaRegArrowAltCircleRight } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';
import TypingAnimation from '../components/TypingAnimation';
import CodeSnippet from '../components/CodeSnippet';
import { useTheme } from '../context/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import SkillsSection from '../components/SkillsSection';
import CTASection from '../components/CTASection';

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr auto auto auto;
  gap: clamp(2rem, 8vw, 6rem);
  position: relative;

  /* Add subtle background pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(
        circle at 20% 30%,
        ${(props) => props.theme.colors.accent}08 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 80% 70%,
        ${(props) => props.theme.colors.accentSecondary}06 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 60% 20%,
        ${(props) => props.theme.colors.accent}04 0%,
        transparent 40%
      );
    pointer-events: none;
    z-index: -1;
    animation: floatPattern 25s ease-in-out infinite;
  }

  @keyframes floatPattern {
    0%,
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(10px, -5px) rotate(1deg);
    }
    66% {
      transform: translate(-5px, 10px) rotate(-1deg);
    }
  }

  @media (max-width: 768px) {
    gap: clamp(1.5rem, 6vw, 4rem);
  }
`;
const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.accentSecondary};
  text-decoration: none;
  font-family: HelveticaNeueLTStd-Roman, sans-serif;
  font-size: 1.75rem;
  line-height: 1.2;
  transition: color ${(props) => props.theme.transitions.normal};

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

function IndexPage() {
  const { theme } = useTheme();
  const [headerRef, headerVisible] = useScrollAnimation({ delay: 100 });
  const [introRef, introVisible] = useScrollAnimation({ delay: 300 });
  const [navRef, navVisible] = useScrollAnimation({ delay: 500 });
  const [codeRef, codeVisible] = useScrollAnimation({ delay: 200 });
  const [skillsRef, skillsVisible] = useScrollAnimation({ delay: 300 });
  const [ctaRef, ctaVisible] = useScrollAnimation({ delay: 400 });

  return (
    <Layout>
      <SEO
        title="Home"
        description="Jeff Maxwell - Full Stack Web Developer specializing in React, Node.js, and modern web development. Explore my portfolio of innovative projects and development solutions."
        pathname="/"
        keywords={[
          `full stack developer`,
          `web developer`,
          `react developer`,
          `node.js developer`,
          `javascript developer`,
          `portfolio`,
          `Jeff Maxwell`,
          `frontend development`,
          `backend development`,
          `web development`,
        ]}
      />
      <StyledContainer role="main">
        <header ref={headerRef}>
          <div
            css={css`
              position: relative;
              padding: clamp(1.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
              touch-action: manipulation;

              @media (max-width: 768px) {
                padding: clamp(1rem, 5vw, 2rem) clamp(0.75rem, 3vw, 1.5rem);
                border-radius: 16px;
                margin-bottom: 1.5rem;
              }

              @media (max-width: 480px) {
                padding: 1rem 0.75rem;
                border-radius: 12px;
                margin-bottom: 1rem;
              }
              border-radius: 24px;
              background: ${theme.gradients.subtle};
              backdrop-filter: blur(20px);
              border: 1px solid ${theme.colors.border};
              margin-bottom: 2rem;
              overflow: hidden;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                  135deg,
                  ${theme.colors.accent}10 0%,
                  transparent 50%,
                  ${theme.colors.accentSecondary}10 100%
                );
                pointer-events: none;
              }

              &::after {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: ${theme.gradients.accent};
                border-radius: 26px;
                z-index: -1;
                opacity: 0;
                transition: opacity ${theme.transitions.slow};
              }

              &:hover::after {
                opacity: 0.1;
              }

              @media (hover: none) {
                &:active::after {
                  opacity: 0.15;
                }
              }
            `}
          >
            <h1
              css={css`
                position: relative;
                z-index: 1;
                font-family: HelveticaNeueLTStd-Bd, sans-serif;
                font-size: clamp(1.75rem, 6vw, 3.5rem);

                @media (max-width: 768px) {
                  font-size: clamp(1.5rem, 8vw, 2.5rem);
                  line-height: 1.2;
                  margin-bottom: 0.75rem;
                }

                @media (max-width: 480px) {
                  font-size: clamp(1.25rem, 9vw, 2rem);
                  letter-spacing: -0.01em;
                }
                margin-bottom: 1rem;
                background: ${theme.gradients.accent};
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 1.1;
                text-align: center;
                opacity: ${headerVisible ? 1 : 0};
                transform: ${headerVisible
                  ? 'translateY(0) scale(1)'
                  : 'translateY(20px) scale(0.95)'};
                transition: all ${theme.transitions.elastic};
                letter-spacing: -0.02em;

                /* Add text shadow for depth */
                filter: drop-shadow(0 4px 8px ${theme.colors.accent}20);
              `}
            >
              <span
                css={css`
                  display: block;
                  margin-bottom: 0.5rem;
                  font-size: 0.7em;
                  opacity: ${headerVisible ? 0.9 : 0};
                  transition: opacity ${theme.transitions.slow};
                  transition-delay: 0.3s;
                `}
              >
                My name&#39;s Jeff.
              </span>
              <span
                css={css`
                  display: block;
                  margin-bottom: 0.5rem;
                `}
              >
                I'm a{' '}
                <span
                  css={css`
                    color: white !important;
                    -webkit-text-fill-color: white !important;
                    background-clip: initial !important;
                    -webkit-background-clip: initial !important;
                  `}
                >
                  <TypingAnimation
                    key="hero-typing"
                    texts={[
                      'Full Stack Developer',
                      'React Specialist',
                      'Node.js Expert',
                      'GraphQL Enthusiast',
                      'JAMstack Architect',
                      'Problem Solver',
                    ]}
                    typeSpeed={80}
                    deleteSpeed={40}
                    delayBetweenTexts={1500}
                    loop
                    startDelay={800}
                  />
                </span>
              </span>
              <span
                css={css`
                  display: block;
                  font-size: 0.6em;
                  opacity: ${headerVisible ? 0.8 : 0};
                  transition: opacity ${theme.transitions.slow};
                  transition-delay: 0.6s;
                  color: ${theme.colors.textSecondary};
                  background: none;
                  -webkit-text-fill-color: ${theme.colors.textSecondary};
                `}
              >
                crafting exceptional web experiences
              </span>
            </h1>

            {/* Floating elements for visual interest */}
            <div
              css={css`
                position: absolute;
                top: 20%;
                right: 10%;
                width: 60px;
                height: 60px;
                background: ${theme.gradients.accent};
                border-radius: 50%;
                opacity: 0.1;
                animation: float 6s ease-in-out infinite;

                @keyframes float {
                  0%,
                  100% {
                    transform: translateY(0) rotate(0deg);
                  }
                  50% {
                    transform: translateY(-20px) rotate(180deg);
                  }
                }
              `}
            />
            <div
              css={css`
                position: absolute;
                bottom: 15%;
                left: 8%;
                width: 40px;
                height: 40px;
                background: ${theme.colors.accentSecondary};
                border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                opacity: 0.08;
                animation: float 8s ease-in-out infinite reverse;
              `}
            />
          </div>
        </header>
        <section
          ref={introRef}
          aria-labelledby="intro-heading"
          css={css`
            grid-row: 2 / 3;
            grid-column: 1 / 2;
            opacity: ${introVisible ? 1 : 0};
            transform: ${introVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
          `}
        >
          <h2 id="intro-heading" className="sr-only">
            About My Development Approach
          </h2>
          <div
            css={css`
              background: ${theme.gradients.secondary};
              border-radius: 20px;
              padding: clamp(1.5rem, 4vw, 2.5rem);
              border: 1px solid ${theme.colors.border};
              position: relative;
              overflow: hidden;
              margin-bottom: 2rem;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: ${theme.gradients.accent};
              }
            `}
          >
            <p
              css={css`
                color: ${theme.colors.text};
                font-family: HelveticaNeueLTStd-Roman, sans-serif;
                font-size: clamp(1.125rem, 3vw, 1.5rem);

                @media (max-width: 768px) {
                  font-size: clamp(1rem, 3.5vw, 1.25rem);
                }

                @media (max-width: 480px) {
                  padding-left: 0;
                }
                margin-bottom: 1rem;
                line-height: 1.6;
                opacity: ${introVisible ? 1 : 0};
                transform: ${introVisible ? 'translateY(0)' : 'translateY(20px)'};
                transition: all ${theme.transitions.slow};
                transition-delay: 0.1s;
                position: relative;

                &::before {
                  content: '💡';
                  position: absolute;
                  left: -2rem;
                  top: 0;
                  font-size: 1.5rem;
                  opacity: 0.6;

                  @media (max-width: 768px) {
                    left: -1.5rem;
                    font-size: 1.25rem;
                  }

                  @media (max-width: 480px) {
                    display: none;
                  }
                }

                padding-left: 0.5rem;
              `}
            >
              I believe in <strong>clean, maintainable code</strong> and
              <strong>user-centered design</strong>. Every line I write is crafted with performance,
              accessibility, and scalability in mind.
            </p>
            <p
              css={css`
                color: ${theme.colors.textSecondary};
                font-family: HelveticaNeueLTStd-Roman, sans-serif;
                font-size: clamp(1rem, 2.5vw, 1.125rem);
                margin-bottom: 0;
                line-height: 1.6;
                opacity: ${introVisible ? 1 : 0};
                transform: ${introVisible ? 'translateY(0)' : 'translateY(20px)'};
                transition: all ${theme.transitions.slow};
                transition-delay: 0.3s;
                font-style: italic;

                @media (max-width: 480px) {
                  font-size: 0.9rem;
                }
              `}
            >
              &#34;Code is like humor. When you have to explain it, it&#39;s bad.&#34; — That&#39;s why I
              focus on intuitive, self-documenting solutions.
            </p>
          </div>
          <nav
            ref={navRef}
            aria-label="Portfolio navigation"
            css={css`
              opacity: ${navVisible ? 1 : 0};
              transform: ${navVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)'};
              transition: all ${theme.transitions.elastic};
            `}
          >
            <div
              css={css`
                position: relative;
                display: inline-block;
                margin-bottom: 2rem;
              `}
            >
              <StyledLink
                to="/projects/"
                theme={theme}
                css={css`
                  position: relative;
                  display: inline-flex;
                  align-items: center;
                  gap: 0.75rem;
                  padding: clamp(1rem, 3vw, 1.25rem) clamp(1.5rem, 5vw, 2.5rem);
                  touch-action: manipulation;
                  user-select: none;
                  -webkit-tap-highlight-color: transparent;

                  @media (max-width: 768px) {
                    border-radius: 40px;
                    gap: 0.5rem;
                  }

                  @media (max-width: 480px) {
                    border-radius: 30px;
                    padding: 0.875rem 1.75rem;
                    font-size: 1rem;
                  }
                  background: ${theme.gradients.accent};
                  border-radius: 60px;
                  text-decoration: none;
                  font-weight: bold;
                  color: ${theme.colors.textInverse} !important;
                  box-shadow: ${theme.shadows.medium};
                  transition: all ${theme.transitions.normal};
                  overflow: hidden;
                  font-size: clamp(1rem, 2.5vw, 1.125rem);
                  letter-spacing: 0.025em;
                  border: 2px solid transparent;

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
                      rgba(255, 255, 255, 0.3),
                      transparent
                    );
                    transition: left ${theme.transitions.slow};
                  }

                  &::after {
                    content: '\u2192';
                    font-size: clamp(1rem, 2.5vw, 1.25rem);
                    transition: transform ${theme.transitions.normal};
                  }

                  @media (hover: hover) {
                    &:hover {
                      transform: translateY(-4px) scale(1.02);
                      box-shadow: ${theme.shadows.hover};
                      border-color: ${theme.colors.accentSecondary}40;

                      &::before {
                        left: 100%;
                      }

                      &::after {
                        transform: translateX(4px);
                      }
                    }
                  }

                  @media (hover: none) {
                    &:active {
                      transform: translateY(-2px) scale(0.98);
                      box-shadow: ${theme.shadows.small};

                      &::before {
                        left: 100%;
                      }
                    }
                  }

                  &:active {
                    transform: translateY(-2px) scale(1);
                  }

                  &:focus {
                    outline: 3px solid ${theme.colors.accentSecondary};
                    outline-offset: 4px;
                  }

                  &:focus:not(:focus-visible) {
                    outline: none;
                  }
                `}
              >
                View My Projects
              </StyledLink>
            </div>

          </nav>
        </section>
        <section
          aria-labelledby="personal-heading"
          css={css`
            grid-row: 3 / 4;
            grid-column: 1 / 2;
            animation: ${theme.animations.slideInRight};
            animation-delay: 0.8s;
            animation-fill-mode: both;
          `}
        >
          <div
            css={css`
              background: linear-gradient(
                135deg,
                ${theme.colors.secondary}95 0%,
                ${theme.colors.tertiary}90 100%
              );
              border-radius: 24px;
              padding: clamp(2rem, 5vw, 3rem);
              position: relative;
              overflow: hidden;
              border: 1px solid ${theme.colors.border};
              backdrop-filter: blur(20px);

              &::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 100%;
                height: 100%;
                background: radial-gradient(
                  circle,
                  ${theme.colors.accentSecondary}20 0%,
                  transparent 60%
                );
                animation: pulse 4s ease-in-out infinite;
              }

              @keyframes pulse {
                0%,
                100% {
                  opacity: 0.3;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.6;
                  transform: scale(1.1);
                }
              }
            `}
          >
            <h2
              id="personal-heading"
              css={css`
                color: ${theme.colors.accentSecondary};
                font-family: HelveticaNeueLTStd-Bd, sans-serif;
                font-size: clamp(1.5rem, 4vw, 2rem);
                margin-bottom: 1.5rem;
                position: relative;

                &::after {
                  content: '';
                  position: absolute;
                  bottom: -0.5rem;
                  left: 0;
                  width: 60px;
                  height: 3px;
                  background: ${theme.gradients.accent};
                  border-radius: 2px;
                }
              `}
            >
              Beyond the Code
            </h2>
            <p
              css={css`
                color: ${theme.colors.text};
                font-family: HelveticaNeueLTStd-Roman, sans-serif;
                font-size: clamp(1.125rem, 3vw, 1.375rem);
                margin-bottom: 2rem;
                line-height: 1.6;
                position: relative;
                z-index: 1;

                &::before {
                  content: '\ud83d\udc36';
                  position: absolute;
                  left: -2.5rem;
                  top: 0.5rem;
                  font-size: 1.5rem;
                  opacity: 0.7;
                  animation: wiggle 3s ease-in-out infinite;
                }

                @keyframes wiggle {
                  0%,
                  100% {
                    transform: rotate(0deg);
                  }
                  25% {
                    transform: rotate(5deg);
                  }
                  75% {
                    transform: rotate(-5deg);
                  }
                }

                padding-left: 1rem;
              `}
            >
              When I'm not crafting pixel-perfect interfaces or debugging complex algorithms, you'll
              find me negotiating dinner arrangements with my two demanding canine project managers
              \u2014 they're surprisingly good at code reviews!
            </p>
            <nav 
              aria-label="About page navigation"
              css={css`
                text-align: center;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0;
                margin: 0;
              `}
            >
              <p
                css={css`
                  text-align: center;
                  margin: 0;
                `}
              >
                <StyledLink
                  to="/about/"
                  theme={theme}
                  css={css`
                    &:focus {
                      outline: 2px solid ${theme.colors.accentSecondary};
                      outline-offset: 2px;
                    }
                  `}
                >
                  Meet my development team and learn more about me
                </StyledLink>
              </p>
            </nav>
          </div>
        </section>

        <section
          ref={codeRef}
          aria-labelledby="code-heading"
          css={css`
            grid-row: 4 / 5;
            grid-column: 1 / 2;
            opacity: 1;
            transform: ${codeVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
            position: relative;
          `}
        >
          <div
            css={css`
              background: linear-gradient(
                135deg,
                ${theme.colors.tertiary}98 0%,
                ${theme.colors.secondary}95 100%
              );
              border-radius: 24px;
              padding: clamp(2rem, 5vw, 3rem);
              position: relative;
              overflow: hidden;
              border: 1px solid ${theme.colors.border};
              backdrop-filter: blur(20px);

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: ${theme.gradients.accent};
                border-radius: 24px 24px 0 0;
              }

              &::after {
                content: '';
                position: absolute;
                top: 20px;
                right: 20px;
                width: 12px;
                height: 12px;
                background: #ff5f56;
                border-radius: 50%;
                box-shadow:
                  20px 0 0 #ffbd2e,
                  40px 0 0 #27ca3f;
              }
            `}
          >
            <h2
              id="code-heading"
              css={css`
                color: ${theme.colors.text};
                font-family: HelveticaNeueLTStd-Bd, sans-serif;
                font-size: clamp(1.75rem, 4vw, 2.25rem);
                margin-bottom: 1rem;
                text-align: center;
                background: ${theme.gradients.accent};
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                position: relative;

                &::before {
                  content: '\ud83d\udcbb';
                  position: absolute;
                  left: 50%;
                  top: -3rem;
                  transform: translateX(-50%);
                  font-size: 2rem;
                  opacity: 0.6;
                }

                padding-top: 2rem;
              `}
            >
              Code Philosophy
            </h2>
            <p
              css={css`
                color: ${theme.colors.textSecondary};
                font-family: HelveticaNeueLTStd-Roman, sans-serif;
                font-size: clamp(1rem, 2.5vw, 1.125rem);
                text-align: center;
                margin-bottom: 2rem;
                line-height: 1.6;
                font-style: italic;
              `}
            >
              Clean, readable, and maintainable \u2014 here's how I approach modern React
              development:
            </p>
            <CodeSnippet
              title="Custom Hook Example"
              animated={codeVisible}
              animationSpeed={25}
              code={`const useTheme = () => {
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
};`}
            />

            <div
              css={css`
                margin-top: 2rem;
                padding: 1.5rem;
                background: ${theme.colors.secondary};
                border-radius: 12px;
                border-left: 4px solid ${theme.colors.accentSecondary};
              `}
            >
              <h3
                css={css`
                  color: ${theme.colors.accentSecondary};
                  font-family: HelveticaNeueLTStd-Bd, sans-serif;
                  font-size: 1.125rem;
                  margin-bottom: 0.75rem;
                `}
              >
                Why I Love This Pattern
              </h3>
              <ul
                css={css`
                  color: ${theme.colors.text};
                  font-family: HelveticaNeueLTStd-Roman, sans-serif;
                  font-size: 1rem;
                  line-height: 1.6;
                  list-style: none;
                  padding: 0;
                  margin: 0;

                  li {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-bottom: 0.5rem;

                    &::before {
                      content: '\u2713';
                      position: absolute;
                      left: 0;
                      color: ${theme.colors.accentSecondary};
                      font-weight: bold;
                    }
                  }
                `}
              >
                <li>Separation of concerns \u2014 logic stays in the hook</li>
                <li>Reusable across multiple components</li>
                <li>Easy to test in isolation</li>
                <li>Performance optimized with useCallback</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          ref={skillsRef}
          aria-labelledby="skills-heading"
          css={css`
            grid-row: 5 / 6;
            grid-column: 1 / 2;
            margin-top: 4rem;
            opacity: ${skillsVisible ? 1 : 0};
            transform: ${skillsVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
          `}
        >
          <SkillsSection visible={skillsVisible} />
        </section>

        <section
          ref={ctaRef}
          aria-labelledby="cta-heading"
          css={css`
            grid-row: 6 / 7;
            grid-column: 1 / 2;
            margin-top: 4rem;
            opacity: ${ctaVisible ? 1 : 0};
            transform: ${ctaVisible ? 'translateY(0)' : 'translateY(30px)'};
            transition: all ${theme.transitions.slow};
          `}
        >
          <CTASection visible={ctaVisible} />
        </section>
      </StyledContainer>
    </Layout>
  );
}

export default IndexPage;
