class ScenaPreguntas extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaPreguntas' });
        this.preguntaTexto = "¿Cuál es la función de un servomotor en un robot?";
        this.opciones = [
            { texto: "(A) Generar señales de radio", esCorrecta: false },
            { texto: "(B) Controlar el ángulo de movimiento de una pieza mecánica", esCorrecta: true },
            { texto: "(C) Almacenar datos de navegación", esCorrecta: false },
            { texto: "(D) Emitir luz infrarroja", esCorrecta: false }
        ];
        this.opcionesUI = [];
        this.feedbackTexto = null;
        this.botonSeleccionado = null;

        // Paleta de colores "profesional y divertida"
        this.colores = {
            fondoPregunta: 0x2c3e50,      // Azul oscuro desaturado para el título
            fondoBoton: 0x34495e,        // Un azul ligeramente más claro para el fondo de los botones
            textoBlanco: '#FFFFFF',
            textoPregunta: '#FFFFFF',
            bordeBotonNormal: 0x3498db,    // Azul brillante para el borde
            bordeBotonHover: 0x5dade2,     // Azul más claro para borde en hover
            fondoBotonHover: 0x4a6480,     // Fondo de botón más claro en hover
            bordeCorrecto: 0x2ecc71,      // Verde para borde y fondo de feedback
            fondoCorrecto: 0x27ae60,      // Verde más oscuro para fondo de botón correcto
            bordeIncorrecto: 0xe74c3c,    // Rojo para borde y fondo de feedback
            fondoIncorrecto: 0xc0392b,    // Rojo más oscuro para fondo de botón incorrecto
            textoFeedbackFondo: 'rgba(0,0,0,0.7)'
        };
    }

    preload() {
        // Cargar la imagen de fondo
        this.load.image('fondoTaller', 'assets/scenaPregunta/taller.jpg'); // Asegúrate que la ruta es correcta
    }

    init(data) {
        // Guardar datos de la escena anterior si existen
        this.fromScene = data.fromScene || null;
    }

    create() {
        // Asegurar que el canvas se configure correctamente sin usar reset()
        if (this.sys.game.renderer.type === Phaser.WEBGL) {
            // En lugar de reset(), podemos forzar una actualización del contexto
            this.sys.game.renderer.pipelines.rebind();
        }

        // Añadir imagen de fondo
        const fondo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'fondoTaller');
        fondo.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        const centerX = this.cameras.main.width / 2;
        let currentY = 80;

        // Panel para la pregunta
        const panelPreguntaAncho = this.cameras.main.width * 0.9;
        const panelPreguntaAlto = 100; // Ajustar según el texto
        const panelPregunta = this.add.graphics();
        panelPregunta.fillStyle(this.colores.fondoPregunta, 0.85); // 85% opacidad
        panelPregunta.fillRoundedRect(centerX - panelPreguntaAncho / 2, currentY - panelPreguntaAlto / 2, panelPreguntaAncho, panelPreguntaAlto, 20);
        panelPregunta.lineStyle(3, 0xffffff, 0.5); // Borde blanco sutil
        panelPregunta.strokeRoundedRect(centerX - panelPreguntaAncho / 2, currentY - panelPreguntaAlto / 2, panelPreguntaAncho, panelPreguntaAlto, 20);


        // Estilo para la pregunta
        const estiloPregunta = {
            fontSize: '26px',
            fill: this.colores.textoPregunta,
            fontStyle: 'bold',
            wordWrap: { width: panelPreguntaAncho - 40 },
            align: 'center'
        };
        this.add.text(centerX, currentY, this.preguntaTexto, estiloPregunta).setOrigin(0.5);

        currentY += panelPreguntaAlto / 2 + 80; // Espacio después de la pregunta

        // Botones de opción
        const botonWidth = this.cameras.main.width * 0.8;
        const botonHeight = 60;
        const paddingTextoIzquierda = 25; // Espacio desde el borde izquierdo del botón al texto
        const estiloTextoOpcion = {
            fontSize: '20px',
            fill: this.colores.textoBlanco,
            align: 'left', // Alineación del texto a la izquierda dentro de su caja
            wordWrap: { width: botonWidth - (paddingTextoIzquierda * 2) } // Ajustar ancho para el texto
        };

        this.opciones.forEach((opcion, index) => {
            const opcionY = currentY + (index * (botonHeight + 25)); // 25px de espacio

            // Contenedor para el botón (para facilitar el escalado y la gestión)
            const botonContainer = this.add.container(centerX, opcionY);

            const botonRect = this.add.graphics();
            // Fondo y borde para el botón
            botonRect.fillStyle(this.colores.fondoBoton, 0.85); // Fondo similar al título pero puede ser un tono diferente
            botonRect.fillRoundedRect(-botonWidth / 2, -botonHeight / 2, botonWidth, botonHeight, 15);
            botonRect.lineStyle(3, this.colores.bordeBotonNormal, 1); // Grosor 3, color azul, alfa 1
            botonRect.strokeRoundedRect(-botonWidth / 2, -botonHeight / 2, botonWidth, botonHeight, 15);

            // Posicionar el texto a la izquierda
            const opcionTextoUI = this.add.text(
                (-botonWidth / 2) + paddingTextoIzquierda, // Posición X: borde izquierdo del botón más padding
                0,                                        // Posición Y: centrado verticalmente
                opcion.texto,
                estiloTextoOpcion
            ).setOrigin(0, 0.5); // Origen en (izquierda, centro)

            botonContainer.add([botonRect, opcionTextoUI]);
            botonContainer.setSize(botonWidth, botonHeight); // Necesario para la interactividad del contenedor
            botonContainer.setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    // Modificamos esta condición para permitir seguir seleccionando
                    // Solo verificamos si el botón específico está habilitado
                    if (botonContainer.input && botonContainer.input.enabled) {
                        this.seleccionarRespuesta(opcion, botonContainer, botonRect);
                    }
                })
                .on('pointerover', () => {
                    // También modificamos esta condición para que funcione con múltiples selecciones
                    if (botonContainer.input && botonContainer.input.enabled) {
                        botonRect.clear();
                        botonRect.fillStyle(this.colores.fondoBotonHover, 0.95); // Fondo más claro y opaco en hover
                        botonRect.fillRoundedRect(-botonWidth / 2, -botonHeight / 2, botonWidth, botonHeight, 15);
                        botonRect.lineStyle(4, this.colores.bordeBotonHover, 1); // Borde más grueso y claro en hover
                        botonRect.strokeRoundedRect(-botonWidth / 2, -botonHeight / 2, botonWidth, botonHeight, 15);
                        this.tweens.add({ targets: botonContainer, scale: 1.03, duration: 150, ease: 'Power1' }); // Escala sutil
                    }
                })
                .on('pointerout', () => {
                    // También modificamos esta condición
                    if (botonContainer.input && botonContainer.input.enabled) {
                        botonRect.clear();
                        botonRect.fillStyle(this.colores.fondoBoton, 0.85);
                        botonRect.fillRoundedRect(-botonWidth / 2, -botonHeight / 2, botonWidth, botonHeight, 15);
                        botonRect.lineStyle(3, this.colores.bordeBotonNormal, 1);
                        botonRect.strokeRoundedRect(-botonWidth / 2, -botonHeight / 2, botonWidth, botonHeight, 15);
                        this.tweens.add({ targets: botonContainer, scale: 1, duration: 150, ease: 'Power1' });
                    }
                });

            this.opcionesUI.push({ container: botonContainer, rect: botonRect, text: opcionTextoUI, data: opcion });
        });

        // Texto para el feedback - Modificado para mayor visibilidad
        // Cambiamos la posición Y para que esté en la parte superior, debajo de la pregunta
        const feedbackYPosition = 170; // Posiciona el centro del texto a Y=170

        this.feedbackTexto = this.add.text(centerX, feedbackYPosition, '', {
            fontSize: '24px',
            fontStyle: 'bold',
            align: 'center',
            backgroundColor: this.colores.textoFeedbackFondo,
            padding: { x: 25, y: 15 }, // Aumentamos el padding para un mejor diseño
            fixedWidth: this.cameras.main.width * 0.8,
            wordWrap: { width: this.cameras.main.width * 0.8 - 50 } // Ajustamos el wordWrap con el nuevo padding
        }).setOrigin(0.5);

        // Asegurarnos que el texto de feedback esté por encima de otros elementos
        this.feedbackTexto.setDepth(100);
        this.feedbackTexto.setVisible(false);
    }

    seleccionarRespuesta(opcionSeleccionada, botonContainerSeleccionado, botonRectSeleccionado) {
        // Detener animación de hover del seleccionado
        this.tweens.killTweensOf(botonContainerSeleccionado);
        botonContainerSeleccionado.setScale(1); // Asegurar escala normal

        // Limpiar el estilo actual del botón
        botonRectSeleccionado.clear();

        if (opcionSeleccionada.esCorrecta) {
            // Si la respuesta es correcta, ahora sí guardamos el botón seleccionado
            this.botonSeleccionado = botonContainerSeleccionado;

            // Mostrar feedback de correcto con mensaje específico
            this.feedbackTexto.setText("¡Correcto! Un servomotor permite mover componentes de un robot con precisión.");
            this.feedbackTexto.setFill(this.colores.textoBlanco);
            // Aumentamos la opacidad del fondo a 0.9
            this.feedbackTexto.setBackgroundColor(`rgba(${Phaser.Display.Color.ValueToColor(this.colores.bordeCorrecto).r}, ${Phaser.Display.Color.ValueToColor(this.colores.bordeCorrecto).g}, ${Phaser.Display.Color.ValueToColor(this.colores.bordeCorrecto).b}, 0.9)`);
            this.feedbackTexto.setDepth(100); // Asegurar que esté por encima
            console.log("Mostrando feedback correcto"); // Para depuración
            this.feedbackTexto.setVisible(true);

            // Estilo para el botón correcto
            botonRectSeleccionado.fillStyle(this.colores.fondoCorrecto, 1);
            botonRectSeleccionado.fillRoundedRect(-botonContainerSeleccionado.width / 2, -botonContainerSeleccionado.height / 2, botonContainerSeleccionado.width, botonContainerSeleccionado.height, 15);
            botonRectSeleccionado.lineStyle(4, this.colores.bordeCorrecto, 1);
            botonRectSeleccionado.strokeRoundedRect(-botonContainerSeleccionado.width / 2, -botonContainerSeleccionado.height / 2, botonContainerSeleccionado.width, botonContainerSeleccionado.height, 15);

            // Ahora sí deshabilitamos todos los botones
            this.opcionesUI.forEach(ui => {
                ui.container.disableInteractive();
                // Si no es el botón correcto y no ha sido seleccionado antes (no está rojo)
                if (ui.container !== botonContainerSeleccionado && ui.container.input && ui.container.input.enabled) {
                    // Atenuar los botones no seleccionados
                    ui.rect.clear();
                    ui.rect.fillStyle(this.colores.fondoBoton, 0.5);
                    ui.rect.fillRoundedRect(-ui.container.width / 2, -ui.container.height / 2, ui.container.width, ui.container.height, 15);
                    ui.rect.lineStyle(3, this.colores.bordeBotonNormal, 0.5);
                    ui.rect.strokeRoundedRect(-ui.container.width / 2, -ui.container.height / 2, ui.container.width, ui.container.height, 15);
                }
                this.tweens.killTweensOf(ui.container);
                ui.container.setScale(1);
            });

            // Animación divertida para el botón correcto
            this.tweens.add({
                targets: botonContainerSeleccionado,
                scale: 1.1,
                duration: 200,
                ease: 'Bounce.easeOut',
                yoyo: true,
            });

            this.time.delayedCall(2500, () => {
                console.log("Pasando a la siguiente parte...");
                // this.scene.start('SiguienteNivel'); // O la escena que corresponda
            });
        } else {
            // Si la respuesta es incorrecta

            // Mostrar mensaje de feedback para respuesta incorrecta
            this.feedbackTexto.setText("Revisa nuevamente las funciones de los actuadores en la robótica.");
            this.feedbackTexto.setFill(this.colores.textoBlanco);
            // Aumentamos la opacidad del fondo a 0.9
            this.feedbackTexto.setBackgroundColor(`rgba(${Phaser.Display.Color.ValueToColor(this.colores.bordeIncorrecto).r}, ${Phaser.Display.Color.ValueToColor(this.colores.bordeIncorrecto).g}, ${Phaser.Display.Color.ValueToColor(this.colores.bordeIncorrecto).b}, 0.9)`);
            this.feedbackTexto.setDepth(100); // Asegurar que esté por encima
            console.log("Mostrando feedback incorrecto"); // Para depuración
            this.feedbackTexto.setVisible(true);

            // Estilo para el botón incorrecto (solo este botón)
            botonRectSeleccionado.fillStyle(this.colores.fondoIncorrecto, 1);
            botonRectSeleccionado.fillRoundedRect(-botonContainerSeleccionado.width / 2, -botonContainerSeleccionado.height / 2, botonContainerSeleccionado.width, botonContainerSeleccionado.height, 15);
            botonRectSeleccionado.lineStyle(4, this.colores.bordeIncorrecto, 1);
            botonRectSeleccionado.strokeRoundedRect(-botonContainerSeleccionado.width / 2, -botonContainerSeleccionado.height / 2, botonContainerSeleccionado.width, botonContainerSeleccionado.height, 15);

            // Deshabilitar SOLO este botón incorrecto
            botonContainerSeleccionado.disableInteractive();

            // Animación de "shake" para el botón incorrecto
            const originalX = botonContainerSeleccionado.x; // Guardar la posición original
            this.tweens.add({
                targets: botonContainerSeleccionado,
                x: originalX + 10,
                duration: 50,
                ease: 'Power1',
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    // Asegurarse de que el botón vuelva a su posición original
                    botonContainerSeleccionado.x = originalX;
                }
            });

            // El mensaje de feedback desaparecerá después de un tiempo para no distraer
            this.time.delayedCall(2000, () => {
                this.feedbackTexto.setVisible(false);
            });

            // NO revelamos la respuesta correcta
            // NO deshabilitamos los otros botones
            // NO hay delayedCall para pasar a otra escena, el usuario puede seguir intentando
        }
    }

    update() {
        // Lógica que se ejecuta en cada frame, si es necesario
    }
}

// Si estás usando módulos ES6 y un empaquetador como Webpack o Parcel:
// export default ScenaPreguntas;

// Si no usas módulos, asegúrate de que esta clase esté disponible globalmente
// para que Phaser pueda encontrarla cuando la inicies, por ejemplo:
// var config = {
//    type: Phaser.AUTO,
//    width: 800, // Ajusta al tamaño de tu juego
//    height: 600, // Ajusta al tamaño de tu juego
//    scene: [ScenaPreguntas] // Añade tu escena aquí
// };
// var game = new Phaser.Game(config);