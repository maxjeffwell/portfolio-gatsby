// Styled utility fallback for @mui/system/styled during SSR

// Simple styled component factory
const styled = (tag) => {
  const styledComponent = (styles) => {
    // Return the tag name for SSR - React will render it as a basic element
    return tag || 'div';
  };
  
  // Add common styled component methods
  styledComponent.withConfig = (config) => styledComponent;
  styledComponent.attrs = (attrs) => styledComponent;
  styledComponent.shouldForwardProp = () => true;
  
  return styledComponent;
};

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

// Add the .Ay property that the error mentions
styled.Ay = styled;

// Default export
module.exports = styled;
module.exports.default = styled;