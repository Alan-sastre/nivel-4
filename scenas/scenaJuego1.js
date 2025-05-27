class ScenaJuego1 extends Phaser.Scene {
  constructor() {
    super("ScenaJuego1");
    this.piezasRecolectadas = 0;
    this.totalPiezas = 6;
    // Definir el laberinto (0 = camino, 1 = pared, 2 = pieza tipo 1, 3 = pieza tipo 2, 4 = pieza tipo 3)
    this.maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 4, 0, 0, 0, 0, 1, 5, 0, 0, 0, 0, 0, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.cellSize = 40;
    this.margin = 20; // Margen para evitar que el personaje se salga
    this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    this.joystick = null;
    this.joystickBase = null;
    this.joystickThumb = null;
    this.joystickPointer = null; // Para rastrear el dedo que controla el joystick
    this.joystickActive = false;
    this.joystickRadius = 80; // Radio de la base del joystick
    this.thumbRadius = 40;   // Radio del control (thumb)
    this.joystickDeadZone = 10; // Pequeña zona muerta para evitar movimientos accidentales
  }

  preload() {
    this.load.image("wall", "assets/scenaJuego1/wall.png");
    this.load.spritesheet("robot", "assets/scenaJuego1/robot.png", {
      frameWidth: 198,
      frameHeight: 188,
    });
    this.load.image("pieza1", "assets/scenaJuego1/pieza1.png");
    this.load.image("pieza2", "assets/scenaJuego1/pieza2.png");
    this.load.image("pieza3", "assets/scenaJuego1/pieza3.png");
    this.load.image("pieza4", "assets/scenaJuego1/pieza4.png");
    this.load.image("pieza5", "assets/scenaJuego1/pieza5.png");
    this.load.image("pieza6", "assets/scenaJuego1/pieza6.png");
    // NO cargamos el plugin del joystick
  }

  create() {
    // Fondo negro
    this.cameras.main.setBackgroundColor("#000000");

    // Centrar el juego
    const gameWidth = this.maze[0].length * this.cellSize;
    const gameHeight = this.maze.length * this.cellSize;
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Calcular el offset para centrar con márgenes
    const offsetX = (screenWidth - gameWidth) / 2;
    const offsetY = (screenHeight - gameHeight) / 2;

    // Grupos para paredes y piezas
    this.walls = this.physics.add.staticGroup();
    this.piezas = this.physics.add.group();

    // Construir el laberinto
    for (let row = 0; row < this.maze.length; row++) {
      for (let col = 0; col < this.maze[row].length; col++) {
        const x = col * this.cellSize + this.cellSize / 2 + offsetX;
        const y = row * this.cellSize + this.cellSize / 2 + offsetY;

        if (this.maze[row][col] === 1) {
          const wall = this.walls
            .create(x, y, "wall")
            .setScale(this.cellSize / 64)
            .refreshBody();
        } else if (this.maze[row][col] === 2) {
          const pieza = this.piezas
            .create(x, y, "pieza1")
            .setScale(0.5)
            .setOrigin(0.5, 0.5);
          pieza.setCollideWorldBounds(true);
          pieza.tipo = 1;
        } else if (this.maze[row][col] === 3) {
          const pieza = this.piezas
            .create(x, y, "pieza2")
            .setScale(0.5)
            .setOrigin(0.5, 0.5);
          pieza.setCollideWorldBounds(true);
          pieza.tipo = 2;
        } else if (this.maze[row][col] === 4) {
          const pieza = this.piezas
            .create(x, y, "pieza3")
            .setScale(0.5)
            .setOrigin(0.5, 0.5);
          pieza.setCollideWorldBounds(true);
          pieza.tipo = 3;
        } else if (this.maze[row][col] === 5) {
          const pieza = this.piezas
            .create(x, y, "pieza4")
            .setScale(0.5)
            .setOrigin(0.5, 0.5);
          pieza.setCollideWorldBounds(true);
          pieza.tipo = 4;
        } else if (this.maze[row][col] === 6) {
          const pieza = this.piezas
            .create(x, y, "pieza5")
            .setScale(0.5)
            .setOrigin(0.5, 0.5);
          pieza.setCollideWorldBounds(true);
          pieza.tipo = 5;
        }
      }
    }

    // Añadir la sexta pieza
    const sextaPieza = this.piezas
      .create(
        offsetX + 5 * this.cellSize + this.cellSize / 2,
        offsetY + 2 * this.cellSize + this.cellSize / 2,
        "pieza6"
      )
      .setScale(0.5)
      .setOrigin(0.5, 0.5);
    sextaPieza.setCollideWorldBounds(true);
    sextaPieza.tipo = 6;

    // Jugador
    this.player = this.physics.add.sprite(
      offsetX + this.cellSize * 1.5,
      offsetY + this.cellSize * 1.5,
      "robot"
    );
    this.player.setScale(0.15);

    // Ajustar el cuerpo de colisión
    const bodyWidth = 160;
    const bodyHeight = 205;
    this.player.body.setSize(bodyWidth, bodyHeight);
    const offsetX_body = (198 - bodyWidth) / 2;
    const offsetY_body = (188 - bodyHeight) / 2 + 25;
    this.player.body.setOffset(offsetX_body, offsetY_body);

    // Crear animaciones para el robot
    this.anims.create({
      key: "robot_idle",
      frames: this.anims.generateFrameNumbers("robot", { start: 0, end: 0 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "robot_run",
      frames: this.anims.generateFrameNumbers("robot", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });

    // Iniciar con animación idle
    this.player.anims.play("robot_idle");

    // Colisiones
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.overlap(
      this.player,
      this.piezas,
      this.recolectarPieza,
      null,
      this
    );

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Añadir controles táctiles para móvil
    if (this.isMobile) {
      this.crearJoystickPersonalizado();
    }

    // Puntuación
    this.scoreText = this.add.text(16, 16, "Piezas: 0/" + this.totalPiezas, {
      fontSize: "24px",
      fill: "#fff",
      fontFamily: "Arial",
    });
    this.scoreText.setDepth(1001);

    // Añadir contador de tipos de piezas
    this.piezasTipo1 = 0;
    this.piezasTipo2 = 0;
    this.piezasTipo3 = 0;
    this.piezasTipo4 = 0;
    this.piezasTipo5 = 0;
    this.piezasTipo6 = 0;
    this.piezasText = this.add.text(16, 50, "", {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "Arial",
    });
    this.piezasText.setDepth(1001);

    // Crear el pincel para la luz con bordes suaves
    this.lightBrush = this.make.graphics();
    const lightOuterRadius = 100;
    const numberOfBrushLayers = 20;
    const alphaPerLayer = 0.1;

    this.lightBrush.clear();
    for (let i = 0; i < numberOfBrushLayers; i++) {
      const currentBrushRadius =
        lightOuterRadius - (i * lightOuterRadius) / numberOfBrushLayers;
      if (currentBrushRadius <= 0) continue;

      this.lightBrush.fillStyle(0xffffff, alphaPerLayer);
      this.lightBrush.fillCircle(0, 0, currentBrushRadius);
    }

    // Crear la Render Texture que actuará como nuestra capa de oscuridad
    this.visionTexture = this.make.renderTexture(
      {
        width: this.sys.game.config.width,
        height: this.sys.game.config.height,
      },
      false
    );

    this.add.existing(this.visionTexture);
    this.visionTexture.setDepth(1000);
  }

  createTouchControls() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    const buttonSize = 60;
    const padding = 20;

    // Crear grupo para los controles táctiles
    this.touchControls = this.add.group();

    // Crear los botones de control
    const directions = [
      {
        key: "up",
        x: screenWidth - buttonSize * 2 - padding,
        y: screenHeight - buttonSize * 2 - padding,
      },
      {
        key: "down",
        x: screenWidth - buttonSize * 2 - padding,
        y: screenHeight - buttonSize - padding,
      },
      {
        key: "left",
        x: screenWidth - buttonSize * 3 - padding,
        y: screenHeight - buttonSize - padding,
      },
      {
        key: "right",
        x: screenWidth - buttonSize - padding,
        y: screenHeight - buttonSize - padding,
      },
    ];

    directions.forEach((dir) => {
      const button = this.add.graphics();
      button.fillStyle(0xffffff, 0.3);
      button.fillRoundedRect(dir.x, dir.y, buttonSize, buttonSize, 10);
      button.lineStyle(2, 0xffffff, 0.5);
      button.strokeRoundedRect(dir.x, dir.y, buttonSize, buttonSize, 10);

      const zone = this.add
        .zone(dir.x, dir.y, buttonSize, buttonSize)
        .setOrigin(0)
        .setInteractive();

      // Añadir el botón y la zona al grupo
      this.touchControls.add(button);
      this.touchControls.add(zone);

      // Configurar eventos táctiles
      zone.on("pointerdown", () => {
        this.player.setVelocity(0, 0);
        switch (dir.key) {
          case "up":
            this.player.setVelocityY(-80);
            break;
          case "down":
            this.player.setVelocityY(80);
            break;
          case "left":
            this.player.setVelocityX(-80);
            break;
          case "right":
            this.player.setVelocityX(80);
            break;
        }
      });

      zone.on("pointerup", () => {
        this.player.setVelocity(0, 0);
      });

      zone.on("pointerout", () => {
        this.player.setVelocity(0, 0);
      });
    });
  }

  crearJoystickPersonalizado() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Posición del joystick (esquina inferior derecha)
    const joystickX = screenWidth - 150;
    const joystickY = screenHeight - 150;

    // Crear la base del joystick
    this.joystickBase = this.add.graphics();
    this.joystickBase.fillStyle(0x888888, 0.5);
    this.joystickBase.fillCircle(joystickX, joystickY, this.joystickRadius);
    this.joystickBase.lineStyle(4, 0xffffff, 0.8);
    this.joystickBase.strokeCircle(joystickX, joystickY, this.joystickRadius);
    this.joystickBase.setScrollFactor(0);
    this.joystickBase.setDepth(1000);

    // Crear el thumb del joystick
    this.joystickThumb = this.add.graphics();
    this.joystickThumb.fillStyle(0xffffff, 0.9);
    this.joystickThumb.fillCircle(joystickX, joystickY, this.thumbRadius);
    this.joystickThumb.lineStyle(2, 0x000000, 0.5);
    this.joystickThumb.strokeCircle(joystickX, joystickY, this.thumbRadius);
    this.joystickThumb.setScrollFactor(0);
    this.joystickThumb.setDepth(1001);

    // Crear zona interactiva más grande para mejor usabilidad
    const interactiveZone = this.add.zone(joystickX, joystickY, this.joystickRadius * 2.5, this.joystickRadius * 2.5);
    interactiveZone.setInteractive();
    interactiveZone.setScrollFactor(0);
    interactiveZone.setDepth(999);
    interactiveZone.setOrigin(0.5);

    // Eventos del joystick
    interactiveZone.on('pointerdown', (pointer) => {
      if (!this.joystickActive) {
        this.joystickActive = true;
        this.joystickPointer = pointer;
        this.actualizarPosicionThumb(pointer, joystickX, joystickY);
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (this.joystickActive && pointer.id === this.joystickPointer.id) {
        this.actualizarPosicionThumb(pointer, joystickX, joystickY);
      }
    });

    this.input.on('pointerup', (pointer) => {
      if (this.joystickActive && pointer.id === this.joystickPointer.id) {
        this.joystickActive = false;
        this.joystickPointer = null;
        this.joystickVector = { x: 0, y: 0 };

        // Volver el thumb al centro
        this.joystickThumb.clear();
        this.joystickThumb.fillStyle(0xffffff, 0.9);
        this.joystickThumb.fillCircle(joystickX, joystickY, this.thumbRadius);
        this.joystickThumb.lineStyle(2, 0x000000, 0.5);
        this.joystickThumb.strokeCircle(joystickX, joystickY, this.thumbRadius);
      }
    });

    this.input.on('pointerupoutside', (pointer) => {
      if (this.joystickActive && pointer.id === this.joystickPointer.id) {
        this.joystickActive = false;
        this.joystickPointer = null;
        this.joystickVector = { x: 0, y: 0 };

        // Volver el thumb al centro
        this.joystickThumb.clear();
        this.joystickThumb.fillStyle(0xffffff, 0.9);
        this.joystickThumb.fillCircle(joystickX, joystickY, this.thumbRadius);
        this.joystickThumb.lineStyle(2, 0x000000, 0.5);
        this.joystickThumb.strokeCircle(joystickX, joystickY, this.thumbRadius);
      }
    });

    // Inicializar vector del joystick
    this.joystickVector = { x: 0, y: 0 };
  }

  actualizarPosicionThumb(pointer, baseX, baseY) {
    const dx = pointer.x - baseX;
    const dy = pointer.y - baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let thumbX = baseX;
    let thumbY = baseY;

    if (distance > this.joystickDeadZone) {
      if (distance <= this.joystickRadius) {
        thumbX = pointer.x;
        thumbY = pointer.y;
      } else {
        const angle = Math.atan2(dy, dx);
        thumbX = baseX + Math.cos(angle) * this.joystickRadius;
        thumbY = baseY + Math.sin(angle) * this.joystickRadius;
      }

      // Calcular vector normalizado
      this.joystickVector = {
        x: (thumbX - baseX) / this.joystickRadius,
        y: (thumbY - baseY) / this.joystickRadius
      };
    } else {
      this.joystickVector = { x: 0, y: 0 };
    }

    // Redibujar el thumb
    this.joystickThumb.clear();
    this.joystickThumb.fillStyle(0xffffff, 0.9);
    this.joystickThumb.fillCircle(thumbX, thumbY, this.thumbRadius);
    this.joystickThumb.lineStyle(2, 0x000000, 0.5);
    this.joystickThumb.strokeCircle(thumbX, thumbY, this.thumbRadius);
  }

  update() {
    const velocidad = 200; // Velocidad aumentada para mejor respuesta
    let vx = 0;
    let vy = 0;

    if (this.isMobile) {
      // Movimiento con joystick personalizado
      if (this.joystickActive && this.joystickVector) {
        vx = this.joystickVector.x * velocidad;
        vy = this.joystickVector.y * velocidad;

        // Normalizar velocidad diagonal
        if (Math.abs(vx) > 0 && Math.abs(vy) > 0) {
          const length = Math.sqrt(vx * vx + vy * vy);
          vx = (vx / length) * velocidad;
          vy = (vy / length) * velocidad;
        }
      }
    } else {
      // Controles de teclado para PC
      if (this.cursors.left.isDown || this.keys.left.isDown) vx = -velocidad;
      else if (this.cursors.right.isDown || this.keys.right.isDown) vx = velocidad;

      if (this.cursors.up.isDown || this.keys.up.isDown) vy = -velocidad;
      else if (this.cursors.down.isDown || this.keys.down.isDown) vy = velocidad;
    }

    this.player.setVelocity(vx, vy);

    // Actualizar la Render Texture (nuestra nueva capa de oscuridad)
    if (this.visionTexture && this.lightBrush && this.player) {
        this.visionTexture.clear();
        this.visionTexture.fill(0x000000, 1);
        this.visionTexture.erase(this.lightBrush, this.player.x, this.player.y);
    }

    // Actualizar animación según el movimiento
    if (this.player) {
        if (vx !== 0 || vy !== 0) {
            this.player.anims.play("robot_run", true);
            if (vx < 0) {
                this.player.setFlipX(true);
            } else if (vx > 0) {
                this.player.setFlipX(false);
            }
        } else {
            this.player.anims.play("robot_idle", true);
        }
    }
  }

  recolectarPieza(player, pieza) {
    pieza.destroy();
    this.piezasRecolectadas++;

    // Actualizar contador según el tipo de pieza (esto puede quedar si lo usas para otra lógica)
    switch (pieza.tipo) {
      case 1:
        this.piezasTipo1++;
        break;
      case 2:
        this.piezasTipo2++;
        break;
      case 3:
        this.piezasTipo3++;
        break;
      case 4:
        this.piezasTipo4++;
        break;
      case 5:
        this.piezasTipo5++;
        break;
      case 6:
        this.piezasTipo6++;
        break;
    }

    // Actualizar texto de puntuación general
    this.scoreText.setText(
      "Piezas: " + this.piezasRecolectadas + "/" + this.totalPiezas
    );

    // Nos aseguramos de que la actualización de this.piezasText esté comentada o eliminada
    // if (this.piezasText) {
    //   this.piezasText.setText(
    //     `Piezas: 1:${this.piezasTipo1} 2:${this.piezasTipo2} 3:${this.piezasTipo3} 4:${this.piezasTipo4} 5:${this.piezasTipo5} 6:${this.piezasTipo6}`
    //   );
    // }

    if (this.piezasRecolectadas === this.totalPiezas) {
      // Detener el movimiento del jugador
      this.player.setVelocity(0, 0);
      this.player.setActive(false);

      // Esperar 2 segundos antes de mostrar el mensaje
      this.time.delayedCall(
        2000,
        () => {
          const completedText = this.add.text(
            0,
            0,
            "¡Enhorabuena!\nHa logrado encontrar todas las piezas.",
            {
              fontSize: "36px", // Tamaño de fuente adecuado
              fill: "#FFFFFF", // Color blanco clásico
              fontFamily: "Arial, sans-serif", // Fuente estándar y formal
              align: "center",
              wordWrap: { width: this.sys.game.config.width - 60 },
            }
          );
          completedText.setOrigin(0.5, 0.5);
          completedText.setPosition(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2
          );
          completedText.setDepth(1002); // Asegurar que esté sobre todo

          // Eliminamos la animación tween para un mensaje más formal
          // this.tweens.add({
          //   targets: completedText,
          //   scale: 1.1,
          //   ease: 'Power1',
          //   duration: 500,
          //   yoyo: true,
          //   repeat: 1
          // });

          // Esperar 3 segundos más antes de cambiar de escena
          this.time.delayedCall(
            3000,
            () => {
              this.scene.start("scenaPreguntas");
            },
            [],
            this
          );
        },
        [],
        this
      );
    }
  }

}

