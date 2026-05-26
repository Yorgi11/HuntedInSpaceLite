class Player {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.angle = -HALF_PI;
    this.radius = 4;
    this.mass = 15;
    this.isStatic = false;
    this.restitution = 0.35;
    this.turnSpeed = 2.25;
    this.thrustPower = 2000;
    this.maxSelfPropelledVelocity = 100;
    this.gravityVelocityRatio = 0.25;
    this.gravityAccelerationThisFrame = 0;
    this.directionChangeAccelerationScale = 0.05;
    this.drag = 1.0;
    this.laserCooldownTimer = 0;
    this.directionLockEnabled = false;
    this.directionLockMode = "move";
    this.gravityDirectionThisFrame = createVector(0, 0);
  }

  resetForces() {
    this.acceleration.set(0, 0);
    this.gravityAccelerationThisFrame = 0;
    this.gravityDirectionThisFrame.set(0, 0);
  }

  addGravityAcceleration(amount, directionX = 0, directionY = 0) {
    this.gravityAccelerationThisFrame += amount;

    if (amount > 0) {
      this.gravityDirectionThisFrame.x += directionX * amount;
      this.gravityDirectionThisFrame.y += directionY * amount;
    }
  }

  handleInput(t) {
    const turningLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65) || keyIsDown(97);
    const turningRight =
      keyIsDown(RIGHT_ARROW) || keyIsDown(68) || keyIsDown(100);

    if (turningLeft) {
      this.angle -= this.turnSpeed * t;
    }

    if (turningRight) {
      this.angle += this.turnSpeed * t;
    }

    if (this.directionLockEnabled && !turningLeft && !turningRight) {
      this.steerTowardDirectionLock(t);
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(119)) {
      this.applyThrust(1);
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83) || keyIsDown(115)) {
      this.applyThrust(-0.2);
    }
  }

  setDirectionLockEnabled(isEnabled) {
    this.directionLockEnabled = isEnabled;
  }

  setDirectionLockMode(mode) {
    this.directionLockMode = mode;
    this.directionLockEnabled = true;
  }

  steerTowardDirectionLock(t) {
    const targetAngle = this.getDirectionLockAngle();

    if (targetAngle === null) {
      return;
    }

    this.angle = this.steerAngleToward(this.angle, targetAngle, this.turnSpeed * t);
  }

  steerAngleToward(currentAngle, targetAngle, maxTurn) {
    const angleDelta = Math.atan2(
      sin(targetAngle - currentAngle),
      cos(targetAngle - currentAngle),
    );

    if (Math.abs(angleDelta) <= maxTurn) {
      return targetAngle;
    }

    return currentAngle + Math.sign(angleDelta) * maxTurn;
  }

  getDirectionLockAngle() {
    if (this.directionLockMode === "move") {
      return this.getVelocityDirectionAngle(0);
    }

    if (this.directionLockMode === "reverseMove") {
      return this.getVelocityDirectionAngle(PI);
    }

    if (this.directionLockMode === "gravity") {
      return this.getGravityDirectionAngle(0);
    }

    if (this.directionLockMode === "antiGravity") {
      return this.getGravityDirectionAngle(PI);
    }

    return null;
  }

  getVelocityDirectionAngle(offset) {
    if (this.velocity.magSq() <= 0.01) {
      return null;
    }

    return this.velocity.heading() + offset;
  }

  getGravityDirectionAngle(offset) {
    if (this.gravityDirectionThisFrame.magSq() <= 0.000001) {
      return null;
    }

    return this.gravityDirectionThisFrame.heading() + offset;
  }

  applyThrust(thrustScale = 1) {
    const thrustDirection = p5.Vector.fromAngle(this.angle).mult(
      thrustScale < 0 ? -1 : 1,
    );
    const currentMaxSelfPropelledVelocity =
      this.getCurrentMaxSelfPropelledVelocity();
    const forwardVelocity = this.velocity.dot(thrustDirection);
    const lateralVelocity = p5.Vector.sub(
      this.velocity,
      p5.Vector.mult(thrustDirection, forwardVelocity),
    ).mag();
    const remainingSelfPropelledSpeed =
      currentMaxSelfPropelledVelocity - forwardVelocity;

    if (remainingSelfPropelledSpeed <= 0) {
      return;
    }

    const throttle = constrain(
      remainingSelfPropelledSpeed / currentMaxSelfPropelledVelocity,
      0,
      1,
    );
    const directionChangeScale =
      1 /
      (1 +
        (lateralVelocity / currentMaxSelfPropelledVelocity) *
          (1 / this.directionChangeAccelerationScale - 1));

    this.acceleration.add(
      p5.Vector.mult(
        thrustDirection,
        this.thrustPower *
          Math.abs(thrustScale) *
          throttle *
          directionChangeScale,
      ),
    );
  }

  getCurrentMaxSelfPropelledVelocity() {
    return (
      this.maxSelfPropelledVelocity +
      this.gravityAccelerationThisFrame * this.gravityVelocityRatio
    );
  }

  update(t) {
    this.laserCooldownTimer = max(0, this.laserCooldownTimer - t);
    this.handleInput(t);
    this.velocity.add(p5.Vector.mult(this.acceleration, t));
    this.velocity.mult(this.drag);
    this.position.add(p5.Vector.mult(this.velocity, t));
  }

  canFireLaser() {
    return this.laserCooldownTimer <= 0;
  }

  fireLaser() {
    if (!this.canFireLaser()) {
      return null;
    }

    this.laserCooldownTimer = laserFireCooldown;
    const direction = p5.Vector.fromAngle(this.angle);
    const muzzlePosition = p5.Vector.add(
      this.position,
      p5.Vector.mult(direction, this.radius * 2.4),
    );

    return new Laser(
      muzzlePosition.x,
      muzzlePosition.y,
      this.angle,
      this.velocity.copy(),
    );
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    const nose = this.radius * 1.7;
    const tail = -this.radius * 1.1;
    const wing = this.radius * 0.75;
    const flame = -this.radius * 2.1;

    noStroke();
    fill(240);
    triangle(nose, 0, tail, -wing, tail * 0.6, 0);
    triangle(nose, 0, tail * 0.6, 0, tail, wing);

    if (
      keyIsDown(UP_ARROW) ||
      keyIsDown(87) ||
      keyIsDown(DOWN_ARROW) ||
      keyIsDown(83)
    ) {
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        fill(255, 120, 80);
      } else {
        fill(80, 180, 255);
      }

      triangle(tail, -wing * 0.55, flame, 0, tail, wing * 0.55);
    }

    pop();
  }
}
