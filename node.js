const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Conexão com banco MySQL
// Observação: ajuste usuário/senha/host conforme seu ambiente
// Monitoramento no XAMPP (MariaDB):
// 1) cd C:\xampp\mysql\bin
// 2) .\\mysql -u root -p -e "USE dbk; SELECT COUNT(*) AS total FROM usuarios;"
// 3) .\\mysql -u root -p -e "USE dbk; SELECT id,nome,email,telefone,created_at FROM usuarios ORDER BY id DESC LIMIT 20;"
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'dbk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teste rápido de conexão (pool)
pool.getConnection((err) => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err.message);
  } else {
    console.log('Conectado ao MySQL (pool)');
    // libera de volta pro pool
    pool.releaseConnection?.();
  }
});

// Rota para cadastro
app.post('/cadastro', (req, res) => {
  const { nome, cep, cpf, telefone, email } = req.body || {};

  if (!nome || !email || !cep || !cpf || !telefone) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  const sql = `
    INSERT INTO usuarios (nome, email, cep, cpf, telefone)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome, email, cep, cpf, telefone], (err) => {
    if (err) {
      // Ex: email já cadastrado (UNIQUE)
      console.error(err);
      return res.status(500).json({ message: 'Erro ao salvar no banco' });
    }
    res.json({ message: 'Cadastro realizado com sucesso!' });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

