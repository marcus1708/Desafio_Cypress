const uniqueId = () => `${Date.now()}-${Cypress._.random(1000, 9999)}`;

export const userFactory = (overrides = {}) => {
  const id = uniqueId();

  return {
    nome: `QA Automation ${id}`,
    email: `qa.automation.${id}@example.com`,
    password: 'Teste@12345',
    administrador: 'true',
    ...overrides,
  };
};

export const customerFactory = (overrides = {}) =>
  userFactory({ administrador: 'false', ...overrides });
