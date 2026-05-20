// CPF

const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {

  let value = cpfInput.value.replace(/\D/g, '');

  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;

});

// CEP

const cepInput = document.getElementById('cep');

cepInput.addEventListener('input', () => {

  let value = cepInput.value.replace(/\D/g, '');

  value = value.replace(/^(\d{5})(\d)/, '$1-$2');

  cepInput.value = value;

});

// FORM

const form = document.getElementById('dbkForm');

form.addEventListener('submit', (e) => {

  e.preventDefault();

  alert('Cadastro enviado com sucesso!');

  form.reset();

});


// =========================
// CPF
// =========================

const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {

  let value = cpfInput.value.replace(/\D/g, '');

  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = value;

});

// =========================
// CEP
// =========================

const cepInput = document.getElementById('cep');

cepInput.addEventListener('input', () => {

  let value = cepInput.value.replace(/\D/g, '');

  value = value.replace(/^(\d{5})(\d)/, '$1-$2');

  cepInput.value = value;

});

// =========================
// TELEFONE
// =========================

const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', () => {

  let value = telefoneInput.value.replace(/\D/g, '');

  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');

  telefoneInput.value = value;

});

// =========================
// FORM
// =========================

const form = document.getElementById('dbkForm');

form.addEventListener('submit', async (e) => {

  e.preventDefault();

  // CAPTURA DOS DADOS

  const dados = {

    nome: form.querySelector('input[type="text"]').value,

    cep: document.getElementById('cep').value,

    cpf: document.getElementById('cpf').value,

    telefone: document.getElementById('telefone').value,

    email: form.querySelector('input[type="email"]').value

  };

  try {

    // ENVIO PARA NODE.JS

    const resposta = await fetch('http://localhost:3000/cadastro', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(dados)

    });

    const resultado = await resposta.json();

    alert(resultado.message);

    form.reset();

  } catch (erro) {

    console.error(erro);

    alert('Erro ao enviar cadastro.');

  }

});