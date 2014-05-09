var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload () {
  game.load.image('ship', '/images/ship.png');
  game.load.image('bullet', '/images/bullet.png');
}

var bulletTime = 0;

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  player = game.add.sprite(640, 675, 'ship');
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.bounce.x = 0.5;
  player.body.collideWorldBounds = true;

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  // Setup controls
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update () {
  playerMovement();

  //  Firing?
  if (fireButton.isDown) {
    fireBullet();
  }

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

function fireBullet () {
  if (game.time.now > bulletTime) {
    var bullet = bullets.create(player.body.x + (player.body.width / 2) - 2, 645, 'bullet');
    bullet.body.velocity.y = -500;
    bullet.body.velocity.x = player.body.velocity.x / 4;
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
    // Destroy the bullet when it is killed.
    bullet.events.onKilled.add(function() { this.destroy(); }, bullet)
    bulletTime = game.time.now + 200;
  }

}
