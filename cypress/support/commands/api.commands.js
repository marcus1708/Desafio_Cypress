const getApiUrl = () => Cypress.expose('apiUrl');

Cypress.Commands.add('apiRequest', ({
  method,
  path,
  body,
  headers = {},
  failOnStatusCode = true,
}) => {
  return cy.request({
    method,
    url: `${getApiUrl()}${path}`,
    body,
    headers,
    failOnStatusCode,
  });
});