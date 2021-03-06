console.log('[DevCaio] Flappy Bird');

let frames = 0;
const som_HIT = new Audio();
som_HIT .src = './efeitos/hit.wav';
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {// criação do objeto plano fundo
  spriteX:390,
  spriteY:0,
  largura:275,
  altura:204,
  x:1,
  y:canvas.height - 204,// posição na tela original 204, 315 cidade distante
 
  desenha(){ // mesmo que desenha: function, função dentro objeto
    contexto.fillStyle = '#70c5ce';// prencher com um cor
    contexto.fillRect(0,0, canvas.width, canvas.height);
    contexto.drawImage(// desta forma objeto planoDeFundo pode desenhar ele mesmo
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,//sprite x, sprite y
      planoDeFundo.largura, planoDeFundo.altura,//tamanho do recorte sprite
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
    contexto.drawImage(// desta forma objeto planoDeFundo pode desenhar ele mesmo
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,//sprite x, sprite y
      planoDeFundo.largura, planoDeFundo.altura,//tamanho do recorte sprite
      (planoDeFundo.x+planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY ) {
    return true;//houve colisao
  }
  else{
    return false;
  }
}

function criaFlappyBird(){
  const flappyBird = {// Criação objeto/estrutura do passarinho
    spriteX:0,//atributos
    spriteY:0,
    largura:33,
    altura:24,
    x:10,
    y:50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6, //tamanho pulo
    movimentos: [
      { spriteX: 0, spriteY:0, }, // asa acima
      { spriteX: 0, spriteY:26, },// asa meio
      { spriteX: 0, spriteY:52, },// asa baixo
      { spriteX: 0, spriteY:26, },// asa meio
    ],
    frameAtual: 0,
    atualizaFrameAtual(){
      const interValoDeFrames = 10;
      const passouOIntervalo = frames % interValoDeFrames === 0;// remover === 0 para deixa passaro loko
      if (passouOIntervalo){
        // console.log(frames);
        const baseIncremento = 1;
        const incremento = baseIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha(){ // mesmo que desenha: function, função dentro objeto
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];// des-estruturar
      contexto.drawImage(// desta forma objeto flappybird pode desenhar ele mesmo
          sprites,
          spriteX, spriteY,//sprite x, sprite y
          flappyBird.largura, flappyBird.altura,//tamanho do recorte sprite
          flappyBird.x, flappyBird.y,
          flappyBird.largura, flappyBird.altura,
      );
    },
    
    atualiza(){
      if ( fazColisao(flappyBird, globais.chao) ){
        console.log('Bateu');
        som_HIT.play();// play sound apos bater
        setTimeout(() => {
          mudaParaTela(Telas.INICIO);// resetar tela
        }, 500);// sleep 500 antes de mudar tela
        return;// Parada atualiza, para indicar fim.
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;// velocidade de queda
      //console.log(flappyBird.velocidade); debugar velocidade
      flappyBird.y = flappyBird.y + flappyBird.velocidade;// adicinado movimento queda
    },
    pula(){
      flappyBird.velocidade =  - flappyBird.pulo;// calculo para segurar ele no pulo
    }
  
  };
  return flappyBird;
};

function criaChao(){
  const chao = {// criação objeto/estrutura do chao
    spriteX:0,
    spriteY:610,
    largura:224,
    altura:112,
    x:0,
    y: canvas.height - 112,//altura total canvas - 112
    
    atualiza() {
      // console.log("Chao vivo?");
      const movimentoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentoAcao = chao.x - movimentoChao;
      // console.log('[chao.x]', chao.x);
      // console.log('[repeteEm]', repeteEm)
      // console.log('[movimentoAcao]', movimentoAcao)
      chao.x = movimentoAcao % repeteEm;
    },
    desenha() {//objeto chao pode se desenhar
      contexto.drawImage(// alinhado a esquerda esta figura
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
      contexto.drawImage(// alinhado para esquerda
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x +chao.largura), chao.y,//soma x + largura
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}

function criaCanos(){
  const canos = {
    largura: 52,
    altura: 400,
    chao:{
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,

    desenha(){
      canos.pares.forEach(function(par) {
        const yRandom = par.y; // define como ira aparece na tela.
        const espacamentoEntreCanos = 150;// espaco entre eles, dificuldade

        const canoCeuX = par.x;
        const canoCeuY = yRandom;
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )
        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
      
      if(globais.flappyBird.x >= par.x) {
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if(peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }
      canos.pares.forEach(function(par) {
        par.x = par.x - 2;

        if(canos.temColisaoComOFlappyBird(par)) {
          console.log('Derrota!')
          som_HIT.play();// play sound apos bater
          setTimeout(() => {
            mudaParaTela(Telas.INICIO);// resetar tela
          }, 500);// sleep 500 antes de mudar tela
          mudaParaTela(Telas.INICIO);
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }
  return canos;
}

const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) -174 / 2,
  y: 150,// esticar na tela o get ready

  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.y,
    )
  }
};

const globais = {};
let telaAtiva = {};

function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {//objeto com telas
  INICIO:{
    inicializa(){
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();// no jogo apenas para testes
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha(); // para testes cano
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
      globais.canos.atualiza();
    }
  }
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();// ordem como chamamos nossos desenhos importa 
    globais.canos.desenha();
    globais.chao.desenha();// pois fundo vem primero, chao e passaro.
    globais.flappyBird.desenha();// teste inverter ordem para ver.
  },
  click(){
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
  }
};

function loop(){
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
  if ( telaAtiva.click ){
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();
