import { authClient } from '../../support/clients/auth.client';
import { productsClient } from '../../support/clients/products.client';
import { usersClient } from '../../support/clients/users.client';
import { customerFactory, userFactory } from '../../support/factories/user.factory';
import { productFactory } from '../../support/factories/product.factory';
import { assertSchema } from '../../support/schemas/validator';
import { productListSchema } from '../../support/schemas/product.schema';
import { userListSchema } from '../../support/schemas/user.schema';
import { errorSchema } from '../../support/schemas/error.schema';

let admin;
let adminToken;
let customer;
let customerToken;

const expectErrorContract = (response, status) => {
  expect(response.status).to.eq(status);
  assertSchema(response.body, errorSchema, 'error');

  const hasGeneralMessage =
    typeof response.body.message === 'string' && response.body.message.trim().length > 0;

  const fieldErrors = Object.entries(response.body)
    .filter(([key, value]) => key !== 'message' && typeof value === 'string' && value.trim().length > 0);

  expect(hasGeneralMessage || fieldErrors.length > 0, 'API should return a general or field-level error').to.eq(true);
};

describe('API | Qualidade, Contratos e Cenários Negativos', () => {
  before(() => {
    admin = userFactory({ administrador: 'true' });
    customer = customerFactory();

    usersClient.create(admin).then((adminResponse) => {
      expect(adminResponse.status).to.eq(201);
      return authClient.login(admin.email, admin.password);
    }).then((adminLogin) => {
      expect(adminLogin.status).to.eq(200);
      adminToken = adminLogin.body.authorization;
      return usersClient.create(customer);
    }).then((customerResponse) => {
      expect(customerResponse.status).to.eq(201);
      return authClient.login(customer.email, customer.password);
    }).then((customerLogin) => {
      expect(customerLogin.status).to.eq(200);
      customerToken = customerLogin.body.authorization;
    });
  });

  it('API-14 | deve rejeitar operação protegida sem token', () => {
    productsClient.create(productFactory()).then((response) => {
      expectErrorContract(response, 401);
    });
  });

  it('API-15 | deve rejeitar operação protegida com token inválido', () => {
    productsClient.create(productFactory(), 'Bearer token-invalido').then((response) => {
      expectErrorContract(response, 401);
    });
  });

  it('API-16 | deve impedir criação de produto duplicado', () => {
    const product = productFactory();
    productsClient.create(product, adminToken).then((firstResponse) => {
      expect(firstResponse.status).to.eq(201);
      return productsClient.create(product, adminToken);
    }).then((secondResponse) => {
      expectErrorContract(secondResponse, 400);
      expect(secondResponse.body.message).to.include('produto com esse nome');
    });
  });

  it('API-17 | deve rejeitar payload de produto incompleto', () => {
    const invalidPayload = { nome: `Produto inválido ${Date.now()}` };
    productsClient.create(invalidPayload, adminToken).then((response) => {
      expectErrorContract(response, 400);
    });
  });

  it('API-18 | deve rejeitar tipos incompatíveis no payload de produto', () => {
    const invalidPayload = productFactory({
      preco: 'preco-invalido',
      quantidade: 'quantidade-invalida',
    });
    productsClient.create(invalidPayload, adminToken).then((response) => {
      expectErrorContract(response, 400);
    });
  });

  it('API-19 | deve rejeitar valores abaixo dos limites numéricos documentados', () => {
    productsClient.create(productFactory({ preco: 0, quantidade: -1 }), adminToken).then((response) => {
      expectErrorContract(response, 400);
    });
  });

  it('API-20 | deve validar o contrato dos produtos retornados', () => {
    productsClient.list().then((response) => {
      expect(response.status).to.eq(200);
      assertSchema(response.body, productListSchema, 'productsResponse');
      expect(response.body.produtos).to.have.length(response.body.quantidade);
    });
  });

  it('API-21 | deve validar contrato de autenticação e autorização', () => {
    expect(customerToken).to.match(/^Bearer\s.+/);
    productsClient.create(productFactory(), customerToken).then((response) => {
      expectErrorContract(response, 403);
      expect(response.body.message).to.eq('Rota exclusiva para administradores');
    });
  });

  it('API-22 | deve preservar isolamento entre massas de dados', () => {
    const userA = userFactory();
    const userB = userFactory();

    expect(userA.email).not.to.eq(userB.email);
    expect(userA.nome).not.to.eq(userB.nome);

    usersClient.create(userA).then(({ body: bodyA }) => {
      return usersClient.create(userB).then(({ body: bodyB }) => ({ bodyA, bodyB }));
    }).then(({ bodyA, bodyB }) => {
      expect(bodyA._id).not.to.eq(bodyB._id);
      return usersClient.getById(bodyA._id).then((responseA) => {
        expect(responseA.status).to.eq(200);
        expect(responseA.body.email).to.eq(userA.email);
        return usersClient.getById(bodyB._id);
      });
    }).then((responseB) => {
      expect(responseB.status).to.eq(200);
      expect(responseB.body.email).to.eq(userB.email);
    });
  });

  it('API-23 | deve garantir cleanup após exclusão do recurso', () => {
    const user = userFactory();
    usersClient.create(user).then(({ body }) => {
      return usersClient.delete(body._id).then((deleteResponse) => ({ id: body._id, deleteResponse }));
    }).then(({ id, deleteResponse }) => {
      expect(deleteResponse.status).to.eq(200);
      return usersClient.getById(id);
    }).then((getResponse) => {
      expectErrorContract(getResponse, 400);
      expect(getResponse.body.message).to.include('Usuário não encontrado');
    });
  });

  it('API-24 | deve impedir repetição do mesmo POST de produto de gerar duplicidade', () => {
    const product = productFactory();
    productsClient.create(product, adminToken).then((firstResponse) => {
      expect(firstResponse.status).to.eq(201);
      return productsClient.create(product, adminToken);
    }).then((secondResponse) => {
      expectErrorContract(secondResponse, 400);
      expect(secondResponse.body.message).to.include('produto com esse nome');
    });
  });

  it('API-25 | deve validar o contrato dos usuários retornados', () => {
    usersClient.list(`?email=${encodeURIComponent(admin.email)}`).then((response) => {
      expect(response.status).to.eq(200);
      assertSchema(response.body, userListSchema, 'usersResponse');
      expect(response.body.quantidade).to.eq(1);
      expect(response.body.usuarios).to.have.length(1);
    });
  });
});
