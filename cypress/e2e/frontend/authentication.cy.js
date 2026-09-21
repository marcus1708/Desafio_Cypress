import { userFactory } from '../../support/factories/user.factory';

describe('Frontend | Autenticação', () => {
  it('FE-01 | deve realizar login com credenciais válidas', () => {
    const user = userFactory();

    cy.createUser(user).then(() => {
      cy.loginFrontend(user);
      cy.url().should('include', '/admin/home');
      cy.contains('Bem Vindo').should('be.visible');
    });
  });

  it('FE-02 | deve exibir erro ao informar credenciais inválidas', () => {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.visit('/login');
    cy.get('#email').type(`invalid.${Date.now()}@example.com`);
    cy.get('#password').type('SenhaInvalida@999');
    cy.contains('button', 'Entrar').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.url().should('include', '/login');
    cy.get('body').should('contain.text', 'inválidos');
  });

  it('FE-03 | deve impedir envio do login com campos obrigatórios vazios', () => {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.visit('/login');
    cy.get('#email').clear();
    cy.get('#password').clear();
    cy.contains('button', 'Entrar').click();
    cy.get('@loginRequest.all').should('have.length', 0);
    cy.url().should('include', '/login');
  });

  it('FE-08 | deve encerrar a sessão pelo logout', () => {
    const user = userFactory();

    cy.createUser(user).then(() => {
      cy.loginFrontend(user);
      cy.contains('Sair').should('be.visible').click();
      cy.url().should('include', '/login');
      cy.visit('/admin/home');
      cy.url().should('include', '/login');
    });
  });
});
