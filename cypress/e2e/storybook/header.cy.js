describe('Header Component', () => {
  it('should render desktop navigation links', () => {
    cy.visitStory('navigation-header--desktop');
    cy.getStoryCanvas().find('nav, header').should('exist');
    cy.getStoryCanvas().find('a').should('have.length.at.least', 1);
  });

  it('should display navigation links with correct text', () => {
    cy.visitStory('navigation-header--desktop');
    // Header should contain links to key pages
    cy.getStoryCanvas().then(($body) => {
      const text = $body.text();
      expect(text).to.match(/about|projects|blog|contact/i);
    });
  });

  it('should render mobile viewport with hamburger menu', () => {
    cy.visitStory('navigation-header--mobile');
    // In mobile story, a hamburger/menu button should be visible
    cy.getStoryCanvas().find('button, [class*="hamburger"], [class*="menu"], [aria-label*="menu"]')
      .should('have.length.at.least', 1);
  });

  it('should open mobile drawer on hamburger click', () => {
    cy.visitStory('navigation-header--mobile');
    // Click the hamburger/menu button
    cy.getStoryCanvas()
      .find('button, [class*="hamburger"], [class*="menu"], [aria-label*="menu"]')
      .first()
      .click();
    // After click, navigation links should be visible
    cy.getStoryCanvas().find('a').should('have.length.at.least', 1);
  });
});
