# Automation Architecture

## Visão

```text
                    Cypress Specs
                         │
          ┌──────────────┴──────────────┐
          │                             │
      Frontend                         API
          │                             │
    UI Commands                    API Clients
          │                             │
          └──────────────┬──────────────┘
                         │
                  Factories / Schemas
                         │
                  ServeRest Platform
```

## Specs

As specs são organizadas por camada e domínio:

- `api/authentication.cy.js`
- `api/users.cy.js`
- `api/products.cy.js`
- `api/quality.cy.js`
- `frontend/authentication.cy.js`
- `frontend/users.cy.js`
- `frontend/products.cy.js`

Isso evita um arquivo monolítico conforme a suíte cresce.

## API Clients

Os clients encapsulam rota, método HTTP, headers e opções de falha. A intenção do teste permanece no spec.

## Commands

Commands são reservados para ações repetidas que realmente agregam abstração. O client de API centraliza a configuração e o controle de intervalo das chamadas.

## Factories

Factories geram dados únicos e aceitam `overrides`, permitindo cenários de boundary e payload inválido sem duplicar objetos inteiros.

## Schemas

Schemas mantêm o contrato esperado separado do fluxo do teste. O validador local é deliberadamente pequeno e cobre apenas as construções usadas neste desafio.

## Transferência para Playwright

A arquitetura separa intenção de teste, dados, clientes e contratos. Em uma migração para Playwright, esses papéis podem ser mapeados para fixtures, APIRequestContext, Page Objects/locators e builders sem transportar a implementação específica do Cypress.
