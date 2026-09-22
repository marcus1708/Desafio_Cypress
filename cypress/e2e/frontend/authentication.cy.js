import { usersClient } from '../../support/clients/users.client';
import { userFactory } from '../../support/factories/user.factory';

describe('Frontend | Autenticação', () => {
  it('FE-01 | deve realizar login com credenciais válidas', () => {
    const user = userFactory();

    usersClient.create(user).then(() => {
      cy.visit('/login');

      cy.get('[data-testid="email"]').type(user.email);
      cy.get('[data-testid="senha"]').type(user.password);
      cy.contains('button', 'Entrar').click();

      cy.url().should('include', '/admin/home');
      cy.contains('Bem Vindo').should('be.visible');
    });
  });

  it('FE-02 | deve exibir erro ao informar credenciais inválidas', () => {
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.visit('/login');

    cy.get('[data-testid="email"]').type(
      `invalid.${Date.now()}@example.com`
    );
    cy.get('[data-testid="senha"]').type('SenhaInvalida@999');

    cy.contains('button', 'Entrar').click();

    cy.wait('@loginRequest')
      .its('response.statusCode')
      .should('eq', 401);

    cy.url().should('include', '/login');
    cy.get('body').should('contain.text', 'inválidos');
  });

  it('FE-03 | deve rejeitar login com campos obrigatórios vazios', () => {
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.visit('/login');

    cy.get('[data-testid="email"]')
      .should('be.visible')
      .clear()
      .should('have.value', '');

    cy.get('[data-testid="senha"]')
      .should('be.visible')
      .clear()
      .should('have.value', '');

    cy.contains('button', 'Entrar')
      .should('be.visible')
      .click();

    cy.wait('@loginRequest')
      .its('response.statusCode')
      .should('eq', 400);

    cy.url().should('include', '/login');
  });

  it('FE-08 | deve encerrar a sessão pelo logout', () => {
    const user = userFactory();

    usersClient.create(user).then(() => {
      cy.visit('/login');

      cy.get('[data-testid="email"]').type(user.email);
      cy.get('[data-testid="senha"]').type(user.password);
      cy.contains('button', 'Entrar').click();

      cy.url().should('include', '/admin/home');

      cy.contains('Logout')
        .should('be.visible')
        .click();

      cy.url().should('include', '/login');

      cy.visit('/admin/home');

      cy.url().should('include', '/login');
    });
  });
});