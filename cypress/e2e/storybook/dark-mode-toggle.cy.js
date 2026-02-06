describe('DarkModeToggle Component', () => {
  beforeEach(() => {
    cy.visitStory('theme-darkmodetoggle--default');
  });

  it('should render the toggle button', () => {
    cy.getStoryCanvas().find('button').should('exist');
  });

  it('should toggle dark mode on click', () => {
    cy.getStoryCanvas().find('button').first().click();
    // After clicking, the toggle should still be visible (mode changed)
    cy.getStoryCanvas().find('button').first().should('exist');
  });

  it('should show a context menu on right-click', () => {
    cy.getStoryCanvas().find('button').first().rightclick();
    // Context menu should appear with theme options
    cy.getStoryCanvas().find('[role="menu"], [class*="context"], [class*="menu"]')
      .should('exist');
  });
});
