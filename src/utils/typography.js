import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '16px',
  baseLineHeight: 1.666,
  headerFontFamily: [
    'AvenirLTStd-Roman',
    'HelveticaNeueLTStd-Bd',
    'Avenir Next',
    'Helvetica Neue',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif',
  ],
  bodyFontFamily: [
    'HelveticaNeueLTStd-Roman',
    'AvenirLTStd-Roman',
    'Helvetica Neue',
    'Avenir Next',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif',
  ],
  // Disable rhythm plugin since we're using styled-components
  includeNormalize: false,
  omitGoogleFont: true,
  overrideStyles: () => ({
    body: {
      fontFamily: [
        'HelveticaNeueLTStd-Roman',
        'AvenirLTStd-Roman',
        'Helvetica Neue',
        'Avenir Next',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    h1: {
      fontFamily: [
        'AvenirLTStd-Roman',
        'HelveticaNeueLTStd-Bd',
        'Avenir Next',
        'Helvetica Neue',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    h2: {
      fontFamily: [
        'AvenirLTStd-Roman',
        'HelveticaNeueLTStd-Bd',
        'Avenir Next',
        'Helvetica Neue',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    h3: {
      fontFamily: [
        'AvenirLTStd-Roman',
        'HelveticaNeueLTStd-Bd',
        'Avenir Next',
        'Helvetica Neue',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    h4: {
      fontFamily: [
        'AvenirLTStd-Roman',
        'HelveticaNeueLTStd-Bd',
        'Avenir Next',
        'Helvetica Neue',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    h5: {
      fontFamily: [
        'AvenirLTStd-Roman',
        'HelveticaNeueLTStd-Bd',
        'Avenir Next',
        'Helvetica Neue',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    h6: {
      fontFamily: [
        'AvenirLTStd-Roman',
        'HelveticaNeueLTStd-Bd',
        'Avenir Next',
        'Helvetica Neue',
        'Segoe UI',
        'Helvetica',
        'Arial',
        'sans-serif',
      ].join(','),
    },
  }),
});

// Hot reload typography in development.
if (typeof window !== 'undefined' && process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
