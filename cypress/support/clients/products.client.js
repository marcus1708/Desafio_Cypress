export const productsClient = {
  list() {
    return cy.apiRequest({
      method: 'GET',
      path: '/produtos',
    });
  },

  getById(id) {
    return cy.apiRequest({
      method: 'GET',
      path: `/produtos/${id}`,
      failOnStatusCode: false,
    });
  },

  create(product, token) {
    return cy.apiRequest({
      method: 'POST',
      path: '/produtos',
      body: product,
      headers: {
        Authorization: token,
      },
      failOnStatusCode: false,
    });
  },

  update(id, product, token) {
    return cy.apiRequest({
      method: 'PUT',
      path: `/produtos/${id}`,
      body: product,
      headers: {
        Authorization: token,
      },
      failOnStatusCode: false,
    });
  },

  delete(id, token) {
    return cy.apiRequest({
      method: 'DELETE',
      path: `/produtos/${id}`,
      headers: {
        Authorization: token,
      },
      failOnStatusCode: false,
    });
  },
};