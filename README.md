# ServeRest | QA Automation Challenge

[![Cypress Tests](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml/badge.svg)](https://github.com/marcus1708/Desafio_Cypress/actions/workflows/cypress.yml)

Automação **E2E de frontend + API** com **Cypress + JavaScript**, estruturada com foco em Quality Engineering: cobertura orientada a risco, cenários negativos, autenticação/autorização, contratos, massa dinâmica, isolamento, evidências e execução em CI/CD.

## O que este projeto demonstra

A suíte foi construída para responder quatro perguntas de qualidade:

- **Quais riscos estou cobrindo?** → `docs/risk-matrix.md`
- **Por que escolhi esses cenários?** → `docs/test-strategy.md`
- **Como a suíte escala?** → `docs/architecture.md`
- **Como ela entra no processo de entrega?** → `docs/ci-strategy.md` e GitHub Actions

## Stack

- Node.js 22+
- JavaScript
- Cypress 16
- GitHub Actions
- ServeRest Frontend
- ServeRest REST API
- Mochawesome
- JUnit

> **Cypress 16:** URLs públicas de ambiente são configuradas por `Cypress.expose()`. Segredos não devem ser armazenados nessa configuração.

## Aplicações sob teste

- Frontend: `https://front.serverest.dev/`
- API: `https://serverest.dev/`

## Cobertura

**34 cenários automatizados: 9 frontend + 25 API.**

### Frontend — 9 cenários

| ID | Cenário | Tipo |
|---|---|---|
| FE-01 | Login com credenciais válidas | Positivo |
| FE-02 | Login com credenciais inválidas | Negativo |
| FE-03 | Login com campos obrigatórios vazios | Validação |
| FE-04 | Cadastro de usuário administrador | Positivo |
| FE-05 | Cadastro com e-mail já utilizado | Regra de negócio |
| FE-06 | Cadastro de produto | Positivo |
| FE-07 | Validação dos campos obrigatórios de produto | Validação |
| FE-08 | Logout | Sessão |
| FE-09 | Acesso à listagem de produtos | Navegação |

### API — 25 cenários

| ID | Cenário | Tipo |
|---|---|---|
| API-01 | Login com credenciais válidas | Positivo |
| API-02 | Login com senha inválida | Negativo |
| API-03 | Cadastro de usuário | CRUD |
| API-04 | Cadastro com e-mail duplicado | Negativo |
| API-05 | Consulta de usuário por ID | Consulta |
| API-06 | Atualização de usuário | CRUD |
| API-07 | Exclusão de usuário | CRUD |
| API-08 | Listagem de produtos | Consulta |
| API-09 | Consulta de produto por ID | Consulta |
| API-10 | Bloqueio de produto para não administrador | Autorização |
| API-11 | Cadastro de produto como administrador | CRUD |
| API-12 | Atualização de produto | CRUD |
| API-13 | Exclusão de produto | CRUD |
| API-14 | Token ausente em operação protegida | Autenticação |
| API-15 | Token inválido em operação protegida | Autenticação |
| API-16 | Produto duplicado | Regra de negócio |
| API-17 | Payload de produto incompleto | Payload inválido |
| API-18 | Tipos incompatíveis no payload de produto | Contrato |
| API-19 | Valores abaixo dos limites numéricos documentados | Boundary |
| API-20 | Contrato da resposta de produtos | Contract |
| API-21 | Contrato de autenticação e autorização | Contract |
| API-22 | Isolamento entre massas de dados | Isolamento |
| API-23 | Cleanup após exclusão | Integridade |
| API-24 | Repetição do mesmo POST sem gerar duplicidade | Idempotência lógica |
| API-25 | Contrato da resposta de usuários | Contract |

## Arquitetura

```text
cypress/
├── e2e/
│   ├── api/
│   │   ├── authentication.cy.js
│   │   ├── users.cy.js
│   │   ├── products.cy.js
│   │   └── quality.cy.js
│   └── frontend/
│       ├── authentication.cy.js
│       ├── users.cy.js
│       └── products.cy.js
│
└── support/
    ├── clients/
    │   ├── auth.client.js
    │   ├── users.client.js
    │   └── products.client.js
    ├── commands/
    │   ├── api.commands.js
    │   └── ui.commands.js
    ├── factories/
    │   ├── product.factory.js
    │   └── user.factory.js
    └── schemas/
        ├── error.schema.js
        ├── product.schema.js
        ├── user.schema.js
        └── validator.js

 docs/
 ├── architecture.md
 ├── ci-strategy.md
 ├── risk-matrix.md
 ├── test-strategy.md
 └── known-issues.md
```

### Responsabilidades

**Specs** — expressam o comportamento que está sendo validado.

**API Clients** — encapsulam métodos, rotas, headers e configuração das requisições.

**Commands** — concentram ações de UI/API que realmente são reutilizáveis.

**Factories** — geram massa dinâmica e permitem `overrides` para boundary e negativos.

**Schemas** — isolam o contrato esperado das respostas e evitam repetir validações estruturais nos testes.

## Estratégia de qualidade

A suíte não é apenas um conjunto de happy paths. A cobertura inclui:

- autenticação válida e inválida;
- autorização por perfil;
- token ausente e inválido;
- CRUD de usuários e produtos;
- payload incompleto;
- tipos incompatíveis;
- boundary numérico;
- duplicidade;
- contratos de resposta;
- isolamento de massa;
- confirmação pós-exclusão;
- prevenção de duplicidade em repetição de POST;
- fluxos críticos de frontend.

A matriz completa está em `docs/risk-matrix.md`.

## Test pyramid

```text
             UI / E2E
          poucos cenários
                ▲
                │
        API / Contract
      maior cobertura
                ▲
                │
      Unit / Component
          fora do escopo
```

Como o desafio não contém o código de produção do ServeRest, testes unitários/componentes não fazem parte deste projeto.

## Massa e isolamento

As factories geram dados únicos. Isso reduz colisões em ambiente compartilhado e evita dependência de usuários fixos.

Quando vários cenários compartilham uma pré-condição que não é alterada, ela pode ser preparada no `before()`. Cenários que alteram ou excluem um recurso devem preparar sua própria massa.

A suíte também possui cenários específicos de isolamento e cleanup para tornar essa estratégia verificável.

## Contratos e schemas

Os contratos de produto e usuário estão em `cypress/support/schemas`.

O `validator.js` implementa deliberadamente um subconjunto pequeno de regras de schema necessárias para este desafio:

- tipos;
- propriedades obrigatórias;
- propriedades aninhadas;
- arrays;
- enum;
- `minLength`.

Isso evita adicionar uma dependência externa apenas para validar um contrato pequeno e deixa explícito o que a suíte realmente verifica.

## HTTP status e regras do ServeRest

A suíte valida os códigos observados/documentados para os comportamentos cobertos, incluindo `400`, `401` e `403`.

O projeto não inventa expectativa de `409 Conflict` para duplicidade quando o ServeRest representa essa regra como `400`.

Também não cria limites máximos de texto que não estejam respaldados pelo contrato exercitado.

Detalhes e limitações estão em `docs/known-issues.md`.

## Execução local

Instalação limpa:

```bash
npm ci
```

Modo interativo:

```bash
npm run cy:open
```

Toda a suíte:

```bash
npm test
```

Somente API:

```bash
npm run test:api
```

Somente frontend:

```bash
npm run test:e2e
```

Smoke de autenticação:

```bash
npm run test:smoke
```

Qualidade, contratos e negativos:

```bash
npm run test:quality
```

Alias para a camada de contratos:

```bash
npm run test:contract
```

## Configuração de ambiente

Valores padrão:

```text
CYPRESS_BASE_URL=https://front.serverest.dev
API_URL=https://serverest.dev
API_MIN_INTERVAL_MS=1500
```

Exemplo:

```bash
CYPRESS_BASE_URL=http://localhost:3000 API_URL=http://localhost:3000 npm test
```

O `API_MIN_INTERVAL_MS` controla o intervalo mínimo entre chamadas feitas pelo client de API. Em ambiente controlado, ele pode ser reduzido.

## CI/CD

O workflow `.github/workflows/cypress.yml` roda em `push` e `pull_request`:

```text
Checkout
   ↓
Node.js 22
   ↓
npm ci
   ↓
Cypress / Chrome
   ↓
Reports + Screenshots + Videos
   ↓
GitHub Actions Artifacts
```

O CI usa `API_MIN_INTERVAL_MS=2500` para reduzir chamadas concentradas no ambiente público.

Artefatos são preservados mesmo quando a execução falha.

## Relatórios

- Mochawesome: relatório funcional;
- JUnit: integração com CI;
- screenshots: evidências de falhas;
- vídeos: disponíveis quando habilitados/configurados.

## Known issues do ambiente público

O ServeRest público é compartilhado e pode retornar `429 Too Many Requests` quando detecta comportamento equivalente a teste de carga. Isso é uma limitação do ambiente, não uma regra funcional do produto.

A suíte reduz chamadas desnecessárias, reutiliza pré-condições estáveis dentro do spec e aplica `API_MIN_INTERVAL_MS`.

Em um ambiente de teste controlado, o ideal seria utilizar dados isolados, reset controlado e observabilidade. O desafio atual permanece apontando para o ambiente público solicitado.

## Transferência para Playwright

A arquitetura separa intenção de teste, clientes, dados e contratos. Em uma evolução para Playwright, esses papéis podem ser mapeados para:

- fixtures;
- `APIRequestContext`;
- Page Objects/locators;
- builders/factories;
- contratos compartilhados.

A ideia é transportar a estratégia, não simplesmente converter a sintaxe Cypress para Playwright.

## Critérios atendidos

- [x] Frontend e API
- [x] Happy paths e cenários negativos
- [x] Regras de negócio
- [x] Autenticação e autorização
- [x] Payloads inválidos
- [x] Boundary testing
- [x] Contratos/schemas
- [x] Massa dinâmica
- [x] Isolamento
- [x] Cleanup validado onde aplicável
- [x] API Clients
- [x] Factories
- [x] Estrutura por domínio
- [x] Relatórios
- [x] CI/CD
- [x] Matriz de riscos
- [x] Estratégia de testes
- [x] Arquitetura documentada
- [x] Known issues

## Validação antes da entrega

A versão entregue contém a suíte completa e a documentação. O resultado de execução deve ser confirmado no ambiente alvo antes do commit final.

Não considerar uma execução como 100% aprovada apenas porque o código está presente: a evidência de execução do CI/local é o critério final.

## Autor

Marcus Vinicius B de Souza
