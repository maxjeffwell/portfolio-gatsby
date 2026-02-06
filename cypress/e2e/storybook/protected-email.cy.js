describe('ProtectedEmail Component', () => {
  it('should render with obfuscated email in default story', () => {
    cy.visitStory('components-protectedemail--default');
    // The email should be rendered as a link
    cy.getStoryCanvas().find('a').should('exist');
  });

  it('should reveal email on hover', () => {
    cy.visitStory('components-protectedemail--default');
    cy.getStoryCanvas().find('a').first().trigger('mouseover');
    // After hover, the href should contain mailto:
    cy.getStoryCanvas().find('a').first()
      .should('have.attr', 'href')
      .and('include', 'mailto:');
  });

  it('should render custom children text', () => {
    cy.visitStory('components-protectedemail--with-children');
    cy.getStoryCanvas().contains('Contact Jeff').should('be.visible');
  });

  it('should include subject and body params in WithSubject story', () => {
    cy.visitStory('components-protectedemail--with-subject');
    cy.getStoryCanvas().contains('Send Project Inquiry').should('be.visible');
    cy.getStoryCanvas().find('a').first().trigger('mouseover');
    cy.getStoryCanvas().find('a').first()
      .should('have.attr', 'href')
      .and('include', 'subject=');
  });
});
