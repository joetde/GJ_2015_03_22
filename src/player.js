var Player = function(world) {
    this.world = world;
    
    //init
    this.sprite = game.add.sprite(0, 0, 'medic_simple');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    //animations
    this.sprite.animations.add('walk-up', [0], 10, true);
    this.sprite.animations.add('walk-down', [0], 10, true);
    this.sprite.animations.add('walk-left', [0], 10, true);
    this.sprite.animations.add('walk-right', [0], 10, true);
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
        } else {
            this.sprite.animations.play('walk-up');
        }
    }
    else if(this.sprite.body.velocity.x !== 0) {
        if(this.sprite.body.velocity.x > 0){
            this.sprite.animations.play('walk-right');
        } else {
            this.sprite.animations.play('walk-left');
        }
    }
}
