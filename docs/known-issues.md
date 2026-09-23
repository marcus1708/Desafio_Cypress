# Known Issues / Contract Notes

## HTTP status codes

The current ServeRest Swagger documents `400`, `401` and `403` for the protected product operations. Duplicate product names and invalid product payloads are represented as `400` responses.

The API contract does **not** document `409 Conflict` for the covered user/product endpoints. Therefore the suite does not invent a 409 expectation: duplicate resources are asserted against the documented `400` contract.

## Field limits

The current Swagger documents numeric minimums for query filters such as `preco >= 1` and `quantidade >= 0`, but it does not define maximum lengths for body fields such as `nome` or `descricao`. The suite therefore validates documented numeric boundaries and avoids asserting an undocumented maximum length.

## Data isolation and cleanup

The suite generates unique users/products per scenario. Created resources that are explicitly deleted are followed by a GET assertion confirming the resource is no longer available. The shared ServeRest environment does not provide a global reset endpoint for arbitrary test data, so complete database cleanup is not assumed.

## Ambiente público e HTTP 429

O ambiente público do ServeRest pode responder `429 Too Many Requests` quando detecta comportamento equivalente a teste de carga. Isso não representa um requisito funcional da aplicação sob teste. Para reduzir esse risco, o client de API aplica um intervalo mínimo entre chamadas, configurável pela variável `API_MIN_INTERVAL_MS` (padrão: `1500`). Em uma execução contra um ambiente local ou controlado, esse intervalo pode ser reduzido conforme a capacidade do ambiente.
