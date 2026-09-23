export const usersClient = {
  create(user, options = {}) {
    return cy.apiRequest({
      method: 'POST',
      path: '/usuarios',
      body: user,
      failOnStatusCode: options.failOnStatusCode ?? true,
    });
  },
  getById(id) {
    return cy.apiRequest({ method: 'GET', path: `/usuarios/${id}`, failOnStatusCode: false });
  },
  update(id, user) {
    return cy.apiRequest({ method: 'PUT', path: `/usuarios/${id}`, body: user, failOnStatusCode: false });
  },
  delete(id) {
    return cy.apiRequest({ method: 'DELETE', path: `/usuarios/${id}`, failOnStatusCode: false });
  },
  list(query = '') {
    return cy.apiRequest({ method: 'GET', path: `/usuarios${query}`, failOnStatusCode: false });
  },
};
