const containerRoca = document.getElementById('roca');
const containerPeoes = document.getElementById('peoes');
const areaAlerta = document.getElementById('alerta');

function mostrarErro(mensagem) {
  areaAlerta.innerHTML = `
    <div class="alert alert-danger" role="alert">${mensagem}</div>`;
}

async function carregarRoca() {
  const roca = await listarNaRoca();
  containerRoca.innerHTML = roca.map(p => `
    <div class="col">
      <div class="card card-peao h-100">
        <div class="position-relative">
          <img src="${p.foto}" class="card-img-top" alt="${p.nome}">
          <span class="badge bg-danger position-absolute top-0 end-0 m-2">Na roça</span>
        </div>
        <div class="card-body text-center">
          <h5 class="card-title titulo-fazenda">${p.nome}</h5>
          <button type="button" class="btn btn-danger w-100 btn-votar"
                  data-id="${p.id}" data-nome="${p.nome}">
            Votar para eliminar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

async function carregarPeoes() {
  const peoes = await listarForaDaRoca();
  containerPeoes.innerHTML = peoes.map(p => `
    <div class="col">
      <div class="card card-peao card-peao-pequeno h-100">
        <img src="${p.foto}" class="card-img-top" alt="${p.nome}">
        <div class="card-body p-2 text-center">
          <small class="fw-bold">${p.nome}</small>
        </div>
      </div>
    </div>
  `).join('');
}

async function votar(botao) {
  const id = Number(botao.dataset.id);
  const nome = botao.dataset.nome;

  botao.disabled = true;
  try {
    await registrarVoto(id);
    const votos = await listarVotos();

    areaAlerta.innerHTML = `
      <div class="alert alert-success alert-voto" role="alert">
        Voto registrado para eliminar <strong>${nome}</strong>.
        Você já votou ${votos.length} ${votos.length === 1 ? 'vez' : 'vezes'}.
        <a href="resultado.html" class="alert-link ms-2">Ver resultado</a>
      </div>`;
  } catch (erro) {
    mostrarErro('json server nao esta ativo');
  } finally {
    botao.disabled = false;
  }
}

containerRoca.addEventListener('click', (evento) => {
  const botao = evento.target.closest('.btn-votar');
  if (botao) votar(botao);
});

async function iniciar() {
  try {
    await Promise.all([carregarRoca(), carregarPeoes()]);
  } catch (erro) {
    containerRoca.innerHTML = '';
    mostrarErro('json server nao esta ativo');
  }
}

iniciar();
