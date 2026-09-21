Cypress.Commands.add('loginFrontend', (user) => {
  cy.visit('/login');
  cy.get('#email').clear().type(user.email);
  cy.get('#password').clear().type(user.password);
  cy.contains('button', 'Entrar').click();
});

Cypress.Commands.add('openAdminMenu', (label) => {
  cy.contains('li', label).should('be.visible').click();
});
