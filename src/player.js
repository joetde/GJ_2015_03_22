var Player = function(world) {
    this.world = world;

    //init
    this.sprite = game.add.sprite(0, 0, 'medic_simple');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.bounce.setTo(0.1, 0.1);
	this.sprite.body.collideWorldBounds = true;
	this.life = Config.PLAYER_LIFE;
	this.invulnerabilityEndTime = 0;
    
    //animations4
    this.sprite.animations.add('walk-up', [12,13,15,14], 7, true);
    this.sprite.animations.add('walk-down', [0,1,2,3], 7, true);
    this.sprite.animations.add('walk-left', [4,5,6,7], 7, true);
    this.sprite.animations.add('walk-right', [8,9,11,10], 7, true);
    this.sprite.animations.add('idle-up', [12], 0, false);
    this.sprite.animations.add('idle-down', [0], 0, false);
    this.sprite.animations.add('idle-left', [4], 0, false);
    this.sprite.animations.add('idle-right', [9], 0, false);
    
    this.direction = Config.DOWN;
}

Player.prototype.damage = function () {
	if (this.invulnerabilityEndTime < game.time.now) {
		this.life = this.life - 1;
		this.invulnerabilityEndTime = game.time.now + Config.INVULNERABILITY_TIME;
	}
}

Player.prototype.update =  function () {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    for (direction = 0; direction < 4; direction++) {
        if (game.input.keyboard.isDown(Config.KEYS[direction])) {
            //compute velocity
            Config.COORMAP[direction][0] ? this.sprite.body.velocity.x = Config.COORMAP[direction][0] * Config.SPEED : 0;
            Config.COORMAP[direction][1] ? this.sprite.body.velocity.y = Config.COORMAP[direction][1] * Config.SPEED : 0;
        }
    }
    
    //compute tile
    //up and down sprites get the priority on left and right
    if(this.sprite.body.velocity.y !== 0) {
        if(this.sprite.body.velocity.y > 0){
            this.sprite.animations.play('walk-down');
            this.direction = Config.DOWN;
        } else {
            this.sprite.animations.play('walk-up');
            this.direction = Config.UP;
        }
    }
    else if(this.sprite.body.velocity.x !== 0) {
        if(this.sprite.body.velocity.x > 0){
            this.sprite.animations.play('walk-right');
            this.direction = Config.RIGHT;
        } else {
            this.sprite.animations.play('walk-left');
            this.direction = Config.LEFT;
        }
    } else {
        //idle
        if(this.direction == Config.UP){  
            this.sprite.animations.play('idle-up');
        } else if(this.direction == Config.DOWN){
            this.sprite.animations.play('idle-down');
        } else if(this.direction == Config.LEFT){
            this.sprite.animations.play('idle-left');
        } else if(this.direction == Config.RIGHT){
            this.sprite.animations.play('idle-right');
        }

    }
    
    if (game.input.keyboard.isDown(Config.SHOOT)) {
        this.world.shoot(new Phaser.Point(this.sprite.x, this.sprite.y), this.direction)
    }
}
