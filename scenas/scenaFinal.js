class ScenaFinal extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenaFinal' });
        this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    }

    preload() {
        // Puedes usar una imagen de fondo espacial si tienes una, por ejemplo: this.load.image('space', 'ruta/a/tu/espacio.png');
        // Si no, usaremos gráficos generados por código
    }

    create() {
        // Fondo estrellado animado
        this.stars = this.add.group({ key: null, repeat: 100 });
        for (let i = 0; i < 100; i++) {
            let star = this.add.circle(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Math.Between(1, 3),
                0xffffff
            );
            star.speed = Phaser.Math.FloatBetween(0.2, 1);
            this.stars.add(star);
        }

        // Mensaje central con animación
        const mensaje = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '¡La misión ha terminado con éxito!\n\nPrepárate para las siguientes aventuras',
            {
                fontFamily: 'Arial Black',
                fontSize: '36px',
                color: '#00ffe7',
                align: 'center',
                backgroundColor: 'rgba(10,10,30,0.8)',
                padding: { x: 30, y: 30 },
                stroke: '#fff',
                strokeThickness: 6,
                shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 8, fill: true }
            }
        ).setOrigin(0.5);
        mensaje.setAlpha(0);
        this.tweens.add({
            targets: mensaje,
            alpha: 1,
            duration: 1500,
            ease: 'Power2'
        });
    }

    update() {
        // Animar estrellas
        this.stars.children.iterate(star => {
            star.y += star.speed;
            if (star.y > this.cameras.main.height) {
                star.y = 0;
                star.x = Phaser.Math.Between(0, this.cameras.main.width);
            }
        });
    }
}