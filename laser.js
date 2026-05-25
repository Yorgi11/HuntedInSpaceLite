const laserRadius = 1.6;
const laserExplosionRadius = 30;
const laserFragmentRadiusScale = 0.32;
const laserSpeed = 620;
const laserLifetime = 3.0;
const laserDamageEnergy = 60000000;
const laserGravityScale = 0.08;
const laserFireCooldown = 0.05;

class Laser {
  constructor(x, y, angle, inheritedVelocity) {
    const direction = p5.Vector.fromAngle(angle);

    this.position = createVector(x, y);
    this.velocity = p5.Vector.add(
      inheritedVelocity,
      p5.Vector.mult(direction, laserSpeed),
    );
    this.acceleration = createVector(0, 0);
    this.angle = angle;
    this.radius = laserRadius;
    this.contactPatchRadius = laserExplosionRadius;
    this.fragmentRadiusScale = laserFragmentRadiusScale;
    this.mass = 0;
    this.isStatic = false;
    this.isLaser = true;
    this.damageEnergy = laserDamageEnergy;
    this.age = 0;
    this.lifetime = laserLifetime;
    this.isExpired = false;
    this.gravityAccelerationThisFrame = 0;
  }

  resetForces() {
    this.acceleration.set(0, 0);
    this.gravityAccelerationThisFrame = 0;
  }

  addGravityAcceleration(amount) {
    this.gravityAccelerationThisFrame += amount;
  }

  update(t) {
    this.age += t;
    this.velocity.add(p5.Vector.mult(this.acceleration, t));
    this.position.add(p5.Vector.mult(this.velocity, t));

    if (this.age >= this.lifetime) {
      this.destroy();
    }

    return [];
  }

  destroy() {
    this.isExpired = true;
  }

  draw() {
    const direction = p5.Vector.fromAngle(this.angle);
    const tail = p5.Vector.sub(
      this.position,
      p5.Vector.mult(direction, this.radius * 8),
    );

    stroke(100, 220, 255, 210);
    strokeWeight(this.radius);
    line(tail.x, tail.y, this.position.x, this.position.y);
    noStroke();
    fill(220, 250, 255, 230);
    circle(this.position.x, this.position.y, this.radius * 2);
  }
}
