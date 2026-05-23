const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());


// =========================
// SQL Server (SSMS 22)
// =========================
// Variáveis esperadas:
//   DB_HOST (ex.: localhost ou .\\SQLEXPRESS ou DESKTOP-XYZ\\SQLEXPRESS)
//   DB_PORT  (opcional; default 1433)
//   DB_NAME
//   DB_USER
//   DB_PASSWORD

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error('Defina DB_HOST, DB_NAME, DB_USER e DB_PASSWORD no ambiente.');
}


// =========================
// Supabase (Postgres)
// =========================
// Você deve definir no .env:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY (service role)
//   (opcional) SUPABASE_TABLE
// E informar nomes reais de tabela/colunas abaixo.

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_TABLE || 'usuarios';


if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { headers: { 'x-client-info': 'dbk-backend/1.0' } }
});

// Rota para cadastro
app.post('/cadastro', async (req, res) => {
  const { nome, email, cep, cpf, telefone } = req.body || {};

  if (!nome || !email || !cep || !cpf) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  // IMPORTANTE: ajuste os nomes das colunas abaixo para bater com sua tabela real.
  // Pela sua mensagem: id, column_email, column_cep, column_cpf, column_telefone
  const payload = {
    // Exemplo de mapeamento assumindo que você quer salvar em: column_email/cep/cpf/telefone.
    // Se os nomes forem diferentes, troque aqui.
    column_email: email,
    column_cep: cep,
    column_cpf: cpf,
    column_telefone: telefone || null
  };

  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar no banco' });
    }

    return res.json({ message: 'Cadastro realizado com sucesso!', id: data?.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao salvar no banco' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


