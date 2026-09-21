import { userFactory } from '../../support/factories/user.factory';

describe('API | Usuários', () => {
  it('API-03 | deve cadastrar um novo usuário', () => {
    const user = userFactory();

    cy.createUser(user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.include({ message: 'Cadastro realizado com sucesso' });
      expect(response.body._id).to.be.a('string').and.not.be.empty;
    });
  });

  it('API-04 | deve impedir cadastro com e-mail já utilizado', () => {
    const user = userFactory();

    cy.createUser(user).then((firstResponse) => {
      expect(firstResponse.status).to.eq(201);

      cy.createUser(user, { failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.include('email');
      });
    });
  });

  it('API-05 | deve consultar um usuário pelo ID', () => {
    const user = userFactory();

    cy.createUser(user).then(({ body }) => {
      cy.getUser(body._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include({
          nome: user.nome,
          email: user.email,
          administrador: user.administrador,
        });
        expect(response.body).to.have.property('_id', body._id);
      });
    });
  });

  it('API-06 | deve atualizar um usuário existente', () => {
    const user = userFactory();
    const updatedUser = { ...user, nome: `${user.nome} Updated` };

    cy.createUser(user).then(({ body }) => {
      cy.updateUser(body._id, updatedUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro alterado com sucesso');

        cy.getUser(body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body.nome).to.eq(updatedUser.nome);
        });
      });
    });
  });

  it('API-07 | deve excluir um usuário existente', () => {
    const user = userFactory();

    cy.createUser(user).then(({ body }) => {
      cy.deleteUser(body._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');

        cy.getUser(body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(400);
          expect(getResponse.body.message).to.be.a('string').and.not.be.empty;
        });
      });
    });
  });
});
