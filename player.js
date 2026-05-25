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
  }

  resetForces() {
    this.acceleration.set(0, 0);
    this.gravityAccelerationThisFrame = 0;
  }

  addGravityAcceleration(amount) {
    this.gravityAccelerationThisFrame += amount;
  }

  handleInput(t) {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.angle -= this.turnSpeed * t;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.angle += this.turnSpeed * t;
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.applyThrust(1);
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.applyThrust(-0.2);
    }
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
