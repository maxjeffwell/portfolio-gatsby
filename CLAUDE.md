# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Jeff Maxwell's Developer Portfolio** is a static portfolio website built with Gatsby, showcasing development projects and professional information. The site emphasizes performance optimization, modern web standards, and responsive design with a focus on sub-one-second mobile page speed.

## Commands

### Development
- `gatsby develop` or `npm start` - Start development server with hot reloading
- `gatsby build` or `npm run build` - Build production static site
- `gatsby serve` - Serve production build locally
- `npm run format` - Format code with Prettier (JS/JSX files)
- `npm test` - Placeholder test command

### Linting & Formatting
- ESLint configured with Airbnb style guide and Prettier integration
- Automatic code formatting on save with Prettier
- React-specific linting rules and accessibility checks

## Architecture

### Gatsby Configuration (`gatsby-config.js`)
The site uses multiple Gatsby plugins for optimization and functionality:

**Core Plugins:**
- `gatsby-plugin-react-helmet` - Document head management
- `gatsby-plugin-sharp` + `gatsby-transformer-sharp` - Image processing and optimization
- `gatsby-source-filesystem` - File system source for images
- `gatsby-plugin-manifest` - PWA manifest generation

**Styling & Fonts:**
- `gatsby-plugin-emotion` - CSS-in-JS with Emotion
- `gatsby-plugin-web-font-loader` - Custom font loading
- Custom font families: Avenir, Helvetica Neue, Sabon

**Performance & SEO:**
- `gatsby-plugin-preconnect` - DNS prefetch for key domains
- `gatsby-plugin-react-svg` - SVG component optimization
- Progressive Web App capabilities

### Site Structure

**Pages** (`src/pages/`):
- `/` - Homepage with introduction and navigation
- `/about/` - Personal information and development team
- `/projects/` - Portfolio projects showcase
- `/404/` - Custom 404 error page

**Components** (`src/components/`):
- `layout.js` - Main layout wrapper with global styles and footer
- `header.js` - Site navigation header
- `seo.js` - SEO metadata management
- `projectCard.js` - Reusable project display component
- `image.js` - Optimized image component
- `logo.js` + `myLogo.js` - Brand/logo components

### Styling Architecture

**Emotion CSS-in-JS:**
- Styled components with `@emotion/styled`
- Inline styles with `@emotion/core` css prop
- Global styles defined in layout component
- Responsive design with CSS Grid and media queries

**Design System:**
- Primary colors: `#fc4a1a` (orange), `#052f5f` (blue), `#f7b733` (yellow)
- Typography: Custom font stack with fallbacks
- Grid-based layouts for responsive design
- Consistent spacing and color palette

### GraphQL Data Layer

**Static Queries:**
- Site metadata queries for title, author, creation date
- Image queries using gatsby-image for optimization
- Fragment-based image queries for different sizes

**Image Processing:**
- Automatic responsive images with gatsby-image
- Multiple image formats and sizes generated
- Lazy loading and progressive image enhancement

## Key Technologies

- **Gatsby 2.32.3** - Static site generator with React
- **React 16.14.0** - Component-based UI library
- **Emotion 10.x** - CSS-in-JS styling solution
- **GraphQL** - Data layer for static content
- **React Helmet 5.2.1** - Document head management
- **React Icons 3.11.0** - Icon component library

## Development Dependencies

- **ESLint** - Code linting with Airbnb configuration
- **Prettier** - Code formatting
- **@hot-loader/react-dom** - Hot reloading for development
- **gatsby-plugin-eslint** - ESLint integration with Gatsby

## Project Structure

```
src/
├── components/
│   ├── layout.js           # Main layout with global styles
│   ├── header.js           # Site navigation header
│   ├── seo.js              # SEO metadata component
│   ├── projectCard.js      # Project showcase component
│   ├── image.js            # Optimized image component
│   ├── logo.js             # Brand logo component
│   └── myLogo.js           # Personal logo component
├── pages/
│   ├── index.js            # Homepage
│   ├── about.js            # About page
│   ├── projects.js         # Projects showcase
│   └── 404.js              # Error page
├── images/                 # Static assets and screenshots
└── static/
    └── fonts/              # Custom font files
```

## Performance Optimization

### Image Optimization
- gatsby-image for responsive images
- WebP format generation
- Lazy loading and progressive enhancement
- Multiple breakpoint optimization

### Font Loading
- Custom web font loader
- Font display optimization
- Local font file hosting

### Build Optimization
- Static site generation for fast loading
- Code splitting and lazy loading
- CSS optimization and minification

## Deployment

**Netlify Integration:**
- Continuous deployment from Git repository
- Build status badge in README
- Custom domain configuration (`jeffmaxwell.dev`)
- Automatic HTTPS and CDN distribution

**PWA Features:**
- Web app manifest
- Service worker registration
- App icons for multiple device sizes
- Offline functionality preparation

## Content Management

### Project Data
Projects are defined as JavaScript objects in `projects.js`:
- Title, date, description
- Source code and hosted URLs
- Technology stack icons and descriptions
- Screenshot images

### SEO Optimization
- Meta tags for each page
- Open Graph and Twitter Card data
- Structured data for search engines
- Semantic HTML markup

## Development Notes

### Hot Reloading Setup
- Custom webpack configuration in `gatsby-node.js`
- React hot loader integration for development
- Automatic page regeneration on content changes

### Code Quality
- ESLint with Airbnb configuration
- Prettier for consistent formatting
- Accessibility linting with jsx-a11y
- React best practices enforcement

### Responsive Design
- CSS Grid for layout structure
- Mobile-first responsive breakpoints
- Touch-friendly navigation and interactions
- Performance optimization for mobile devices

## External Integrations

**Social Links:**
- GitHub profile and repositories
- LinkedIn professional profile
- AngelList startup profile
- Direct contact information

**Performance Monitoring:**
- Netlify build status tracking
- Web vitals monitoring preparation
- Page speed optimization targets

## Environment Variables

No environment variables required for basic functionality. All configuration is handled through `gatsby-config.js` and static content.

## Browser Support

- Modern browsers with ES6+ support
- Progressive enhancement for older browsers
- Mobile-first responsive design
- Touch device optimization

## Future Enhancements

- Achieve sub-one-second mobile page speed
- Enhanced SEO optimization
- Additional project showcase features
- Performance monitoring integration