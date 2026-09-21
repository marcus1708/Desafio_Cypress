import { userFactory } from '../../support/factories/user.factory';

describe('API | Autenticação', () => {
  it('API-01 | deve realizar login com credenciais válidas', () => {
    const user = userFactory();

    cy.createUser(user).then((createResponse) => {
      expect(createResponse.status).to.eq(201);

      cy.loginApi(user).then((response) => {
        expect(response.status).to.eq(200);

        expect(response.body).to.include({
          message: 'Login realizado com sucesso',
        });

        expect(response.body.authorization)
          .to.be.a('string')
          .and.to.match(/^Bearer\s.+/);
      });
    });
  });

  it('API-02 | deve rejeitar login com senha inválida', () => {
    const user = userFactory();

    cy.createUser(user).then((createResponse) => {
      expect(createResponse.status).to.eq(201);

      cy.loginApi({
        email: user.email,
        password: 'SenhaInvalida@999',
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message)
          .to.be.a('string')
          .and.not.be.empty;
      });
    });
  });
});