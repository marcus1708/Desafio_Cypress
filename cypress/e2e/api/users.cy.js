import { usersClient } from '../../support/clients/users.client';
import { userFactory } from '../../support/factories/user.factory';

describe('API | Usuários', () => {
  it('API-03 | deve cadastrar um novo usuário', () => {
    const user = userFactory();
    usersClient.create(user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string').and.not.be.empty;
    });
  });

  it('API-04 | deve impedir cadastro com e-mail já utilizado', () => {
    const user = userFactory();
    usersClient.create(user).then((firstResponse) => {
      expect(firstResponse.status).to.eq(201);
      usersClient.create(user, { failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.include('email');
      });
    });
  });

  it('API-05 | deve consultar um usuário pelo ID', () => {
    const user = userFactory();
    usersClient.create(user).then(({ body }) => {
      usersClient.getById(body._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include({ nome: user.nome, email: user.email, administrador: user.administrador, _id: body._id });
      });
    });
  });

  it('API-06 | deve atualizar um usuário existente', () => {
    const user = userFactory();
    const updatedUser = { ...user, nome: `${user.nome} Updated` };
    usersClient.create(user).then(({ body }) => {
      usersClient.update(body._id, updatedUser).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro alterado com sucesso');
        usersClient.getById(body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body.nome).to.eq(updatedUser.nome);
        });
      });
    });
  });

  it('API-07 | deve excluir um usuário existente', () => {
    const user = userFactory();
    usersClient.create(user).then(({ body }) => {
      usersClient.delete(body._id).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
        usersClient.getById(body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(400);
          expect(getResponse.body.message).to.be.a('string').and.not.be.empty;
        });
      });
    });
  });
});
