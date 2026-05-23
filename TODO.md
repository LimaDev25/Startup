# TODO - SQL Server migration (SQL Server Management Studio 22)

- [ ] Entender requisitos do SQL Server (host/instance, porta, user/pass, database)
- [ ] Atualizar `package.json` removendo `mysql2` e adicionando `mssql`
- [ ] Atualizar `node.js` substituindo MySQL (mysql2) por SQL Server (mssql)
- [ ] Ajustar query de INSERT para SQL Server usando parâmetros `@nome` etc.
- [ ] Garantir que a rota `/cadastro` use a variável correta do client/pool (hoje está `db.query` sem `db`)
- [ ] Instalar dependências (`npm install`)
- [ ] Rodar o servidor e testar envio do formulário
- [ ] Validar no SSMS se a tabela `usuarios` recebeu o cadastro

