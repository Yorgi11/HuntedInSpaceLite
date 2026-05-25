const canvasWidth = 1920;
const canvasHeight = 1080;

const G = 30;
const numBodies = 4;
const maxBodyCount = 600;
const closeZoomTrajectoryBodyLimit = 120;
const midZoomTrajectoryBodyLimit = 60;
const farZoomTrajectoryBodyLimit = 28;
const minimumTrajectoryGravityInfluence = 0.35;
const minimumTrajectoryGravityInfluenceTransitionOffset = 0.5;
const trajectoryGravityInfluenceSmoothing = 0.04;

let player;
let planets = [];
let bodies = [];
let lasers = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  player = new Player((width * 0.5) - 375, (height * 0.5) - 375);
  cameraPosition = player.position.copy();

  planets = [
    
    new PhysicsBody(960, 540, 100, null, 20.5, {
      isStatic: true,
      color: color(168, 123, 86),
    }),
  ];

  addBodies(getConnectedBodiesFromPlanets());

  /*
  while (planets.length < numBodies) {
    const planet = createRandomSpaceBody();
    planets.push(planet);
    bodies.push(...planet.connectedBodies);
  }
  */
}

function draw() {
  background(5, 8, 16);

  const t = min(deltaTime / 1000, 0.033);
  const bodyLists = buildBodyLists();

  resetDynamicForces(bodyLists.staticGravityBodies);
  applyPlanetGravity(bodyLists.activePlanets, bodyLists.staticGravityBodies, t);
  applyDynamicGravity(bodyLists.dynamicBodies, t);
  applyPlayerGravity(bodyLists.inactivePlayerGravityBodies, t);
  updateStaticPlanets(t);
  updateDynamicBodies(bodyLists.updatableBodies, t);
  updateLasers(t);
  recordTrajectoryHistory(bodyLists.updatableBodies, t);
  removeExpiredBodies();
  removeExpiredLasers();

  const collisionLists = buildBodyLists();
  addBodies(resolveAllCollisions(collisionLists.collisionBodies, t));
  removeExpiredBodies();
  removeExpiredLasers();
  const renderLists = buildBodyLists();
  updateCamera();

  push();
  applyCameraTransform();
  drawWorld(renderLists);
  pop();
  drawHud();
}

function drawWorld(renderLists) {
  drawStarField();
  const bodyRenderBounds = getCameraWorldBounds(180 / cameraZoom);
  const trajectoryRenderBounds = getCameraWorldBounds(
    max(width, height) / cameraZoom,
  );

  for (const planet of planets) {
    if (!isBodyInRenderBounds(planet, bodyRenderBounds)) {
      continue;
    }

    planet.draw();
  }

  drawTrajectories(
    getRenderableTrajectoryBodies(
      renderLists.updatableBodies,
      trajectoryRenderBounds,
    ),
  );

  for (const body of bodies) {
    if (!isBodyInRenderBounds(body, bodyRenderBounds)) {
      continue;
    }

    body.draw();
  }

  for (const laser of lasers) {
    if (!isBodyInRenderBounds(laser, bodyRenderBounds)) {
      continue;
    }

    laser.draw();
  }

  player.draw();
}

function isBodyInRenderBounds(body, bounds) {
  const bloomRadius =
    typeof body.getBloomRadius === "function" ? body.getBloomRadius() : 0;
  const renderRadius = max(body.radius || 0, bloomRadius);

  return isCircleInBounds(
    body.position.x,
    body.position.y,
    renderRadius,
    bounds,
  );
}

function getRenderableTrajectoryBodies(updatableBodies, bounds) {
  const visibleBodies = [];

  for (const body of updatableBodies) {
    body.trajectoryAlpha = calculateTrajectoryGravityAlpha(body);

    if (
      body.trajectoryAlpha > 0 &&
      isCircleInBounds(body.position.x, body.position.y, body.radius, bounds)
    ) {
      visibleBodies.push(body);
    }
  }

  const bodyLimit = getTrajectoryBodyLimit();

  if (visibleBodies.length <= bodyLimit) {
    return visibleBodies;
  }

  return visibleBodies
    .map((body) => ({
      body,
      distanceSq:
        sq(body.position.x - cameraPosition.x) +
        sq(body.position.y - cameraPosition.y),
    }))
    .sort((a, b) => a.distanceSq - b.distanceSq)
    .slice(0, bodyLimit)
    .map((entry) => entry.body);
}

