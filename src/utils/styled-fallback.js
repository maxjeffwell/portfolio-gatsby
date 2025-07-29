// Styled utility fallback for @mui/system/styled during SSR
const React = require('react');

// Create a styled component that behaves like emotion/styled during SSR
const createStyledComponent = (tag) => {
  // Return a React component function
  const StyledComponent = (props) => {
    const { children, ...restProps } = props || {};
    // During SSR, just return the base element type
    return React.createElement(tag || 'div', restProps, children);
  };
  
  // Add displayName for debugging
  StyledComponent.displayName = `Styled(${tag || 'Component'})`;
  
  return StyledComponent;
};

// Main styled function that can be called with template literals or objects
const styled = (tag) => {
  // Return a function that accepts styles and returns a component
  const styledFactory = (styles, ...args) => {
    // Return the actual styled component
    return createStyledComponent(tag);
  };
  
  // Add common styled methods
  styledFactory.withConfig = (config) => styledFactory;
  styledFactory.attrs = (attrs) => styledFactory;
  styledFactory.shouldForwardProp = () => true;
  
  return styledFactory;
};

// Create a factory function that matches MUI's exact pattern
const createMuiStyledFactory = (options) => {
  // This is what gets returned when MUI calls styled.Ay(options)
  // It should be a function that can be called with styles
  const muiStyledFunction = (stylesOrTemplate, ...templateArgs) => {
    // Handle both object styles and template literal styles
    return createStyledComponent('span');
  };
  
  // Add methods that might be expected
  muiStyledFunction.withConfig = (config) => muiStyledFunction;
  muiStyledFunction.attrs = (attrs) => muiStyledFunction;
  muiStyledFunction.shouldForwardProp = () => true;
  
  return muiStyledFunction;
};

// Make sure the factory function itself can also be called as a styled function
createMuiStyledFactory.withConfig = (config) => createMuiStyledFactory;
createMuiStyledFactory.attrs = (attrs) => createMuiStyledFactory;
createMuiStyledFactory.shouldForwardProp = () => true;

// Add common HTML elements as properties
styled.div = styled('div');
styled.span = styled('span');
styled.button = styled('button');
styled.section = styled('section');
styled.header = styled('header');
styled.footer = styled('footer');
styled.main = styled('main');
styled.nav = styled('nav');
styled.aside = styled('aside');
styled.article = styled('article');
styled.h1 = styled('h1');
styled.h2 = styled('h2');
styled.h3 = styled('h3');
styled.h4 = styled('h4');
styled.h5 = styled('h5');
styled.h6 = styled('h6');
styled.p = styled('p');
styled.a = styled('a');
styled.ul = styled('ul');
styled.ol = styled('ol');
styled.li = styled('li');
styled.img = styled('img');
styled.form = styled('form');
styled.input = styled('input');
styled.textarea = styled('textarea');
styled.select = styled('select');
styled.option = styled('option');
styled.label = styled('label');

// Create a comprehensive styled API that covers all MUI patterns
const styledApi = styled;

// Add the .Ay function that MUI uses (this is the minified version of a styled component creator)
styledApi.Ay = createMuiStyledFactory;

// Add other common MUI styled patterns
styledApi.ZP = styledApi.Ay;
styledApi.default = styledApi;

// Copy all the element shortcuts to the API
Object.keys(styled).forEach(key => {
  if (typeof styled[key] === 'function') {
    styledApi[key] = styled[key];
  }
});

// Export as both default and named exports to cover all import patterns
module.exports = styledApi;
module.exports.default = styledApi;
module.exports.Ay = styledApi.Ay;
module.exports.ZP = styledApi.ZP;

// Also set up the function properties directly on exports for compatibility
Object.defineProperty(module.exports, 'Ay', {
  value: createMuiStyledFactory,
  writable: false,
  enumerable: true,
  configurable: false
});