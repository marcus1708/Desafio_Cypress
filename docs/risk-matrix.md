# Risk Matrix

A matriz relaciona risco, comportamento e cobertura automatizada. Ela não representa uma pontuação de criticidade formal do produto; serve como mapa de cobertura para o desafio.

| Risco | Área | Cobertura |
|---|---|---|
| Login válido não funciona | Autenticação | FE-01, API-01 |
| Credenciais inválidas são aceitas | Autenticação | FE-02, API-02 |
| Campos vazios são aceitos | Validação | FE-03 |
| Cadastro de usuário falha | Usuários | FE-04, API-03 |
| E-mail duplicado é aceito | Regra de negócio | FE-05, API-04 |
| Produto não pode ser cadastrado | Produtos | FE-06, API-11 |
| Campos obrigatórios são aceitos vazios | Validação | FE-07, API-17 |
| Sessão não é encerrada | Sessão | FE-08 |
| Listagem administrativa não abre | Navegação | FE-09, API-08 |
| Consulta por ID quebra | Consulta | API-05, API-09 |
| Usuário comum executa operação administrativa | Autorização | API-10, API-21 |
| Atualização/exclusão de dados quebra | CRUD | API-06, API-07, API-12, API-13 |
| Operação protegida aceita token ausente | Segurança | API-14 |
| Operação protegida aceita token inválido | Segurança | API-15 |
| Produto duplicado é criado | Regra de negócio | API-16, API-24 |
| Payload incompleto é aceito | Validação | API-17 |
| Tipo de dado inválido é aceito | Contrato | API-18 |
| Boundary numérico inválido é aceito | Boundary | API-19 |
| Estrutura da resposta de produto sofre regressão | Contrato | API-20 |
| Massas diferentes são confundidas | Isolamento | API-22 |
| Exclusão não persiste | Integridade | API-23 |
| Estrutura da resposta de usuário sofre regressão | Contrato | API-25 |
