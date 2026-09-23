Cypress.Commands.add('loginFrontend', ({ email, password }) => {
  cy.visit('/login');
  cy.get('[data-testid="email"]').should('be.visible').type(email);
  cy.get('[data-testid="senha"]').should('be.visible').type(password);
  cy.contains('button', 'Entrar').should('be.visible').click();
  cy.url().should('include', '/admin/home');
});
