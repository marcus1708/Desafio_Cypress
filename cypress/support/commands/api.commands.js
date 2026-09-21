const apiUrl = () => Cypress.expose('apiUrl');

Cypress.Commands.add('apiRequest', ({ method, path, body, headers, failOnStatusCode = true }) =>
  cy.request({
    method,
    url: `${apiUrl()}${path}`,
    body,
    headers,
    failOnStatusCode,
  })
);

Cypress.Commands.add('createUser', (user, options = {}) =>
  cy.apiRequest({
    method: 'POST',
    path: '/usuarios',
    body: user,
    failOnStatusCode: options.failOnStatusCode ?? true,
  })
);

Cypress.Commands.add('loginApi', (user) =>
  cy.apiRequest({ method: 'POST', path: '/login', body: user, failOnStatusCode: false })
);

Cypress.Commands.add('getUser', (id) =>
  cy.apiRequest({ method: 'GET', path: `/usuarios/${id}`, failOnStatusCode: false })
);

Cypress.Commands.add('updateUser', (id, user) =>
  cy.apiRequest({ method: 'PUT', path: `/usuarios/${id}`, body: user, failOnStatusCode: false })
);

Cypress.Commands.add('deleteUser', (id) =>
  cy.apiRequest({ method: 'DELETE', path: `/usuarios/${id}`, failOnStatusCode: false })
);

Cypress.Commands.add('listProducts', () =>
  cy.apiRequest({ method: 'GET', path: '/produtos' })
);

Cypress.Commands.add('getProduct', (id) =>
  cy.apiRequest({ method: 'GET', path: `/produtos/${id}`, failOnStatusCode: false })
);

Cypress.Commands.add('createProduct', (product, token) =>
  cy.apiRequest({
    method: 'POST',
    path: '/produtos',
    body: product,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
);
