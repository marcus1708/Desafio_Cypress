export const userSchema = {
  type: 'object',
  required: ['nome', 'email', 'password', 'administrador', '_id'],
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: { type: 'string', minLength: 1 },
    password: { type: 'string', minLength: 1 },
    administrador: { type: 'string', enum: ['true', 'false'] },
    _id: { type: 'string', minLength: 1 },
  },
};

export const userListSchema = {
  type: 'object',
  required: ['quantidade', 'usuarios'],
  properties: {
    quantidade: { type: 'number' },
    usuarios: {
      type: 'array',
      items: userSchema,
    },
  },
};
