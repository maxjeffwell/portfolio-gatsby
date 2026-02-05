# Project Overview

**Jeff Maxwell's Developer Portfolio** is a cutting-edge developer portfolio engineered for speed and user experience. Built with Gatsby's static site generation, optimized for Core Web Vitals, and deployed seamlessly on Netlify's global edge network.

## Purpose

Showcase development projects and professional information with emphasis on performance optimization, modern web standards, and responsive design with focus on sub-one-second mobile page speed.

## Key Information

- **Version**: 0.2.0
- **Author**: Jeff Maxwell
- **License**: MIT
- **Homepage**: https://el-jefe.me
- **Repository**: https://github.com/maxjeffwell/portfolio-gatsby

## Business Domain

- **Type**: Professional Portfolio
- **Target Audience**: Recruiters, clients, fellow developers, technical hiring managers
- **Industry**: Software Development, Web Development

## Architectural Decisions

### Static Site Generation
- **Rationale**: Gatsby chosen for superior performance, SEO, and build-time optimizations
- **Benefit**: Sub-one-second load times, optimal Core Web Vitals scores

### CSS-in-JS with Emotion and Styled Components
- **Rationale**: Component-scoped styling, better SSR support, dynamic theming
- **Benefit**: Theme system for dark/light modes, optimized CSS delivery

### Image Optimization Pipeline
- **Rationale**: Automatic responsive images with WebP/AVIF formats
- **Benefit**: Reduced bandwidth, faster load times, better mobile performance

### Progressive Web App
- **Rationale**: Offline functionality, installability, native app-like experience
- **Benefit**: Better user engagement, works offline, mobile-friendly

### Netlify Deployment
- **Rationale**: Global CDN, automatic deployments, form handling, edge functions
- **Benefit**: Fast global delivery, simplified CI/CD, built-in features

## Design Patterns

- **Component Composition**: React component architecture for reusability
- **Context API**: Theme context for dark/light mode state management
- **Static Queries**: GraphQL queries for build-time data fetching
- **Layout Pattern**: Consistent layout wrapper across all pages
- **Client-Only Components**: Hydration-safe components for browser APIs
- **Error Boundaries**: Graceful error handling for React components
- **Web Workers**: Background processing for performance-intensive tasks

## Key Features

### Performance
- Lighthouse Score: 95+
- First Contentful Paint: <1.2s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3.0s

### Dark/Light Mode
- Seamless theme switching with user preference persistence
- System preference detection
- Theme-aware components and images

### Responsive Design
- Mobile-first approach
- Breakpoints: 375px, 480px, 768px, 1024px
- Touch-friendly interactions

### SEO Optimization
- XML sitemap generation
- Meta tags and Open Graph
- Structured data (JSON-LD)
- Canonical URLs

### Security
- Content Security Policy headers
- XSS protection
- Secure form handling with Netlify Forms
- CSRF protection

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation
- ARIA labels and roles
- Screen reader optimization

## Use Cases

- **Portfolio Showcase**: Display development projects with screenshots, descriptions, and live links
- **Professional Networking**: Contact form for client inquiries and collaboration opportunities
- **Technical Demonstration**: Showcase technical skills through site performance and code quality
- **Resume Distribution**: Online resume accessible to recruiters and hiring managers

## Performance Targets

- **Mobile Page Speed**: Sub-one-second load time on 4G connections
- **Desktop Performance**: Lighthouse score 95+ across all categories
- **Image Optimization**: WebP/AVIF formats with lazy loading
- **Bundle Size**: Minimal JavaScript bundles with code splitting

## Design System

