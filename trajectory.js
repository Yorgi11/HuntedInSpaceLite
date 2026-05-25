const trajectoryHistorySeconds = 2;
const trajectoryPredictionSeconds = 2;
const trajectoryPredictionStep = 0.05;
const farZoomTrajectoryPredictionStep = 0.16;
const midZoomTrajectoryPredictionStep = 0.1;
const trajectoryHistoryMinDistance = 3;
const trajectoryHistoryColor = [120, 170, 255, 25];
const trajectoryPredictionColor = [255, 255, 255, 10];
const trajectoryPredictionCollisionColor = [255, 90, 70, 25];
const trajectoryHistoryThickness = 6;
const trajectoryHistoryMinThickness = 0.5;
const trajectoryPredictionThickness = 4;
const trajectoryPredictionCollisionRadiusScale = 1.0;
const trajectoryPredictionSmoothing = 0.22;
const trajectoryPredictionCollisionSmoothing = 0.18;

function recordTrajectoryHistory(dynamicBodies, t) {
  for (const body of dynamicBodies) {
    if (body.isStatic || body.isDecaying) {
      continue;
    }

    if (!body.trajectoryHistory) {
      body.trajectoryHistory = [];
    }

    body.trajectoryAge = (body.trajectoryAge || 0) + t;

    const lastPoint = body.trajectoryHistory[body.trajectoryHistory.length - 1];
    const shouldRecord =
      !lastPoint ||
      dist(lastPoint.x, lastPoint.y, body.position.x, body.position.y) >=
        trajectoryHistoryMinDistance;

    if (shouldRecord) {
      body.trajectoryHistory.push({
        x: body.position.x,
        y: body.position.y,
        age: body.trajectoryAge,
      });
    }

    const cutoffAge = body.trajectoryAge - trajectoryHistorySeconds;

    while (
      body.trajectoryHistory.length > 0 &&
      body.trajectoryHistory[0].age < cutoffAge
    ) {
      body.trajectoryHistory.shift();
    }
  }
}

function drawTrajectories(dynamicBodies) {
  const predictedBodies = dynamicBodies.filter(
    (body) => !body.isStatic && !body.isDecaying,
  );
  const staticObstacles = planets.filter((planet) => !planet.isDecaying);
  const previousPredictionPathMap =
    buildPreviousPredictionPathMap(predictedBodies);
  const trajectoryObstacles = [...staticObstacles, ...predictedBodies];

  for (const body of predictedBodies) {
    drawTrajectoryHistory(body);
    drawPredictedTrajectory(
      body,
      trajectoryObstacles,
      previousPredictionPathMap,
    );
  }
}

function buildPreviousPredictionPathMap(predictedBodies) {
  const predictionPathMap = new Map();

  for (const body of predictedBodies) {
    if (body.predictedTrajectory && body.predictedTrajectory.length > 0) {
      predictionPathMap.set(body, body.predictedTrajectory);
    }
  }

  return predictionPathMap;
}

function drawTrajectoryHistory(body) {
  if (!body.trajectoryHistory || body.trajectoryHistory.length < 2) {
    return;
  }

  const [r, g, b, a] = trajectoryHistoryColor;
  const trajectoryAlpha = body.trajectoryAlpha ?? 1;
  const pointStride = getTrajectoryHistoryStride();

  for (let i = pointStride; i < body.trajectoryHistory.length; i += pointStride) {
    const previousPoint = body.trajectoryHistory[i - pointStride];
    const point = body.trajectoryHistory[i];
    const ageRatio = i / (body.trajectoryHistory.length - 1);
    const thickness = lerp(
      trajectoryHistoryMinThickness,
      trajectoryHistoryThickness,
      ageRatio,
    );

    stroke(r, g, b, a * ageRatio * trajectoryAlpha);
    strokeWeight(thickness);
    line(previousPoint.x, previousPoint.y, point.x, point.y);
  }
}

