describe('CTASection Component', () => {
  it('should render contact buttons when visible', () => {
    cy.visitStory('components-ctasection--visible');
    cy.getStoryCanvas().find('a, button').should('have.length.at.least', 1);
  });

  it('should display email and phone links', () => {
    cy.visitStory('components-ctasection--visible');
    // Should contain contact-related links
    cy.getStoryCanvas().find('a[href*="mailto:"], a[href*="tel:"]')
      .should('have.length.at.least', 1);
  });

  it('should include a GitHub link', () => {
    cy.visitStory('components-ctasection--visible');
    cy.getStoryCanvas().find('a[href*="github.com"]')
      .should('have.length.at.least', 1);
  });

  it('should not display content when hidden', () => {
    cy.visitStory('components-ctasection--hidden');
    // When visible=false, the CTA content should be hidden or empty
    cy.getStoryCanvas().then(($body) => {
      const visibleButtons = $body.find('a[href*="mailto:"], a[href*="tel:"]');
      expect(visibleButtons.length).to.equal(0);
    });
  });
});
