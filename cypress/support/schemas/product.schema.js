export const productSchema = {
  type: 'object',
  required: ['nome', 'preco', 'descricao', 'quantidade', '_id'],
  properties: {
    nome: { type: 'string', minLength: 1 },
    preco: { type: 'number' },
    descricao: { type: 'string' },
    quantidade: { type: 'number' },
    _id: { type: 'string', minLength: 1 },
  },
};

export const productListSchema = {
  type: 'object',
  required: ['quantidade', 'produtos'],
  properties: {
    quantidade: { type: 'number' },
    produtos: {
      type: 'array',
      items: productSchema,
    },
  },
};
