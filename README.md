# ServeRest | QA Automation Challenge

[![Cypress Tests](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml/badge.svg)](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml)

Automação de testes **E2E de frontend e API** utilizando **Cypress + JavaScript**, desenvolvida para o desafio técnico de QA.

O projeto foi estruturado com foco em:

* independência entre cenários;
* massa de dados dinâmica;
* cobertura de fluxos positivos e negativos;
* assertions orientadas ao comportamento;
* reutilização de comandos;
* sincronização determinística;
* execução automatizada em CI;
* arquitetura organizada e escalável.

> **Status da suíte:** todos os cenários executados com sucesso localmente e no GitHub Actions.

---

## Stack

* **Node.js 22+**
* **JavaScript**
* **Cypress 16**
* **cypress-plugin-api**
* **GitHub Actions**
* **ServeRest Frontend**
* **ServeRest REST API**
* **Mochawesome**
* **JUnit**

---

## Aplicações sob teste

| Camada        | Aplicação                    |
| ------------- | ---------------------------- |
| Frontend      | https://front.serverest.dev/ |
| API / Swagger | https://serverest.dev/       |

---

## Estratégia de testes

A suíte foi dividida em duas camadas:

### Frontend

Valida os principais fluxos de negócio através da interface, incluindo:

* autenticação;
* cadastro de usuários;
* cadastro de produtos;
* validações;
* logout;
* navegação;
* autorização de acesso.

### API

Valida diretamente os contratos e comportamentos da API, incluindo:

* autenticação;
* CRUD de usuários;
* CRUD de produtos;
* consultas;
* duplicidade de dados;
* autorização;
* respostas HTTP.

A API também é utilizada para **preparar estados de teste quando isso reduz o acoplamento desnecessário da UI**, mantendo no frontend a validação do comportamento que pertence à interface.

---

## Cobertura

O desafio solicita 3 cenários de frontend e 3 de API. A suíte foi ampliada para cobrir fluxos adicionais relevantes ao risco funcional da aplicação, evitando limitar a automação apenas aos cenários mínimos solicitados.

### Frontend — 9 cenários

| ID    | Cenário                                     | Tipo      |
| ----- | ------------------------------------------- | --------- |
| FE-01 | Login com credenciais válidas               | Positivo  |
| FE-02 | Login com credenciais inválidas             | Negativo  |
| FE-03 | Login com campos obrigatórios vazios        | Validação |
| FE-04 | Cadastro de usuário administrador           | Positivo  |
| FE-05 | Cadastro com e-mail já utilizado            | Negativo  |
| FE-06 | Cadastro de produto                         | Positivo  |
| FE-07 | Cadastro de produto sem campos obrigatórios | Validação |
| FE-08 | Logout                                      | Sessão    |
| FE-09 | Acesso à listagem de produtos               | Navegação |

### API — 13 cenários

| ID     | Cenário                                                | Tipo        |
| ------ | ------------------------------------------------------ | ----------- |
| API-01 | Login com credenciais válidas                          | Positivo    |
| API-02 | Login com senha inválida                               | Negativo    |
| API-03 | Cadastro de usuário                                    | Positivo    |
| API-04 | Cadastro com e-mail duplicado                          | Negativo    |
| API-05 | Consulta de usuário por ID                             | Consulta    |
| API-06 | Atualização de usuário                                 | CRUD        |
| API-07 | Exclusão de usuário                                    | CRUD        |
| API-08 | Listagem de produtos                                   | Consulta    |
| API-09 | Consulta de produto por ID                             | Consulta    |
| API-10 | Bloqueio de cadastro de produto para não administrador | Autorização |
| API-11 | Cadastro de produto como administrador                 | CRUD        |
| API-12 | Atualização de produto                                 | CRUD        |
| API-13 | Exclusão de produto                                    | CRUD        |

**Total: 22 cenários automatizados.**

---

## Arquitetura

```text
cypress/
├── e2e/
│   ├── api/
│   │   ├── authentication.cy.js
│   │   ├── users.cy.js
│   │   └── products.cy.js
│   │
│   └── frontend/
│       ├── authentication.cy.js
│       ├── users.cy.js
│       └── products.cy.js
│
├── support/
│   ├── commands/
│   │   ├── api.commands.js
│   │   └── ui.commands.js
│   │
│   └── factories/
│       ├── product.factory.js
│       └── user.factory.js
│
├── fixtures/
└── selectors/
```

### Responsabilidade das camadas

**Specs**

Organizadas por domínio e camada, mantendo os cenários próximos ao comportamento que validam.

**Commands**

Concentram ações realmente reutilizáveis, como autenticação e operações de API, evitando duplicação entre os testes.

**Factories**

Geram massa de dados dinâmica para reduzir colisões e dependência de registros previamente existentes.

**Selectors**

Centralizam seletores quando necessário e priorizam atributos estáveis destinados à automação, como `data-testid`.

---

