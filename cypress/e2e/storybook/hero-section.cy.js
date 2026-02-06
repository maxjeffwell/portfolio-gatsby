describe('HeroSection Component', () => {
  it('should render the hero section in light mode', () => {
    cy.visitStory('home-herosection--light');
    cy.getStoryCanvas().should('not.be.empty');
  });

  it('should display heading or hero text', () => {
    cy.visitStory('home-herosection--light');
    cy.getStoryCanvas().find('h1, h2, [class*="hero"], [class*="heading"]')
      .should('have.length.at.least', 1);
  });

  it('should render the dark mode variant', () => {
    cy.visitStory('home-herosection--dark');
    cy.getStoryCanvas().should('not.be.empty');
  });

  it('should contain typing animation or text element', () => {
    cy.visitStory('home-herosection--light');
    // The hero should contain some animated or typed text element
    cy.getStoryCanvas().then(($body) => {
      const text = $body.text();
      expect(text.length).to.be.greaterThan(0);
    });
  });

  it('should render mobile viewport variant', () => {
    cy.visitStory('home-herosection--mobile');
    cy.getStoryCanvas().should('not.be.empty');
  });
});
