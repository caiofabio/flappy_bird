console.log('[DevCaio] Flappy Bird');

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
  y:canvas.height - 315,// posição na tela original 204
 
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
}

const flappyBird = {// Criação objeto/estrutura do passarinho
  spriteX:0,//atributos
  spriteY:0,
  largura:33,
  altura:24,
  x:10,
  y:50,
  gravidade: 0.25,
  velocidade: 0,

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
    flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;// velocidade de queda
    //console.log(flappyBird.velocidade); debugar velocidade
    flappyBird.y = flappyBird.y + flappyBird.velocidade;// adicinado movimento queda
  }

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

function loop(){
  flappyBird.atualiza();
  planoDeFundo.desenha();// ordem como chamamos nossos desenhos importa 
  chao.desenha();// pois fundo vem primero, chao e passaro.
  flappyBird.desenha();// teste inverter ordem para ver.


  requestAnimationFrame(loop);
};

loop();