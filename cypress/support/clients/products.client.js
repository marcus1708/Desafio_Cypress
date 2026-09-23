export const productsClient = {
  list(query = '') {
    return cy.apiRequest({ method: 'GET', path: `/produtos${query}` });
  },
  getById(id) {
    return cy.apiRequest({ method: 'GET', path: `/produtos/${id}`, failOnStatusCode: false });
  },
  create(product, token) {
    const headers = token ? { Authorization: token } : {};
    return cy.apiRequest({ method: 'POST', path: '/produtos', body: product, headers, failOnStatusCode: false });
  },
  update(id, product, token) {
    const headers = token ? { Authorization: token } : {};
    return cy.apiRequest({ method: 'PUT', path: `/produtos/${id}`, body: product, headers, failOnStatusCode: false });
  },
  delete(id, token) {
    const headers = token ? { Authorization: token } : {};
    return cy.apiRequest({ method: 'DELETE', path: `/produtos/${id}`, headers, failOnStatusCode: false });
  },
};
