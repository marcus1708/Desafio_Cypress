const selectors = require('../selectors/serveRest.selectors');

Cypress.Commands.add('loginFrontend', (credentials) => {
  cy.visit('/login');
  cy.get(selectors.login.email).should('be.visible').clear().type(credentials.email);
  cy.get(selectors.login.password).clear().type(credentials.password);
  cy.get(selectors.login.submit).click();
});

Cypress.Commands.add('registerAdminUserViaUi', (user) => {
  cy.visit('/login');
  cy.contains('Cadastre-se').should('be.visible').click();
  cy.get(selectors.user.name).clear().type(user.nome);
  cy.get(selectors.user.email).clear().type(user.email);
  cy.get(selectors.user.password).clear().type(user.password);
  cy.get(selectors.user.admin).check();
  cy.get(selectors.user.submit).click();
});

Cypress.Commands.add('registerProductViaUi', (product) => {
  cy.contains('li', 'Cadastrar Produtos').should('be.visible').click();
  cy.get(selectors.product.name).clear().type(product.nome);
  cy.get(selectors.product.price).clear().type(String(product.preco));
  cy.get(selectors.product.description).clear().type(product.descricao);
  cy.get(selectors.product.quantity).clear().type(String(product.quantidade));
  cy.get(selectors.product.submit).click();
});
