describe('Header Component', () => {
  it('should render desktop navigation links', () => {
    cy.visitStory('navigation-header--desktop');
    cy.getStoryCanvas().find('nav, header').should('exist');
    cy.getStoryCanvas().find('a').should('have.length.at.least', 1);
  });

  it('should display navigation links with correct text', () => {
    cy.visitStory('navigation-header--desktop');
    // Wait for isMobile useEffect to flip to false, then nav renders.
    cy.getStoryCanvas().find('nav[aria-label="Main navigation"]')
      .should('exist');
    // Verify at least one expected nav link text is visible
    cy.getStoryCanvas().find('nav[aria-label="Main navigation"]')
      .contains(/projects|blog|contact/i)
      .should('exist');
  });

  it('should render mobile viewport with hamburger menu', () => {
    // Visit the iframe URL directly so the component gets the full
    // 375px viewport — the Storybook sidebar won't consume space.
    cy.viewport(375, 812);
    cy.visit('/iframe.html?id=navigation-header--mobile&viewMode=story', {
      timeout: 30000,
    });
    cy.get('body').should('not.be.empty');
    cy.get('button[aria-label="open drawer"]').should('exist');
  });

  it('should open mobile drawer on hamburger click', () => {
    cy.viewport(375, 812);
    cy.visit('/iframe.html?id=navigation-header--mobile&viewMode=story', {
      timeout: 30000,
    });
    cy.get('button[aria-label="open drawer"]')
      .should('exist')
      .click();
    // Drawer renders MobileNavButton <a> links
    cy.get('a').should('have.length.at.least', 1);
  });
});
