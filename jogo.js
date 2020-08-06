console.log('[DevCaio] Flappy Bird');

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
  
    desenha(){ // mesmo que desenha: function, função dentro objeto
      contexto.drawImage(// desta forma objeto flappybird pode desenhar ele mesmo
        sprites,
          flappyBird.spriteX, flappyBird.spriteY,//sprite x, sprite y
          flappyBird.largura, flappyBird.altura,//tamanho do recorte sprite
          flappyBird.x, flappyBird.y,
          flappyBird.largura, flappyBird.altura,
      );
    },
    
    atualiza(){
      if ( fazColisao(flappyBird, chao) ){
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

const chao = {// criação objeto/estrutura do chao
  spriteX:0,
  spriteY:610,
  largura:224,
  altura:112,
  x:0,
  y: canvas.height - 112,//altura total canvas - 112
  
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
    },
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      // chao.atualiza();
    }
  }
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();// ordem como chamamos nossos desenhos importa 
    chao.desenha();// pois fundo vem primero, chao e passaro.
    globais.flappyBird.desenha();// teste inverter ordem para ver.
  },
  click(){
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
  }
};

function loop(){
  telaAtiva.desenha();
  telaAtiva.atualiza();
  requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
  if ( telaAtiva.click ){
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();
