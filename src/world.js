/*jslint plusplus: true */
/*jslint browser: true*/
/*global $, Phaser*/

var Config = {
    KEYS : [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT],
    COORMAP : [[0, -1],
               [0, 1],
               [-1, 0],
               [1, 0]],
    UP : 0,
    DOWN : 1,
    LEFT : 2,
    RIGHT : 3,
    SPEED : 200,
    SHOOT : Phaser.Keyboard.S,
    FIRE_RATE : 300,
    FIRE_SPEED : 500,
    FIRE_INIT_OFFSET : 3,
	ZOMBIE_VIEW_RADIUS : 400,
	MIN_MUTATE_TIME : 3000,
	MAX_MUTATE_TIME : 40000,
	MIN_MOVE_TIME : 500,
	MAX_MOVE_TIME : 2000,
	PLAYER_LIFE : 5,
	INVULNERABILITY_TIME : 500
};

var Globals = {
    backgroundImg : null,
    backgroundMusic : null,
    target : null,
    leftTop : null
};

// game variables
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game-div');

var world = {
    zombies: null,
    humans: null,
    player: null,
	rng: new Phaser.RandomDataGenerator([(new Date()).toString()]),
    balls: null,
	npcs:null,
    nextFire:0,
	mobSpeed:40,
	mobsNb:35,
    
    preload: function () {
        // sounds
        game.load.audio('background_music', 'res/snd/temp.mp3');

        // images
        game.load.spritesheet('zombie', 'res/img/zombie_sprite.png', 48, 63);
        game.load.image('ball', 'res/img/brocoli.png');
		game.load.spritesheet('human', 'res/img/human_sprite.png', 55, 65);
        game.load.spritesheet('medic_simple', 'res/img/medic_sprite.png', 35, 62);
		game.load.image('background', 'res/img/background.png');
    },

    create: function () {
		game.physics.startSystem(Phaser.Physics.ARCADE);
	
		// background
		Globals.backgroundImage = game.add.sprite(0,0,'background');
	
        //Entities
        this.zombies = game.add.group();
		this.zombies.enableBody = true;
        
        this.humans = game.add.group();
        this.humans.enableBody = true;

        this.player = new Player(world);
		Globals.target = this.player.sprite;

        this.balls = game.add.group();
        this.balls.createMultiple(500, 'ball', 0, false);
        this.balls.enableBody = true;
        this.nextFire = game.time.now;
        
        // sound
        Globals.backgroundMusic = game.add.audio('background_music');
        Globals.backgroundMusic.play(null, 0, 1, true);

		// Humans 
		for(i = 0; i < this.mobsNb; i++)
		{
			valid = false
			while (!valid) {
				x = game.world.randomX;
				y = game.world.randomY;
				valid = Math.sqrt(x*x + y*y) > 150;
			}
			var human = this.humans.create(x, y, 'human');
			human.name = 'human' + i;
			human.body.collideWorldBounds = true;
			human.body.width = 30;
			human.body.height = 50;
			human.body.bounce.setTo(0.1, 0.1);
			human.lifespan = this.rng.between(Config.MIN_MUTATE_TIME, Config.MAX_MUTATE_TIME);
			human.events.onKilled.add(this.humanMutate, this);
			human.lastmove = 0;
            
            //animations
            human.animations.add('walk-up', [9,10,9,11], 7, true);
            human.animations.add('walk-down', [0,1,0,2], 7, true);
            human.animations.add('walk-left', [3,4,3,5], 7, true);
            human.animations.add('walk-right', [6,7,6,8], 7, true);
		}
    },

    update: function () {
		game.physics.arcade.collide(this.player.sprite, this.zombies, function(player, zombie){
			this.player.damage();
		}, null, this);
		game.physics.arcade.collide(this.player.sprite, this.humans);
		game.physics.arcade.collide(this.zombies, this.humans);
		game.physics.arcade.collide(this.zombies, this.zombies);
		game.physics.arcade.collide(this.humans, this.humans);
		game.physics.arcade.collide(this.zombies, this.balls, function(zombie, ball){
            ball.kill();
            zombie.kill();
        });
		game.physics.arcade.collide(this.humans, this.balls, function(human, ball){
            ball.kill();
            human.kill();
        });
		
		this.player.update();
		
		// zombies
		this.zombies.forEach(this.gotToTarget, this, true);
		this.zombies.forEach(drawEntity, this, true);
		
		// humans
		this.humans.forEach(this.randomMove, this, true);
		this.humans.forEach(drawEntity, this, true);
		
		if (this.player.life == 0) {
			this.player.sprite.kill();
			Globals.target = null;
			this.mobSpeed = this.mobSpeed * 5;
			var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
			var text = game.add.text(game.world.centerX, game.world.centerY, "this.player undefined...\nTHE GAMEOVER\nF5 to reload", style);
			text.anchor.set(0.5);
			text.addColor('#ff0000', 24);
			text.addColor('#ffffff', 20);
			text.addColor('#ffff00', 36);
		}		
    },
	
	humanMutate : function (human) {
		var zombie = this.zombies.create(human.x, human.y, 'zombie');
		zombie.name = 'zombie' + i;
		zombie.body.collideWorldBounds = true;
		zombie.body.width = 30;
		zombie.body.height = 50;
		zombie.body.bounce.setTo(0.1, 0.1);
		zombie.lastmove = 0;
        
        //animations
        zombie.animations.add('walk-up', [9,10,9,11], 7, true);
        zombie.animations.add('walk-down', [0,1,0,2], 7, true);
        zombie.animations.add('walk-left', [3,4,3,5], 7, true);
        zombie.animations.add('walk-right', [6,7,6,8], 7, true);
	},
	
	gotToTarget: function(zombie) {
		if (Globals.target && this.game.physics.arcade.distanceBetween(zombie, Globals.target) < Config.ZOMBIE_VIEW_RADIUS) {
			game.physics.arcade.moveToObject(zombie, Globals.target, 50);
		} else {
			this.randomMove(zombie);
		}
	},
	
	randomMove: function(entity) {
		if ((game.time.now - entity.lastmove) > this.rng.between(Config.MIN_MOVE_TIME, Config.MAX_MOVE_TIME)) {
			entity.body.velocity.setTo(this.rng.between(-1, 1) * this.mobSpeed, this.rng.between(-1, 1) * this.mobSpeed);
			entity.lastmove = game.time.now;
		}
	},
    
    shoot: function(position, direction) {
        if (game.time.now > this.nextFire){
            this.nextFire = game.time.now + Config.FIRE_RATE;
            var ball = this.balls.getFirstExists(false); // get the first created fireball that no exists atm
            if (ball){
                ball.exists = true; 
                ball.lifespan = 2500;
                game.physics.enable(ball, Phaser.Physics.ARCADE);
                
                if(direction == Config.UP){  
                    ball.reset(position.x, position.y-Config.FIRE_INIT_OFFSET);
                    ball.body.velocity.x = 0;
                    ball.body.velocity.y = -Config.FIRE_SPEED;
                } else if(direction == Config.DOWN){
                    ball.reset(position.x, position.y+Config.FIRE_INIT_OFFSET);
                    ball.body.velocity.x = 0;
                    ball.body.velocity.y = Config.FIRE_SPEED;
                } else if(direction == Config.LEFT){
                    ball.reset(position.x-Config.FIRE_INIT_OFFSET, position.y);
                    ball.body.velocity.x = -Config.FIRE_SPEED;
                    ball.body.velocity.y = 0;
                } else if(direction == Config.RIGHT){
                    ball.reset(position.x+Config.FIRE_INIT_OFFSET, position.y);
                    ball.body.velocity.x = Config.FIRE_SPEED;
                    ball.body.velocity.y = 0;
                }
            }
        }
    }
}

function drawEntity(entity) {
    if(Math.abs(entity.body.velocity.x) > Math.abs(entity.body.velocity.y)) {
        if(entity.body.velocity.x > 0){
            entity.animations.play('walk-right');
        } else {
            entity.animations.play('walk-left');
        }
    } else {
        if(entity.body.velocity.y > 0){
            entity.animations.play('walk-down');
        } else {
            entity.animations.play('walk-up');
        }
    }
}

game.state.add('world', world);
game.state.start('world');
