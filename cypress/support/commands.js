/**
 * Custom command to access the Storybook preview iframe body.
 * Storybook renders stories inside an iframe (#storybook-preview-iframe).
 * This command waits for the iframe to load and yields its body element.
 */
Cypress.Commands.add('getStoryCanvas', () => {
  return cy
    .get('#storybook-preview-iframe', { timeout: 15000 })
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
});

/**
 * Custom command to navigate to a specific Storybook story by its ID.
 * Story IDs follow the pattern: title-exportname--variant
 * e.g., "components-protectedemail--default"
 */
Cypress.Commands.add('visitStory', (storyId) => {
  cy.visit(`/?path=/story/${storyId}`, { timeout: 30000 });
  cy.get('#storybook-preview-iframe', { timeout: 15000 }).should('exist');
  // Wait for the story to render inside the iframe
  cy.getStoryCanvas().should('not.be.empty');
});