### Colors
- **Primary** (#1565c0): Blue - main brand color
- **Secondary** (#e91e63): Pink - accent highlights
- **Success** (#4caf50): Green - success states
- **Warning** (#ff9800): Orange - warnings
- **Error** (#f44336): Red - error states
- **Orange Gradient** (#fc4a1a): Gradient start
- **Blue Gradient** (#052f5f): Gradient end

### Typography
- **Primary**: System font stack with fallbacks
- **Code**: Monaco, Menlo, Ubuntu Mono, Consolas
- **Custom**: Avenir, Helvetica Neue, Sabon

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+
- **Wide**: 1200px+

# Technology Stack

## Languages
- **JavaScript ES6+**: Primary development language
- **JSX**: React component markup (React 18.3.1)

## Core Framework
- **Gatsby 5.14.5**: Static site generator for superior performance
- **React 18.3.1**: Component-based UI library

## Styling
- **Emotion 11.14.0**: CSS-in-JS styling solution
- **Styled Components 6.1.19**: Component-scoped styling with theme support

## Build Tools
- **Webpack 5.101.3**: Module bundler with optimizations
- **Babel 7.x**: JavaScript transpilation and polyfills
- **Terser 5.3.14**: JavaScript minification and optimization

## Package Management
- **npm >=8.0.0**: Package manager (legacy-peer-deps enabled)

## Runtime
- **Node.js >=18.0.0**: JavaScript runtime environment

## Deployment
- **Netlify**: Edge network deployment platform
- **gatsby-adapter-netlify 1.2.0**: Netlify-specific optimizations
- **Docker**: Containerization support with multi-platform builds (linux/amd64, linux/arm64)

## Image Processing
- **gatsby-plugin-sharp 5.14.0**: Image processing and optimization
- **gatsby-transformer-sharp 5.14.0**: GraphQL image transformations
- **gatsby-plugin-image 3.14.0**: Next-gen image components with WebP/AVIF
- **gatsby-transformer-ffmpeg 0.5.5**: Video file processing

## Progressive Web App
- **gatsby-plugin-manifest 5.14.0**: PWA manifest generation
- **gatsby-plugin-offline 6.14.0**: Service worker and offline functionality

## SEO & Analytics
- **gatsby-plugin-sitemap 6.14.0**: XML sitemap generation
- **gatsby-plugin-robots-txt 1.8.0**: Robots.txt automation
- **react-helmet-async 1.3.0**: Document head management
- **gatsby-plugin-google-gtag 5.14.0**: Google Analytics 4 integration

## Code Quality
- **ESLint 8.57.0**: Linting with Airbnb configuration
- **Prettier 3.2.5**: Code formatting and style enforcement

## Compression & Optimization
- **gatsby-plugin-brotli 2.1.0**: Brotli compression for assets
- **gatsby-plugin-zopfli 2.0.0**: Zopfli compression for maximum efficiency
- **html-minifier-terser 7.2.0**: HTML minification

## Additional Libraries
- **Motion (Framer) 12.23.12**: Smooth animations and page transitions
- **React Icons 5.5.0**: Comprehensive icon library
- **React Animated Cursor 2.11.2**: Custom interactive cursor effects
- **Typography.js 0.16.24**: Responsive typography system
- **Web Vitals 5.1.0**: Core Web Vitals performance monitoring

# Coding Standards

## Style Guide
- **Standard**: Airbnb JavaScript Style Guide
- **Prettier**: Enabled for automatic code formatting

## Linting Configuration

### Parser
- **@babel/eslint-parser**: Babel-based ESLint parser
- **ECMAScript Version**: 2022
- **Source Type**: Module (ES6 modules)

## React-Specific Rules

### JSX and Props
- **jsx-filename-extension** (warn): Allow both .js and .jsx extensions for JSX files
- **prop-types** (warn): Warn when PropTypes are missing
- **forbid-prop-types** (off): Allow any prop types including 'any' and 'object'
- **require-default-props** (off): Default props are not required
- **jsx-props-no-spreading** (off): Prop spreading is allowed
- **no-unescaped-entities** (warn): Warn on unescaped HTML entities in JSX
- **jsx-one-expression-per-line** (off): Multiple expressions per line allowed
- **no-array-index-key** (warn): Warn when using array index as key prop

## Import Rules
- **prefer-default-export** (off): Named exports are allowed and encouraged
- **no-extraneous-dependencies** (error): Error on dependencies not in package.json
  - **Allowed in**: gatsby-config.js, gatsby-node.js, gatsby-browser.js, gatsby-ssr.js, wrap-root-element.js, test files

## General JavaScript Rules
- **no-console** (warn): Console statements generate warnings
- **no-alert** (warn): Alert statements generate warnings
- **no-unused-vars** (error): Error on unused variables (except those prefixed with _)
- **prefer-const** (error): Prefer const over let when variable is not reassigned
- **no-underscore-dangle** (off): Underscore dangle allowed for private properties
- **consistent-return** (warn): Warn on functions with inconsistent return statements
- **no-param-reassign** (error): Error on parameter reassignment (except for object properties)

## Accessibility Standards
- **Plugin**: jsx-a11y for accessibility linting
- **anchor-is-valid** (error): Validate Link components have proper attributes
- **label-has-associated-control** (error): Form labels must be properly associated with controls

## Styling Rules
- **CSS Prop**: Allow css prop on React components (Emotion)
- **Unknown Properties**: Allow unknown properties for Emotion styled components

## Syntax Restrictions
- **Disallowed**:
  - ForInStatement (use Object.keys/values/entries instead)
  - LabeledStatement (avoid GOTO-like patterns)
  - WithStatement (not allowed in strict mode)
- **Allowed**:
  - ForOfStatement (modern iteration pattern)

## Environment Configuration
- **Browser**: true (browser global variables available)
- **Node**: true (Node.js global variables available)
- **ES2022**: true (ES2022 features enabled)
- **Jest**: true (Jest testing globals available)

## Global Variables
- **graphql**: Readonly (Gatsby GraphQL tag)
- **__PATH_PREFIX__**: Readonly (Gatsby path prefix)
- **__BASE_PATH__**: Readonly (Gatsby base path)

## Best Practices
1. Use ESLint and Prettier for consistent code style
2. Follow Airbnb JavaScript style guide conventions
3. Prioritize accessibility in component development
4. Write semantic HTML with proper ARIA attributes
5. Use PropTypes or TypeScript for type safety
6. Prefer functional components with hooks over class components
7. Keep components small and focused on single responsibility
8. Use meaningful variable and function names
9. Write self-documenting code with clear logic
10. Handle errors gracefully with Error Boundaries

# Project Structure

```
.
|-- 93751e66221249d7a9c9b3ef548f0c07.txt
|-- babel.config.js
|-- CICD.md
|-- CLAUDE.md
|-- docker-compose.yml
|-- Dockerfile
|-- DOCKER.md
|-- docs
|   `-- THIRD_PARTY_SCRIPTS.md
|-- gatsby-browser.js
|-- gatsby-config.js
|-- gatsby-node.js
|-- gatsby-node.js.backup
|-- gatsby-server.log
|-- gatsby-ssr.js
|-- index.html
|-- LICENSE
|-- netlify
|   `-- functions
|-- netlify.toml
|-- nginx.conf
|-- package.json
|-- package-lock.json
|-- plugins
|-- README.md
|-- screenshots
|   |-- bookmarked_screenshot1.png
|   |-- podrick1.png
|   |-- podrick2.png
|   |-- podrick_screenshot1.png
|   |-- podrick_screenshot2.png
|   |-- pop1.png
|   |-- pop2.png
|   |-- pop3.png
|   |-- Screen Shot 2025-08-16 at 06.42.41.png
|   |-- Screen Shot 2025-08-16 at 06.43.03.png
|   |-- Screen Shot 2025-08-16 at 06.43.29.png
|   |-- Screen Shot 2025-08-16 at 06.43.40.png
|   |-- Screen Shot 2025-08-16 at 06.43.53.png
|   |-- Screen Shot 2025-08-16 at 06.44.29.png
|   |-- Screen Shot 2025-08-16 at 06.44.48.png
|   |-- Screen Shot 2025-08-16 at 06.44.52.png
|   |-- Screen Shot 2025-08-16 at 06.45.26.png
|   |-- Screen Shot 2025-08-16 at 06.45.34.png
|   |-- Screen Shot 2025-08-16 at 06.45.44.png
|   |-- Screen Shot 2025-08-16 at 06.45.56.png
|   |-- Screen Shot 2025-08-16 at 06.46.06.png
|   |-- screenshots-devops
|   |   |-- pipeline.png
|   |   `-- timeline_cicd.png
|   |-- screenshots_pop
|   |   |-- metrics.png
|   |   |-- pop_dashboard.png
|   |   |-- pop_login.png
|   |   `-- pop_pods.png
|   |-- Video_2025-08-16_00-12-56.mp4
|   |-- Video_2025-08-16_00-32-19.mp4
|   `-- Video_2025-08-16_01-20-17.mp4
|-- scripts
|   |-- build-secure.js
|   |-- generate-csp-hashes.js
|   `-- optimize-deps.sh
|-- SETUP.md
|-- src
|   |-- components
|   |   |-- Analytics.js
|   |   |-- CanvasCodeSnippet.js
|   |   |-- CanvasTypingAnimation.js
|   |   |-- ClientOnlyButton.js
|   |   |-- ClientOnlyIconInternal.js
|   |   |-- ClientOnlyIcon.js
|   |   |-- ClientOnlyMUI.js
|   |   |-- CodeSnippet.js
|   |   |-- CTASection.js
|   |   |-- DarkModeToggle.js
|   |   |-- ErrorBoundary.js
|   |   |-- GlobalStyles.js
|   |   |-- header.js
|   |   |-- image.js
|   |   |-- layout.js
|   |   |-- logo.js
|   |   |-- MotionWrapper.js
|   |   |-- myLogo.js
|   |   |-- PageTransition.js
|   |   |-- PerformanceMonitor.js
|   |   |-- projectCard.js
|   |   |-- ProjectCardWithInView.js
|   |   |-- ProtectedEmail.js
|   |   |-- seo.js
|   |   |-- SimpleTypingAnimation.js
|   |   |-- SocialShare.js
|   |   |-- SSRSafeDarkModeToggle.js
|   |   |-- StaggeredAnimation.js
|   |   |-- ThirdPartyScripts.js
|   |   `-- TypingAnimation.js
|   |-- context
|   |   `-- ThemeContext.js
|   |-- data
|   |   `-- keywords.js
|   |-- docs
|   |   |-- accessibility-checklist.md
|   |   `-- webp-implementation.md
|   |-- hooks
|   |   |-- useDebounce.js
|   |   |-- useScrollAnimation.js
|   |   `-- useWebWorker.js
|   |-- html.js
|   |-- images
|   |   |-- bookmarked_screenshot1.mp4
|   |   |-- bookmarked_screenshot2.mp4
|   |   |-- chiapas_map.png
|   |   |-- code-companions.png
|   |   |-- codetalk_screenshot1.mp4
|   |   |-- codetalk_screenshot2.webm
|   |   |-- educationelly_graphql_screenshot1.png
|   |   |-- educationelly_graphql_screenshot2.png
|   |   |-- educationelly_screenshot1.png
|   |   |-- educationelly_screenshot2.mp4
|   |   |-- elephant_developer.png
|   |   |-- elephant_noun_project.png
|   |   |-- el_jefe.png
|   |   |-- firebook_screenshot1.png
|   |   |-- firebook_screenshot2.png
|   |   |-- gatsby-icon.png
|   |   |-- intervalai_screenshot1.mp4
|   |   |-- intervalai_screenshot2.mp4
|   |   |-- podrick_screenshot1.png
|   |   |-- podrick_screenshot2.png
|   |   |-- pop_screenshot1.png
|   |   |-- pop_screenshot2.png
|   |   |-- screenRecording-16-8-2025-4-49.mp4
|   |   |-- screenshot-iPhone 13 Mini-15.0 (1).png
|   |   |-- screenshot-iPhone 13 Mini-15.0 (2).png
|   |   |-- screenshot-iPhone 13 Mini-15.0 (3).png
|   |   |-- screenshot-iPhone 13 Mini-15.0 (4).png
|   |   |-- screenshot-iPhone 13 Mini-15.0.png
|   |   |-- svg-icons
|   |   |-- tenant_screenshot1.mp4
|   |   |-- tenant_screenshot2.mp4
|   |   |-- vertex_screenshot1.png
|   |   `-- vertex_screenshot2.png
|   |-- pages
|   |   |-- 404.js
|   |   |-- about.js
|   |   |-- contact.js
|   |   |-- index.js
|   |   |-- projects.js
|   |   |-- resume.js
|   |   |-- test-form.js
|   |   `-- test-form-success.js
|   |-- polyfills
|   |   `-- textencoder-inline.js
|   |-- utils
|   |   |-- buttonbase-fallback.js
|   |   |-- chip-fallback.js
|   |   |-- color-manipulator-fallback.js
|   |   |-- create-styled-fallback.js
|   |   |-- create-theme-fallback.js
|   |   |-- default-props-provider-fallback.js
|   |   |-- empty-module.js
|   |   |-- gatsby-fallback.js
|   |   |-- grid-fallback.js
|   |   |-- iconbutton-fallback.js
|   |   |-- init-color-scheme-script-fallback.js
|   |   |-- keywordTracker.js
|   |   |-- mui-cssbaseline-fallback.js
|   |   |-- mui-fallback.js
|   |   |-- mui-styles-fallback.js
|   |   |-- mui-system-fallback.js
|   |   |-- mui-utils-fallback.js
|   |   |-- react-icons-di-fallback.js
|   |   |-- react-icons-fa-fallback.js
|   |   |-- rtl-provider-fallback.js
|   |   |-- scriptWorker.js
|   |   |-- styled-fallback.js
|   |   |-- style-function-sx-fallback.js
|   |   |-- touchripple-fallback.js
|   |   |-- typography.js
|   |   |-- unstable-grid-fallback.js
|   |   |-- use-media-query-fallback.js
|   |   |-- use-theme-props-fallback.js
|   |   `-- use-theme-without-default-fallback.js
|   |-- workers
|   |   `-- projectFilter.worker.js
|   `-- wrap-root-element.js
|-- static
|   |-- android-chrome-192x192.png
|   |-- android-chrome-512x512.png
|   |-- apple-touch-icon.png
|   |-- favicon-16x16.png
|   |-- favicon-32x32.png
|   |-- favicon.ico
|   |-- fonts
|   |   |-- AvenirLTStd-Roman.svg
|   |   |-- AvenirLTStd-Roman.woff
|   |   |-- AvenirLTStd-Roman.woff2
|   |   |-- fonts.css
|   |   |-- HelveticaNeueLTStd-Bd.svg
|   |   |-- HelveticaNeueLTStd-Bd.woff
|   |   |-- HelveticaNeueLTStd-Bd.woff2
|   |   |-- HelveticaNeueLTStd-Roman.svg
|   |   |-- HelveticaNeueLTStd-Roman.woff
|   |   |-- HelveticaNeueLTStd-Roman.woff2
|   |   |-- SabonLTStd-Roman.svg
|   |   |-- SabonLTStd-Roman.woff
|   |   `-- SabonLTStd-Roman.woff2
|   |-- netlify-form.html
|   `-- robots.txt
`-- yandex_3ce929a7bc84e6a0.html
```

## Key Directories

### Root Configuration Files
- **gatsby-config.js**: Main Gatsby configuration with plugins and site metadata
- **gatsby-node.js**: Build-time Node.js APIs for custom functionality
- **gatsby-browser.js**: Browser APIs for client-side functionality
- **gatsby-ssr.js**: Server-side rendering APIs
- **babel.config.js**: Babel transpilation configuration
- **package.json**: Dependencies and build scripts
- **Dockerfile**: Multi-platform Docker containerization
- **docker-compose.yml**: Docker orchestration for local development
- **netlify.toml**: Netlify deployment configuration

### Source Directory (src/)

#### Components (src/components/)
Reusable React components organized by functionality:
- **Layout Components**: layout.js, header.js, GlobalStyles.js
- **SEO & Analytics**: seo.js, Analytics.js, ThirdPartyScripts.js
- **Performance**: PerformanceMonitor.js, MotionWrapper.js
- **Theme & Styling**: DarkModeToggle.js, SSRSafeDarkModeToggle.js
- **Animations**: TypingAnimation.js, SimpleTypingAnimation.js, CanvasTypingAnimation.js, StaggeredAnimation.js, PageTransition.js
- **Client-Only Wrappers**: ClientOnlyIcon.js, ClientOnlyButton.js, ClientOnlyMUI.js
- **Content Display**: CodeSnippet.js, CanvasCodeSnippet.js, projectCard.js, ProjectCardWithInView.js
- **Utility Components**: ErrorBoundary.js, image.js, logo.js, myLogo.js, ProtectedEmail.js, SocialShare.js, CTASection.js

#### Context (src/context/)
- **ThemeContext.js**: Dark/light mode state management with localStorage persistence

#### Data (src/data/)
- **keywords.js**: SEO keyword definitions and tracking

#### Documentation (src/docs/)
- **accessibility-checklist.md**: WCAG compliance checklist
- **webp-implementation.md**: Image optimization documentation

#### Custom Hooks (src/hooks/)
- **useDebounce.js**: Debouncing hook for performance optimization
- **useScrollAnimation.js**: Scroll-triggered animation effects
- **useWebWorker.js**: Web Worker integration for background processing

#### Pages (src/pages/)
- **index.js**: Homepage with hero and features
- **about.js**: Personal information and development approach
- **projects.js**: Portfolio project showcase gallery
- **contact.js**: Contact form with Netlify Forms integration
- **resume.js**: Online resume/CV
- **404.js**: Custom error page
- **test-form.js**: Form testing page
- **test-form-success.js**: Form submission success page

#### Images (src/images/)
Screenshots, videos, and assets for portfolio projects and site branding

#### Utilities (src/utils/)
Fallback modules and utility functions for graceful degradation:
- **MUI Fallbacks**: Component fallbacks when Material-UI fails to load
- **Icon Fallbacks**: React Icons fallbacks for reliability
- **Gatsby Fallbacks**: Graceful degradation for Gatsby-specific modules
- **Typography Utils**: Custom typography utilities
- **Workers**: scriptWorker.js for script loading optimization
- **Keyword Tracking**: keywordTracker.js for SEO analytics

#### Workers (src/workers/)
- **projectFilter.worker.js**: Web Worker for project filtering performance

#### Static Assets (static/)
- **Fonts**: Custom font files (Avenir, Helvetica Neue, Sabon) in multiple formats
- **Icons**: PWA icons and favicons for multiple device sizes
- **Configuration**: robots.txt, netlify-form.html

#### Scripts (scripts/)
Build and optimization scripts:
- **build-secure.js**: Security-enhanced production build
- **generate-csp-hashes.js**: Content Security Policy hash generation
- **optimize-deps.sh**: Dependency optimization

# External Resources

## Official Documentation

### Framework & Libraries
- **Gatsby Documentation**: https://www.gatsbyjs.com/docs/
  - Comprehensive guide for Gatsby static site generation
  - Plugin ecosystem and API references

- **React Documentation**: https://reactjs.org/docs/
  - Official React library documentation
  - Hooks, component patterns, and best practices

### Styling
- **Emotion Documentation**: https://emotion.sh/docs/introduction
  - CSS-in-JS styling with Emotion
  - Server-side rendering and theming

- **Styled Components Documentation**: https://styled-components.com/docs
  - Component-scoped styling patterns
  - Dynamic theming and prop-based styling

### Deployment & Infrastructure
- **Netlify Documentation**: https://docs.netlify.com/
  - Deployment configuration and edge functions
  - Form handling and serverless functions

### Code Quality
- **ESLint Airbnb Style Guide**: https://github.com/airbnb/javascript
  - JavaScript style guide and best practices
  - React-specific linting rules

### Build Tools
- **Webpack Documentation**: https://webpack.js.org/concepts/
  - Module bundling and optimization
  - Plugin configuration and performance tuning

## APIs and Services

### Analytics
- **Google Analytics**: https://analytics.google.com/
  - **Tracking ID**: G-NL37L9SVQ0
  - **Optimize ID**: GTM-N8HJBQM7
  - Purpose: User behavior tracking and conversion analysis

### Form Handling
- **Netlify Forms**: https://www.netlify.com/products/forms/
  - Built-in form handling with spam protection
  - Automatic form submissions and notifications

### Content Delivery
- **Netlify CDN**: https://www.netlify.com/products/edge/
  - Global edge network for fast content delivery
  - Automatic SSL and domain management

## External Libraries

### Animation & Interaction
- **Motion (Framer) 12.23.12**: Animations and page transitions
  - Smooth, declarative animations
  - Page transition orchestration

- **React Animated Cursor 2.11.2**: Custom cursor effects
  - Interactive cursor animations
  - Mouse tracking and visual feedback

### Icons & Typography
- **React Icons 5.5.0**: Icon library
  - Comprehensive icon sets (Font Awesome, Material Design, etc.)
  - Tree-shakeable icon components

- **Typography.js 0.16.24**: Typography system
  - Responsive typography scales
  - Vertical rhythm and font management

### Performance
- **Web Vitals 5.1.0**: Performance monitoring
  - Core Web Vitals measurement (LCP, FID, CLS)
  - Real user monitoring data

## Build Dependencies

### JavaScript Transpilation
- **Babel**: JavaScript transpilation for browser compatibility
  - **@babel/preset-react**: JSX transformation
  - **babel-plugin-module-resolver**: Module path resolution

### Module Bundling
- **Webpack**: Module bundling and optimization
  - **webpack-bundle-analyzer**: Bundle size visualization
  - **terser-webpack-plugin**: JavaScript minification
  - **css-minimizer-webpack-plugin**: CSS optimization

### Build Tools
- **Cheerio 1.1.2**: HTML parsing in build scripts
  - Server-side DOM manipulation
  - CSP hash generation

## Gatsby Plugins

### Image & Video Processing
- **gatsby-plugin-sharp**: Image processing and optimization
- **gatsby-transformer-sharp**: GraphQL image transformations
- **gatsby-plugin-image**: Next-gen image components
- **gatsby-transformer-ffmpeg**: Video file processing

### Progressive Web App
- **gatsby-plugin-manifest**: PWA manifest generation
- **gatsby-plugin-offline**: Service worker and offline support

### SEO & Indexing
- **gatsby-plugin-sitemap**: XML sitemap generation
- **gatsby-plugin-robots-txt**: Robots.txt automation
- **gatsby-plugin-google-gtag**: Google Analytics integration

### Performance Optimization
- **gatsby-plugin-preconnect**: DNS prefetch optimization
- **gatsby-plugin-react-svg**: SVG component optimization
- **gatsby-plugin-web-font-loader**: Web font loading strategy
- **gatsby-plugin-brotli**: Brotli compression
- **gatsby-plugin-zopfli**: Zopfli compression
- **gatsby-plugin-html-minifier**: HTML minification

## Custom Fonts

### Google Fonts
- **Domains**:
  - https://fonts.googleapis.com
  - https://fonts.gstatic.com

### Local Custom Fonts
- **AvenirLTStd-Roman.woff2**: Primary body text
- **HelveticaNeueLTStd-Bd.woff2**: Bold headings
- **HelveticaNeueLTStd-Roman.woff2**: Secondary text
- **SabonLTStd-Roman.woff2**: Serif accents

## Deployment Platforms

### Netlify
- **URL**: https://app.netlify.com
- **Live Site**: https://el-jefe.me
- **Features**:
  - Continuous deployment from Git
  - Form handling with spam protection
  - Edge functions for serverless computing
  - Automatic HTTPS with custom domains
  - Global CDN distribution

### Docker Hub
- **URL**: https://hub.docker.com/r/maxjeffwell/portfolio-gatsby
- **Image**: maxjeffwell/portfolio-gatsby
- **Platforms**: linux/amd64, linux/arm64
- Multi-platform container images for flexible deployment

## CI/CD

### GitHub Actions
- **CI Workflow**: .github/workflows/ci.yml
  - Automated testing and build verification
  - Node.js 20 environment
  - Dependency caching for faster builds

- **Docker Build & Push**: .github/workflows/docker-build-push.yml
  - Multi-platform Docker image builds
  - Trivy security vulnerability scanning
  - Automated push to Docker Hub on main branch
  - GitHub Security integration

## Security Tools

### Container Security
- **Trivy**: Container vulnerability scanning in CI/CD
  - Automated security checks
  - CVE detection and reporting

### Web Security
- **Content Security Policy**: XSS and injection attack prevention
  - Hash-based script execution
  - Restricted resource loading
  - Nonce-based inline scripts

## Social & Contact

- **GitHub**: https://github.com/maxjeffwell
- **Live Portfolio**: https://el-jefe.me
- **Email**: jeff@el-jefe.me

# Additional Context

## Production Performance Focus

This is a production portfolio website emphasizing extreme performance optimization and modern web development practices. The site is engineered to achieve sub-one-second mobile load times and consistently maintain Lighthouse scores above 95 across all categories.

## Dual CSS-in-JS Strategy

The project uniquely employs both Emotion and Styled Components for styling flexibility. This dual approach provides:
- Component-scoped styling with Emotion's css prop
- Styled Components for theme-aware component libraries
- Optimized server-side rendering support
- Dynamic theming for dark/light mode switching

**Important**: This dual approach requires careful attention to:
- SSR hydration consistency
- Bundle size optimization
- CSS extraction and deduplication

## Client-Only Component Pattern

Multiple client-only wrapper components handle browser APIs safely to prevent SSR hydration mismatches:
- **ClientOnlyIcon.js**: SVG icon components with browser API access
- **ClientOnlyMUI.js**: Material-UI components with window access
- **ClientOnlyButton.js**: Interactive buttons with browser-specific features

**Pattern**: These components use dynamic imports and useEffect hooks to ensure browser-only code execution after hydration.

## Fallback Utilities Architecture

Extensive fallback utilities in `src/utils/` directory provide graceful degradation when dependencies fail to load:
- **MUI Fallbacks**: Material-UI component substitutes
- **Icon Fallbacks**: React Icons component alternatives
- **Gatsby Fallbacks**: Core Gatsby module replacements
- **Style Fallbacks**: Emotion/Styled Components alternatives

**Purpose**: Ensures site functionality and reliability even when third-party dependencies encounter loading errors or network issues.

## Custom Build Scripts

Critical build optimization scripts in `scripts/` directory:
- **build-secure.js**: Enhanced production build with security hardening
- **generate-csp-hashes.js**: Automated Content Security Policy hash generation
- **optimize-deps.sh**: Dependency tree optimization and cleanup

**Integration**: These scripts are integrated into the build pipeline and are essential for achieving security and performance targets.

## Docker Multi-Platform Support

Full Docker containerization with multi-platform builds:
- **Platforms**: linux/amd64, linux/arm64
- **Base Image**: Node.js 18 Alpine for minimal footprint
- **Nginx**: Production web server with optimized configuration
- **Build Cache**: Layer caching for faster builds

**Deployment**: Docker images are automatically built and pushed to Docker Hub via GitHub Actions on every main branch commit.

## Security Implementation

### Content Security Policy
- Hash-based integrity checks for inline scripts
- Restricted resource loading domains
- XSS and injection attack mitigation
- Nonce-based script execution

### Form Security
- CSRF protection via Netlify Forms
- Input validation and sanitization
- Honeypot spam protection
- Rate limiting on submissions

### Vulnerability Scanning
- Trivy security scanning in CI/CD pipeline
- Automated CVE detection and reporting
- GitHub Security integration for alerts

## Progressive Enhancement Philosophy

The site is built with progressive enhancement principles:
- **Core Functionality**: Works without JavaScript
- **Enhanced Experience**: Animations, interactions, and advanced features when JavaScript is available
- **Web Workers**: Background processing for filtering and heavy computations
- **Cursor Effects**: Interactive custom cursor when supported
- **Theme Persistence**: Dark/light mode saved to localStorage

## Theme System Architecture

ThemeContext provides centralized theme management:
- **System Preference Detection**: Automatically detects user's OS theme preference
- **Manual Toggle**: User can override system preference
- **localStorage Persistence**: Theme choice persisted across sessions
- **Component Propagation**: Theme state available via React Context
- **CSS Variables**: Dynamic CSS custom properties for theme values

## CI/CD Pipeline

### GitHub Actions Workflows

**Continuous Integration**:
- Node.js 20 environment
- Legacy peer dependencies handling
- Production build verification
- Artifact upload for deployment
- Docker test builds

**Docker Publishing**:
- Multi-platform builds (amd64, arm64)
- Trivy vulnerability scanning
- Semantic versioning
- Automated push on main branch
- GitHub Container Registry integration

## SEO Strategy

### Technical SEO
- **XML Sitemap**: Auto-generated with priority and changefreq metadata
- **Robots.txt**: Automated generation with crawl directives
- **Structured Data**: JSON-LD schema for search engines
- **Canonical URLs**: Proper canonical URL management
- **Open Graph**: Social media preview optimization
- **Twitter Cards**: Rich Twitter preview cards

### Content Optimization
- Semantic HTML5 structure
- Descriptive alt text for all images
- Keyword-optimized meta descriptions
- Internal linking strategy
- Mobile-first responsive design

### Performance SEO
- Core Web Vitals optimization
- Sub-one-second mobile page load
- WebP/AVIF image formats
- Lazy loading for images and videos
- Code splitting for minimal initial bundle

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Semantic HTML and ARIA labels
- **Color Contrast**: Minimum 4.5:1 contrast ratios
- **Focus Indicators**: Visible focus states
- **Form Labels**: Properly associated form controls
- **Heading Hierarchy**: Logical document outline

### Testing
- jsx-a11y ESLint rules enforced
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS)
- Color contrast analysis tools

## Image Optimization Pipeline

### Processing Strategy
- **Formats**: WebP (quality 65), AVIF (quality 50), auto-fallback
- **Responsive**: 375px, 480px, 768px, 1024px breakpoints
- **Placeholder**: Dominant color extraction
- **Lazy Loading**: Intersection Observer API
- **Progressive Enhancement**: Blur-up technique

### Video Optimization
- FFmpeg processing for video files
- Multiple format generation
- Thumbnail extraction
- Compression optimization

## Known Considerations

### Performance Trade-offs
1. **Dual CSS-in-JS**: Slight bundle size increase for styling flexibility
2. **Fallback Utilities**: Additional code for reliability
3. **Web Workers**: More complex build but better runtime performance
4. **Animation Libraries**: Motion library adds bundle size but improves UX

### Browser Compatibility
- Modern browsers (ES2022 support required)
- Progressive enhancement for older browsers
- Polyfills for critical features
- Fallback experiences for unsupported features

### Development Considerations
1. Always test dark/light mode changes in both themes
2. Verify client-only components don't cause hydration errors
3. Check bundle size after adding new dependencies
4. Run Lighthouse audits before deploying
5. Test form submissions with Netlify Forms
6. Validate accessibility with keyboard navigation

# Testing Instructions

## Unit Tests
Currently, unit tests are not implemented. The test script in package.json is a placeholder.

**Future Implementation**:
```bash
npm test
```

Recommended testing libraries:
- Jest for unit testing
- React Testing Library for component testing
- Cypress or Playwright for E2E testing

## Linting
Run ESLint to check for code quality issues:
```bash
npm run lint
```

## Code Formatting
Format code with Prettier:
```bash
npm run format
```

## Manual Testing Checklist

### Performance Testing
1. Run Lighthouse audit (target: 95+ score)
2. Check Core Web Vitals (FCP < 1.2s, LCP < 2.5s, CLS < 0.1)
3. Test on 3G/4G network throttling
4. Verify bundle size with webpack-bundle-analyzer

### Functionality Testing
1. Test dark/light mode switching
2. Verify contact form submission
3. Test navigation across all pages
4. Check responsive design at multiple breakpoints (375px, 768px, 1024px, 1200px)
5. Validate PWA installation
6. Test offline functionality

### Accessibility Testing
1. Keyboard navigation (Tab, Enter, Escape, Arrow keys)
2. Screen reader testing (NVDA, JAWS, VoiceOver)
3. Color contrast validation
4. Focus indicator visibility
5. Form label associations
6. Heading hierarchy

### Browser Testing
Test in the following browsers:
- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Security Testing
1. Verify CSP headers in production
2. Check HTTPS enforcement
3. Test form spam protection
4. Validate input sanitization

# Build Steps

## Prerequisites

Ensure you have the following installed:
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

Verify versions:
```bash
node --version
npm --version
```

## Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/maxjeffwell/portfolio-gatsby.git
cd portfolio-gatsby
npm install --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is required due to peer dependency conflicts between packages.

## Development

### Start Development Server
```bash
npm start
# or
gatsby develop
```

The development server will start at:
- **Site URL**: http://localhost:8000
- **GraphQL Explorer**: http://localhost:8000/___graphql

Features:
- Hot module replacement (HMR)
- Instant page refresh on file changes
- GraphQL query development interface
- Error overlay for debugging

### Development Tips
1. Use GraphQL Explorer to test queries
2. Check browser console for warnings
3. Monitor bundle size during development
4. Test responsive breakpoints with DevTools

## Production Build

### Standard Build
```bash
npm run build
```

This command:
1. Builds static site files
2. Generates CSP hashes
3. Optimizes images (WebP/AVIF)
4. Minifies JavaScript and CSS
5. Creates service worker

Output directory: `public/`

### Secure Build (Enhanced)
```bash
npm run build:secure
```

Additional optimizations:
- Disables source maps
- Runs security hardening script
- Generates CSP hashes
- Extra minification passes

### Netlify Build
```bash
npm run build:netlify
```

Optimized for Netlify deployment:
- Disables code uglification (Netlify handles it)
- Faster build times
- Legacy peer dependencies handling

### Bundle Analysis
```bash
npm run build:analyze
```

Generates interactive bundle size analysis:
- Identifies large dependencies
- Visualizes bundle composition
- Helps optimize bundle size

## Serve Production Build Locally

Preview the production build:
```bash
gatsby serve
# or
npm run serve
```

Serves the `public/` directory at http://localhost:9000

## Docker Build

### Build Docker Image
```bash
docker build -t portfolio-gatsby .
```

### Run Docker Container
```bash
docker run -p 80:80 portfolio-gatsby
```

Access at http://localhost

### Multi-Platform Build
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t maxjeffwell/portfolio-gatsby:latest .
```

## Deployment

### Netlify Deployment (Automatic)
Automatic deployment on push to main branch:
1. Push to GitHub main branch
2. Netlify automatically builds and deploys
3. Check deployment status badge in README

### Manual Netlify Deployment
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=public
```

### Docker Deployment
```bash
docker-compose up -d
```

## Environment Variables

No environment variables are required for basic functionality. Optional:
- `ANALYZE=true`: Enable bundle analyzer
- `GENERATE_SOURCEMAP=false`: Disable source maps
- `NODE_ENV=production`: Production optimizations

## Troubleshooting

### Build Errors

**Dependency Conflicts**:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Cache Issues**:
```bash
gatsby clean
npm run build
```

**Memory Issues**:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Performance Issues
1. Run bundle analyzer to identify large dependencies
2. Check image optimization settings in gatsby-config.js
3. Verify code splitting is working correctly
4. Check for unnecessary re-renders with React DevTools

### Common Issues

**Hydration Mismatch**:
- Ensure client-only components use proper wrappers
- Check for server/client rendering differences
- Verify localStorage access only happens in useEffect

**Image Processing Failures**:
- Ensure Sharp has proper system dependencies
- Check image file formats and sizes
- Verify gatsby-plugin-sharp configuration

**Theme Not Persisting**:
- Check localStorage is available
- Verify ThemeContext is properly wrapped
- Check for SSR issues with theme detection

## Post-Build Verification

After building, verify:
1. Check bundle size (target: < 500KB initial bundle)
2. Validate HTML minification
3. Confirm image optimization (WebP/AVIF generation)
4. Test service worker registration
5. Verify sitemap generation
6. Check robots.txt creation
7. Validate CSP hash generation

## Optimization Tips

### Build Time Optimization
- Use `--parallel` flag for faster builds
- Enable Gatsby build caching
- Optimize image processing settings
- Use incremental builds when possible

### Runtime Performance
- Monitor Core Web Vitals
- Lazy load images and components
- Use code splitting for large components
- Minimize JavaScript bundle size
- Leverage browser caching

### SEO Optimization
- Validate structured data with Google Rich Results Test
- Check sitemap with Google Search Console
- Verify Open Graph tags with Facebook Debugger
- Test Twitter Cards with Twitter Card Validator
