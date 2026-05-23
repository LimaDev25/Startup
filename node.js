const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// =========================
// SQL Server (SSMS 22)
// =========================
// Recomendado: setar via variáveis de ambiente.
// Exemplos (PowerShell):
//   $env:DB_HOST='localhost';
//   $env:DB_PORT='1433';
//   $env:DB_USER='seu_usuario';
//   $env:DB_PASSWORD='sua_senha';
//   $env:DB_NAME='dbk';
//
// Se você não setar, ele vai usar defaults abaixo.
// Config fixa para reduzir problemas com escape no terminal.
// Ajuste o password/usuário se necessário.
const DB_HOST = process.env.DB_HOST || 'RAEL_BALA\\israe';
const DB_NAME = 'dbk';

console.log('process.env.DB_HOST=', process.env.DB_HOST);
console.log('DB_HOST=', DB_HOST);

// SQL Server Authentication (user/password)
// Por padrão, usamos variáveis de ambiente:
//   DB_USER, DB_PASSWORD
// Se não definir, o app vai falhar com mensagem de erro.
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DB_USER || !DB_PASSWORD) {
  console.error('Defina DB_USER e DB_PASSWORD no ambiente (ex.: $env:DB_USER="sa"; $env:DB_PASSWORD="..." )');
}

const pool = new sql.ConnectionPool({
  server: DB_HOST,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  options: {
    encrypt: false, // ambiente local
    trustServerCertificate: true
  }
});

let poolReady = false;
async function ensurePoolConnected() {
  if (poolReady) return;
  try {
    await pool.connect();
    poolReady = true;
    console.log('Conectado ao SQL Server');
  } catch (err) {
    console.error('Erro ao conectar no SQL Server:', err.message);
    throw err;
  }
}

// Teste rápido de conexão na inicialização
ensurePoolConnected().catch(() => {
  // não derruba o servidor imediatamente; a rota vai falhar se precisar
});

// Rota para cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, cep, cpf, telefone, email } = req.body || {};

  if (!nome || !email || !cep || !cpf || !telefone) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  const query = `
    INSERT INTO usuarios (nome, email, cep, cpf, telefone)
    VALUES (@nome, @email, @cep, @cpf, @telefone)
  `;

  try {
    await ensurePoolConnected();

    const request = pool.request();
    request.input('nome', sql.NVarChar(200), nome);
    request.input('email', sql.NVarChar(200), email);
    request.input('cep', sql.NVarChar(50), cep);
    request.input('cpf', sql.NVarChar(50), cpf);
    request.input('telefone', sql.NVarChar(50), telefone);

    await request.query(query);

    return res.json({ message: 'Cadastro realizado com sucesso!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao salvar no banco' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