function drawPredictedTrajectory(body, trajectoryObstacles, predictionPathMap) {
  const predictedPoints = predictTrajectory(
    body,
    trajectoryObstacles,
    predictionPathMap,
  );
  const displayPoints = smoothPredictedTrajectory(body, predictedPoints);
  body.rawPredictedTrajectory = predictedPoints;
  body.predictedTrajectory = displayPoints;

  if (displayPoints.length < 2) {
    return;
  }

  const trajectoryAlpha = body.trajectoryAlpha ?? 1;

  for (let i = 1; i < displayPoints.length; i++) {
    const previousPoint = displayPoints[i - 1];
    const point = displayPoints[i];
    const [r, g, b, a] = point.hasCollided
      ? trajectoryPredictionCollisionColor
      : trajectoryPredictionColor;

    stroke(r, g, b, a * trajectoryAlpha);
    strokeWeight(trajectoryPredictionThickness);
    line(previousPoint.x, previousPoint.y, point.x, point.y);
  }
}

function smoothPredictedTrajectory(body, predictedPoints) {
  const previousPoints = body.displayedPredictedTrajectory;
  const targetCollisionIndex = getFirstCollisionIndex(predictedPoints);

  if (!previousPoints || previousPoints.length !== predictedPoints.length) {
    body.displayedPredictionCollisionIndex = targetCollisionIndex;
    body.displayedPredictedTrajectory = predictedPoints.map((point) => ({
      x: point.x,
      y: point.y,
      hasCollided: point.hasCollided,
    }));
    return body.displayedPredictedTrajectory;
  }

  const previousCollisionIndex =
    body.displayedPredictionCollisionIndex ?? targetCollisionIndex;
  const collisionIndex = lerp(
    previousCollisionIndex,
    targetCollisionIndex,
    trajectoryPredictionCollisionSmoothing,
  );
  const smoothedPoints = [];

  body.displayedPredictionCollisionIndex = collisionIndex;

  for (let i = 0; i < predictedPoints.length; i++) {
    const point = predictedPoints[i];
    const previousPoint = previousPoints[i];

    smoothedPoints.push({
      x:
        i === 0
          ? point.x
          : lerp(previousPoint.x, point.x, trajectoryPredictionSmoothing),
      y:
        i === 0
          ? point.y
          : lerp(previousPoint.y, point.y, trajectoryPredictionSmoothing),
      hasCollided:
        i >= collisionIndex && collisionIndex < predictedPoints.length,
    });
  }

  body.displayedPredictedTrajectory = smoothedPoints;
  return smoothedPoints;
}

function getFirstCollisionIndex(predictedPoints) {
  for (let i = 0; i < predictedPoints.length; i++) {
    if (predictedPoints[i].hasCollided) {
      return i;
    }
  }

  return predictedPoints.length;
}

function predictTrajectory(body, trajectoryObstacles, predictionPathMap) {
  const points = [];
  const position = body.position.copy();
  const velocity = body.velocity.copy();
  const predictionStep = getTrajectoryPredictionStep();
  const steps = floor(trajectoryPredictionSeconds / predictionStep);
  let hasCollided = false;

  points.push({ x: position.x, y: position.y, hasCollided });

  for (let i = 0; i < steps; i++) {
    const acceleration = calculateStaticGravityAcceleration(
      position,
      body.radius,
    );

    velocity.add(p5.Vector.mult(acceleration, predictionStep));
    position.add(p5.Vector.mult(velocity, predictionStep));
    hasCollided =
      resolvePredictedTrajectoryCollisions(
        body,
        position,
        velocity,
        trajectoryObstacles,
        predictionPathMap,
        i + 1,
        predictionStep,
      ) || hasCollided;
    points.push({ x: position.x, y: position.y, hasCollided });
  }

  return points;
}

