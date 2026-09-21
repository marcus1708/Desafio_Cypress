const apiUrl = () => Cypress.expose('apiUrl');

const apiRequest = ({
  method,
  path,
  body,
  headers,
  failOnStatusCode = true,
}) => {
  const request = {
    method,
    url: `${apiUrl()}${path}`,
    failOnStatusCode,
  };

  if (body !== undefined) {
    request.body = body;
  }

  if (headers !== undefined) {
    request.headers = headers;
  }

  return cy.api(request);
};

Cypress.Commands.add('apiRequest', apiRequest);

Cypress.Commands.add('createUser', (user, options = {}) =>
  cy.api({
    method: 'POST',
    url: `${apiUrl()}/usuarios`,
    body: user,
    failOnStatusCode: options.failOnStatusCode ?? true,
  })
);

Cypress.Commands.add('loginApi', ({ email, password }) =>
  cy.api({
    method: 'POST',
    url: `${apiUrl()}/login`,
    body: {
      email,
      password,
    },
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('getUser', (id) =>
  cy.api({
    method: 'GET',
    url: `${apiUrl()}/usuarios/${id}`,
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('updateUser', (id, user) =>
  cy.api({
    method: 'PUT',
    url: `${apiUrl()}/usuarios/${id}`,
    body: user,
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('deleteUser', (id) =>
  cy.api({
    method: 'DELETE',
    url: `${apiUrl()}/usuarios/${id}`,
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('listProducts', () =>
  cy.api({
    method: 'GET',
    url: `${apiUrl()}/produtos`,
  })
);

Cypress.Commands.add('getProduct', (id) =>
  cy.api({
    method: 'GET',
    url: `${apiUrl()}/produtos/${id}`,
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('createProduct', (product, token) =>
  cy.api({
    method: 'POST',
    url: `${apiUrl()}/produtos`,
    body: product,
    headers: {
      Authorization: token,
    },
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('updateProduct', (id, product, token) =>
  cy.api({
    method: 'PUT',
    url: `${apiUrl()}/produtos/${id}`,
    body: product,
    headers: {
      Authorization: token,
    },
    failOnStatusCode: false,
  })
);

Cypress.Commands.add('deleteProduct', (id, token) =>
  cy.api({
    method: 'DELETE',
    url: `${apiUrl()}/produtos/${id}`,
    headers: {
      Authorization: token,
    },
    failOnStatusCode: false,
  })
);