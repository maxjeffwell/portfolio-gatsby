import React from 'react';
import { Script } from 'gatsby';

const ThirdPartyScripts = () => {
  return (
    <>
      {/* Google Analytics - Load after page is interactive (post-hydrate) */}
      {process.env.GATSBY_GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GATSBY_GA_TRACKING_ID}`}
            strategy="post-hydrate"
          />
          <Script id="gtag-config" strategy="post-hydrate">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.GATSBY_GA_TRACKING_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Hotjar - Load when idle to avoid blocking main thread */}
      {process.env.GATSBY_HOTJAR_ID && (
        <Script id="hotjar" strategy="idle">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${process.env.GATSBY_HOTJAR_ID},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>
      )}

      {/* Plausible Analytics - Privacy-friendly alternative, load after hydration */}
      {process.env.GATSBY_PLAUSIBLE_DOMAIN && (
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={process.env.GATSBY_PLAUSIBLE_DOMAIN}
          strategy="post-hydrate"
          defer
        />
      )}

      {/* Microsoft Clarity - Load when idle */}
      {process.env.GATSBY_CLARITY_PROJECT_ID && (
        <Script id="clarity" strategy="idle">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.GATSBY_CLARITY_PROJECT_ID}");
          `}
        </Script>
      )}

      {/* Facebook Pixel - Load after hydration for better performance */}
      {process.env.GATSBY_FACEBOOK_PIXEL_ID && (
        <Script id="facebook-pixel" strategy="post-hydrate">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.GATSBY_FACEBOOK_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* LinkedIn Insight Tag - Load when idle */}
      {process.env.GATSBY_LINKEDIN_PARTNER_ID && (
        <Script id="linkedin-insight" strategy="idle">
          {`
            _linkedin_partner_id = "${process.env.GATSBY_LINKEDIN_PARTNER_ID}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);})(window.lintrk);
          `}
        </Script>
      )}

      {/* Intercom - Load when idle for customer support */}
      {process.env.GATSBY_INTERCOM_APP_ID && (
        <Script id="intercom" strategy="idle">
          {`
            (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){
            ic('reattach_activator');ic('update',w.intercomSettings);}else{
            var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};
            w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';
            s.async=true;s.src='https://widget.intercom.io/widget/${process.env.GATSBY_INTERCOM_APP_ID}';
            var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};
            if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}
            else{w.addEventListener('load',l,false);}}})();
          `}
        </Script>
      )}

      {/* PostHog - Analytics and feature flags, load when idle */}
      {process.env.GATSBY_POSTHOG_API_KEY && (
        <Script id="posthog" strategy="idle">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
            function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);
            t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
            (p=t.createElement("script")).type="text/javascript",p.async=!0,
            p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
            var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],
            u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),e},
            u.people.toString=function(){return u.toString()+".people (stub)"},
            o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),
            n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('${process.env.GATSBY_POSTHOG_API_KEY}',{api_host:'${process.env.GATSBY_POSTHOG_API_HOST || 'https://app.posthog.com'}'})
          `}
        </Script>
      )}

      {/* Custom performance monitoring script - Load off-main-thread */}
      <Script id="performance-monitor" strategy="off-main-thread">
        {`
          // Only run in browser environment
          if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            // Enhanced Web Vitals monitoring
            function reportWebVitals(metric) {
              // Send to your analytics service
              console.log('Web Vital:', metric);
              
              // Example: Send to Google Analytics
              if (typeof gtag !== 'undefined') {
                gtag('event', metric.name, {
                  event_category: 'Web Vitals',
                  value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                  event_label: metric.id,
                  non_interaction: true,
                });
              }
            }

            // Load web-vitals library and observe Core Web Vitals
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.js')
              .then((webVitals) => {
                // Use the correct web-vitals v3 API
                webVitals.onFCP(reportWebVitals);
                webVitals.onLCP(reportWebVitals);
                webVitals.onFID(reportWebVitals);
                webVitals.onCLS(reportWebVitals);
                webVitals.onTTFB(reportWebVitals);
                
                // Also monitor additional metrics if available
                if (webVitals.onINP) {
                  webVitals.onINP(reportWebVitals);
                }
              })
              .catch((error) => {
                console.warn('Failed to load web-vitals:', error);
              });
          }
        `}
      </Script>

      {/* Development-only scripts */}
      {process.env.NODE_ENV === 'development' && (
        <Script id="dev-tools" strategy="idle">
          {`
            // Development performance monitoring
            console.log('Portfolio development mode active');
            
            // Log navigation timing
            window.addEventListener('load', () => {
              const timing = window.performance.timing;
              const loadTime = timing.loadEventEnd - timing.navigationStart;
              console.log('Page load time:', loadTime + 'ms');
            });
          `}
        </Script>
      )}
    </>
  );
};

export default ThirdPartyScripts;