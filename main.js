/*jslint plusplus: true */
/*jslint browser: true*/
/*global $, Phaser*/

var Config = {
    KEYS : [Phaser.Keyboard.Z, Phaser.Keyboard.S, Phaser.Keyboard.Q, Phaser.Keyboard.D],
    COORMAP : [[0, -1],
               [0, 1],
               [-1, 0],
               [1, 0]],
    UP : 0,
    DOWN : 1,
    LEFT : 2,
    RIGHT : 3,
    SPEED : 500
};

var Globals = {
    backgroundImg : null,
    backgroundMusic : null,
    player : null,
    target : null,
    leftTop : null
};

// game variables
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-div', { preload: preload, create: create, update: update });

function preload() {
    // sounds
    game.load.audio('background_music', 'res/snd/temp.mp3');

    // images
    game.load.image('temp', 'res/img/temp.png');
}

function create() {
    // display
    //Globals.backgroundImg = game.add.sprite(0, 0, 'background');
    Globals.player = game.add.sprite(0, 0, 'temp');

    // sound
    Globals.backgroundMusic = game.add.audio('background_music');
    Globals.backgroundMusic.play(null, 0, 1, true);

    game.physics.enable(Globals.player, Phaser.Physics.ARCADE);
}

function update() {
    checkInput();
}

function checkInput() {
    Globals.player.body.velocity.x = 0;
    Globals.player.body.velocity.y = 0;
    for (direction = 0; direction < 4; direction++) {
        if (game.input.keyboard.isDown(Config.KEYS[direction])) {
            Config.COORMAP[direction][0] ? Globals.player.body.velocity.x = Config.COORMAP[direction][0] * Config.SPEED : 0;
            Config.COORMAP[direction][1] ? Globals.player.body.velocity.y = Config.COORMAP[direction][1] * Config.SPEED : 0;
        }
    }
}
