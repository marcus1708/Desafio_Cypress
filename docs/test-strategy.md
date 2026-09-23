# Test Strategy

## Objetivo

A suíte existe para reduzir risco de regressão nos fluxos críticos do ServeRest e demonstrar uma estratégia de qualidade que vai além da execução de happy paths.

## Riscos priorizados

- autenticação incorreta ou indisponível;
- autorização inadequada entre administrador e usuário comum;
- cadastro, atualização e exclusão de dados com comportamento incorreto;
- aceitação de payloads inválidos;
- quebra do contrato das respostas da API;
- duplicidade de dados;
- perda de isolamento entre massas;
- regressão nos fluxos críticos do frontend;
- execução não reproduzível fora da máquina do QA.

## Estratégia por camada

### API

A maior parte da cobertura está na API porque ela oferece feedback rápido e permite validar regras, autorização, payloads e contratos com menor acoplamento à UI.

### Frontend

A camada E2E cobre os fluxos que dependem da integração entre tela, navegação, autenticação e chamadas de API.

### Qualidade / contratos

`quality.cy.js` concentra cenários negativos, boundary, autenticação/autorização, isolamento, cleanup e contratos.

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
        Unit / component
       fora do escopo atual
```

O projeto não possui código de produção do ServeRest; por isso testes unitários/componentes não fazem parte deste desafio.

## Massa e isolamento

Factories criam usuários e produtos com identificadores únicos. A API é usada para preparar pré-condições quando isso reduz acoplamento da UI.

O compartilhamento de uma pré-condição em `before()` é permitido apenas quando o estado não é alterado pelo cenário. Cenários mutáveis devem criar a própria massa.

## Contratos

As respostas críticas possuem definições de schema em `cypress/support/schemas`. O validador local implementa o subconjunto de regras necessário para este projeto: tipos, propriedades obrigatórias, propriedades aninhadas, arrays, enum e tamanho mínimo de strings.

## Ambiente

O ambiente público do ServeRest é compartilhado. A suíte reduz chamadas desnecessárias e aplica `API_MIN_INTERVAL_MS` para diminuir o risco de `429` associado a comportamento semelhante a teste de carga.

Isso é uma mitigação de ambiente, não uma regra funcional do produto.

## Critério de qualidade

Uma execução é considerada aprovada quando:

1. instalação limpa com `npm ci` funciona;
2. os cenários críticos executam sem falhas funcionais;
3. não há dependência de ordem entre testes;
4. relatórios e screenshots são produzidos quando aplicável;
5. o pipeline consegue reproduzir a execução fora da máquina local.
