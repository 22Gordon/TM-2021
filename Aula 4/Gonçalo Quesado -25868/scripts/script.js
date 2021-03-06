var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png',
        { frameWidth: 32, frameHeight: 48}
    );


}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
        });

    this.anims.create({
        key: 'turn',
        frames: [ {key: 'dude', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });
    //gravidade a que o player cai
    player.body.setGravityY(300);
    //permite a colisão do player com as plataformas
    this.physics.add.collider(player, platforms);

    //Utilizar as teclas do teclado (com as propriedades em update)
    cursors = this.input.keyboard.createCursorKeys();

    //adicionar estrelas
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70}
    });

    stars.children.iterate(function (child){

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});

    //Colisão das estrelas e plataformas
    this.physics.add.collider(stars, platforms);

    //Verficar a sobreposição com as estrelas
    this.physics.add.overlap(player, stars, collectStar, null, this);

    //Caso acha sobreposição
    function collectStar (player, star)
    {
        star.disableBody(true, true);
        // aumentar o score +1 por cada estrela apanhada
        score += 1;
        scoreText.setText('Score: ' + score);

        //adicionar as bombas após apanhar as estrelas todas da fase
            //o countActive ve o numero de estrelas. caso não acha nenhuma procede
        if (stars.countActive(true) === 0){
            nivel += 1;
            nivelText.setText('Nivel: ' + nivel);
            //iterate reativa todas as estrelas, caindo de novo do topo da tela
            stars.children.iterate(function (child){

                child.enableBody(true, child.x, 0, true, true);
            });

            // Escolher uma coordenada x aleatória, do lado oposto ao player
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            //Criar a bomba
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200,200), 20);
        }
    }

    //Tabela de pontuação:
    var score = 0;
    var scoreText;

    //Tabela de nivel
    var nivel = 1;
    var nivelText;

    scoreText = this.add.text(24, 24, 'score: 0', { fontSize: '48px', fill: '#0b5103' });
    nivelText = this.add.text(550, 24, 'Nivel: 1', { fontSize: '48px', fill: '#0b5103' });

    //Colocar as bombas

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    //Caso o jogador toque nas bombas

    function hitBomb (player, bomb){

        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }



}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-500);
    }


}