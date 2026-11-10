const placar = document.getElementById('placar');
const totalEl = document.getElementById('total');
const btnZerar = document.getElementById('btn-zerar');

function formatarPercentual(valor) {
  return valor.toFixed(1).replace('.', ',') + '%';
}

async function atualizarPlacar() {
  try {
    const [roca, votos] = await Promise.all([listarNaRoca(), listarVotos()]);

    totalEl.textContent = votos.length;
    btnZerar.disabled = votos.length === 0;

    if (votos.length === 0) {
      placar.innerHTML = `
        <div class="card card-peao text-center">
          <div class="card-body p-4">
            <p class="fs-5 mb-3">Ainda nao há nenhum voto. Escolha quem sai da roça para ver a parcial.</p>
            <a href="votacao.html" class="btn btn-danger btn-lg">Ir para a votação</a>
          </div>
        </div>`;
      return;
    }

    const resultado = calcularResultado(roca, votos);

    placar.innerHTML = resultado.map((p, i) => `
      <div class="card card-peao mb-3 ${i === 0 ? 'card-lider' : ''}">
        <div class="card-body d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <img src="${p.foto}" alt="${p.nome}" class="foto-placar">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 mb-2">
              <h5 class="titulo-fazenda mb-0">${p.nome}</h5>
              ${i === 0 ? '<span class="badge bg-danger">Sairia hoje</span>' : ''}
            </div>
            <div class="progress" role="progressbar" aria-valuenow="${p.percentual.toFixed(1)}"
                 aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar ${i === 0 ? 'bg-danger' : 'barra-fazenda'}"
                   style="width: ${p.percentual}%"></div>
            </div>
            <div class="fw-bold mt-1">${formatarPercentual(p.percentual)} (${p.votos} ${p.votos === 1 ? 'voto' : 'votos'})</div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (erro) {
    placar.innerHTML = `
      <div class="alert alert-danger" role="alert">json server nao esta ativo</div>`;
  }
}

document.getElementById('btn-confirmar').addEventListener('click', async () => {
  try {
    await zerarVotos();
  } finally {
    atualizarPlacar();
  }
});

atualizarPlacar();
