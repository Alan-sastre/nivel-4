function isMobile() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT, // FIT se encarga de ajustar el juego al contenedor manteniendo la relación de aspecto.
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1000, // Ancho base del juego
    height: 500, // Alto base del juego
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

