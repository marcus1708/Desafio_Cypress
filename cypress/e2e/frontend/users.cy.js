import { usersClient } from '../../support/clients/users.client';
import { customerFactory, userFactory } from '../../support/factories/user.factory';

describe('Frontend | Usuários', () => {
  it('FE-04 | deve cadastrar um novo usuário administrador', () => {
    const user = userFactory();

    cy.intercept('POST', '**/usuarios').as('createUser');
    cy.visit('/login');
    cy.contains('Cadastre-se').click();
    cy.get('#nome').type(user.nome);
    cy.get('#email').type(user.email);
    cy.get('#password').type(user.password);
    cy.get('#administrador').check();
    cy.contains('button', 'Cadastrar').click();

    cy.wait('@createUser').then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string').and.not.be.empty;
    });

    cy.url().should('include', '/admin/home');
  });

  it('FE-05 | deve informar erro ao tentar cadastrar e-mail existente', () => {
    const user = customerFactory();
    usersClient.create(user).then(() => {
      cy.intercept('POST', '**/usuarios').as('duplicateUser');
      cy.visit('/login');
      cy.contains('Cadastre-se').click();
      cy.get('#nome').type(user.nome);
      cy.get('#email').type(user.email);
      cy.get('#password').type(user.password);
      cy.contains('button', 'Cadastrar').click();
      cy.wait('@duplicateUser').then(({ response }) => {
        expect(response.statusCode).to.eq(400);
        expect(response.body.message).to.include('email');
      });
      cy.get('body').should('contain.text', 'email');
    });
  });
});
