function update () {
  playerMovement();

  // Firing?
  if (fireButton.isDown && player.alive) {
    fireBullet();
  }

  // Restart?
  if (restartButton.isDown && lives == 0) {
    restartGame();
  }

  // Handle aliens dropping bombs
  handleBombs();

  game.physics.arcade.overlap(bullets, aliens, bulletHitsAlien, null, this);
  game.physics.arcade.overlap(bombs, player, bombHitsPlayer, null, this);
}
