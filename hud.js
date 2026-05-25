function drawHud() {
  const currentVelocity = player.velocity.mag();
  const currentMaxPropelledVelocity =
    player.getCurrentMaxSelfPropelledVelocity();

  push();
  noStroke();
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Fps: ${frameRate().toFixed(1)}`, 16, 16);
  text(`Velocity: ${currentVelocity.toFixed(1)}`, 16, 38);
  text(`Max propelled: ${currentMaxPropelledVelocity.toFixed(1)}`, 16, 60);
  pop();
}