## Princípios adotados

### Independência

Cada cenário prepara a massa necessária para sua execução e não deve depender da ordem em que os demais testes são executados.

### Massa dinâmica

Usuários e produtos são gerados com identificadores únicos, reduzindo colisões em um ambiente compartilhado.

### API + UI

A API é utilizada para preparar estados de teste quando isso reduz o acoplamento da interface.

O comportamento que pertence ao frontend continua sendo validado através do fluxo E2E.

### Reutilização

Comandos Cypress são utilizados para encapsular operações recorrentes, como autenticação administrativa e chamadas de API.

Nos fluxos que exigem autenticação, o setup compartilhado é realizado por `beforeEach()`, mantendo os cenários focados no comportamento que realmente está sendo validado.

### Assertions

As assertions são mantidas próximas ao comportamento validado, priorizando:

* status HTTP;
* payloads;
* respostas da API;
* elementos visíveis;
* navegação;
* resultado funcional.

### Sincronização

Não são utilizados `waits` fixos para sincronização.

Quando necessário, os testes utilizam intercepts e espera por eventos/requisições específicas:

```javascript
cy.intercept('POST', '**/produtos').as('createProduct');

cy.wait('@createProduct');
```

---

## API Testing

As chamadas de API utilizam o [`cypress-plugin-api`](https://www.npmjs.com/package/cypress-plugin-api), permitindo executar requisições através do `cy.api()` e visualizar método, URL, request e response diretamente no Cypress Runner.

Exemplo:

```javascript
cy.api({
  method: 'POST',
  url: `${apiUrl}/login`,
  body: {
    email,
    password,
  },
  failOnStatusCode: false,
});
```

Os cenários validam tanto o **status HTTP** quanto os dados relevantes da resposta e da requisição.

---

## Dados de teste

Os testes não dependem de usuários fixos ou registros previamente existentes.

Exemplo de estratégia:

```text
Factory
   ↓
Dados únicos
   ↓
Preparação do estado
   ↓
Execução do cenário
   ↓
Assertions
```

Quando um cenário precisa de um usuário administrador, por exemplo, a massa é criada durante a própria execução.

Essa abordagem reduz colisões e torna os testes mais independentes do estado prévio do ambiente.

---

## Execução

### Instalação

```bash
npm ci
```

### Cypress em modo interativo

```bash
npm run cy:open
```

### Suíte completa

```bash
npm test
```

### Somente API

```bash
npm run cy:run:api
```

### Somente Frontend

```bash
npm run cy:run:e2e
```

### Smoke test de autenticação

```bash
npm run test:smoke
```

---

## Configuração de ambiente

Por padrão:

```text
Frontend: https://front.serverest.dev
API:      https://serverest.dev
```

A URL do frontend e da API podem ser sobrescritas por configuração de ambiente.

Exemplo:

```bash
CYPRESS_BASE_URL=http://localhost:3000 \
API_URL=http://localhost:3000 \
npm test
```

No Cypress 16, a URL da API é tratada como configuração pública através de `Cypress.expose()`.

> Dados sensíveis, como credenciais e tokens, não devem ser armazenados em `Cypress.expose()`.

---

## Relatórios

A execução utiliza:

* **Mochawesome** para relatório funcional;
* **JUnit** para integração com pipelines;
* **screenshots automáticos** em falhas.

Os relatórios e screenshots são gerados durante a execução e podem ser disponibilizados como artefatos do pipeline.

---

## CI/CD

O projeto possui pipeline automatizado através do **GitHub Actions**.

Fluxo:

```text
Checkout
   ↓
Node.js 22
   ↓
npm ci
   ↓
Cypress headless
   ↓
Chrome
   ↓
Execução da suíte
   ↓
Reports / Screenshots
   ↓
Artifacts
```

O workflow é executado em eventos definidos no pipeline e utiliza a mesma suíte automatizada utilizada localmente.

### Resultado

A suíte foi validada com execução completa no GitHub Actions, apresentando **100% de sucesso**.

---

## Ambiente compartilhado

O ServeRest online é um ambiente compartilhado e seus dados podem ser alterados por outros consumidores.

Por isso, a suíte:

* evita depender de IDs fixos;
* utiliza massa dinâmica;
* cria os estados necessários para os cenários;
* evita dependência entre execuções.

Detalhes sobre comportamentos específicos do ambiente estão documentados em:

```text
docs/known-issues.md
```
---

## Critérios atendidos

* [x] Frontend e API
* [x] Cenários positivos e negativos
* [x] Assertions relevantes
* [x] Massa dinâmica
* [x] Testes independentes
* [x] Commands reutilizáveis
* [x] Factories
* [x] Seletores estáveis
* [x] Sincronização sem sleeps arbitrários
* [x] Estrutura escalável
* [x] Relatórios
* [x] CI/CD
* [x] Documentação
* [x] Known issues
* [x] Execução validada localmente
* [x] Execução validada no CI
