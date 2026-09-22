# ServeRest | QA Automation Challenge

[![Cypress Tests](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml/badge.svg)](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml)

Automação de testes **E2E de frontend e API** utilizando **Cypress + JavaScript**, desenvolvida para o desafio técnico de QA.

O projeto foi estruturado com foco em:

- independência entre cenários;
- massa de dados dinâmica;
- cobertura de fluxos positivos e negativos;
- assertions orientadas ao comportamento;
- reutilização de código;
- sincronização determinística;
- separação de responsabilidades;
- execução automatizada em CI;
- arquitetura organizada e escalável.

> **Status da suíte:** 22 cenários automatizados validados com sucesso localmente.

---

## Stack

- **Node.js 22+**
- **JavaScript**
- **Cypress 16**
- **cypress-plugin-api**
- **GitHub Actions**
- **ServeRest Frontend**
- **ServeRest REST API**
- **Mochawesome**
- **JUnit**

---

## Aplicações sob teste

| Camada | Aplicação |
|---|---|
| Frontend | https://front.serverest.dev/ |
| API / Swagger | https://serverest.dev/ |

---

# Estratégia de testes

A suíte foi dividida em duas camadas principais.

## Frontend

Os testes E2E validam os principais fluxos de negócio através da interface, incluindo:

- autenticação;
- cadastro de usuários;
- cadastro de produtos;
- validações;
- logout;
- navegação;
- controle de acesso.

## API

Os testes de API validam diretamente os comportamentos e contratos da aplicação, incluindo:

- autenticação;
- CRUD de usuários;
- CRUD de produtos;
- consultas;
- duplicidade de dados;
- autorização;
- códigos HTTP;
- conteúdo das respostas.

A API também é utilizada para **preparar estados de teste quando isso reduz o acoplamento desnecessário da UI**, mantendo no frontend a validação do comportamento que pertence à interface.

---

# Cobertura

A suíte foi ampliada para além dos cenários mínimos do desafio, cobrindo fluxos positivos, negativos, validações, autorização e operações CRUD.

## Frontend — 9 cenários

| ID | Cenário | Tipo |
|---|---|---|
| FE-01 | Login com credenciais válidas | Positivo |
| FE-02 | Login com credenciais inválidas | Negativo |
| FE-03 | Login com campos obrigatórios vazios | Validação |
| FE-04 | Cadastro de usuário administrador | Positivo |
| FE-05 | Cadastro com e-mail já utilizado | Negativo |
| FE-06 | Cadastro de produto | Positivo |
| FE-07 | Cadastro de produto sem campos obrigatórios | Validação |
| FE-08 | Logout | Sessão |
| FE-09 | Acesso à listagem de produtos | Navegação |

## API — 13 cenários

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

**Total: 22 cenários automatizados.**

---

# Arquitetura

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
│   ├── clients/
│   │   ├── auth.client.js
│   │   ├── products.client.js
│   │   └── users.client.js
│   │
│   ├── commands/
│   │   ├── api.commands.js
│   │   └── ui.commands.js
│   │
│   └── factories/
│       ├── product.factory.js
│       └── user.factory.js
│
└── fixtures/
```

## Responsabilidade das camadas

### Specs

Contêm os cenários e as assertions relacionadas ao comportamento que está sendo validado.

Os testes são organizados por camada e domínio:

```text
API
├── authentication
├── users
└── products

Frontend
├── authentication
├── users
└── products
```

### API Clients

Os clients encapsulam as operações específicas de cada domínio:

```text
auth.client.js
users.client.js
products.client.js
```

Essa camada evita que os testes precisem conhecer detalhes de URL, método HTTP e estrutura de cada endpoint.

Exemplo:

```javascript
usersClient.create(user);
```

em vez de repetir diretamente uma requisição HTTP dentro de cada cenário.

### Commands

Os commands são utilizados somente para comportamentos realmente reutilizáveis.

O `api.commands.js` disponibiliza a infraestrutura genérica:

```javascript
cy.apiRequest(...)
```

Os clients utilizam esse comando para executar as requisições.

Fluxo:

```text
Spec
  ↓
