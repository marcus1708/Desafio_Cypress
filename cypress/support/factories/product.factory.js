const uniqueId = () => `${Date.now()}-${Cypress._.random(1000, 9999)}`;

export const productFactory = (overrides = {}) => {
  const id = uniqueId();

  return {
    nome: `Produto QA Automation ${id}`,
    preco: 199,
    descricao: `Produto criado pela suíte automatizada ${id}`,
    quantidade: 10,
    ...overrides,
  };
};
