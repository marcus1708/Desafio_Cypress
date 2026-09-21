Cypress.Commands.add('loginFrontend', (user) => {
  cy.visit('/login');
  cy.get('#email').clear().type(user.email);
  cy.get('#password').clear().type(user.password);
  cy.contains('button', 'Entrar').click();
});
Cypress.Commands.add('openAdminMenu', (label) => {
  cy.contains('li', label).should('be.visible').click();
});
const { userFactory } = require('../factories/user.factory');
Cypress.Commands.add('loginAsAdmin', () => {
  const admin = userFactory({
    administrador: 'true',
  });

  cy.createUser(admin).then((createResponse) => {
    expect(createResponse.status).to.eq(201);
  });

  cy.intercept('POST', '**/login').as('loginRequest');

  cy.visit('/login');

  cy.get('#email')
    .should('be.visible')
    .type(admin.email);

  cy.get('#password')
    .should('be.visible')
    .type(admin.password);

  cy.contains('button', 'Entrar')
    .should('be.visible')
    .click();

  cy.wait('@loginRequest')
    .its('response.statusCode')
    .should('eq', 200);
});