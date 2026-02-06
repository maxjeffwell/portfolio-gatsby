/**
 * Trigger a mouseover event using the iframe's own MouseEvent constructor.
 * Cypress's .trigger() creates events from the parent window context,
 * which may not propagate correctly through React's event delegation
 * inside the Storybook iframe.
 */
function triggerIframeMouseover($el) {
  const el = $el[0];
  const win = el.ownerDocument.defaultView;
  el.dispatchEvent(new win.MouseEvent('mouseover', { bubbles: true, cancelable: true }));
}

describe('ProtectedEmail Component', () => {
  it('should render with obfuscated email in default story', () => {
    cy.visitStory('components-protectedemail--default');
    // Target the component's <a> specifically — Storybook 10's onboarding
    // overlay renders its own links inside the preview iframe.
    cy.getStoryCanvas().find('a[title*="email"]').should('exist');
  });

  it('should reveal email on hover', () => {
    cy.visitStory('components-protectedemail--default');
    // Initially the href is '#' (obfuscated)
    cy.getStoryCanvas().find('a[title*="email"]')
      .should('have.attr', 'href', '#');
    // Dispatch mouseover via the iframe's own event constructor
    cy.getStoryCanvas().find('a[title*="email"]')
      .then(triggerIframeMouseover);
    // After hover, href should update to mailto:
    cy.getStoryCanvas().find('a[title*="email"]')
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
    cy.getStoryCanvas().find('a[title*="email"]')
      .then(triggerIframeMouseover);
    cy.getStoryCanvas().find('a[title*="email"]')
      .should('have.attr', 'href')
      .and('include', 'subject=');
  });
});
