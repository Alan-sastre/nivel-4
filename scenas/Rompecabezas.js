class Rompecabezas extends Phaser.Scene {
    constructor() {
        super('Rompecabezas');
        this.piezasColocadas = 0;
        // Eliminado chasis del orden correcto
        this.ordenCorrecto = ['motores', 'sensores', 'arduino'];
        this.ordenActual = [];

    // Información de cada pieza
    this.infoPiezas = {
        motores: {
            titulo: 'Motores',
            descripcion: 'Los motores permiten el movimiento del robot. Son responsables de convertir la energía eléctrica en movimiento mecánico, permitiendo que el robot se desplace en diferentes direcciones.'
        },
        sensores: {
            titulo: 'Sensores',
            descripcion: 'Los sensores son los "ojos y oídos" del robot. Detectan cambios en el entorno como luz, sonido, distancia o temperatura, y envían esta información al cerebro del robot.'
        },
        arduino: {
            titulo: 'Arduino',
            descripcion: 'El Arduino es el "cerebro" del robot. Es una placa de control que procesa la información de los sensores y decide cómo deben actuar los motores según la programación.'
        }
    };
}

    preload() {
        // Cargar imágenes para las piezas del robot (eliminado chasis)
        // No cargamos fondo, usaremos color de fondo
        this.load.image('motores', 'assets/Rompecabezas/motores.png');
        this.load.image('sensores', 'assets/Rompecabezas/sensores.png');
        this.load.image('arduino', 'assets/Rompecabezas/arduino.png');
        this.load.image('esquema', 'assets/Rompecabezas/pecho.png');

        // Cargar sonidos
        this.load.audio('correcto', 'assets/Rompecabezas/correcto.mp3');
        this.load.audio('incorrecto', 'assets/Rompecabezas/incorrecto.mp3');
    }

    create() {
        // Obtener dimensiones del juego
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // Establecer un color de fondo más atractivo
        this.cameras.main.setBackgroundColor('#1a2639'); // Azul oscuro más elegante

        // Añadir esquema del robot (pecho) centrado y más grande
        const esquema = this.add.image(gameWidth / 2, gameHeight / 2, 'esquema');

        // Ajustar la escala para que ocupe toda la pantalla
        const escalaX = gameWidth / esquema.width * 0.9; // 90% del ancho de la pantalla
        const escalaY = gameHeight / esquema.height * 0.9; // 90% del alto de la pantalla
        const escalaFinal = Math.min(escalaX, escalaY); // Usar la menor escala para mantener proporción

        esquema.setScale(escalaFinal);
        esquema.setDepth(0); // Asegura que esté en la capa más baja

        // Crear contenedores visuales para las zonas de colocación
        this.contenedoresVisuales = {};

        // Ajustar posiciones de las zonas según el nuevo tamaño del pecho
        const centroX = gameWidth / 2;
        const centroY = gameHeight / 2;

        // Añadir recuadros visibles en el pecho del robot para indicar dónde colocar las piezas
        // Estos recuadros estarán por encima de la imagen del pecho pero por debajo de las piezas
        const recuadrosPecho = this.add.graphics();
        recuadrosPecho.setDepth(1); // Por encima de la imagen pero por debajo de las piezas

        // Recuadro para los motores (centro)
        recuadrosPecho.lineStyle(4, 0xe74c3c, 1); // Rojo, línea gruesa
        recuadrosPecho.strokeRect(centroX - 70, centroY - 40, 140, 80);
        recuadrosPecho.fillStyle(0xe74c3c, 0.2); // Semitransparente
        recuadrosPecho.fillRect(centroX - 70, centroY - 40, 140, 80);

        // Recuadro para los sensores (arriba izquierda)
        recuadrosPecho.lineStyle(4, 0x2ecc71, 1); // Verde, línea gruesa
        recuadrosPecho.strokeRect(centroX - 120, centroY - 100, 80, 60);
        recuadrosPecho.fillStyle(0x2ecc71, 0.2); // Semitransparente
        recuadrosPecho.fillRect(centroX - 120, centroY - 100, 80, 60);

        // Recuadro para el arduino (arriba derecha)
        recuadrosPecho.lineStyle(4, 0xf39c12, 1); // Naranja, línea gruesa
        recuadrosPecho.strokeRect(centroX + 40, centroY - 100, 80, 60);
        recuadrosPecho.fillStyle(0xf39c12, 0.2); // Semitransparente
        recuadrosPecho.fillRect(centroX + 40, centroY - 100, 80, 60);

        // Crear zonas de colocación para cada pieza con contenedores visuales
        this.zonas = {
            // Eliminado chasis
            motores: this.crearZonaConContenedor(centroX, centroY, 140, 80, 'Motores', 0xe74c3c),
            sensores: this.crearZonaConContenedor(centroX - 80, centroY - 70, 80, 60, 'Sensores', 0x2ecc71),
            arduino: this.crearZonaConContenedor(centroX + 80, centroY - 70, 80, 60, 'Arduino', 0xf39c12)
        };

        // Asegurar que los contenedores visuales estén por encima de la imagen del pecho
        for (const key in this.contenedoresVisuales) {
            if (this.contenedoresVisuales.hasOwnProperty(key)) {
                this.contenedoresVisuales[key].setDepth(1.5); // Entre los recuadros del pecho y las piezas
            }
        }

        // Crear piezas arrastrables con recuadros más visibles
        this.piezas = {
            // Eliminado chasis
            motores: this.crearPiezaArrastrable('motores', 150, 200, 0.4),
            sensores: this.crearPiezaArrastrable('sensores', 150, 300, 0.4),
            arduino: this.crearPiezaArrastrable('arduino', 150, 400, 0.4)
        };

        // Asegurar que las piezas estén en una capa superior para recibir input y ser visibles
        for (const piezaKey in this.piezas) {
            if (this.piezas.hasOwnProperty(piezaKey)) {
                this.piezas[piezaKey].setDepth(2); // Establece la profundidad a 2 (por encima de todo lo demás)
            }
        }

        // Añadir instrucciones con un fondo para hacerlo más visible - Interfaz mejorada
        const titleBg = this.add.graphics();
        titleBg.fillStyle(0x000000, 0.8); // Fondo negro más opaco
        titleBg.fillRect(0, 0, gameWidth, 80); // Barra superior completa
        titleBg.setDepth(3); // Por encima de todo

        this.add.text(gameWidth / 2, 40, 'ENSAMBLAJE DEL ROBOT', {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(3); // Mayor profundidad para estar sobre todo

        // Añadir texto para mostrar el estado con fondo
        const statusBg = this.add.graphics();
        statusBg.fillStyle(0x000000, 0.8); // Fondo negro más opaco
        statusBg.fillRect(0, gameHeight - 60, gameWidth, 60); // Barra inferior completa
        statusBg.setDepth(3); // Por encima de todo

        this.mensajeEstado = this.add.text(gameWidth / 2, gameHeight - 30, 'Arrastra las piezas para ensamblar el robot', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(3); // Mayor profundidad para estar sobre todo

        // Sonidos
        this.sonidoCorrecto = this.sound.add('correcto');
        this.sonidoIncorrecto = this.sound.add('incorrecto');

        // Añadir un panel de instrucciones mejorado
        this.crearPanelInstrucciones();

        // Configurar eventos de arrastre
        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        // En el evento drop, después de colocar una pieza correctamente
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            // Determinar qué zona es
            let zonaTipo = '';
            for (const [tipo, zona] of Object.entries(this.zonas)) {
                if (zona === dropZone) {
                    zonaTipo = tipo;
                    break;
                }
            }

            // Si la pieza coincide con la zona
            if (gameObject.tipo === zonaTipo && !gameObject.colocada) {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.colocada = true;
                this.ordenActual.push(gameObject.tipo);
                this.piezasColocadas++;

                // Ocultar el contenedor visual cuando la pieza está colocada
                if (this.contenedoresVisuales[zonaTipo]) {
                    this.contenedoresVisuales[zonaTipo].setVisible(false);
                }

                // Mostrar recuadro con información de la pieza
                this.mostrarInfoPieza(gameObject.tipo);

                // Verificar si el orden es correcto hasta ahora
                if (this.verificarOrden()) {
                    this.sonidoCorrecto.play();
                    this.mensajeEstado.setText(`¡Pieza colocada correctamente! (${this.piezasColocadas}/3)`);

                    // Si todas las piezas están colocadas correctamente
                    if (this.piezasColocadas === 3) { // Cambiado de 4 a 3 (sin chasis)
                        this.mensajeEstado.setText('¡Robot ensamblado correctamente! ¡Felicidades!');
                        this.time.delayedCall(3000, () => {
                            // Animación de éxito mejorada
                            const textoExito = this.add.text(gameWidth / 2, gameHeight / 2, '¡ROBOT FUNCIONAL!', {
                                fontSize: '48px',
                                fill: '#00ff00',
                                fontStyle: 'bold',
                                fontFamily: 'Arial',
                                stroke: '#000000',
                                strokeThickness: 6
                            }).setOrigin(0.5).setDepth(4);

                            // Animación de escala para el texto
                            this.tweens.add({
                                targets: textoExito,
                                scale: { from: 0.5, to: 1.2 },
                                duration: 1000,
                                ease: 'Bounce.Out',
                                yoyo: true,
                                repeat: 1
                            });
                        });
                    }
                } else {
                    this.sonidoIncorrecto.play();
                    this.mensajeEstado.setText('¡Orden incorrecto! El robot no funcionará bien así.');
                }
            } else {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
    }

    crearPanelInstrucciones() {
        // Esta función ha sido modificada para eliminar el panel de orden de ensamblaje
        // No se crea ningún panel, dejando la interfaz más limpia
        // Si en el futuro se necesita mostrar otras instrucciones, se puede modificar esta función
    }

    crearZonaConContenedor(x, y, width, height, nombre, color) {
        // Crear la zona de drop
        const zona = this.add.zone(x, y, width, height);
        zona.setRectangleDropZone(width, height);

        // Crear un contenedor visual más atractivo
        const contenedor = this.add.graphics();
        contenedor.lineStyle(2, color, 1);
        contenedor.strokeRect(zona.x - zona.input.hitArea.width / 2, zona.y - zona.input.hitArea.height / 2,
                           zona.input.hitArea.width, zona.input.hitArea.height);

        // Añadir un fondo semitransparente
        contenedor.fillStyle(color, 0.3);
        contenedor.fillRect(zona.x - zona.input.hitArea.width / 2, zona.y - zona.input.hitArea.height / 2,
                           zona.input.hitArea.width, zona.input.hitArea.height);

        // Añadir texto indicativo
        const texto = this.add.text(x, y, nombre, {
            fontSize: '12px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Agrupar elementos visuales
        this.contenedoresVisuales[nombre.toLowerCase()] = this.add.container(0, 0, [contenedor, texto]);

        return zona;
    }

    crearPiezaArrastrable(tipo, x, y, escala = 1) {
        // Crear la pieza como imagen interactiva
        const pieza = this.add.image(x, y, tipo).setInteractive();
        pieza.setScale(escala);
        pieza.tipo = tipo;
        pieza.colocada = false;

        // Añadir un recuadro alrededor de la pieza para hacerla más visible
        const recuadro = this.add.graphics();
        recuadro.setDepth(1.9); // Justo por debajo de la pieza pero visible

        // Determinar color según el tipo de pieza
        let colorRecuadro;
        switch(tipo) {
            case 'motores': colorRecuadro = 0xe74c3c; break; // Rojo
            case 'sensores': colorRecuadro = 0x2ecc71; break; // Verde
            case 'arduino': colorRecuadro = 0xf39c12; break; // Naranja
            default: colorRecuadro = 0xffffff; // Blanco
        }

        // Dibujar el recuadro con un borde más grueso y visible
        const anchoPieza = pieza.width * escala;
        const altoPieza = pieza.height * escala;
        const padding = 10; // Espacio extra alrededor de la pieza

        recuadro.lineStyle(4, colorRecuadro, 1); // Línea más gruesa
        recuadro.strokeRect(x - anchoPieza/2 - padding, y - altoPieza/2 - padding,
                          anchoPieza + padding*2, altoPieza + padding*2);

        // Añadir un fondo semitransparente
        recuadro.fillStyle(colorRecuadro, 0.2);
        recuadro.fillRect(x - anchoPieza/2 - padding, y - altoPieza/2 - padding,
                        anchoPieza + padding*2, altoPieza + padding*2);

        // Hacer la pieza arrastrable después de asegurarnos que es interactiva
        this.input.setDraggable(pieza);

        return pieza;
    }

    verificarOrden() {
        // Modificado para ignorar el orden y solo verificar que las piezas estén en sus lugares correctos
        // Siempre devuelve true para que suene el sonido correcto al colocar cualquier pieza
        return true;
    }

    mostrarInfoPieza(tipo) {
        // Eliminar cualquier panel de información anterior si existe
        if (this.panelInfo) {
            this.panelInfo.destroy();
        }

        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // Crear un contenedor para agrupar todos los elementos del panel
        this.panelInfo = this.add.container(0, 0);
        this.panelInfo.setDepth(5); // Por encima de todo

        // Obtener la información de la pieza
        const info = this.infoPiezas[tipo];

        // Crear el fondo del panel
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x000000, 0.9); // Fondo negro casi opaco
        panelBg.lineStyle(4, 0x3498db, 1); // Borde azul

        // Dimensiones y posición del panel
        const panelWidth = 400;
        const panelHeight = 200;
        const panelX = gameWidth / 2 - panelWidth / 2;
        const panelY = gameHeight / 2 - panelHeight / 2;

        // Dibujar panel con esquinas redondeadas
        panelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 16);
        panelBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 16);

        // Añadir el panel al contenedor
        this.panelInfo.add(panelBg);

        // Título de la pieza
        const titulo = this.add.text(gameWidth / 2, panelY + 40, info.titulo, {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Descripción de la pieza
        const descripcion = this.add.text(gameWidth / 2, panelY + 100, info.descripcion, {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: panelWidth - 40 }
        }).setOrigin(0.5, 0);

        // Botón para cerrar el panel
        const botonCerrar = this.add.text(panelX + panelWidth - 20, panelY + 20, 'X', {
            fontSize: '24px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Evento para cerrar el panel
        botonCerrar.on('pointerdown', () => {
            this.panelInfo.destroy();
            this.panelInfo = null;
        });

        // Añadir textos al contenedor
        this.panelInfo.add(titulo);
        this.panelInfo.add(descripcion);
        this.panelInfo.add(botonCerrar);

        // Hacer que el panel desaparezca automáticamente después de 10 segundos
        this.time.delayedCall(10000, () => {
            if (this.panelInfo) {
                this.panelInfo.destroy();
                this.panelInfo = null;
            }
        });
    }

    update() {
        // No se necesita código aquí, los eventos están en create()
    }
}
// Eliminar la línea de exportación