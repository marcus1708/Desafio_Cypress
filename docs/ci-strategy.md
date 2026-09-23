# CI/CD Strategy

## Pipeline

O workflow `.github/workflows/cypress.yml` executa a suíte em ambiente limpo:

1. checkout do código;
2. Node.js 22;
3. `npm ci`;
4. execução Cypress em Chrome;
5. publicação de reports, screenshots e vídeos quando existirem.

## Gatilhos

- `push`
- `pull_request`

## Ambiente público

A suíte usa o ServeRest público por padrão. O workflow define `API_MIN_INTERVAL_MS` para reduzir chamadas concentradas e documenta a possibilidade de `429` do ambiente compartilhado.

## Evidências

Quando uma execução falha, o pipeline preserva os artefatos disponíveis para análise posterior.

## Próxima evolução em ambiente produtivo

Em um produto real, a recomendação seria executar a suíte contra um ambiente de teste controlado, com massa previsível, observabilidade e possibilidade de reset. O desafio atual permanece configurado para o ambiente público solicitado.
