var game = new Phaser.Game(1024, 576, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload () {
  game.load.image('ship', 'images/ship.png');
  game.load.image('bullet', 'images/bullet.png');
  game.load.image('alien', 'images/alien.png');
  game.load.image('bomb', 'images/bomb.png');
  game.load.spritesheet('explosion', 'images/explosion.png', 80, 80);
}

var bulletTime = 0,
    initialPlayerPosition = 512;
    lives = 3,
    score = 0;

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // Initialize player
  player = game.add.sprite(initialPlayerPosition, 540, 'ship');
  player.anchor.setTo(0.5, 0.5);
  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.bounce.x = 0.5;
  player.body.collideWorldBounds = true;

  // Initialize bullets
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(3, 'bullet');
  bullets.setAll('anchor.x', 0.5);
  bullets.setAll('anchor.y', 1);
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);

  // Initialize aliens
  aliens = game.add.group();
  aliens.enableBody = true;
  aliens.physicsBodyType = Phaser.Physics.ARCADE;

  createAliens();

  // Initialize bombs
  bombs = game.add.group();
  bombs.enableBody = true;
  bombs.physicsBodyType = Phaser.Physics.ARCADE;
  bombs.createMultiple(10, 'bomb');
  bombs.setAll('anchor.x', 0.5);
  bombs.setAll('anchor.y', 0.5);
  bombs.setAll('checkWorldBounds', true);
  bombs.setAll('outOfBoundsKill', true);

  // Initialize explosions
  explosions = game.add.group();
  explosions.createMultiple(10, 'explosion');
  explosions.setAll('anchor.x', 0.5);
  explosions.setAll('anchor.y', 0.5);
  explosions.forEach(setupExplosion, this);

  // Text bits
  var style = { font: "32px silkscreen", fill: "#666666", align: "right" };
  livesText = game.add.text(game.world.bounds.width - 16, 16, "LIVES: " + lives, style);
  livesText.anchor.set(1, 0);

  scoreText = game.add.text(16, 16, "SCORE: " + score, style);
  scoreText.anchor.set(0, 0);

  // Setup controls
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function setupExplosion (explosion) {
  explosion.animations.add('explode');
}

function update () {
  playerMovement();

  // Firing?
  if (fireButton.isDown && player.alive) {
    fireBullet();
  }

  // Handle aliens dropping bombs
  handleBombs();

  game.physics.arcade.overlap(bullets, aliens, bulletHitsAlien, null, this);
  game.physics.arcade.overlap(bombs, player, bombHitsPlayer, null, this);
}

function playerMovement () {
  var maxVelocity = 500;

  if (cursors.left.isDown && player.body.velocity.x > -maxVelocity) {
    // Move to the left
    player.body.velocity.x -= 20;
  }
  else if (cursors.right.isDown && player.body.velocity.x < maxVelocity) {
    // Move to the right
    player.body.velocity.x += 20;
  }
  else {
    // Slow down
    if (player.body.velocity.x > 0) {
      player.body.velocity.x -= 4;
    }
    else if (player.body.velocity.x < 0) {
      player.body.velocity.x += 4;
    }
  }
}

function fireBullet () {
  if (game.time.now > bulletTime) {
    bullet = bullets.getFirstExists(false);

    if (bullet) {
      // And fire it
      bullet.reset(player.x, player.y - 16);
      bullet.body.velocity.y = -400;
      bullet.body.velocity.x = player.body.velocity.x / 4
      bulletTime = game.time.now + 500;
    }
  }
}

function bulletHitsAlien (bullet, alien) {
  bullet.kill();
  explode(alien);
  score += 10;
  updateScoreText();
}

function bombHitsPlayer (bomb, player) {
  bomb.kill();
  explode(player);
  lives -= 1;
  updateLivesText();
  if (lives > 0) {
    respawnPlayer();
  }
  else {
    gameOver();
  }
}

function explode (entity) {
  entity.kill();

  // And create an explosion :)
  var explosion = explosions.getFirstExists(false);
  explosion.reset(entity.body.x + (entity.width / 2), entity.body.y + (entity.height / 2));
  explosion.play('explode', 30, false, true);
}

function updateLivesText () {
  livesText.text = "LIVES: " + lives;
}

function updateScoreText () {
  scoreText.text = "SCORE: " + score;
}

function respawnPlayer () {
  player.body.x = initialPlayerPosition;
  setTimeout(function() {
    player.revive();
  }, 1000);
}

function gameOver () {
  var style = { font: "bold 32px silkscreen", fill: "#ffffff", align: "center" };
  livesText = game.add.text(game.world.centerX, game.world.centerY, "GAME OVER", style);
  livesText.anchor.set(0.5, 0.5);
}

function createAliens () {
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 10; x++) {
      var alien = aliens.create(x * 72, y * 48, 'alien');
      alien.anchor.setTo(0.5, 0.5);
      alien.body.moves = false;
    }
  }

  aliens.x = 64;
  aliens.y = 96;

  // All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
  var tween = game.add.tween(aliens).to( { x: 300 }, 2500, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);

  // When the tween loops it calls descend
  tween.onLoop.add(descend, this);
}

function handleBombs () {
  aliens.forEachAlive(function (alien) {
    chanceOfDroppingBomb = game.rnd.integerInRange(0, 20 * aliens.countLiving());
    if (chanceOfDroppingBomb == 0) {
      dropBomb(alien);
    }
  }, this)
}

function dropBomb (alien) {
  bomb = bombs.getFirstExists(false);

  if (bomb && player.alive) {

    // And drop it
    bomb.reset(alien.x + aliens.x, alien.y + aliens.y + 16);
    bomb.body.velocity.y = +100;
    bomb.body.gravity.y = 250
  }
}

function descend () {
  if (player.alive) {
    aliens.y += 8;
  }
}