function calculateTrajectoryGravityAlpha(body) {
  const lowerBound = max(
    minimumTrajectoryGravityInfluence -
      minimumTrajectoryGravityInfluenceTransitionOffset,
    0,
  );
  const upperBound =
    minimumTrajectoryGravityInfluence +
    minimumTrajectoryGravityInfluenceTransitionOffset;
  const gravityInfluence = getSmoothedTrajectoryGravityInfluence(body);

  if (upperBound <= lowerBound) {
    return gravityInfluence >= minimumTrajectoryGravityInfluence ? 1 : 0;
  }

  return constrain(
    (gravityInfluence - lowerBound) / (upperBound - lowerBound),
    0,
    1,
  );
}

function getSmoothedTrajectoryGravityInfluence(body) {
  const currentInfluence = body.gravityAccelerationThisFrame || 0;
  const previousInfluence =
    body.smoothedTrajectoryGravityInfluence ?? currentInfluence;

  body.smoothedTrajectoryGravityInfluence = lerp(
    previousInfluence,
    currentInfluence,
    trajectoryGravityInfluenceSmoothing,
  );

  return body.smoothedTrajectoryGravityInfluence;
}

function isCircleInBounds(x, y, radius, bounds) {
  return (
    x + radius >= bounds.left &&
    x - radius <= bounds.right &&
    y + radius >= bounds.top &&
    y - radius <= bounds.bottom
  );
}

function getTrajectoryBodyLimit() {
  if (cameraZoom < 0.7) {
    return farZoomTrajectoryBodyLimit;
  }

  if (cameraZoom < 1.6) {
    return midZoomTrajectoryBodyLimit;
  }

  return closeZoomTrajectoryBodyLimit;
}

function buildBodyLists() {
  const activePlanets = [];
  const activeBodies = [];
  const inactivePlayerGravityBodies = [];

  for (const planet of planets) {
    if (!planet.isDecaying) {
      activePlanets.push(planet);
    }
  }

  for (const body of bodies) {
    if (!body.isDecaying) {
      activeBodies.push(body);
    } else {
      inactivePlayerGravityBodies.push(body);
    }
  }

  return {
    activePlanets,
    activeBodies,
    inactivePlayerGravityBodies,
    dynamicBodies: [player, ...activeBodies],
    staticGravityBodies: [player, ...bodies, ...lasers],
    updatableBodies: [player, ...bodies],
    collisionBodies: [player, ...activePlanets, ...activeBodies, ...lasers],
  };
}

function createRandomSpaceBody() {
  const radius = random(55, 130);
  return new PhysicsBody(
    random(radius, width - radius),
    random(radius, height - radius),
    radius,
    null,
    random(1.2, 6.2),
    {
      isStatic: true,
      color: color(random(100, 200), random(100, 200), random(100, 200)),
    },
  );
}

function getConnectedBodiesFromPlanets() {
  const connectedBodies = [];

  for (const planet of planets) {
    connectedBodies.push(...planet.connectedBodies);
  }

  return connectedBodies;
}

function addBodies(newBodies) {
  if (!newBodies || newBodies.length <= 0) {
    return;
  }

  const availableSlots = maxBodyCount - bodies.length;

  if (availableSlots <= 0) {
    return;
  }

  bodies.push(...newBodies.slice(0, availableSlots));
}

function hasBodyCapacity() {
  return bodies.length < maxBodyCount;
}

function resetDynamicForces(dynamicBodies) {
  for (const body of dynamicBodies) {
    body.resetForces();
  }
}

function applyPlanetGravity(activePlanets, dynamicBodies, t) {
  for (const planet of activePlanets) {
    for (const body of dynamicBodies) {
      planet.attractBody(body, t);
    }
  }
}

function applyDynamicGravity(dynamicBodies, t) {
  for (let i = 0; i < dynamicBodies.length; i++) {
    for (let j = i + 1; j < dynamicBodies.length; j++) {
      applyMutualGravity(dynamicBodies[i], dynamicBodies[j], t);
    }
  }
}

function applyPlayerGravity(gravityBodies, t) {
  for (const body of gravityBodies) {
    applyGravityFromBodyToPlayer(body, t);
  }
}

function applyGravityFromBodyToPlayer(body, t) {
  if (!body || body === player || body.isLaser || body.mass <= 0) {
    return;
  }

  const dx = body.position.x - player.position.x;
  const dy = body.position.y - player.position.y;
  const rawDistance = sqrt(dx * dx + dy * dy);

  if (rawDistance <= 0) {
    return;
  }

  const distance = max(
    rawDistance,
    player.radius + body.radius + gravitationalSoftening,
  );
  const acceleration = (G * body.mass) / (distance * distance);

  player.acceleration.x += (dx / rawDistance) * acceleration;
  player.acceleration.y += (dy / rawDistance) * acceleration;
  addGravityAcceleration(player, acceleration);
}

