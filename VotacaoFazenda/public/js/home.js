async function carregarRoca() {
  const container = document.getElementById('roca');
  try {
    const [roca] = await Promise.all([listarNaRoca(), listarForaDaRoca()]);
    container.innerHTML = roca.map(p => `
      <div class="pilula-roca d-flex align-items-center gap-2">
        <img src="${p.foto}" alt="${p.nome}" width="40" height="40" class="rounded-circle object-fit-cover">
        <span class="fw-bold">${p.nome}</span>
      </div>
    `).join('');
  } catch (erro) {
    container.innerHTML = `
      <div class="alert alert-danger mb-0">
        json server nao esta ativo
      </div>`;
  }
}

carregarRoca();
