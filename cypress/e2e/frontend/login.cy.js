const { createUser } = require('../../support/factories/user.factory');

describe('Frontend | Login', () => {
  it('deve realizar login com sucesso', () => {
    const user = createUser();

    cy.createUser(user);
    cy.intercept('POST', '**/login').as('login');

    cy.loginFrontend({
      email: user.email,
      password: user.password,
    });

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/admin/home');
    cy.contains('Bem Vindo').should('be.visible');
  });
});
