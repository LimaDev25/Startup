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

// Form handler (vai enviar para o backend)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const cep = document.getElementById('cep')?.value;
  const cpf = document.getElementById('cpf')?.value;

  const telefoneEl = document.getElementById('telefone');
  const telefone = telefoneEl ? telefoneEl.value : undefined;

  const dados = { nome, cep, cpf, telefone, email };

  try {
    const resposta = await fetch('http://localhost:3000/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    alert(resultado.message || 'Cadastro enviado com sucesso!');
    form.reset();
  } catch (erro) {
    console.error(erro);
    alert('Erro ao enviar cadastro.');
  }
});