function applyMutualGravity(bodyA, bodyB, t) {
  const dx = bodyB.position.x - bodyA.position.x;
  const dy = bodyB.position.y - bodyA.position.y;
  const rawDistance = sqrt(dx * dx + dy * dy);

  if (rawDistance <= 0) {
    return;
  }

  const distance = max(
    rawDistance,
    bodyA.radius + bodyB.radius + gravitationalSoftening,
  );
  const directionX = dx / rawDistance;
  const directionY = dy / rawDistance;
  const accelerationA = (G * bodyB.mass) / (distance * distance);
  const accelerationB = (G * bodyA.mass) / (distance * distance);

  if (!bodyA.isStatic) {
    bodyA.acceleration.x += directionX * accelerationA;
    bodyA.acceleration.y += directionY * accelerationA;
    addGravityAcceleration(bodyA, accelerationA);
    applyGravityAlignmentTorque(bodyA, bodyB.position, accelerationA, t);
    addGravitationalHeat(bodyB, bodyA, accelerationA, distance, t);
  }

  if (!bodyB.isStatic) {
    bodyB.acceleration.x -= directionX * accelerationB;
    bodyB.acceleration.y -= directionY * accelerationB;
    addGravityAcceleration(bodyB, accelerationB);
    applyGravityAlignmentTorque(bodyB, bodyA.position, accelerationB, t);
    addGravitationalHeat(bodyA, bodyB, accelerationB, distance, t);
  }
}

function updateDynamicBodies(dynamicBodies, t) {
  for (const body of dynamicBodies) {
    const fragments = body.update(t);

    if (fragments && fragments.length > 0) {
      addBodies(fragments);
    }
  }
}

function updateLasers(t) {
  for (const laser of lasers) {
    laser.update(t);
  }
}

function removeExpiredLasers() {
  lasers = lasers.filter((laser) => !laser.isExpired);
}

function keyPressed() {
  if (keyCode !== 32 && key !== " ") {
    return;
  }

  const laser = player.fireLaser();

  if (laser) {
    lasers.push(laser);
  }
}

function updateStaticPlanets(t) {
  for (const planet of planets) {
    const fragments = planet.update(t);

    if (fragments.length > 0) {
      addBodies(fragments);
    }
  }
}

function removeExpiredBodies() {
  const remainingBodies = [];

  for (const body of bodies) {
    if (body.isExpired()) {
      distributeExpiredBodyHeat(body);
    } else {
      remainingBodies.push(body);
    }
  }

  bodies = remainingBodies;
  planets = planets.filter((planet) => {
    if (planet.isExpired()) {
      distributeExpiredBodyHeat(planet);
      return false;
    }

    return true;
  });
}

function distributeExpiredBodyHeat(expiredBody) {
  const heatEnergy =
    expiredBody.decayStoredHeatEnergy ||
    expiredBody.getKineticEnergy() * decayKineticHeatTransferScale +
      expiredBody.heatEnergy * decayHeatTransferScale;
  const heatReceivers = findRadiativeHeatReceivers(expiredBody);

  if (heatReceivers.length <= 0 || heatEnergy <= 0) {
    return;
  }

  const heatShare = heatEnergy / heatReceivers.length;

  for (const body of heatReceivers) {
    body.addHeatEnergy(heatShare);
  }
}

function findRadiativeHeatReceivers(sourceBody) {
  const radiativeRadius = sourceBody.fullRadius * 3;
  const radiativeRadiusSq = radiativeRadius * radiativeRadius;

  return [...planets, ...bodies]
    .filter((body) => body !== sourceBody && !body.isExpired())
    .filter((body) => {
      const dx = body.position.x - sourceBody.position.x;
      const dy = body.position.y - sourceBody.position.y;
      return dx * dx + dy * dy <= radiativeRadiusSq;
    });
}

function resolveAllCollisions(collisionBodies, t) {
  const fragments = [];

  for (let i = 0; i < collisionBodies.length; i++) {
    for (let j = i + 1; j < collisionBodies.length; j++) {
      fragments.push(
        ...resolveCollision(collisionBodies[i], collisionBodies[j], t),
      );
    }
  }

  return fragments;
}

window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
