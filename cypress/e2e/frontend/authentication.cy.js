import { usersClient } from '../../support/clients/users.client';
import { userFactory } from '../../support/factories/user.factory';

describe('Frontend | Autenticação', () => {
  let user;

  before(() => {
    user = userFactory();
    usersClient.create(user).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it('FE-01 | deve realizar login com credenciais válidas', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type(user.email);
    cy.get('[data-testid="senha"]').type(user.password);
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin/home');
    cy.contains('Bem Vindo').should('be.visible');
  });

  it('FE-02 | deve exibir erro ao informar credenciais inválidas', () => {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.visit('/login');
    cy.get('[data-testid="email"]').type(`invalid.${Date.now()}@example.com`);
    cy.get('[data-testid="senha"]').type('SenhaInvalida@999');
    cy.contains('button', 'Entrar').click();
    cy.wait('@loginRequest').then(({ response }) => {
      expect(response.statusCode).to.eq(401);
    });
    cy.url().should('include', '/login');
    cy.get('body').should('contain.text', 'inválidos');
  });

  it('FE-03 | deve rejeitar login com campos obrigatórios vazios', () => {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.visit('/login');
    cy.get('[data-testid="email"]').clear();
    cy.get('[data-testid="senha"]').clear();
    cy.contains('button', 'Entrar').click();
    cy.wait('@loginRequest').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
      expect(response.body).to.be.an('object');

      const hasGeneralMessage =
        typeof response.body.message === 'string' &&
        response.body.message.trim().length > 0;

      const fieldErrors = Object.entries(response.body).filter(
        ([key, value]) =>
          key !== 'message' &&
          typeof value === 'string' &&
          value.trim().length > 0
      );

      expect(hasGeneralMessage || fieldErrors.length > 0).to.eq(true);
    });
    cy.url().should('include', '/login');
  });

  it('FE-08 | deve encerrar a sessão pelo logout', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type(user.email);
    cy.get('[data-testid="senha"]').type(user.password);
    cy.contains('button', 'Entrar').click();
    cy.url().should('include', '/admin/home');
    cy.contains('Logout').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.visit('/admin/home');
    cy.url().should('include', '/login');
  });
});
