function preload () {
  game.load.image('ship', 'images/ship.png');
  game.load.image('bullet', 'images/bullet.png');
  game.load.image('alien', 'images/alien.png');
  game.load.image('bomb', 'images/bomb.png');
  game.load.spritesheet('explosion', 'images/explosion.png', 80, 80);

  game.load.audio('shoot', 'sounds/shoot.wav');
  game.load.audio('explode', 'sounds/explode.wav');
  game.load.audio('bomb', 'sounds/bomb.wav');
}
