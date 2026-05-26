const directionLockButtons = [
  { id: "toggle", label: "Assist", width: 64 },
  { id: "move", label: "Move", width: 62 },
  { id: "reverseMove", label: "Reverse", width: 82 },
  { id: "gravity", label: "Gravity", width: 78 },
  { id: "antiGravity", label: "Away", width: 62 },
];
const directionLockButtonX = 16;
const directionLockButtonY = 90;
const directionLockButtonHeight = 28;
const directionLockButtonGap = 8;

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

  drawDirectionLockButtons();
}

function drawDirectionLockButtons() {
  let x = directionLockButtonX;

  push();
  textSize(13);
  textAlign(CENTER, CENTER);

  for (const button of directionLockButtons) {
    const isToggle = button.id === "toggle";
    const isActive = isToggle
      ? player.directionLockEnabled
      : player.directionLockEnabled && player.directionLockMode === button.id;

    stroke(120, 180, 255, isActive ? 230 : 120);
    strokeWeight(1);
    fill(isActive ? color(45, 105, 175, 220) : color(12, 24, 40, 190));
    rect(
      x,
      directionLockButtonY,
      button.width,
      directionLockButtonHeight,
      4,
    );
    noStroke();
    fill(235);
    text(
      button.label,
      x + button.width * 0.5,
      directionLockButtonY + directionLockButtonHeight * 0.5,
    );

    x += button.width + directionLockButtonGap;
  }

  pop();
}

function handleHudMousePressed() {
  let x = directionLockButtonX;

  for (const button of directionLockButtons) {
    if (
      mouseX >= x &&
      mouseX <= x + button.width &&
      mouseY >= directionLockButtonY &&
      mouseY <= directionLockButtonY + directionLockButtonHeight
    ) {
      handleDirectionLockButton(button.id);
      return true;
    }

    x += button.width + directionLockButtonGap;
  }

  return false;
}

function handleDirectionLockButton(buttonId) {
  if (buttonId === "toggle") {
    player.setDirectionLockEnabled(!player.directionLockEnabled);
    return;
  }

  player.setDirectionLockMode(buttonId);
}

