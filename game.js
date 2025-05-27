function isMobile() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000,
    height: 500,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  render: {
    pixelArt: true,
  },
  scene: [
    scenaPrincipal,
    ScenaJuego1,
    ScenaPreguntas,
    Rompecabezas,
    ArduinoGameScene,
    ArduinoGameScene2,
  ], //scenaPrincipal, ScenaJuego1,ScenaPreguntas,Rompecabezas,ArduinoGameScene,ArduinoGameScene2
};

var game = new Phaser.Game(config);