Client de domínio
  ↓
cy.apiRequest()
  ↓
cy.request()
```

O `ui.commands.js` concentra ações reutilizáveis da interface, como autenticação.

### Factories

As factories são responsáveis pela geração de massa de teste dinâmica:

```text
user.factory.js
product.factory.js
```

Os dados recebem identificadores únicos para reduzir colisões em ambientes compartilhados.

---

# Princípios adotados

## Independência

Cada cenário prepara a massa necessária para sua própria execução.

Os testes não devem depender da ordem de execução de outros cenários.

## Massa dinâmica

Usuários e produtos são gerados com identificadores únicos.

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

Essa abordagem reduz colisões e dependência de registros previamente existentes.

## API + UI

A API é utilizada para preparar estados de teste quando isso reduz o acoplamento da interface.

Por exemplo, um usuário pode ser criado através da API antes que o fluxo de login seja validado pelo frontend.

O comportamento pertencente à interface continua sendo validado através do fluxo E2E.

## Reutilização

A reutilização é aplicada através de:

- API Clients;
- Commands;
- Factories;
- configuração compartilhada do Cypress.

As responsabilidades são mantidas separadas para evitar duplicação desnecessária.

## Assertions

As assertions são mantidas próximas ao comportamento validado.

São considerados, conforme o cenário:

- status HTTP;
- payloads;
- conteúdo das respostas;
- elementos visíveis;
- navegação;
- resultado funcional;
- comportamento de autorização.

## Sincronização

Não são utilizados `waits` fixos como estratégia de sincronização.

Quando necessário, os testes utilizam intercepts e esperam requisições específicas:

```javascript
cy.intercept('POST', '**/produtos').as('createProduct');

cy.wait('@createProduct');
```

Essa abordagem reduz a dependência de tempos arbitrários de execução.

---

# API Testing

As requisições são centralizadas através de `apiRequest` e dos clients de domínio.

Exemplo:

```javascript
import { authClient } from '../../support/clients/auth.client';

authClient.login(user.email, user.password)
  .then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body)
      .to.include({
        message: 'Login realizado com sucesso',
      });
  });
```

Os cenários validam tanto o **status HTTP** quanto os dados relevantes da resposta.

Quando aplicável, também são realizadas validações posteriores para confirmar o efeito da operação.

```text
POST
 ↓
Validação da resposta
 ↓
GET
 ↓
Validação do estado final
```

Isso permite validar não apenas a resposta imediata da API, mas também o resultado da operação.

---

# Dados de teste

Os testes não dependem de usuários fixos ou registros previamente existentes.

As factories geram dados únicos durante a execução.

Exemplo:

```javascript
const user = userFactory();
```

ou:

```javascript
const product = productFactory();
```

As factories também permitem sobrescrever propriedades quando necessário:

```javascript
const customer = customerFactory();
```

ou:

```javascript
const admin = userFactory({
  administrador: 'true',
});
```

Essa abordagem facilita a criação de diferentes perfis sem duplicar estruturas de dados.

---

# Execução

## Instalação

```bash
npm ci
```

## Cypress em modo interativo

```bash
npm run cy:open
```

## Suíte completa

```bash
npm test
```

Executa todos os testes utilizando Chrome.

## Somente API

```bash
npm run cy:run:api
```

Executa os cenários localizados em:

```text
cypress/e2e/api/
```

## Somente Frontend

```bash
npm run cy:run:e2e
```

Executa os cenários localizados em:

```text
cypress/e2e/frontend/
```

## Smoke test

```bash
npm run test:smoke
```

Executa os principais cenários de autenticação de frontend e API.

---

# Configuração de ambiente

Por padrão, o projeto utiliza:

```text
Frontend: https://front.serverest.dev
API:      https://serverest.dev
```

As URLs podem ser sobrescritas através de variáveis de ambiente.

Exemplo:

```bash
CYPRESS_BASE_URL=http://localhost:3000 \
API_URL=http://localhost:3000 \
npm test
```

A URL da API é disponibilizada através de `Cypress.expose()`.

Credenciais e tokens não devem ser armazenados como dados públicos de configuração.

---

# Relatórios

A execução utiliza:

- **Mochawesome** para relatório funcional;
- **JUnit** para integração com pipelines;
- **screenshots** automáticos em falhas.

Os relatórios e screenshots são gerados durante a execução e podem ser disponibilizados como artefatos do pipeline de CI.

---

# CI/CD

O projeto possui pipeline automatizado através do **GitHub Actions**.

Fluxo:

```text
Checkout
   ↓
