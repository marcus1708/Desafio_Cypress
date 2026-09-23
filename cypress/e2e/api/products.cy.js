import { authClient } from '../../support/clients/auth.client';
import { productsClient } from '../../support/clients/products.client';
import { usersClient } from '../../support/clients/users.client';
import { customerFactory, userFactory } from '../../support/factories/user.factory';
import { productFactory } from '../../support/factories/product.factory';

const authenticateAdmin = () => {
  const admin = userFactory({ administrador: 'true' });
  return usersClient.create(admin).then(() =>
    authClient.login(admin.email, admin.password).then(({ body }) => body.authorization)
  );
};

describe('API | Produtos', () => {
  it('API-08 | deve listar produtos', () => {
    productsClient.list().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantidade).to.be.a('number');
      expect(response.body.produtos).to.be.an('array');
      expect(response.body.produtos).to.have.length(response.body.quantidade);
      if (response.body.produtos.length) expect(response.body.produtos[0]).to.include.all.keys('nome', 'preco', 'descricao', 'quantidade', '_id');
    });
  });

  it('API-09 | deve consultar um produto pelo ID', () => {
    productsClient.list().then(({ body }) => {
      expect(body.produtos.length).to.be.greaterThan(0);
      const product = body.produtos[0];
      productsClient.getById(product._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include({ _id: product._id, nome: product.nome, descricao: product.descricao });
      });
    });
  });

  it('API-10 | deve bloquear criação de produto para usuário não administrador', () => {
    const customer = customerFactory();
    const product = productFactory();
    usersClient.create(customer).then(() => {
      authClient.login(customer.email, customer.password).then(({ body }) => {
        productsClient.create(product, body.authorization).then((response) => {
          expect(response.status).to.eq(403);
          expect(response.body.message).to.eq('Rota exclusiva para administradores');
        });
      });
    });
  });

  it('API-11 | deve cadastrar um produto como administrador', () => {
    const product = productFactory();
    authenticateAdmin().then((token) => {
      productsClient.create(product, token).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.include({ message: 'Cadastro realizado com sucesso' });
        expect(response.body._id).to.be.a('string').and.not.be.empty;
        productsClient.getById(response.body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body.nome).to.eq(product.nome);
        });
      });
    });
  });

  it('API-12 | deve atualizar um produto criado pela própria suíte', () => {
    const product = productFactory();
    const updatedProduct = { ...product, nome: `${product.nome} Updated`, preco: 299 };
    authenticateAdmin().then((token) => {
      productsClient.create(product, token).then(({ body }) => {
        productsClient.update(body._id, updatedProduct, token).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Registro alterado com sucesso');
          productsClient.getById(body._id).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body.nome).to.eq(updatedProduct.nome);
            expect(Number(getResponse.body.preco)).to.eq(updatedProduct.preco);
          });
        });
      });
    });
  });

  it('API-13 | deve excluir um produto criado pela própria suíte', () => {
    const product = productFactory();
    authenticateAdmin().then((token) => {
      productsClient.create(product, token).then(({ body }) => {
        productsClient.delete(body._id, token).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Registro excluído com sucesso');
          productsClient.getById(body._id).then((getResponse) => expect(getResponse.status).to.eq(400));
        });
      });
    });
  });
});
