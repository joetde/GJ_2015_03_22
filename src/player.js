var Player = function(world) {
    this.world = world;
    this.sprite = game.add.sprite(0, 0, 'temp');
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
}

Player.prototype.update =  function () {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    for (direction = 0; direction < 4; direction++) {
        if (game.input.keyboard.isDown(Config.KEYS[direction])) {
            Config.COORMAP[direction][0] ? this.sprite.body.velocity.x = Config.COORMAP[direction][0] * Config.SPEED : 0;
            Config.COORMAP[direction][1] ? this.sprite.body.velocity.y = Config.COORMAP[direction][1] * Config.SPEED : 0;
        }
    }
}
