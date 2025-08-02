# Jeff Maxwell's Developer Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/54a79ae3-eb7d-47a5-b7a0-ece69d629199/deploy-status)](https://app.netlify.com/sites/jovial-chandrasekhar-b8b6b4/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Gatsby](https://img.shields.io/badge/Gatsby-5.14.5-663399.svg)](https://www.gatsbyjs.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)](https://reactjs.org/)

A modern, high-performance developer portfolio built with Gatsby and React, featuring responsive design, dark mode support, animated components, and optimized performance targeting sub-one-second load times.

🌐 **Live Site**: [https://jeffmaxwell.dev](https://jeffmaxwell.dev)

## 📸 Screenshots

[![Home](https://i.gyazo.com/48e97ab602636db45a32a882876a32d5.png)](https://gyazo.com/48e97ab602636db45a32a882876a32d5)

[![Bio](https://i.gyazo.com/2b28b3bae23de9f12e2b53439cb638d4.png)](https://gyazo.com/2b28b3bae23de9f12e2b53439cb638d4)

[![Projects](https://i.gyazo.com/f69c5433c0c23028e6ea040163c99c8e.png)](https://gyazo.com/f69c5433c0c23028e6ea040163c99c8e)

## ✨ Features

### Core Features
- **Modern Stack**: Built with Gatsby 5.14.5, React 18.3.1, and Styled Components
- **Performance Optimized**: Sub-one-second mobile page load targeting with image optimization
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Dark Mode**: Complete theme system with user preference persistence
- **SEO Ready**: Comprehensive meta tags, Open Graph, structured data, and sitemap
- **Progressive Web App**: Manifest file and offline-ready architecture
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation support

### Interactive Elements
- **Animated Components**: Page transitions, staggered animations, and micro-interactions
- **Custom Code Snippets**: Interactive canvas-based code examples with syntax highlighting
- **Form Handling**: Contact form with Netlify integration and validation
- **Icon System**: Custom SVG icon library with theme-aware colors
- **Dynamic Typography**: Responsive font sizing and custom font loading

### Performance & SEO
- **Image Optimization**: WebP format support, lazy loading, and responsive images
- **Bundle Optimization**: Code splitting, tree shaking, and minimal JavaScript
- **Content Security Policy**: Secure headers and XSS protection
- **Search Engine Optimization**: Meta tags, structured data, and XML sitemap
- **Analytics Ready**: Google Analytics integration with privacy controls

## 🛠️ Technology Stack

### Core Technologies
- **[Gatsby](https://www.gatsbyjs.com/)** (v5.14.5) - Static site generator with React
- **[React](https://reactjs.org/)** (v18.3.1) - UI library with hooks and context
- **[Styled Components](https://styled-components.com/)** (v6.1.19) - CSS-in-JS styling solution
- **[Emotion](https://emotion.sh/)** (v11.14.0) - Additional CSS-in-JS capabilities

### Gatsby Plugins & Extensions
- **gatsby-plugin-image** - Next-gen responsive image optimization
- **gatsby-plugin-sharp** & **gatsby-transformer-sharp** - Image processing pipeline
- **gatsby-plugin-manifest** - PWA manifest and app icon generation
- **gatsby-plugin-sitemap** - XML sitemap for search engines
- **gatsby-plugin-robots-txt** - Robots.txt file generation
- **gatsby-plugin-react-helmet-async** - Document head management
- **gatsby-plugin-react-svg** - SVG component optimization
- **gatsby-plugin-preconnect** - DNS prefetch for performance
- **gatsby-plugin-web-font-loader** - Optimized web font loading

### Development Tools
- **ESLint** - Code linting with Airbnb configuration
- **Prettier** - Automated code formatting
- **webpack-bundle-analyzer** - Bundle size analysis and optimization
- **Netlify** - Continuous deployment and form handling

### UI & Animation Libraries
- **React Icons** (v5.5.0) - Comprehensive icon library
- **Motion** (v12.23.12) - Advanced animation library
- **React Animated Cursor** (v2.11.2) - Custom cursor animations
- **Typography.js** - Responsive typography system

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher

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

### Development Tools
- GraphQL Explorer: `http://localhost:8000/___graphql`
- Bundle Analyzer: `npm run build:analyze`

### Available Scripts

```bash
npm start                # Start development server
npm run build           # Build production site
npm run build:netlify   # Build for Netlify (no uglify)
npm run build:secure    # Build with enhanced security
npm run build:analyze   # Build with bundle analysis
npm run serve           # Serve production build locally
npm run format          # Format code with Prettier
npm test                # Run tests (placeholder)
```

## 📁 Project Structure

```
src/
├── components/
│   ├── CanvasCodeSnippet.js    # Animated code display component
│   ├── ClientOnlyIcon.js       # SVG icon management system
│   ├── DarkModeToggle.js       # Theme switcher with persistence
│   ├── header.js               # Navigation with mobile responsiveness
│   ├── layout.js               # Main layout with footer and globals
│   ├── logo.js                 # Brand logos with dark mode support
│   ├── PageTransition.js       # Smooth page transitions
│   ├── projectCard.js          # Interactive project showcase cards
│   ├── seo.js                  # SEO metadata management
│   ├── SimpleTypingAnimation.js # Text typing animation effects
│   ├── StaggeredAnimation.js   # Coordinated animation sequences
│   └── image.js                # Optimized image wrapper
├── context/
│   └── ThemeContext.js         # Dark/light mode state management
├── data/
│   ├── keywords.js             # SEO keyword definitions
│   └── projects.js             # Project portfolio data
├── pages/
│   ├── index.js                # Homepage with hero and features
│   ├── about.js                # About page with personal info
│   ├── contact.js              # Contact form with validation
│   ├── projects.js             # Project showcase gallery
│   └── 404.js                  # Custom error page
├── images/
│   ├── screenshots/            # Project screenshots
│   └── svg-icons/             # Custom SVG icon library
├── styles/                     # Global styles and themes
└── utils/                      # Utility functions and helpers
```

## 🎨 Design System

### Color Palette
- **Primary**: `#1565c0` (Blue) - Main brand color
- **Secondary**: `#e91e63` (Pink) - Accent and highlights  
- **Success**: `#4caf50` (Green) - Success states
- **Warning**: `#ff9800` (Orange) - Warnings and attention
- **Error**: `#f44336` (Red) - Error states

### Dark Mode Support
- Automatic system preference detection
- Manual toggle with persistence
- Theme-aware SVG icons and images
- Optimized contrast ratios for accessibility

### Typography
- **Primary Font**: System font stack with fallbacks
- **Code Font**: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas'
- **Custom Fonts**: Avenir, Helvetica Neue, Sabon (selectively loaded)
- **Responsive Sizing**: `clamp()` functions for optimal scaling

### Responsive Breakpoints
```css
Mobile: 320px - 767px
Tablet: 768px - 1023px  
Desktop: 1024px+
Wide: 1200px+
```

## 🔧 Configuration

### Gatsby Configuration
The main configuration is in `gatsby-config.js`:
- Site metadata and SEO defaults
- Plugin configuration and options
- Image processing settings
- PWA manifest configuration
- Content Security Policy headers

### Theme Configuration
Theme settings in `src/context/ThemeContext.js`:
- Dark/light mode definitions
- Color palette management
- User preference persistence
- Component theme propagation

### Environment Variables
No environment variables required for basic functionality. Optional configurations:
- `ANALYZE=true` - Enable bundle analyzer
- `GENERATE_SOURCEMAP=false` - Disable source maps in production
- `NODE_ENV=production` - Production build optimizations

## 📈 Performance Optimizations

### Current Metrics
- **Lighthouse Performance**: 95+ score
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s

### Optimization Techniques
- **Image Optimization**: WebP format, responsive sizing, lazy loading
- **Code Splitting**: Route-based and component-based splitting
- **Resource Hints**: Preconnect, prefetch for critical resources
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Critical CSS**: Inline critical styles, defer non-critical CSS
- **Font Loading**: Optimized web font loading with fallbacks
- **Service Worker**: Offline functionality and caching strategies

## 🚢 Deployment

### Automatic Deployment (Netlify)
The site automatically deploys to Netlify on pushes to the main branch:
- Build command: `npm run build:netlify`
- Publish directory: `public/`
- Environment: Node.js 18.x
- Form handling: Netlify Forms integration
- Headers: Security headers and CSP

### Manual Deployment Options

#### Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=public
```

#### Vercel
```bash
npm install -g vercel
npm run build
vercel --prod
```

#### GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d public
```

## 🧪 Testing & Quality Assurance

### Code Quality
- **ESLint**: Airbnb configuration with React hooks support
- **Prettier**: Consistent code formatting across the project
- **Accessibility**: jsx-a11y plugin for accessibility compliance
- **Performance**: Bundle size monitoring and optimization

### Browser Testing
- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Performance Testing
- Lighthouse CI integration
- WebPageTest monitoring
- Bundle size regression testing
- Core Web Vitals tracking

## 📱 Progressive Web App Features

### Manifest Configuration
- App icons for multiple device sizes
- Theme color definitions
- Display mode and orientation preferences
- Start URL and scope definitions

### Offline Support
- Service worker registration
- Cache-first strategies for static assets
- Network-first for dynamic content
- Offline fallback pages

### Installation Prompts
- Add to home screen functionality
- Custom installation prompts
- iOS and Android compatibility

## 🔐 Security Features

### Content Security Policy
- Strict CSP headers for XSS protection
- Nonce-based script execution
- Restricted resource loading
- Hash-based integrity checks

### Form Security
- CSRF protection with Netlify Forms
- Input validation and sanitization
- Spam protection with honeypot fields
- Rate limiting on form submissions

## 📧 Contact Form Integration

### Features
- Real-time validation with user feedback
- Netlify Forms backend integration
- Honeypot spam protection
- Success/error state management
- Accessible form design with ARIA labels

### Form Handling
- Client-side validation
- Server-side processing via Netlify
- Email notifications
- Form submission analytics

## 🎯 SEO Strategy

### Technical SEO
- XML sitemap generation
- Robots.txt configuration
- Canonical URL management
- Structured data (JSON-LD)
- Open Graph and Twitter Card meta tags

### Content Optimization
- Semantic HTML structure
- Descriptive alt text for images
- Keyword-optimized content
- Internal linking strategy
- Page speed optimization

### Analytics & Monitoring
- Google Analytics 4 integration
- Search Console monitoring
- Core Web Vitals tracking
- Conversion goal setup

## 🔄 Continuous Integration

### GitHub Actions (Future Enhancement)
```yaml
# Planned CI/CD pipeline
- Code quality checks (ESLint, Prettier)
- Bundle size regression testing
- Lighthouse performance testing
- Automated dependency updates
- Security vulnerability scanning
```

### Build Optimization
- Dependency caching
- Incremental builds
- Parallelized processing
- Build artifact optimization

## 📊 Analytics & Monitoring

### Performance Monitoring
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Bundle size monitoring
- Error tracking and reporting

### User Analytics
- Page view tracking
- User interaction events
- Conversion funnel analysis
- A/B testing capabilities

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code style
4. Run tests and linting (`npm run format`)
5. Commit with descriptive messages
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with detailed description

### Code Standards
- Follow Airbnb ESLint configuration
- Use Prettier for code formatting
- Write descriptive commit messages
- Add comments for complex logic
- Ensure accessibility compliance
- Test across multiple browsers

### Bug Reports
When reporting bugs, please include:
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Jeff Maxwell**
- Email: [maxjeffwell@gmail.com](mailto:maxjeffwell@gmail.com)
- GitHub: [@maxjeffwell](https://github.com/maxjeffwell)
- Portfolio: [https://jeffmaxwell.dev](https://jeffmaxwell.dev)
- LinkedIn: [Jeff Maxwell](https://linkedin.com/in/jeffreymaxwell)

## 🙏 Acknowledgments

- **Gatsby Community** - For the amazing static site generator
- **React Team** - For the excellent UI library
- **Netlify** - For seamless deployment and hosting
- **Design Inspiration** - Various portfolio sites and design systems
- **Open Source Contributors** - All the package maintainers and contributors

## 📈 Roadmap

### Version 1.0 (Current)
- ✅ Core portfolio functionality
- ✅ Dark mode implementation  
- ✅ Contact form integration
- ✅ Performance optimization
- ✅ SEO implementation

### Version 1.1 (In Progress)
- 🔄 Sub-one-second mobile load time
- 🔄 Enhanced animations and micro-interactions
- 🔄 Improved accessibility features
- 🔄 Advanced SEO optimizations

### Version 1.2 (Planned)
- 📝 Blog section with MDX support
- 📝 CMS integration for content management
- 📝 Advanced analytics implementation
- 📝 Multi-language support
- 📝 Enhanced PWA features

### Version 2.0 (Future)
- 🔮 Server-side rendering (SSR) capabilities
- 🔮 Advanced personalization features
- 🔮 AI-powered content recommendations
- 🔮 Real-time collaboration features

---

<div align="center">

**Made with ❤️ and ☕ by Jeff Maxwell**

*Building the web, one component at a time*

[![Netlify Status](https://api.netlify.com/api/v1/badges/54a79ae3-eb7d-47a5-b7a0-ece69d629199/deploy-status)](https://app.netlify.com/sites/jovial-chandrasekhar-b8b6b4/deploys)

</div>