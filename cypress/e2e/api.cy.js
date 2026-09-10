describe('API - ServeRest', () => {
  let apiUrl;

  before(() => {
    cy.env(['apiUrl']).then(({ apiUrl: url }) => {
      apiUrl = url;
    });
  });

  it('Deve cadastrar um novo usuário com sucesso', () => {
  cy.fixture('usuario').then((usuario) => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: usuario,
    }).then((response) => {
      expect(response.status).to.eq(201);

      expect(response.body)
        .to.have.property('_id')
        .and.to.be.a('string')
        .and.not.be.empty;

      expect(response.body.message).to.eq(
        'Cadastro realizado com sucesso'
      );
    });
  });
});

  it('Deve realizar login com sucesso', () => {
    cy.fixture('login').then(({ usuarioValido }) => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: usuarioValido,
      }).then((response) => {
        expect(response.status).to.eq(200);

        expect(response.body.message).to.eq(
          'Login realizado com sucesso'
        );

        expect(response.body.authorization).to.match(/^Bearer\s.+/);
      });
    });
  });

  it('Deve consultar a lista de produtos com sucesso', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/produtos`,
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body)
        .to.have.property('produtos')
        .and.to.be.an('array');

      expect(response.body)
        .to.have.property('quantidade')
        .and.to.be.a('number');

      expect(response.body.produtos.length).to.be.greaterThan(0);
    });
  });
});