Node.js 22
   ↓
npm ci
   ↓
Cypress
   ↓
Chrome
   ↓
Execução da suíte
   ↓
Reports / Screenshots
   ↓
Artifacts
```

O workflow é executado em:

- `push`;
- `pull_request`.

O pipeline utiliza `npm ci` para instalação determinística das dependências e executa a suíte principal através de:

```bash
npm test
```

Em caso de falha, screenshots e relatórios disponíveis são preservados como artefatos.

---

# Ambiente compartilhado

O ServeRest online é um ambiente compartilhado e seus dados podem ser alterados por outros consumidores.

Por isso, a suíte procura:

- evitar IDs fixos;
- utilizar massa dinâmica;
- criar os estados necessários para os cenários;
- evitar dependência entre execuções;
- validar o resultado das operações realizadas.

Essa estratégia reduz o acoplamento com o estado prévio do ambiente.

---

# Decisões técnicas

## Por que utilizar API para preparação de dados?

A preparação de dados através da API evita utilizar a interface para operações que não fazem parte do comportamento que determinado teste precisa validar.

Isso reduz:

- tempo de execução;
- acoplamento;
- duplicação;
- dependência de etapas de UI.

O frontend continua responsável pela validação dos comportamentos que pertencem à interface.

## Por que utilizar Factories?

Factories centralizam a criação de massa de teste e facilitam a geração de dados únicos.

Isso permite que os testes sejam executados de maneira independente e reduz colisões em ambientes compartilhados.

## Por que utilizar API Clients?

Os API Clients isolam detalhes técnicos das requisições.

Por exemplo:

```javascript
usersClient.create(user);
```

é mais expressivo no cenário do que repetir:

```javascript
cy.request({
  method: 'POST',
  url: `${apiUrl}/usuarios`,
  body: user,
});
```

Além disso, mudanças na implementação dos endpoints podem ser concentradas nos clients.

## Por que utilizar intercepts?

Intercepts são utilizados quando o teste precisa sincronizar ou validar uma comunicação específica entre frontend e API.

Isso evita dependência de tempos fixos:

```javascript
cy.wait(3000);
```

e favorece uma sincronização baseada no evento esperado:

```javascript
cy.wait('@createProduct');
```

---

# Resultado atual

A suíte possui:

```text
Frontend:  9 cenários
API:      13 cenários
----------------------
Total:    22 cenários
```

Os **22 cenários foram executados com sucesso localmente** após a refatoração da arquitetura.

---

# Critérios atendidos

- [x] Frontend e API
- [x] Cenários positivos e negativos
- [x] Assertions relevantes
- [x] Massa dinâmica
- [x] Testes independentes
- [x] API Clients
- [x] Commands reutilizáveis
- [x] Factories
- [x] Seletores estáveis nos fluxos validados
- [x] Sincronização sem sleeps arbitrários
- [x] Estrutura organizada
- [x] Relatórios
- [x] CI/CD
- [x] Execução em Chrome
- [x] Node.js 22
- [x] 22 cenários automatizados
- [x] Execução local validada

---

# Estrutura de execução

A arquitetura foi pensada para permitir evolução da suíte sem concentrar toda a lógica nos arquivos de teste.

```text
                    ┌──────────────────┐
                    │      Specs       │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       Frontend Commands              API Clients
              │                             │
              │                       apiRequest
              │                             │
              ▼                             ▼
         Aplicação UI                  REST API
```

Essa separação facilita manutenção, reutilização e evolução futura da automação.

---

## Autor

**Marcus Vinicius B de Souza**

QA Automation Engineer
