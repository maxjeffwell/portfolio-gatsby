# Third-Party Script Management with Gatsby Script API

This project uses the Gatsby Script API to optimize the loading of third-party scripts for better performance and user experience.

## Overview

The `ThirdPartyScripts.js` component demonstrates how to properly defer loading of non-critical third-party scripts using different loading strategies:

### Loading Strategies

1. **`post-hydrate`** - Scripts load after React hydration completes
   - **Use for**: Analytics that need React context
   - **Examples**: Google Analytics, Facebook Pixel
   - **Benefits**: Doesn't block initial page rendering or interactivity

2. **`idle`** - Scripts load when the main thread is idle
   - **Use for**: Non-critical functionality 
   - **Examples**: Hotjar, Microsoft Clarity, chat widgets
   - **Benefits**: Loads only when browser isn't busy with other tasks

3. **`off-main-thread`** - Scripts run in a web worker (where supported)
   - **Use for**: Heavy computation that doesn't need DOM access
   - **Examples**: Performance monitoring, data processing
   - **Benefits**: Never blocks the main thread

## Implemented Services

### Analytics & Tracking
- **Google Analytics 4**: Page views and custom events (`post-hydrate`)
- **Plausible Analytics**: Privacy-friendly alternative (`post-hydrate`)
- **Microsoft Clarity**: User session recordings (`idle`)
- **Hotjar**: User behavior analytics (`idle`)
- **PostHog**: Product analytics with feature flags (`idle`)

### Marketing & Social
- **Facebook Pixel**: Conversion tracking (`post-hydrate`)
- **LinkedIn Insight Tag**: Professional network tracking (`idle`)

### Support & Communication
- **Intercom**: Customer support chat widget (`idle`)

### Custom Performance Monitoring
- **Web Vitals Monitoring**: Core Web Vitals tracking (`off-main-thread`)

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure the services you want to use:

```bash
# Google Analytics
GATSBY_GA_TRACKING_ID=G-XXXXXXXXXX

# Hotjar
GATSBY_HOTJAR_ID=1234567

# Add other service IDs as needed
```

### Security Considerations

The Content Security Policy (CSP) is automatically updated to allow necessary domains:

- **Script sources**: Uses hash-based validation with `'strict-dynamic'`
- **Connect sources**: Allows API calls to analytics services
- **Image sources**: Allows tracking pixels and service images
- **Frame sources**: Allows embedded widgets (Hotjar, Clarity)

## Performance Benefits

### Before (Traditional Loading)
```html
<!-- All scripts load immediately, blocking rendering -->
<script src="https://www.googletagmanager.com/gtag/js"></script>
<script src="https://static.hotjar.com/c/hotjar.js"></script>
<script src="https://www.clarity.ms/tag/project-id"></script>
```

### After (Gatsby Script API)
```jsx
{/* Load after hydration - doesn't block initial render */}
<Script src="https://www.googletagmanager.com/gtag/js" strategy="post-hydrate" />

{/* Load when idle - doesn't compete with critical tasks */}
<Script src="https://static.hotjar.com/c/hotjar.js" strategy="idle" />

{/* Heavy processing runs off main thread */}
<Script id="analytics" strategy="off-main-thread">
  {/* Complex analytics code */}
</Script>
```

## Performance Impact

| Strategy | Render Blocking | Hydration Blocking | Main Thread Impact |
|----------|----------------|-------------------|-------------------|
| Default | ❌ Yes | ❌ Yes | ❌ High |
| `post-hydrate` | ✅ No | ❌ Yes | ⚠️ Medium |
| `idle` | ✅ No | ✅ No | ✅ Low |
| `off-main-thread` | ✅ No | ✅ No | ✅ None |

## Development vs Production

- **Development**: Only development monitoring scripts load
- **Production**: All configured services load with optimized timing
- **Environment-based**: Services only load if environment variables are set

## Best Practices Demonstrated

1. **Conditional Loading**: Scripts only load if environment variables are configured
2. **Strategy Selection**: Each script uses the most appropriate loading strategy
3. **CSP Compliance**: All scripts work with strict Content Security Policy
4. **Performance First**: Critical path remains unblocked
5. **Privacy Friendly**: Easy to disable services or use privacy-focused alternatives

## Monitoring Performance

The custom performance monitoring script tracks:
- Core Web Vitals (FCP, LCP, FID, CLS, TTFB)
- Custom metrics and business events  
- Real user monitoring data

All data is collected without impacting the user experience.

## Adding New Services

To add a new third-party service:

1. Add environment variable to `.env.example`
2. Add script component to `ThirdPartyScripts.js` with appropriate strategy
3. Update CSP domains in `generate-csp-hashes.js` if needed
4. Test with both development and production builds

## Testing

```bash
# Test development build (minimal scripts)
gatsby develop

# Test production build (all configured scripts)
gatsby build && gatsby serve

# Analyze bundle and loading performance
npm run build:analyze
```

This approach ensures optimal performance while maintaining full functionality of all third-party services.