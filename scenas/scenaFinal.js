class ScenaFinal extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaFinal' });
        this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    }

    preload() {
        // Cargar recursos para la escena espacial
        this.load.image('fondoEspacio', 'assets/scenaPrincipal/2.jpg'); // Usando una imagen existente como fondo espacial
        this.load.image('estrellas', 'assets/scenaPrincipal/1.jpg'); // Usando otra imagen como efecto de estrellas

        // Aquí puedes cargar más recursos si los necesitas
        // this.load.audio('sonidoEspacio', 'ruta/a/tu/sonido.mp3');
    }

    create() {
        // Obtener dimensiones de la pantalla
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Fondo espacial con efecto parallax
        const fondo = this.add.image(screenWidth / 2, screenHeight / 2, 'fondoEspacio');
        fondo.setDisplaySize(screenWidth, screenHeight);

        // Capa de estrellas con efecto de movimiento
        const estrellas = this.add.tileSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight, 'estrellas');
        estrellas.setAlpha(0.3); // Transparencia para que se vea como un efecto

        // Añadir partículas para simular estrellas en movimiento
        const particles = this.add.particles('estrellas');

        const emitter = particles.createEmitter({
            frame: 0,
            x: { min: 0, max: screenWidth },
            y: 0,
            lifespan: 3000,
            speedY: { min: 50, max: 150 },
            scale: { start: 0.05, end: 0.01 },
            quantity: 1,
            blendMode: 'ADD'
        });

        // Título con efecto de brillo
        const titleStyle = {
            fontSize: this.isMobile ? '28px' : '36px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            align: 'center',
            stroke: '#4444ff',
            strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 2, stroke: true, fill: true }
        };

        // Mensaje principal
        const title = this.add.text(screenWidth / 2, screenHeight / 3, '¡MISIÓN COMPLETADA!', titleStyle);
        title.setOrigin(0.5);

        // Añadir efecto de escala al título
        this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Mensaje secundario
        const messageStyle = {
            fontSize: this.isMobile ? '18px' : '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: screenWidth * 0.8 }
        };

        const message = this.add.text(
            screenWidth / 2,
            screenHeight / 2 + 20,
            'Has completado todos los desafíos con éxito.\n¡Prepárate para la siguiente misión espacial!',
            messageStyle
        );
        message.setOrigin(0.5);

        // Botón para continuar
        const buttonStyle = {
            fontSize: this.isMobile ? '16px' : '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            align: 'center'
        };

        // Crear un botón interactivo
        const buttonWidth = 200;
        const buttonHeight = 50;
        const button = this.add.graphics();
        button.fillStyle(0x4444ff, 1);
        button.fillRoundedRect(screenWidth / 2 - buttonWidth / 2, screenHeight * 0.7, buttonWidth, buttonHeight, 15);
        button.lineStyle(2, 0x8888ff, 1);
        button.strokeRoundedRect(screenWidth / 2 - buttonWidth / 2, screenHeight * 0.7, buttonWidth, buttonHeight, 15);

        const buttonText = this.add.text(
            screenWidth / 2,
            screenHeight * 0.7 + buttonHeight / 2,
            'CONTINUAR',
            buttonStyle
        );
        buttonText.setOrigin(0.5);

        // Hacer el botón interactivo
        const buttonContainer = this.add.container(0, 0, [button, buttonText]);
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(screenWidth / 2 - buttonWidth / 2, screenHeight * 0.7, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

        // Efectos al pasar el mouse por encima
        buttonContainer.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x6666ff, 1);
            button.fillRoundedRect(screenWidth / 2 - buttonWidth / 2, screenHeight * 0.7, buttonWidth, buttonHeight, 15);
            button.lineStyle(2, 0xaaaaff, 1);
            button.strokeRoundedRect(screenWidth / 2 - buttonWidth / 2, screenHeight * 0.7, buttonWidth, buttonHeight, 15);
        });

        buttonContainer.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x4444ff, 1);
            button.fillRoundedRect(screenWidth / 2 - buttonWidth / 2, screenHeight * 0.7, buttonWidth, buttonHeight, 15);
            button.lineStyle(2, 0x8888ff, 1);
            button.strokeRoundedRect(screenWidth / 2 - buttonWidth / 2, screenHeight * 0.7, buttonWidth, buttonHeight, 15);
        });

        // Acción al hacer clic
        buttonContainer.on('pointerdown', () => {
            // Aquí puedes redirigir a la siguiente escena o reiniciar el juego
            this.scene.start('scenaPrincipal');
        });

        // Verificar orientación en dispositivos móviles
        if (this.isMobile) {
            this.checkOrientation();
            this.scale.on('resize', this.checkOrientation, this);
        }
    }

    checkOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Si ya existe un mensaje de orientación, lo eliminamos
        if (this.orientationText) {
            this.orientationText.destroy();
        }

        // Si no está en modo horizontal, mostrar mensaje
        if (!isLandscape) {
            this.orientationText = this.add
                .text(
                    screenWidth / 2,
                    screenHeight / 2,
                    "Por favor, gira tu dispositivo a modo horizontal",
                    {
                        font: "24px Arial",
                        fill: "#ffffff",
                        align: "center",
                        stroke: "#000000",
                        strokeThickness: 4,
                        backgroundColor: "#000000",
                    }
                )
                .setOrigin(0.5)
                .setPadding(16)
                .setDepth(1000);
        }
    }

    update() {
        // Actualizar efectos de movimiento
        const estrellas = this.children.list.find(child => child.type === 'TileSprite');
        if (estrellas) {
            estrellas.tilePositionY -= 0.5;
        }
    }
}