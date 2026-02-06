describe('ProjectCard Component', () => {
  it('should render the default project card', () => {
    cy.visitStory('components-projectcard--default');
    cy.getStoryCanvas().find('[class*="card"], [class*="project"], article')
      .should('exist');
  });

  it('should display source and demo links', () => {
    cy.visitStory('components-projectcard--default');
    // Project cards should have external links (source/demo)
    cy.getStoryCanvas().find('a[href]').should('have.length.at.least', 1);
  });

  it('should render tech icons or labels', () => {
    cy.visitStory('components-projectcard--default');
    // Tech stack should be visible (icons or text)
    cy.getStoryCanvas().find('svg, img, [class*="tech"], [class*="icon"]')
      .should('have.length.at.least', 1);
  });

  it('should render the minimal variant without errors', () => {
    cy.visitStory('components-projectcard--minimal');
    cy.getStoryCanvas().should('not.be.empty');
  });

  it('should render the video variant', () => {
    cy.visitStory('components-projectcard--with-video');
    cy.getStoryCanvas().should('not.be.empty');
  });
});
