const minCameraZoom = 0.25;
const maxCameraZoom = 5;
const cameraZoomStep = 1.12;

let cameraZoom = 1;
let cameraPosition;

function updateCamera() {
  cameraPosition.set(player.position);
}

function applyCameraTransform() {
  translate(width * 0.5, height * 0.5);
  scale(cameraZoom);
  translate(-cameraPosition.x, -cameraPosition.y);
}

function getCameraWorldBounds(padding = 0) {
  const halfWidth = width / (cameraZoom * 2);
  const halfHeight = height / (cameraZoom * 2);

  return {
    left: cameraPosition.x - halfWidth - padding,
    right: cameraPosition.x + halfWidth + padding,
    top: cameraPosition.y - halfHeight - padding,
    bottom: cameraPosition.y + halfHeight + padding,
  };
}

function isWorldCircleVisible(x, y, radius, padding = 0) {
  const bounds = getCameraWorldBounds(padding);

  return (
    x + radius >= bounds.left &&
    x - radius <= bounds.right &&
    y + radius >= bounds.top &&
    y - radius <= bounds.bottom
  );
}

function mouseWheel(event) {
  const zoomMultiplier = event.delta < 0 ? cameraZoomStep : 1 / cameraZoomStep;
  cameraZoom = constrain(
    cameraZoom * zoomMultiplier,
    minCameraZoom,
    maxCameraZoom,
  );

  return false;
}
