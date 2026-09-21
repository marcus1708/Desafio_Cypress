# ServeRest | QA Automation Challenge

[![Cypress Tests](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml/badge.svg)](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml)

Automação de testes **E2E de frontend** e **API** utilizando **Cypress + JavaScript**, construída para o desafio técnico de QA.

O projeto foi estruturado com foco em independência dos testes, massa de dados dinâmica, assertions orientadas ao comportamento, reutilização, estabilidade e execução em CI.

> **Cypress 16:** URLs de ambiente são tratadas como configuração pública via `Cypress.expose()`. Segredos e credenciais não devem ser armazenados em `expose`.

## Stack

- Node.js 22+
- JavaScript
- Cypress 16
- GitHub Actions
- ServeRest Frontend
- ServeRest REST API

## Aplicações sob teste

- Frontend: https://front.serverest.dev/
- API / Swagger: https://serverest.dev/

## Cobertura

O enunciado solicita 3 cenários de frontend e 3 de API. Além dos cenários mínimos, a suíte amplia a cobertura para fluxos positivos, negativos, validações, ciclo de vida de dados e autorização.

### Frontend — 9 cenários

| ID | Cenário | Tipo |
|---|---|---|
| FE-01 | Login com credenciais válidas | Positivo |
| FE-02 | Login com credenciais inválidas | Negativo |
| FE-03 | Login com campos obrigatórios vazios | Validação |
| FE-04 | Cadastro de usuário administrador | Positivo |
| FE-05 | Cadastro com e-mail já utilizado | Negativo |
| FE-06 | Cadastro de produto | Positivo |
| FE-07 | Validação dos campos obrigatórios de produto | Validação |
| FE-08 | Logout | Sessão |
| FE-09 | Acesso à listagem de produtos | Navegação |

### API — 13 cenários

| ID | Cenário | Tipo |
|---|---|---|
| API-01 | Login com credenciais válidas | Positivo |
| API-02 | Login com senha inválida | Negativo |
| API-03 | Cadastro de usuário | Positivo |
| API-04 | Cadastro com e-mail duplicado | Negativo |
| API-05 | Consulta de usuário por ID | Consulta |
| API-06 | Atualização de usuário | CRUD |
| API-07 | Exclusão de usuário | CRUD |
| API-08 | Listagem de produtos | Consulta |
| API-09 | Consulta de produto por ID | Consulta |
| API-10 | Bloqueio de cadastro de produto para não administrador | Autorização |
| API-11 | Cadastro de produto como administrador | CRUD |
| API-12 | Atualização de produto | CRUD |
| API-13 | Exclusão de produto | CRUD |

## Arquitetura

```text
cypress/
├── e2e/
│   ├── api/
│   │   ├── authentication.cy.js
│   │   ├── users.cy.js
│   │   └── products.cy.js
│   └── frontend/
│       ├── authentication.cy.js
│       ├── users.cy.js
│       └── products.cy.js
│
├── support/
│   ├── commands/
│   │   ├── api.commands.js
│   │   └── ui.commands.js
│   └── factories/
│       ├── product.factory.js
│       └── user.factory.js
│
├── fixtures/
├── reports/
└── screenshots/
```

### Princípios adotados

- Specs separadas por domínio e camada.
- Commands para ações realmente reutilizáveis.
- Factories para geração de massa dinâmica.
- Testes independentes entre si.
- API utilizada para preparar massa quando isso reduz acoplamento da UI.
- Assertions próximas ao comportamento validado.
- Sincronização por comandos do Cypress em vez de sleeps arbitrários.
- Configuração por variáveis de ambiente quando necessário.

## Estratégia de massa de dados

Os testes não dependem de usuários fixos como `qa@qa.com.br`.

Usuários e produtos são gerados com identificadores únicos para reduzir colisões no ambiente público compartilhado.

Quando um cenário precisa de um estado específico, o estado é preparado dentro do próprio cenário.

## Execução

Instale as dependências:

```bash
npm ci
```

Abra o Cypress em modo interativo:

```bash
npm run cy:open
```

Execute toda a suíte em modo headless:

```bash
npm test
```

Execute apenas API:

```bash
npm run cy:run:api
```

Execute apenas frontend:

```bash
npm run cy:run:e2e
```

Execute um smoke test de autenticação:

```bash
npm run test:smoke
```

## Configuração de ambiente

Por padrão:

```text
Frontend: https://front.serverest.dev
API: https://serverest.dev
```

Para executar contra outro ambiente:

```bash
CYPRESS_BASE_URL=http://localhost:3000 API_URL=http://localhost:3000 npm test
```

## Relatórios

A execução utiliza:

- Mochawesome para relatório funcional;
- JUnit para integração com pipelines;
- screenshots automáticos em falhas.

Os artefatos são armazenados em `cypress/reports` e `cypress/screenshots`.

## CI/CD

O GitHub Actions executa a suíte a cada `push` e `pull request`.

Pipeline:

```text
Checkout
  ↓
Node.js 22
  ↓
npm ci
  ↓
Cypress headless (Chrome)
  ↓
Reports / screenshots
  ↓
Artifacts
```

## Decisões de automação

### API + UI

A API é utilizada para preparar estados de teste quando isso evita dependência desnecessária da interface. O comportamento que pertence ao frontend continua sendo validado pelo fluxo E2E.

### Independência

Cada cenário cria a massa necessária para sua execução. A ordem de execução dos specs não deve alterar o resultado.

### Estabilidade

Não são utilizados waits fixos para sincronizar a aplicação. O Cypress aguarda os elementos e comandos de forma determinística e os testes podem evoluir para intercepts específicos conforme novos fluxos forem adicionados.

### Playwright

A separação entre specs, commands, factories e integração por API foi pensada para manter conceitos transferíveis para uma suíte Playwright, especialmente na organização de fixtures, page objects/API clients, dados e camadas de teste.

## Ambiente compartilhado

O ServeRest online é compartilhado e seus dados podem ser alterados por outros consumidores. Por isso, a suíte utiliza massa dinâmica e não depende de IDs fixos.

Mais detalhes: `docs/known-issues.md`.

## Critérios atendidos

- [x] Frontend e API
- [x] Cenários positivos e negativos
- [x] Assertions relevantes
- [x] Massa dinâmica
- [x] Testes independentes
- [x] Reutilização
- [x] Estrutura escalável
- [x] Relatórios
- [x] CI/CD
- [x] Documentação
- [x] Known issues
