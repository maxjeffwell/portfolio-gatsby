/**
 * Dispatch a native contextmenu event using the iframe's own constructor.
 * Cypress's .rightclick() may not propagate correctly through React's
 * event delegation when the component lives inside Storybook's iframe.
 */
function triggerIframeContextMenu($el) {
  const el = $el[0];
  const win = el.ownerDocument.defaultView;
  el.dispatchEvent(
    new win.MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 })
  );
}

describe('DarkModeToggle Component', () => {
  beforeEach(() => {
    cy.visitStory('theme-darkmodetoggle--default');
  });

  it('should render the toggle button', () => {
    cy.getStoryCanvas().find('button').should('exist');
  });

  it('should toggle dark mode on click', () => {
    // Capture the initial aria-label, then verify it changes after toggle
    cy.getStoryCanvas().find('button[aria-label]').first()
      .invoke('attr', 'aria-label')
      .then((initialLabel) => {
        cy.getStoryCanvas().find('button[aria-label]').first().click();
        cy.getStoryCanvas().find('button[aria-label]').first()
          .should('have.attr', 'aria-label')
          .and('not.eq', initialLabel);
      });
  });

  it('should show a context menu on right-click', () => {
    // Target the toggle button specifically (has aria-label), then
    // dispatch a native contextmenu event from the iframe's own window
    // context so React 16's document-level delegation receives it.
    cy.getStoryCanvas().find('button[aria-label]').first()
      .then(($btn) => {
        triggerIframeContextMenu($btn);
      });
    // The StyledMenu should now be rendered with "Follow system preference"
    cy.getStoryCanvas().contains('Follow system preference', { timeout: 5000 })
      .should('be.visible');
  });
});