function resolvePredictedTrajectoryCollisions(
  body,
  position,
  velocity,
  trajectoryObstacles,
  predictionPathMap,
  stepIndex,
  predictionStep,
) {
  let hasCollided = false;

  for (const obstacle of trajectoryObstacles) {
    if (obstacle === body || obstacle.isDecaying) {
      continue;
    }

    const obstacleState = getPredictedObstacleState(
        obstacle,
        predictionPathMap,
        stepIndex,
        predictionStep,
      );
    const dx = position.x - obstacleState.x;
    const dy = position.y - obstacleState.y;
    const distanceSq = dx * dx + dy * dy;
    const minimumDistance =
      (body.radius + obstacle.radius) *
      trajectoryPredictionCollisionRadiusScale;

    if (distanceSq >= minimumDistance * minimumDistance) {
      continue;
    }

    const distance = sqrt(distanceSq) || 1;
    const normalX = dx / distance;
    const normalY = dy / distance;
    const relativeVelocityX = velocity.x - obstacleState.vx;
    const relativeVelocityY = velocity.y - obstacleState.vy;
    const velocityAlongNormal =
      relativeVelocityX * normalX + relativeVelocityY * normalY;

    if (velocityAlongNormal >= 0) {
      continue;
    }

    position.x = obstacleState.x + normalX * minimumDistance;
    position.y = obstacleState.y + normalY * minimumDistance;
    hasCollided = true;

    const restitution = min(
      body.restitution ?? 0.45,
      obstacle.restitution ?? 0.45,
    );
    const inverseMassBody = getPredictedInverseMass(body);
    const inverseMassObstacle = getPredictedInverseMass(obstacle);
    const inverseMassTotal = inverseMassBody + inverseMassObstacle;

    if (inverseMassTotal <= 0) {
      continue;
    }

    const impulseMagnitude =
      (-(1 + restitution) * velocityAlongNormal) / inverseMassTotal;
    velocity.x += normalX * impulseMagnitude * inverseMassBody;
    velocity.y += normalY * impulseMagnitude * inverseMassBody;
  }

  return hasCollided;
}

function getPredictedInverseMass(body) {
  if (body.isStatic || body.mass <= 0) {
    return 0;
  }

  return 1 / body.mass;
}

function getPredictedObstacleState(
  obstacle,
  predictionPathMap,
  stepIndex,
  predictionStep = trajectoryPredictionStep,
) {
  if (obstacle.isStatic) {
    return {
      x: obstacle.position.x,
      y: obstacle.position.y,
      vx: 0,
      vy: 0,
    };
  }

  const predictedPath = predictionPathMap?.get(obstacle);

  if (!predictedPath || predictedPath.length <= 0) {
    return {
      x: obstacle.position.x,
      y: obstacle.position.y,
      vx: obstacle.velocity.x,
      vy: obstacle.velocity.y,
    };
  }

  const pointIndex = constrain(stepIndex, 0, predictedPath.length - 1);
  const point = predictedPath[pointIndex];
  const previousPoint = predictedPath[max(pointIndex - 1, 0)];

  return {
    x: point.x,
    y: point.y,
    vx: (point.x - previousPoint.x) / predictionStep,
    vy: (point.y - previousPoint.y) / predictionStep,
  };
}

function getTrajectoryPredictionStep() {
  if (cameraZoom < 0.7) {
    return farZoomTrajectoryPredictionStep;
  }

  if (cameraZoom < 1.6) {
    return midZoomTrajectoryPredictionStep;
  }

  return trajectoryPredictionStep;
}

function getTrajectoryHistoryStride() {
  if (cameraZoom < 0.7) {
    return 4;
  }

  if (cameraZoom < 1.6) {
    return 2;
  }

  return 1;
}

function calculateStaticGravityAcceleration(position, radius) {
  const acceleration = createVector(0, 0);

  for (const planet of planets) {
    if (planet.isDecaying) {
      continue;
    }

    const dx = planet.position.x - position.x;
    const dy = planet.position.y - position.y;
    const rawDistance = sqrt(dx * dx + dy * dy);

    if (rawDistance <= 0 || rawDistance >= planet.attractionRadius) {
      continue;
    }

    const distance = constrain(
      rawDistance,
      planet.radius + radius,
      planet.attractionRadius,
    );
    const accelerationMagnitude =
      (G * planet.mass) / (distance * distance + gravitationalSoftening);

    acceleration.x += (dx / rawDistance) * accelerationMagnitude;
    acceleration.y += (dy / rawDistance) * accelerationMagnitude;
  }

  return acceleration;
}

