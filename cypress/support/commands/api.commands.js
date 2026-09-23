let lastApiRequestAt = 0;

const getApiUrl = () => Cypress.expose('apiUrl');
const getApiMinInterval = () => Number(Cypress.expose('apiMinIntervalMs') || 0);

Cypress.Commands.add('apiRequest', ({
  method,
  path,
  body,
  headers = {},
  failOnStatusCode = true,
}) => {
  const elapsed = Date.now() - lastApiRequestAt;
  const waitTime = Math.max(0, getApiMinInterval() - elapsed);

  if (waitTime > 0) {
    cy.wait(waitTime, { log: false });
  }

  return cy.request({
    method,
    url: `${getApiUrl()}${path}`,
    body,
    headers,
    failOnStatusCode,
  }).then((response) => {
    lastApiRequestAt = Date.now();
    return response;
  });
});
