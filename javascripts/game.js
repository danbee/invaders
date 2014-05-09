var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

function preload () {
  cursors = game.input.keyboard.createCursorKeys();

  game.load.image('ship', '/images/ship.png');
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(640, 675, 'ship');
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.bounce.x = 0.5;
  player.body.collideWorldBounds = true;
}

function update () {
  playerMovement();
}

function playerMovement () {
  var maxVelocity = 600;

  if (cursors.left.isDown && player.body.velocity.x > -maxVelocity) {
    // Move to the left
    player.body.velocity.x -= 25;
  }
  else if (cursors.right.isDown && player.body.velocity.x < maxVelocity) {
    // Move to the right
    player.body.velocity.x += 25;
  }
  else {
    // Slow down
    if (player.body.velocity.x > 0) {
      player.body.velocity.x -= 5;
    }
    else if (player.body.velocity.x < 0) {
      player.body.velocity.x += 5;
    }
  }
}
