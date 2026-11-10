const API_URL = "";

async function requisitar(rota, opcoes) {
  const resposta = await fetch(`${API_URL}${rota}`, opcoes);
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} em ${rota}`);
  }
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}

function listarParticipantes() {
  return requisitar("/participantes");
}

function listarNaRoca() {
  return requisitar("/participantes?naRoca=true");
}

function listarForaDaRoca() {
  return requisitar("/participantes?naRoca=false");
}

function listarVotos() {
  return requisitar("/votos");
}

function registrarVoto(participanteId) {
  return requisitar("/votos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participanteId: participanteId,
      data: new Date().toISOString(),
    }),
  });
}

function apagarVoto(id) {
  return requisitar(`/votos/${id}`, { method: "DELETE" });
}

async function zerarVotos() {
  const votos = await listarVotos();
  await Promise.all(votos.map((voto) => apagarVoto(voto.id)));
}

function calcularResultado(naRoca, votos) {
  const total = votos.length;
  return naRoca
    .map((participante) => {
      const qtd = votos.filter((v) => v.participanteId === participante.id).length;
      return {
        ...participante,
        votos: qtd,
        percentual: total > 0 ? (qtd / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.votos - a.votos);
}
