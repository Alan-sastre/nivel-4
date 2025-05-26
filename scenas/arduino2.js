class ArduinoGameScene2 extends Phaser.Scene {
  constructor() {
    super({ key: "ArduinoGameScene2" });

    this.arduinoCodeStringArray = [
      "int sensorLuz = A1;",
      "int laser = 7;",
      "",
      "void setup() {",
      "  pinMode(laser, OUTPUT);",
      "}",
      "",
      "void loop() {",
      "  int luz = analogRead(sensorLuz);",
      "  if (luz < 200) {",
      "    digitalWrite(laser, HIGH);",,
      "  }",
      "}",
    ];

    this.questionTextString = "¿Cuál es el error en este código?";

    this.optionsData = [
      {
        text: "(A)  Falta definir el sensorLuz como entrada.",
        correct: true,
      },
      {
        text: "(B)  El láser no se apaga después de activarse.",
        correct: false,
      },
      {
        text: "(C)  No se ha declarado la variable luz correctamente.",
        correct: false,
      },
      {
        text: "(D)  Se necesita usar digitalRead en lugar de analogRead.",
        correct: false,
      },
    ];

    this.feedbackText = null;
    this.optionObjects = [];
    this.optionBackgrounds = []; // Para los fondos de las opciones
  }

  preload() {
    // Aquí puedes cargar assets si los necesitas
    // Por ejemplo: this.load.image('background', 'assets/background.png');
  }

  create() {
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    // --- Fondo de la Escena ---
    this.cameras.main.setBackgroundColor("#2c3e50"); // Un azul oscuro/grisáceo

    // --- Estilos de Texto Mejorados ---
    const titleStyle = {
      fontSize: "28px",
      fill: "#ecf0f1",
      fontFamily: "Arial, sans-serif",
      align: "center",
      wordWrap: { width: screenWidth * 0.9 },
      stroke: "#000000",
      strokeThickness: 2,
    };
    const panelTitleStyle = {
      fontSize: "20px",
      fill: "#e0e0e0",
      fontFamily: "Arial, sans-serif",
      align: "left",
    };
    // Estilo para el bloque de código, manteniendo la fuente monoespaciada
    const codeStyle = {
      fontSize: "15px",
      fill: "#f0f0f0",
      fontFamily: 'Consolas, "Courier New", monospace',
      lineSpacing: 5,
      align: "left",
      wordWrap: { width: screenWidth / 2 - 70 },
    }; // Ajustar ancho para el nuevo panel
    const questionStyle = {
      fontSize: "20px",
      fill: "#f1c40f",
      fontFamily: "Arial, sans-serif",
      align: "left",
      wordWrap: { width: screenWidth / 2 - 80 },
    }; // Amarillo para la pregunta
    // Estilo base para el texto de las opciones - Cambiado a color blanco
    const optionTextStyle = {
      fontSize: "16px",
      fill: "#ffffff",
      fontFamily: "Arial, sans-serif",
      align: "center",
      wordWrap: { width: screenWidth / 2 - 120 },
    };
    const feedbackStyle = {
      fontSize: "18px",
      fill: "#ffffff",
      fontFamily: "Arial, sans-serif",
      align: "center",
      wordWrap: { width: screenWidth / 2 - 70 },
      padding: { y: 5 },
    };

    // --- Título General ---
    this.add
      .text(screenWidth / 2, 50, "Desafío de Código Arduino", titleStyle)
      .setOrigin(0.5);

    // --- Panel Izquierdo: Código Arduino ---
    const leftPanelX = 20; // Reducir un poco el margen izquierdo para dar más espacio
    const leftPanelY = 100;
    const leftPanelWidth = screenWidth / 2 - 30; // Aumentar ligeramente el ancho del panel
    const leftPanelHeight = screenHeight - 115; // Aumentar significativamente la altura del panel
    const leftPanelBg = this.add.graphics();
    leftPanelBg.fillStyle(0x34495e, 0.8); // Color de fondo del panel (azul grisáceo más oscuro)
    leftPanelBg.fillRoundedRect(
      leftPanelX,
      leftPanelY,
      leftPanelWidth,
      leftPanelHeight,
      15
    ); // Rectángulo redondeado
    leftPanelBg.lineStyle(2, 0xecf0f1, 0.5); // Borde sutil
    leftPanelBg.strokeRoundedRect(
      leftPanelX,
      leftPanelY,
      leftPanelWidth,
      leftPanelHeight,
      15
    );

    this.add.text(
      leftPanelX + 20,
      leftPanelY + 15,
      "Código a Analizar:",
      panelTitleStyle
    );
    this.add.text(
      leftPanelX + 20,
      leftPanelY + 50,
      this.arduinoCodeStringArray.join("\n"),
      codeStyle
    );

    // --- Panel Derecho: Pregunta y Opciones ---
    const rightPanelX = screenWidth / 2 + 10; // Ajustar la posición X del panel derecho
    const rightPanelY = 100;
    const rightPanelWidth = screenWidth / 2 - 30; // Ajustar el ancho del panel derecho
    const rightPanelHeight = screenHeight - 120; // Igualar altura con el panel izquierdo
    const rightPanelBg = this.add.graphics();
    rightPanelBg.fillStyle(0x34495e, 0.8);
    rightPanelBg.fillRoundedRect(
      rightPanelX,
      rightPanelY,
      rightPanelWidth,
      rightPanelHeight,
      15
    );
    rightPanelBg.lineStyle(2, 0xecf0f1, 0.5);
    rightPanelBg.strokeRoundedRect(
      rightPanelX,
      rightPanelY,
      rightPanelWidth,
      rightPanelHeight,
      15
    );

    this.add.text(
      rightPanelX + 20,
      rightPanelY + 15,
      this.questionTextString,
      questionStyle
    );

    let optionStartY = rightPanelY + 75; // Espacio después de la pregunta
    const optionHeight = 45; // Alto de cada botón de opción
    const optionSpacingY = 15; // Espacio vertical entre opciones
    const optionButtonWidth = rightPanelWidth - 40; // Ancho del botón de opción

    this.optionObjects = [];
    this.optionBackgrounds = [];

    this.optionsData.forEach((option, index) => {
      const optX = rightPanelX + 20;
      const optY = optionStartY + index * (optionHeight + optionSpacingY);

      // Fondo del botón de opción
      const optionBg = this.add.graphics();
      optionBg.fillStyle(0xecf0f1, 1); // Color de fondo inicial del botón (blanco/gris claro)
      optionBg.fillRoundedRect(optX, optY, optionButtonWidth, optionHeight, 10);

      // Guardar las coordenadas y dimensiones en el objeto gráfico para usarlas después
      optionBg.x = optX;
      optionBg.y = optY;
      optionBg.width = optionButtonWidth;
      optionBg.height = optionHeight;

      this.optionBackgrounds.push(optionBg);

      // Texto de la opción
      const optionLabel = this.add
        .text(
          optX + optionButtonWidth / 2,
          optY + optionHeight / 2,
          option.text,
          optionTextStyle
        )
        .setOrigin(0.5);

      // Crear una zona interactiva explícita que cubra exactamente el área del botón
      const zone = this.add
        .zone(optX, optY, optionButtonWidth, optionHeight)
        .setOrigin(0)
        .setInteractive()
        .on("pointerdown", () => {
          this.handleAnswer(option.correct, optionLabel, optionBg, zone);
        })
        .on("pointerover", () => {
          // Efecto de animación al pasar el ratón
          this.tweens.add({
            targets: optionLabel,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 100,
            ease: "Power1",
          });

          // Efecto de brillo en el fondo
          optionBg.clear();
          optionBg.fillStyle(0x3498db, 1); // Color azul brillante al pasar el mouse
          optionBg.fillRoundedRect(
            optX,
            optY,
            optionButtonWidth,
            optionHeight,
            10
          );

          // Añadir un borde brillante
          optionBg.lineStyle(2, 0xf1c40f, 1); // Borde amarillo
          optionBg.strokeRoundedRect(
            optX,
            optY,
            optionButtonWidth,
            optionHeight,
            10
          );
        })
        .on("pointerout", () => {
          // Revertir la animación al quitar el ratón
          this.tweens.add({
            targets: optionLabel,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: "Power1",
          });

          // Volver al color original
          optionBg.clear();
          optionBg.fillStyle(0xecf0f1, 1); // Color original
          optionBg.fillRoundedRect(
            optX,
            optY,
            optionButtonWidth,
            optionHeight,
            10
          );
        });

      optionLabel.setData("optionBg", optionBg);
      optionLabel.setData("zone", zone);
      this.optionObjects.push(optionLabel);
    });

    // --- Espacio para Feedback (debajo de las opciones) ---
    const feedbackY =
      optionStartY +
      this.optionsData.length * (optionHeight + optionSpacingY) +
      15;
    this.feedbackText = this.add
      .text(rightPanelX + rightPanelWidth / 2, feedbackY, "", feedbackStyle)
      .setOrigin(0.5, 0);
  }

  handleAnswer(isCorrect, selectedOptionLabel, selectedOptionBg, selectedZone) {
    // Si la zona ya está deshabilitada, no hacer nada
    if (selectedZone.input && !selectedZone.input.enabled) {
      return;
    }

    const correctColor = 0x2ecc71; // Verde para correcto
    const incorrectColor = 0xe74c3c; // Rojo para incorrecto
    const disabledColor = 0x95a5a6; // Gris para deshabilitado
    const disabledTextColor = "#ffffff"; // Cambiado a blanco para mejor visibilidad
    const correctTextColor = "#ffffff"; // Texto blanco para mejor contraste sobre verde/rojo

    if (isCorrect) {
      // Respuesta correcta
      selectedOptionBg.clear();
      selectedOptionBg.fillStyle(correctColor, 1);
      selectedOptionBg.fillRoundedRect(
        selectedOptionBg.x,
        selectedOptionBg.y,
        selectedOptionBg.width,
        selectedOptionBg.height,
        10
      );
      selectedOptionLabel.setStyle({ fill: correctTextColor });

      // Deshabilitar todas las zonas
      this.optionObjects.forEach((optLabel, idx) => {
        const optBg = this.optionBackgrounds[idx];
        const zone = optLabel.getData("zone");

        if (zone && zone.input) {
          zone.disableInteractive();
        }

        if (optLabel !== selectedOptionLabel) {
          optBg.clear();
          optBg.fillStyle(disabledColor, 1);
          optBg.fillRoundedRect(
            optBg.x,
            optBg.y,
            optBg.width,
            optBg.height,
            10
          );
          optLabel.setStyle({ fill: disabledTextColor });
        }
      });

      if (this.feedbackText) {
        this.feedbackText.setText("¡Correcto! ✅\nEsa es la falla principal.");
        this.feedbackText.setStyle({ fill: "#2ecc71" });
      }

      // Esperar 2 segundos y luego mostrar el código correcto
      this.time.delayedCall(2000, () => {
        // Limpiar toda la pantalla
        this.children.removeAll(true);

        // Configurar el fondo
        this.cameras.main.setBackgroundColor("#2c3e50");

        // Estilos para el código correcto - Reducir tamaño de fuente para que quepa mejor
        const titleStyle = {
          fontSize: "22px",
          fill: "#ecf0f1",
          fontFamily: "Arial, sans-serif",
          align: "center",
          stroke: "#000000",
          strokeThickness: 1,
        };
        const subtitleStyle = {
          fontSize: "18px",
          fill: "#2ecc71",
          fontFamily: "Arial, sans-serif",
          align: "center",
          fontWeight: "bold",
        };
        const codeStyle = {
          fontSize: "12px",
          fill: "#f0f0f0",
          fontFamily: 'Consolas, "Courier New", monospace',
          lineSpacing: 4,
          align: "left",
        };

        // Mostrar el título y subtítulo en la misma línea para ahorrar espacio
        this.add
          .text(
            this.cameras.main.width / 2,
            20,
            "Desafío de Código Arduino - Solución Correcta",
            titleStyle
          )
          .setOrigin(0.5);

        // Crear el panel para el código - Ajustar dimensiones para que quepa en la pantalla
        const codePanelX = this.cameras.main.width / 2 - 280;
        const codePanelY = 50; // Subir el panel
        const codePanelWidth = 560;
        const codePanelHeight = 400; // Aumentar altura

        const codePanelBg = this.add.graphics();
        codePanelBg.fillStyle(0x34495e, 0.9);
        codePanelBg.fillRoundedRect(
          codePanelX,
          codePanelY,
          codePanelWidth,
          codePanelHeight,
          15
        );
        codePanelBg.lineStyle(3, 0x3498db, 0.8);
        codePanelBg.strokeRoundedRect(
          codePanelX,
          codePanelY,
          codePanelWidth,
          codePanelHeight,
          15
        );

        // Añadir una barra superior para el lenguaje
        const headerHeight = 25; // Reducir altura del encabezado
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x2c3e50, 1);
        headerBg.fillRoundedRect(
          codePanelX,
          codePanelY,
          codePanelWidth,
          headerHeight,
          { tl: 15, tr: 15, bl: 0, br: 0 }
        );

        // Añadir etiqueta de lenguaje en la barra superior
        const langLabel = this.add
          .text(codePanelX + 20, codePanelY + headerHeight / 2, "cpp", {
            fontSize: "14px",
            fill: "#f39c12",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          })
          .setOrigin(0, 0.5);

        // Añadir botones decorativos de copiar/editar
        const copyText = this.add
          .text(
            codePanelX + codePanelWidth - 150,
            codePanelY + headerHeight / 2,
            "Copiar",
            {
              fontSize: "12px",
              fill: "#bdc3c7",
              fontFamily: "Arial, sans-serif",
            }
          )
          .setOrigin(0, 0.5);

        const editText = this.add
          .text(
            codePanelX + codePanelWidth - 80,
            codePanelY + headerHeight / 2,
            "Editar",
            {
              fontSize: "12px",
              fill: "#bdc3c7",
              fontFamily: "Arial, sans-serif",
            }
          )
          .setOrigin(0, 0.5);

        // Código correcto
        const correctCode = [
          "int motorIzq = 3;",
          "int motorDer = 5;",
          "int sensorDistancia = A0;",
          "",
          "void setup() {",
          "  pinMode(motorIzq, OUTPUT);",
          "  pinMode(motorDer, OUTPUT);",
          "}",
          "",
          "void loop() {",
          "  int distancia = analogRead(sensorDistancia);",
          "  if (distancia > 300) {",
          "    digitalWrite(motorIzq, HIGH);",
          "    digitalWrite(motorDer, HIGH);",
          "  } else {",
          "    digitalWrite(motorIzq, LOW);",
          "    digitalWrite(motorDer, LOW);",
          "  }",
          "}",
        ];

        // Mostrar el código con números de línea - Ajustar posición
        const codeContent = this.add.text(
          codePanelX + 40,
          codePanelY + headerHeight + 10,
          correctCode.join("\n"),
          codeStyle
        );

        // Añadir números de línea
        let lineNumbers = "";
        for (let i = 1; i <= correctCode.length; i++) {
          lineNumbers += i + "\n";
        }

        const lineNumberStyle = {
          fontSize: "12px",
          fill: "#95a5a6",
          fontFamily: 'Consolas, "Courier New", monospace',
          lineSpacing: 4,
          align: "right",
        };

        this.add
          .text(
            codePanelX + 25,
            codePanelY + headerHeight + 10,
            lineNumbers,
            lineNumberStyle
          )
          .setOrigin(1, 0);

        // Resaltar la parte corregida - Ajustar altura de línea
        const highlightBg = this.add.graphics();
        highlightBg.fillStyle(0x27ae60, 0.2); // Verde transparente

        // Calcular la posición y tamaño del resaltado (líneas 14-17)
        const lineHeight = 16; // Altura ajustada para cada línea
        const startLine = 14; // Línea donde comienza el bloque else
        const endLine = 17; // Línea donde termina

        highlightBg.fillRect(
          codePanelX + 10,
          codePanelY + headerHeight + 10 + (startLine - 1) * lineHeight,
          codePanelWidth - 20,
          (endLine - startLine + 1) * lineHeight
        );

        // Añadir explicación mejorada - Reducir tamaño y ajustar posición
        const explanationStyle = {
          fontSize: "14px",
          fill: "#ecf0f1",
          fontFamily: "Arial, sans-serif",
          align: "center",
          wordWrap: { width: 540 },
          backgroundColor: "#34495e",
          padding: { x: 15, y: 6 },
          borderRadius: 10,
        };

        this.add
          .text(
            this.cameras.main.width / 2,
            codePanelY + codePanelHeight + 10,
            "¡Bien hecho! Ahora el robot se detendrá cuando detecte un obstáculo.",
            explanationStyle
          )
          .setOrigin(0.5, 0);



        // Fondo del botón - Hacerlo más visible
        const continueButtonBg = this.add.graphics();
        continueButtonBg.fillStyle(0x27ae60, 1); // Verde más llamativo
        continueButtonBg.fillRoundedRect(
          buttonX,
          buttonY,
          buttonWidth,
          buttonHeight,
          10
        );
        continueButtonBg.lineStyle(3, 0xf1c40f, 1); // Borde amarillo más visible
        continueButtonBg.strokeRoundedRect(
          buttonX,
          buttonY,
          buttonWidth,
          buttonHeight,
          10
        );

        // Texto del botón - Más grande y visible


        // Añadir un mensaje flotante encima del botón
        const floatingMessage = this.add
          .text(
            this.cameras.main.width / 2,
            buttonY - 15,
            "→ Pasar a la siguiente escena ←",
            {
              fontSize: "16px",
              fill: "#f1c40f",
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }
          )
          .setOrigin(0.5);

        // Animación para el mensaje flotante
        this.tweens.add({
          targets: floatingMessage,
          y: floatingMessage.y - 10,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        // Añadir interactividad al botón
        const buttonZone = this.add
          .zone(buttonX, buttonY, buttonWidth, buttonHeight)
          .setOrigin(0)
          .setInteractive()
          .on("pointerover", () => {
            // Efecto al pasar el ratón
            continueButtonBg.clear();
            continueButtonBg.fillStyle(0x219653, 1); // Verde más oscuro
            continueButtonBg.fillRoundedRect(
              buttonX,
              buttonY,
              buttonWidth,
              buttonHeight,
              10
            );
            continueButtonBg.lineStyle(4, 0xf1c40f, 1); // Borde amarillo más grueso
            continueButtonBg.strokeRoundedRect(
              buttonX,
              buttonY,
              buttonWidth,
              buttonHeight,
              10
            );

            // Animar el texto
            this.tweens.add({
              targets: buttonText,
              scaleX: 1.1,
              scaleY: 1.1,
              duration: 100,
              ease: "Power1",
            });
          })
          .on("pointerout", () => {
            // Restaurar apariencia normal
            continueButtonBg.clear();
            continueButtonBg.fillStyle(0x27ae60, 1); // Verde original
            continueButtonBg.fillRoundedRect(
              buttonX,
              buttonY,
              buttonWidth,
              buttonHeight,
              10
            );
            continueButtonBg.lineStyle(3, 0xf1c40f, 1);
            continueButtonBg.strokeRoundedRect(
              buttonX,
              buttonY,
              buttonWidth,
              buttonHeight,
              10
            );

            // Restaurar tamaño del texto
            this.tweens.add({
              targets: buttonText,
              scaleX: 1,
              scaleY: 1,
              duration: 100,
              ease: "Power1",
            });
          })
          .on("pointerdown", () => {
            // Efecto de pulsación
            continueButtonBg.clear();
            continueButtonBg.fillStyle(0x1e8449, 1); // Verde aún más oscuro
            continueButtonBg.fillRoundedRect(
              buttonX,
              buttonY,
              buttonWidth,
              buttonHeight,
              10
            );

            // Mostrar mensaje de transición
            const transitionMessage = this.add
              .text(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                "¡Pasando a la siguiente escena!",
                {
                  fontSize: "32px",
                  fill: "#ffffff",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  stroke: "#000000",
                  strokeThickness: 4,
                  backgroundColor: "#27ae60",
                  padding: { x: 20, y: 10 },
                }
              )
              .setOrigin(0.5)
              .setAlpha(0);

            // Animar mensaje de transición
            this.tweens.add({
              targets: transitionMessage,
              alpha: 1,
              duration: 300,
              ease: "Power1",
              onComplete: () => {
                // Cambiar a la siguiente escena después de mostrar el mensaje
                this.time.delayedCall(1000, () => {
                  this.scene.start("arduino2"); // Asegúrate de que 'NextScene' sea el nombre correcto
                });
              },
            });
          });

        // Añadir efecto pulsante para llamar la atención
        this.tweens.add({
          targets: continueButtonBg,
          alpha: 0.8,
          yoyo: true,
          repeat: -1,
          duration: 800,
          ease: "Sine.easeInOut",
        });

        // Añadir efecto de rebote al texto del botón
        this.tweens.add({
          targets: buttonText,
          scaleX: 1.05,
          scaleY: 1.05,
          yoyo: true,
          repeat: -1,
          duration: 1200,
          ease: "Sine.easeInOut",
        });
      });
    } else {
      // Respuesta incorrecta - Mantener el color rojo para las opciones incorrectas
      selectedOptionBg.clear();
      selectedOptionBg.fillStyle(incorrectColor, 1);
      selectedOptionBg.fillRoundedRect(
        selectedOptionBg.x,
        selectedOptionBg.y,
        selectedOptionBg.width,
        selectedOptionBg.height,
        10
      );
      selectedOptionLabel.setStyle({ fill: correctTextColor });

      // Deshabilitar solo esta zona
      if (selectedZone && selectedZone.input) {
        selectedZone.disableInteractive();
      }

      if (this.feedbackText) {
        this.feedbackText.setText("Incorrecto. ❌\nIntenta con otra opción.");
        this.feedbackText.setStyle({ fill: "#e74c3c" });
      }
    }
  }

  update() {}
}
