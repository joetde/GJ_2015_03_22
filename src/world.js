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
    SPEED : 200
};

var Globals = {
    backgroundImg : null,
    backgroundMusic : null,
    target : null,
    leftTop : null,
	zombieView : 200
};

// game variables
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-div');

var world = {
    zombies: null,
    humans: null,
    player: null,
	rng: new Phaser.RandomDataGenerator([(new Date()).toString()]),
    
    preload: function () {
        // sounds
        game.load.audio('background_music', 'res/snd/temp.mp3');

        // images
        game.load.image('zombie', 'res/img/zombie_simple.png');
		game.load.image('human', 'res/img/human_simple.png');
        game.load.spritesheet('medic_simple', 'res/img/medic_simple.png', 33, 58);
    },

    create: function () {
		game.physics.startSystem(Phaser.Physics.ARCADE);
	
        //Entities
        this.zombies = game.add.group();
		this.zombies.enableBody = true;
        
        this.humans = game.add.group();
        this.humans.enableBody = true;

        this.player = new Player(world);
		Globals.target = this.player.sprite;

        // sound
        Globals.backgroundMusic = game.add.audio('background_music');
        Globals.backgroundMusic.play(null, 0, 1, true);

		// Humans 
		for(i = 0; i < 50; i++)
		{
			var human = this.humans.create(game.world.randomX, game.world.randomY, 'human');
			human.name = 'human' + i;
			human.body.collideWorldBounds = true;
			human.body.width = 30;
			human.body.height = 50;
			human.body.bounce.setTo(0.1, 0.1);
			human.body.velocity.setTo(5 + Math.random() * 40, 5 + Math.random() * 40);
			human.lifespan = this.rng.between(2000, 10000);
			human.events.onKilled.add(this.humanMutate, this);
		}
    },

    update: function () {
		game.physics.arcade.collide(this.player.sprite, this.zombies);
		game.physics.arcade.collide(this.player.sprite, this.humans);
		game.physics.arcade.collide(this.zombies, this.humans);
		game.physics.arcade.collide(this.zombies, this.zombies);
		game.physics.arcade.collide(this.humans, this.humans);
		
		this.player.update();
		this.zombies.forEach(this.gotToTarget, this, true);
        this.humans.update();
    },
	
	humanMutate : function (human) {
		var zombie = this.zombies.create(human.x, human.y, 'zombie');
		zombie.name = 'zombie' + i;
		zombie.body.collideWorldBounds = true;
		zombie.body.width = 30;
		zombie.body.height = 50;
		zombie.body.bounce.setTo(0.1, 0.1);
		zombie.body.velocity.setTo(5 + Math.random() * 40, 5 + Math.random() * 40);
	},
	
	gotToTarget: function(zombie) {
		if (this.targetInRange(zombie)) {
			game.physics.arcade.moveToObject(zombie, Globals.target, 50);
		}
	},
	
	targetInRange: function(zombie) {
		dx = zombie.x - Globals.target.x;
		dy = zombie.y - Globals.target.y;
		return Math.sqrt(dx*dx + dy*dy) < Globals.zombieView;
	}
}

game.state.add('world', world);
game.state.start('world');
