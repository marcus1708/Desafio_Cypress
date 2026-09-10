Cypress.Commands.add('loginFrontend', (usuario) => {
  cy.visit('/login');
  cy.get('#email').type(usuario.email);
  cy.get('#password').type(usuario.password);
  cy.contains('button', 'Entrar').click();
});
