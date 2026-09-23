export const authClient = {
  login(email, password) {
    return cy.apiRequest({
      method: 'POST',
      path: '/login',
      body: { email, password },
      failOnStatusCode: false,
    });
  },
};
