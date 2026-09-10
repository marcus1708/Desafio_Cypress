# Desafio de Automação - ServeRest

Projeto de automação de testes **E2E para frontend** e **testes de API** desenvolvido com **Cypress** e **JavaScript**.

## Tecnologias

- Cypress
- JavaScript
- Node.js
- ServeRest

## Cenários automatizados

### Frontend - E2E

1. Deve realizar login com sucesso
2. Deve cadastrar um novo usuário administrador com sucesso
3. Deve cadastrar um novo produto com sucesso

### API

1. Deve cadastrar um novo usuário com sucesso
2. Deve realizar login com sucesso
3. Deve consultar a lista de produtos com sucesso

## Estrutura

```text
cypress/
├── e2e/
│   ├── api.cy.js
│   └── frontend.cy.js
├── fixtures/
│   ├── login.json
│   ├── produto.json
│   └── usuario.json
└── support/
    ├── api_serverest.js
    ├── e2e.js
    └── web_serverest.js
```

## Configuração

A URL do frontend é configurada como `baseUrl` no `cypress.config.js`.

A URL da API é disponibilizada pela variável `Cypress.env('apiUrl')`.

## Instalação

```bash
npm install
```

## Execução em modo interativo

```bash
npm run cy:open
```

## Execução em modo headless

```bash
npm test
```

ou

```bash
npm run cy:run
```

## Aplicações utilizadas

- Frontend: https://front.serverest.dev/
- API/Swagger: https://serverest.dev/

## Boas práticas aplicadas

- Uso de `cy.visit()` com `baseUrl`.
- Uso de `cy.request()` para automação de API.
- Dados de teste separados em fixtures.
- Dados dinâmicos para evitar colisão de e-mails e produtos.
- Assertions específicas para validar status, mensagens e estrutura da resposta.
- Comandos customizados somente para ações reutilizáveis.
- Separação entre testes de frontend e API.
- Nomenclatura dos cenários orientada ao comportamento esperado.
