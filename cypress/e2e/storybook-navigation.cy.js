describe('Storybook Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the Storybook UI', () => {
    cy.get('#storybook-preview-iframe', { timeout: 15000 }).should('exist');
  });

  it('should display sidebar with story categories', () => {
    // Storybook sidebar contains story group headings
    cy.contains('Components').should('be.visible');
  });

  it('should navigate between stories via sidebar', () => {
    // Click on a sidebar item and verify the story loads
    cy.contains('ProtectedEmail').click();
    cy.getStoryCanvas().find('a').should('exist');
  });

  it('should load the docs page for a component', () => {
    cy.visit('/?path=/docs/components-protectedemail--docs');
    cy.get('#storybook-preview-iframe', { timeout: 15000 }).should('exist');
  });
});
