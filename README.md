# Jeff Maxwell's Developer Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/54a79ae3-eb7d-47a5-b7a0-ece69d629199/deploy-status)](https://app.netlify.com/sites/jovial-chandrasekhar-b8b6b4/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Gatsby](https://img.shields.io/badge/Gatsby-5.14.5-663399.svg)](https://www.gatsbyjs.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)

A modern, performant developer portfolio built with Gatsby and React, featuring a Material-UI design system, optimized images, and responsive layouts.

🌐 **Live Site**: [https://www.el-jefe.me](https://www.el-jefe.me)

## 📸 Screenshots

[![Home](https://i.gyazo.com/48e97ab602636db45a32a882876a32d5.png)](https://gyazo.com/48e97ab602636db45a32a882876a32d5)

[![Bio](https://i.gyazo.com/2b28b3bae23de9f12e2b53439cb638d4.png)](https://gyazo.com/2b28b3bae23de9f12e2b53439cb638d4)

[![Projects](https://i.gyazo.com/f69c5433c0c23028e6ea040163c99c8e.png)](https://gyazo.com/f69c5433c0c23028e6ea040163c99c8e)

## ✨ Features

- **Modern Stack**: Built with Gatsby 5, React 18, and Material-UI 7
- **Performance Optimized**: Image optimization with gatsby-image, lazy loading, and progressive enhancement
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Dark Mode**: Theme toggle with system preference detection
- **SEO Ready**: Comprehensive meta tags, Open Graph, and structured data
- **Progressive Web App**: Manifest file and offline-ready architecture
- **Continuous Deployment**: Automated builds and deploys via Netlify

## 🛠️ Technology Stack

### Core
- **[Gatsby](https://www.gatsbyjs.com/)** (v5.14.5) - Static site generator
- **[React](https://reactjs.org/)** (v18.3.1) - UI library
- **[Material-UI](https://mui.com/)** (v7.2.0) - Component library and design system
- **[Emotion](https://emotion.sh/)** (v11.14.0) - CSS-in-JS styling

### Tools & Plugins
- **gatsby-plugin-image** - Responsive image optimization
- **gatsby-plugin-sharp** & **gatsby-transformer-sharp** - Image processing
- **gatsby-plugin-manifest** - PWA manifest generation
- **gatsby-plugin-sitemap** - SEO sitemap generation
- **react-helmet-async** - Document head management
- **react-icons** - Icon library

### Development
- **ESLint** - Code linting with Airbnb config
- **Prettier** - Code formatting
- **webpack-bundle-analyzer** - Bundle size analysis

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/maxjeffwell/portfolio-gatsby.git
cd portfolio-gatsby
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The site will be running at `http://localhost:8000`

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build production site
npm run serve      # Serve production build locally
npm run format     # Format code with Prettier
npm test           # Run tests (placeholder)
```

## 📁 Project Structure

```
src/
├── components/
│   ├── DarkModeToggle.js   # Theme switcher component
│   ├── header.js           # Site navigation
│   ├── layout.js           # Main layout wrapper
│   ├── projectCard.js      # Project showcase cards
│   ├── seo.js              # SEO metadata component
│   ├── SkillsSection.js    # Skills display component
│   └── image.js            # Optimized image component
├── pages/
│   ├── index.js            # Homepage
│   ├── about.js            # About page
│   ├── projects.js         # Projects showcase
│   └── 404.js              # Custom 404 page
├── images/                 # Static assets
└── styles/                 # Global styles
```

## 🎨 Design System

### Colors
- Primary: `#fc4a1a` (Orange)
- Secondary: `#052f5f` (Blue)
- Accent: `#f7b733` (Yellow)
- Dark mode support with Material-UI theming

### Typography
- Custom font stack: Avenir, Helvetica Neue, Sabon
- Responsive font sizing
- Optimized web font loading

## 🔧 Configuration

### Gatsby Configuration
The main configuration is in `gatsby-config.js`:
- Site metadata
- Plugin configuration
- Image processing settings
- PWA manifest settings

### Environment Variables
No environment variables required for basic functionality.

## 📈 Performance

- Lighthouse scores targeting 90+ across all metrics
- Optimized images with WebP format
- Code splitting and lazy loading
- Minimal JavaScript bundle size
- Fast initial page load

## 🚢 Deployment

The site is automatically deployed to Netlify on push to the main branch.

### Manual Deployment

1. Build the production site:
```bash
npm run build
```

2. The static files will be in the `public/` directory

3. Deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## 📝 Next Steps

### Performance Enhancements
- [ ] Achieve sub-1-second mobile page load time (currently ~1.9s)
- [ ] Implement service worker for offline functionality
- [ ] Add resource hints (preconnect, prefetch) for critical resources
- [ ] Optimize font loading strategy
- [ ] Implement critical CSS extraction

### Feature Additions
- [ ] Blog section with MDX support
- [ ] Project filtering and search functionality
- [ ] Contact form with backend integration
- [ ] Newsletter signup
- [ ] RSS feed generation
- [ ] Comments system for projects

### SEO & Analytics
- [ ] Add Google Analytics or privacy-friendly alternative
- [ ] Implement structured data for projects
- [ ] Add XML sitemap submission to search engines
- [ ] Implement canonical URLs
- [ ] Add social media preview cards

### Developer Experience
- [ ] Add unit tests with Jest and React Testing Library
- [ ] Implement E2E tests with Cypress
- [ ] Set up Storybook for component development
- [ ] Add commit hooks with Husky
- [ ] Implement GitHub Actions for CI/CD
- [ ] Add bundle size monitoring

### Content Management
- [ ] Integrate with a headless CMS (Contentful, Strapi)
- [ ] Add markdown support for project descriptions
- [ ] Implement dynamic project data loading
- [ ] Add project categories and tags
- [ ] Create admin interface for content updates

### Accessibility
- [ ] Full WCAG 2.1 AA compliance audit
- [ ] Keyboard navigation improvements
- [ ] Screen reader testing and optimization
- [ ] Add skip navigation links
- [ ] Implement focus management for SPAs

### UI/UX Improvements
- [ ] Add page transitions and animations
- [ ] Implement skeleton screens for loading states
- [ ] Add micro-interactions and hover effects
- [ ] Create custom 404 page with navigation
- [ ] Add breadcrumb navigation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Jeff Maxwell**

- Email: [maxjeffwell@gmail.com](mailto:maxjeffwell@gmail.com)
- GitHub: [@maxjeffwell](https://github.com/maxjeffwell)
- Portfolio: [https://www.el-jefe.me](https://www.el-jefe.me)

---

Made with ❤️ and ☕ by Jeff Maxwell