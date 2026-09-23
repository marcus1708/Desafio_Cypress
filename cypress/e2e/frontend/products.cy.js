import { usersClient } from '../../support/clients/users.client';
import { userFactory } from '../../support/factories/user.factory';
import { productFactory } from '../../support/factories/product.factory';

describe('Frontend | Produtos', () => {
  let admin;

  before(() => {
    admin = userFactory();
    usersClient.create(admin).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type(admin.email);
    cy.get('[data-testid="senha"]').type(admin.password);
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin/home');
  });

  it('FE-06 | deve cadastrar um novo produto', () => {
    const product = productFactory();
    cy.intercept('POST', '**/produtos').as('createProduct');
    cy.intercept('GET', '**/produtos*').as('listProducts');
    cy.visit('/admin/cadastrarprodutos');
    cy.get('[data-testid="nome"]').should('be.visible').type(product.nome);
    cy.get('[data-testid="preco"]').should('be.visible').type(String(product.preco));
    cy.get('[data-testid="descricao"]').should('be.visible').type(product.descricao);
    cy.get('[data-testid="quantity"]').should('be.visible').type(String(product.quantidade));
    cy.contains('button', 'Cadastrar').click();
    cy.wait('@createProduct').then(({ request, response }) => {
      expect(response.statusCode).to.eq(201);
      expect(request.body).to.include({ nome: product.nome, descricao: product.descricao });
      expect(Number(request.body.preco)).to.eq(Number(product.preco));
      expect(Number(request.body.quantidade)).to.eq(Number(product.quantidade));
    });
    cy.wait('@listProducts');
    cy.contains(product.nome).should('be.visible');
  });

  it('FE-07 | deve validar campos obrigatórios no cadastro de produto', () => {
    cy.intercept('POST', '**/produtos').as('createProduct');
    cy.visit('/admin/cadastrarprodutos');
    cy.get('[data-testid="nome"]').clear();
    cy.get('[data-testid="preco"]').clear();
    cy.get('[data-testid="descricao"]').clear();
    cy.get('[data-testid="quantity"]').clear();
    cy.contains('button', 'Cadastrar').click();
    cy.wait('@createProduct').then(({ request, response }) => {
      expect(response.statusCode).to.eq(400);
      expect(request.body).to.be.an('object');
    });
    cy.url().should('include', '/admin/cadastrarprodutos');
  });

  it('FE-09 | deve acessar a listagem de produtos após autenticação administrativa', () => {
    cy.visit('/admin/listarprodutos');
    cy.url().should('include', '/admin/listarprodutos');
    cy.contains('Lista dos Produtos').should('be.visible');
  });
});
