let resultadoAtualDado = null;
let vidaInimigo = 100;
let vidaPersonagem = 100;

document.getElementById('personagemForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const classe = document.getElementById('classe').value;
  const atributo = document.getElementById('atributo').value;

  const personagem = {
    nome,
    classe,
    atributo
  };

  iniciarHistoria(personagem);
});

function iniciarHistoria(personagem) {
  document.getElementById('personagemForm').style.display = 'none';
  document.getElementById('historia').style.display = 'block';

  // Trocar o fundo do site para o modo história
document.body.classList.remove('inicial');
document.body.classList.add('modoHistoria');
  const narrativa = gerarHistoria(personagem);
  document.getElementById('textoNarracao').innerText = narrativa;

  mostrarOpcoes();
  atualizarBarrasDeVida();
}

function gerarHistoria(personagem) {
  const eventosIniciais = [
    `Você, ${personagem.nome}, um(a) ${personagem.classe} com grande ${personagem.atributo}, caminha por uma floresta sombria.`,
    `Nas montanhas geladas, ${personagem.nome} sente um chamado misterioso vindo de uma caverna escondida.`,
    `Durante a madrugada chuvosa, ${personagem.nome} acorda com um brilho mágico vindo de um portal em ruínas.`
  ];

  const desafios = [
    "Um monstro com olhos de fogo bloqueia seu caminho.",
    "Você escuta um sussurro estranho vindo das paredes.",
    "Uma armadilha quase atinge seu pé — por pouco você escapa.",
    "Um velho guerreiro aparece e propõe um duelo justo."
  ];

  const aleatorio = (lista) => lista[Math.floor(Math.random() * lista.length)];

  return `${aleatorio(eventosIniciais)}\n\n${aleatorio(desafios)}`;
}

function mostrarOpcoes() {
  const opcoes = document.getElementById('opcoes');
  opcoes.innerHTML = `
    <button onclick="rolarDado()">Rolar Dado</button>
    <p id="resultadoDado" style="margin-top: 10px; font-weight: bold; font-size: 18px;"></p>
    <button onclick="escolherOpcao('lutar')">Lutar</button>
    <button onclick="escolherOpcao('observar')">Observar</button>
  `;
}

function rolarDado() {
  resultadoAtualDado = Math.floor(Math.random() * 20) + 1;
  const display = document.getElementById('resultadoDado');
  display.innerText = `Você rolou: ${resultadoAtualDado}`;

  display.style.transform = "scale(1.3)";
  display.style.color = resultadoAtualDado >= 15 ? 'limegreen' : resultadoAtualDado <= 5 ? 'crimson' : 'white';

  setTimeout(() => {
    display.style.transform = "scale(1)";
  }, 200);
}

function escolherOpcao(opcao) {
  if (resultadoAtualDado === null) {
    const display = document.getElementById('resultadoDado');
    display.innerText = "Você precisa rolar o dado antes de escolher uma ação!";
    display.style.color = "orange";
    return;
  }

  let resposta = "";

  if (opcao === 'lutar') {
    if (resultadoAtualDado >= 15) {
      resposta = "Você ataca com força total e acerta um golpe crítico!";
      vidaInimigo -= 30;
    } else if (resultadoAtualDado <= 5) {
      resposta = "Você erra o ataque completamente e o inimigo contra-ataca!";
      vidaPersonagem -= 20;
    } else {
      resposta = "Você luta com firmeza e acerta um golpe médio.";
      vidaInimigo -= 15;
    }
  } else if (opcao === 'observar') {
    if (resultadoAtualDado >= 15) {
      resposta = "Você encontra uma cura escondida entre pedras!";
      vidaPersonagem += 15;
      if (vidaPersonagem > 100) vidaPersonagem = 100;
    } else if (resultadoAtualDado <= 5) {
      resposta = "Você observa, mas baixa a guarda e o inimigo te acerta!";
      vidaPersonagem -= 10;
    } else {
      resposta = "Você encontra uma dica sobre a fraqueza do inimigo.";
    }
  }

  atualizarBarrasDeVida();

  document.getElementById('textoNarracao').innerText += "\n\n" + resposta;
  resultadoAtualDado = null;

  // Verificar se alguém perdeu
  verificarFimDeJogo();
}

function atualizarBarrasDeVida() {
    const vidaInimigoClamp = Math.max(0, Math.min(vidaInimigo, 100));
    const vidaPersonagemClamp = Math.max(0, Math.min(vidaPersonagem, 100));
  
    const barraInimigo = document.getElementById('vidaInimigo');
    const barraPersonagem = document.getElementById('vidaPersonagem');
  
    document.getElementById('vidaInimigoTexto').innerText = vidaInimigoClamp + "%";
    document.getElementById('vidaPersonagemTexto').innerText = vidaPersonagemClamp + "%";
  
    barraInimigo.style.width = vidaInimigoClamp + "%";
    barraPersonagem.style.width = vidaPersonagemClamp + "%";
  
    // Pode mudar cor com base na vida, se quiser:
    barraInimigo.style.backgroundColor = vidaInimigoClamp < 30 ? 'red' : 'green';
    barraPersonagem.style.backgroundColor = vidaPersonagemClamp < 30 ? 'orange' : 'green';
  }
function verificarFimDeJogo() {
  if (vidaInimigo <= 0) {
    document.getElementById('textoNarracao').innerText += "\n\nO inimigo foi derrotado! Você venceu!";
    document.getElementById('opcoes').innerHTML = '';
  } else if (vidaPersonagem <= 0) {
    document.getElementById('textoNarracao').innerText += "\n\nVocê foi derrotado! Fim de jogo.";
    document.getElementById('opcoes').innerHTML = '';
  } else {
    mostrarOpcoes(); // mantém as opções aparecendo
  }
}