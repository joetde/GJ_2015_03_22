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
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-div');

var world = {
    zombies: null,
    humans: null,
    player: null,
    
    preload: function () {
        // sounds
        game.load.audio('background_music', 'res/snd/temp.mp3');

        // images
        game.load.image('temp', 'res/img/temp.png');
    },

    create: function () {
		game.physics.startSystem(Phaser.Physics.ARCADE);
	
        //Entities
        this.zombies = game.add.group();
		this.zombies.classType = Zombie;
        this.zombies.enableBody = true;
        
        this.humans = game.add.group();
        this.humans.enableBody = true;

        this.player = new Player(world);
        
        // display
        //Globals.backgroundImg = game.add.sprite(0, 0, 'background');
        Globals.player = game.add.sprite(0, 0, 'temp');

        // sound
        Globals.backgroundMusic = game.add.audio('background_music');
        Globals.backgroundMusic.play(null, 0, 1, true);

        game.physics.enable(Globals.player, Phaser.Physics.ARCADE);
		
		
		// Zombies
		for (var i = 0; i < 50; i++)
		{
			var ball = zombies.create(game.world.randomX, game.world.randomY, 'temp');
		}
    },

    update: function () {
        checkInput();
        
        this.player.update();
        this.zombies.update();
        this.humans.update();
    }
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

game.state.add('world', world);
game.state.start('world');
