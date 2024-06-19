let baralho, maoBanca, maoJogador;
let vitoriaJogador = 0;
let vitoriaBanca = 0;


function criarBaralho() {
    let baralho = [] // começamos com um array vazio
    const naipes = ['♠', '♣', '♥', '♦']
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

    //cria uma variavel chamada 'naipe' que sera o index de 'naipes'
    for (let naipe of naipes) {
        // para cada 'valor' de 'valores' add naipes e valor em 'baralho'
        for (let valor of valores) {
            baralho.push({ naipe, valor });
        }
    }

    return baralho;
}

function embaralhar(baralho) {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}

function obterValorCarta(carta) {
    if (carta.valor === 'A') {
        return 1;
    } else if (['K', 'Q', 'J'].includes(carta.valor)) {
        return 10;
    } else {
        return Number(carta.valor);
    }
}

function iniciarJogo() {
    baralho = criarBaralho();
    embaralhar(baralho);

    // a banca e o jogador entram com duas cartas
    maoBanca = [obterProximaCarta(), obterProximaCarta()];
    maoJogador = [obterProximaCarta(), obterProximaCarta()];

    //botoes ficar ativados ou desativados
    document.getElementById('jogar').disabled = true;
    document.getElementById('comprar').disabled = false;
    document.getElementById('parar').disabled = false;
    document.getElementById('resultado').textContent = '';

    mostrarCarta();
}

function obterProximaCarta() {
    return baralho.pop();
}

function mostrarCartas(mao, elementId) {
    const elementoMao = document.getElementById(elementId);
    elementoMao.innerHTML = '';

    for (let carta of mao) {
        const elementoCarta = document.createElement('div');
        elementoCarta.className = 'card';

        // acrescenta o valor e nipe
        elementoCarta.textContent = carta.naipe + ' ' + carta.valor;
        elementoMao.appendChild(elementoCarta);
    }
}

function mostrarCarta() {
    mostrarCartas(maoBanca, 'cartas-banca');
    mostrarCartas(maoJogador, 'cartas-jogador');
    atualizarTotalCartas();
}

function atualizarTotalCartas() {
    const totalCartasJogador = obterPontuacao(maoJogador);
    const totalCartasBanca = obterPontuacao(maoBanca);

    document.getElementById('total-cartas-jogador').textContent = `Total de pontos: ${totalCartasJogador}`;
    document.getElementById('total-cartas-banca').textContent = `Total de pontos: ${totalCartasBanca}`;
}

function atualizarContadoresVitorias() {
    document.getElementById('vitorias-jogador').textContent = `Vitórias do Jogador: ${vitoriaJogador}`;
    document.getElementById('vitorias-banca').textContent = `Vitórias da Banca: ${vitoriaBanca}`;
}
function verificarVencedor() {
    if (estourou(maoJogador)) {
        vitoriaBanca++;

    } else if (estourou(maoBanca)) {
        vitoriaJogador++;

    } else if (obterPontuacao(maoJogador) > obterPontuacao(maoBanca)) {
        vitoriaJogador++;

    } else if (obterPontuacao(maoJogador) < obterPontuacao(maoBanca)) {
        vitoriaBanca++;
    }
    atualizarContadoresVitorias();
}

function obterPontuacao(mao) {
    let pontuacao = 0;
    let possuiAs = false;

    for (let carta of mao) {
        pontuacao += obterValorCarta(carta);

        if (carta.valor === 'A') {
            possuiAs = true;
        }
    }

    if (pontuacao <= 11 && possuiAs) {
        pontuacao += 10;
    }

    return pontuacao;
}

function estourou(mao) {
    return obterPontuacao(mao) > 21;
}

function turnoBanca() {
    while (obterPontuacao(maoBanca) < 17) {
        maoBanca.push(obterProximaCarta());
    }

    fimJogo();
}

function fimJogo() {
    document.getElementById('jogar').disabled = false;
    document.getElementById('comprar').disabled = true;
    document.getElementById('parar').disabled = true;

    mostrarCarta();

    if (estourou(maoJogador)) {
        document.getElementById('resultado').textContent =
            'Jogador estourou. A banca venceu! 👍';
    } else if (estourou(maoBanca)) {
        document.getElementById('resultado').textContent =
            'Banca estourou. O jogador venceu! 🔫';
    } else if (obterPontuacao(maoJogador) > obterPontuacao(maoBanca)) {
        document.getElementById('resultado').textContent =
            'You win!';
    } else if (obterPontuacao(maoJogador) < obterPontuacao(maoBanca)) {
        document.getElementById('resultado').textContent =
            'You lose!';
    } else {
        document.getElementById('resultado').textContent =
            'Morte súbita!'
    }

    verificarVencedor()
}

document.getElementById('jogar').addEventListener('click', iniciarJogo);

document.getElementById('comprar').addEventListener('click', function () {
    maoJogador.push(obterProximaCarta());
    mostrarCarta();

    if (estourou(maoJogador)) {
        fimJogo();

    }
});

document.getElementById('parar').addEventListener('click', turnoBanca);