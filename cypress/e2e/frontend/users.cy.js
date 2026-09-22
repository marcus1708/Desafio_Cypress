import { usersClient } from '../../support/clients/users.client';
import {
  customerFactory,
  userFactory,
} from '../../support/factories/user.factory';

describe('Frontend | Usuários', () => {
  it('FE-04 | deve cadastrar um novo usuário administrador', () => {
    const user = userFactory();

    cy.visit('/login');
    cy.contains('Cadastre-se').click();

    cy.get('#nome').type(user.nome);
    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);
    cy.get('#administrador').check();

    cy.contains('button', 'Cadastrar').click();

    cy.contains('Cadastro realizado com sucesso')
      .should('be.visible');
  });

  it('FE-05 | deve informar erro ao tentar cadastrar e-mail existente', () => {
    const user = customerFactory();

    usersClient.create(user).then(() => {
      cy.visit('/login');
      cy.contains('Cadastre-se').click();

      cy.get('#nome').type(user.nome);
      cy.get('#email').type(user.email);
      cy.get('#password').type(user.password);

      cy.contains('button', 'Cadastrar').click();

      cy.get('body').should('contain.text', 'email');
      cy.get('body').should('contain.text', 'já');
    });
  });
});