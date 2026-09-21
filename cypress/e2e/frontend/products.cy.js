import { userFactory } from '../../support/factories/user.factory';
import { productFactory } from '../../support/factories/product.factory';

describe('Frontend | Produtos', () => {
  const loginAsAdmin = () => {
    const user = userFactory();
    return cy.createUser(user).then(() => cy.loginFrontend(user));
  };

  it('FE-06 | deve cadastrar um novo produto', () => {
    const product = productFactory();

    loginAsAdmin();
    cy.contains('li', 'Cadastrar Produtos').click();
    cy.get('#nome').type(product.nome);
    cy.get('#price').type(String(product.preco));
    cy.get('#description').type(product.descricao);
    cy.get('#quantity').type(String(product.quantidade));
    cy.contains('button', 'Cadastrar').click();

    cy.contains('Cadastro realizado com sucesso').should('be.visible');
    cy.url().should('include', '/admin/listarprodutos');

    cy.listProducts().then(({ body }) => {
      const createdProduct = body.produtos.find(({ nome }) => nome === product.nome);

      expect(createdProduct, 'produto criado pela UI deve existir na API').to.exist;
      expect(createdProduct).to.include({
        nome: product.nome,
        descricao: product.descricao,
        quantidade: product.quantidade,
      });
      expect(Number(createdProduct.preco)).to.eq(product.preco);
    });
  });

  it('FE-07 | deve validar campos obrigatórios no cadastro de produto', () => {
    loginAsAdmin();
    cy.contains('li', 'Cadastrar Produtos').click();

    cy.get('#nome').should('have.attr', 'required');
    cy.get('#price').should('have.attr', 'required');
    cy.get('#description').should('have.attr', 'required');
    cy.get('#quantity').should('have.attr', 'required');

    cy.contains('button', 'Cadastrar').click();
    cy.url().should('include', '/admin/cadastrarprodutos');
  });

  it('FE-09 | deve acessar a listagem de produtos após autenticação administrativa', () => {
    loginAsAdmin();
    cy.contains('li', 'Listar Produtos').click();
    cy.url().should('include', '/admin/listarprodutos');
    cy.contains('Listar Produtos').should('be.visible');
  });
});
