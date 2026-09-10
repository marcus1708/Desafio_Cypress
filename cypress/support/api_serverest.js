const apiUrl = () => Cypress.env('apiUrl');

Cypress.Commands.add('cadastrarUsuario', (usuario) => {
  return cy.request({
    method: 'POST',
    url: `${apiUrl()}/usuarios`,
    body: usuario,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('loginApi', (usuario) => {
  return cy.request({
    method: 'POST',
    url: `${apiUrl()}/login`,
    body: usuario,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('listarProdutos', () => {
  return cy.request({
    method: 'GET',
    url: `${apiUrl()}/produtos`,
    failOnStatusCode: false
  });
});
