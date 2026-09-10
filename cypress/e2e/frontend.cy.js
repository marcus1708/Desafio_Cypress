describe('Frontend - ServeRest', () => {
  let usuario;

  before(() => {
    cy.fixture('login').then((data) => {
      usuario = data.usuarioValido;
    });
  });

  it('Deve realizar login com sucesso', () => {
    cy.loginFrontend(usuario);

    cy.url().should('include', '/admin/home');
    cy.contains('Bem Vindo').should('be.visible');
  });

  it('Deve cadastrar um novo usuário administrador com sucesso', () => {
    cy.fixture('usuario').then((data) => {
      const novoUsuario = {
        ...data,
        email: `qa.${Date.now()}@example.com`
      };

      cy.visit('/login');
      cy.contains('Cadastre-se').click();

      cy.get('#nome').type(novoUsuario.nome);
      cy.get('#email').type(novoUsuario.email);
      cy.get('#password').type(novoUsuario.password);
      cy.get('#administrador').check();
      cy.contains('button', 'Cadastrar').click();

      cy.contains('Cadastro realizado com sucesso').should('be.visible');
    });
  });

  it('Deve cadastrar um novo produto com sucesso', () => {
    cy.loginFrontend(usuario);

    cy.contains('li', 'Cadastrar Produtos').click();

    cy.fixture('produto').then((produto) => {
      const nomeProduto = `Produto QA ${Date.now()}`;

      cy.get('#nome').type(nomeProduto);
      cy.get('#price').type(String(produto.preco));
      cy.get('#description').type(produto.descricao);
      cy.get('#quantity').type(String(produto.quantidade));
      cy.contains('button', 'Cadastrar').click();

    });
  });
});
