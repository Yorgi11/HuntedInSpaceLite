// Connected-body size range, as a fraction of the parent body's radius.
// Higher values create larger orbiting rocks/moons.
const minConnectedBodySizePercentage = 0.01;
const maxConnectedBodySizePercentage = 0.24;

// Converts visual radius/density into simulation mass. Higher values make all
// space bodies pull harder, hit harder, and resist motion more.
const massScale = 0.0045;

// Prevents singular gravity/collision math at very short distances. Higher
// values soften close-range acceleration and make tight orbits less violent.
const gravitationalSoftening = 35;

// Small overlap ignored during collision separation. Higher values reduce
// jitter but allow slightly more visual overlap.
const collisionSlop = 0.01;

// Minimum gravitational acceleration used to calculate attraction radius.
// Lower values make gravity influence reach farther.
const minimumAttractionAcceleration = 8;

// Orbital placement range around parent bodies. Higher values place connected
// bodies farther from their parent.
const connectionRadiusScale = 5.5;

// Parent bodies below this radius do not spawn connected bodies.
const connectedBodyRadiusCutoff = 40;

// Radius interval that adds another connected body. Lower values create more
// connected bodies for a given parent size.
const connectedBodyRadiusStep = 14;

// Hard cap for connected bodies on one parent.
const maxConnectedBodies = 28;

// Minimum spacing between connected bodies, relative to their combined radii.
// Higher values create sparser orbital fields.
const orbitalBandSpacingScale = 4.5;

// Placement retries per connected body before skipping it.
const connectedBodyPlacementAttempts = 80;

// Number of samples used when impact damage falls off through a body.
// Higher values make fracture sampling smoother but slightly more expensive.
const impactFalloffSampleCount = 14;

// How deep into the body impact falloff samples, as a fraction of radius.
// Higher values let impacts affect deeper material.
const defaultImpactFalloffDepthScale = 0.1;

// Shape of impact falloff. Higher values concentrate damage nearer the surface.
const defaultImpactFalloffExponent = 1.65;

// Global multiplier for impact falloff strength. Higher values make impacts
// more likely to fracture.
const defaultImpactFalloffMultiplierScale = 1;

// Smallest fragment that can remain as an active body.
const minimumFragmentRadius = 1;

// Energy required to fracture one unit of mass. Higher values make bodies
// tougher against collision fractures.
const materialStrengthScale = 6000;

// Fraction of collision impact energy available for fracture. Higher values
// produce more/larger fragments.
const fractureEnergyTransfer = 0.85;

// Fraction of laser damage energy applied as a surface explosion. This portion
// uses the normal impact falloff/fracture path.
const laserSurfaceExplosionEnergyRatio = 0.9;

// Fraction of laser damage energy converted directly into target heat.
const laserDirectHeatEnergyRatio = 0.1;

// Contact patch size relative to impactor radius. Higher values let large
// impacts remove wider chunks.
const contactPatchRadiusScale = 1.5;

// Average collision-fragment radius relative to contact patch radius. Higher
// values create fewer, larger fragments.
const fragmentRadiusScale = 0.24;

// Ejection speed for collision fragments. Higher values throw debris faster.
const fragmentVelocityScale = 0.018;

// Hard cap for fragments produced by one collision fracture event. Extra lost
// mass is distributed into larger fragments instead of more objects.
const maxCollisionFragments = 10;

// Fraction of the parent's removed visual area that fragments may occupy.
// Lower values leave more empty space and reduce overlap after fracturing.
const fragmentAreaBudgetScale = 1.0;

// Dynamic bodies below this mass start decaying to zero.
const minimumBodyMass = 20;

const minimumBodyRadius = 4;

// Dynamic bodies below this kinetic energy start decaying to zero.
const minimumBodyKineticEnergy = 0;

// Seconds for a decaying body to shrink to zero.
const bodyDecayDuration = 0.5;

// Heat per mass needed before bloom starts.
const heatBloomActivationRatio = 150;

// Bloom growth per heat/mass above activation. Higher values brighten sooner.
const heatBloomRatioScale = 0.0025;

// Bloom response curve. Higher values delay visible bloom until hotter states.
const heatBloomExponent = 1.35;

// Maximum bloom intensity multiplier.
const maxHeatBloomIntensity = 2.0;

// Bloom radius growth per intensity. Higher values make hot bodies glow wider.
const heatBloomRadiusScale = 0.1;

// Number of translucent circles used to fake bloom.
const heatBloomLayerCount = 10;

// Fraction of heat lost per second. Higher values cool bodies faster.
const heatDissipationRate = 0.5;

// Bodies below this radius get no derived atmosphere unless one is explicitly
// provided in options.atmosphere.
const minimumAtmosphereBodyRadius = 35;

// Baseline atmosphere depth relative to body radius. Higher values extend the
// blue drag/heating zone farther from the surface.
const defaultAtmosphereDepthScale = 0.175;

// How much density increases derived atmosphere depth. Higher values make dense
// bodies keep thicker atmospheres.
const atmosphereDensityDepthScale = 0.18;

// How much mass increases derived atmosphere depth. Higher values make massive
// bodies keep thicker atmospheres.
const atmosphereMassDepthScale = 0.0015;

// Exponential curve for atmosphere strength from outer edge to surface. Higher
// values make drag weak until bodies get close to the surface.
const atmosphereFalloffExponent = 3.2;

// Linear velocity damping per second at full atmosphere strength.
const atmosphereLinearFrictionRate = 0.85;

// Angular velocity damping per second at full atmosphere strength.
const atmosphereAngularFrictionRate = 1.1;

// Fraction of atmosphere friction energy converted into heat on the slowed body.
const atmosphereFrictionHeatScale = 0.35;

// Fraction of atmosphere friction energy fed back into the atmosphere owner.
const atmosphereOwnerHeatShare = 0.015;

// Number of translucent blue shells used to render atmosphere bloom.
const atmosphereBloomLayerCount = 8;

// Maximum atmosphere bloom opacity. Higher values make atmospheres more visible.
const atmosphereBloomAlpha = 85;

// Baseline heat generated by gravitational acceleration. Higher values make
// gravity heating more visible even outside Roche range.
const gravitationalHeatingScale = 0.035;

// Extra heating from tidal stress, scaled by body radius over distance.
// Higher values make large/close bodies heat faster.
const tidalHeatingScale = 0.015;

// Roche limit multiplier. Higher values begin exponential heating farther out.
const rocheLimitScale = 2.44;

// Exponential heating curve inside Roche limit. Higher values make the heat
// spike more sharply as bodies get closer.
const rocheHeatingExponent = 8;

// Cap on Roche heating multiplier to prevent runaway single-frame heat spikes.
const maxRocheHeatingMultiplier = 80;

// Bodies below this mass still receive normal gravitational/tidal heat, but
// skip the exponential Roche heating multiplier.
const minimumRocheHeatingMass = 125;

// Angular velocity damping per simulated frame. Lower values slow spin faster.
const angularDamping = 0.99;

// Aligns body rotation toward the direction of gravitational pull. Higher
// values make bodies turn faster toward nearby massive objects.
const gravitationalAlignmentTorqueScale = 0.08;

// Converts tangential collision impulse into spin. Higher values spin bodies
// more from glancing impacts.
const collisionSpinScale = 0.1;

// Continuous contact friction applied while bodies collide. Higher values remove
// tangential sliding and spin faster during sustained contact.
const contactFrictionRate = 5.5;

// Multiplies heat produced by contact friction without changing the friction
// impulse itself. Higher values make sliding/spinning contact run hotter.
const contactFrictionHeatMultiplier = 0.01;

// Converts fragment ejection spread into spin. Higher values make debris spin more.
const fractureSpinScale = 0.02;

// Heat/mass threshold where radiative thermal fracture begins.
const defaultRadiativeHeatLimitRatio = 3200;

// Fraction of body mass shed per second when overheated. Higher values shed
// material faster above the heat limit.
const defaultRadiativeFractureMassRate = 0.1;

// Heat removed from the parent per unit mass shed. Higher values cool the
// parent faster during radiative fracture.
const defaultRadiativeCoolingPerMass = 8000;

// Thermal fragment target size relative to parent radius. Higher values create
// fewer, larger heat-fracture fragments.
const defaultRadiativeFragmentRadiusScale = 0.2;

// Heat/mass inherited by radiative fragments as a fraction of parent limit.
// Higher values make emitted fragments hotter and more likely to glow/fracture.
const defaultRadiativeFragmentHeatRatio = 0.95;

// Ejection speed for radiative fragments. Higher values push thermal debris out faster.
const radiativeFragmentVelocityScale = 0.8;

// Hard cap for fragments produced by one radiative fracture update. Extra lost
// mass is distributed into larger fragments instead of more objects.
const maxRadiativeFragments = 8;

// Collision speed below which no collision heat is generated. Higher values
// make small bumps colder.
const collisionHeatDeadZoneSpeed = 75;

// Collision heat curve after the dead zone. Higher values make high-speed
// impacts dominate heat generation more strongly.
const collisionHeatExponent = 1.2;

// Fraction of a decayed body's remaining heat transferred to nearby bodies.
// Higher values make disappearing bodies heat their neighbors more.
const decayHeatTransferScale = 0.005;

// Fraction of a decayed body's kinetic energy transferred as heat.
// Higher values make fast disappearing bodies leave a stronger heat trail.
const decayKineticHeatTransferScale = 0.005;

class PhysicsBody {
  constructor(
    x,
    y,
    radius,
    connectedBodyCount = null,
    density = 1,
    options = {},
  ) {
    this.position = createVector(x, y);
    this.velocity = createVector(options.vx || 0, options.vy || 0);
    this.acceleration = createVector(0, 0);
    this.angle = options.angle || 0;
    this.angularVelocity = options.angularVelocity ?? random(-0.25, 0.25);
    this.radius = radius;
    this.density = density;
    this.isStatic = options.isStatic ?? true;
    this.mass = this.calculateMassForRadius(radius);
    this.fullRadius = radius;
    this.decayTimer = 0;
    this.isDecaying = false;
    this.decayStoredHeatEnergy = 0;
    this.gravityAccelerationThisFrame = 0;
    this.heatEnergy = options.heatEnergy || 0;
    this.radiativeHeatLimitRatio =
      options.radiativeHeatLimitRatio ?? defaultRadiativeHeatLimitRatio;
    this.radiativeFractureMassRate =
      options.radiativeFractureMassRate ?? defaultRadiativeFractureMassRate;
    this.radiativeCoolingPerMass =
      options.radiativeCoolingPerMass ?? defaultRadiativeCoolingPerMass;
    this.radiativeFragmentRadiusScale =
      options.radiativeFragmentRadiusScale ??
      defaultRadiativeFragmentRadiusScale;
    this.radiativeFragmentHeatRatio =
      options.radiativeFragmentHeatRatio ?? defaultRadiativeFragmentHeatRatio;
    this.restitution = options.restitution ?? 0.45;
    this.impactFalloffDepthScale =
      options.impactFalloffDepthScale ?? defaultImpactFalloffDepthScale;
    this.impactFalloffExponent =
      options.impactFalloffExponent ?? defaultImpactFalloffExponent;
    this.impactFalloffMultiplierScale =
      options.impactFalloffMultiplierScale ??
      defaultImpactFalloffMultiplierScale;
    this.materialStrength =
      options.materialStrength ?? this.calculateMaterialStrength();
    this.atmosphere = this.createAtmosphere(options.atmosphere);
    this.canFracture = options.canFracture ?? true;
    this.impactFalloffGradient = this.buildImpactFalloffGradient();
    this.attractionRadius = this.calculateAttractionRadius();
    this.connectionRadius = this.calculateConnectionRadius();
    this.color =
      options.color ||
      color(random(100, 200), random(100, 200), random(100, 200));
    this.connectedBodies = [];
    this.connectedBodyCount =
      connectedBodyCount ?? this.calculateConnectedBodyCount();

    if (this.connectedBodyCount <= 0) {
      return;
    }

    this.spawnConnectedBodies();
  }

  calculateAttractionRadius() {
    return sqrt((G * this.mass) / minimumAttractionAcceleration);
  }

  calculateConnectionRadius() {
    return this.radius * connectionRadiusScale;
  }

  calculateConnectedBodyCount() {
    if (this.radius < connectedBodyRadiusCutoff) {
      return 0;
    }

    return constrain(
      floor(
        (this.radius - connectedBodyRadiusCutoff) / connectedBodyRadiusStep,
      ) + 1,
      0,
      maxConnectedBodies,
    );
  }

  calculateStableOrbitVelocity(orbitingMass, orbitDistance, angle) {
    const gravityDistance = max(
      orbitDistance,
      this.radius +
        this.calculateRadiusForMass(orbitingMass) +
        gravitationalSoftening,
    );
    const orbitAcceleration =
      (G * (this.mass + orbitingMass)) /
      (gravityDistance * gravityDistance + gravitationalSoftening);
    const orbitSpeed = sqrt(orbitAcceleration * orbitDistance);
    const orbitDirection = random() < 0.5 ? -1 : 1;

    return p5.Vector.fromAngle(
      angle + orbitDirection * HALF_PI,
      orbitSpeed,
    ).add(this.velocity);
  }

  spawnConnectedBodies() {
    const placements = [];

    for (let i = 0; i < this.connectedBodyCount; i++) {
      const connectedRadius = this.calculateConnectedBodyRadius(i);
      const placement = this.findConnectedBodyPlacement(
        connectedRadius,
        i,
        placements,
      );

      if (!placement) {
        continue;
      }

      placements.push({
        radius: connectedRadius,
        orbitDistance: placement.orbitDistance,
        angle: placement.angle,
      });
      this.connectedBodies.push(
        this.createConnectedBody(
          connectedRadius,
          placement.orbitDistance,
          placement.angle,
        ),
      );
    }
  }

  calculateConnectedBodyRadius(index) {
    const sizeBias = 1 - index / max(this.connectedBodyCount, 1);
    //const minimumRadiusForMass = this.calculateRadiusForMass(minimumBodyMass);
    const minimumRadiusPercentage =
      /*minimumRadiusForMass*/ minimumBodyRadius / this.radius;
    const lowerSizePercentage = max(
      minConnectedBodySizePercentage,
      minimumRadiusPercentage,
    );
    const upperSizePercentage = max(
      lowerSizePercentage,
      lerp(
        minConnectedBodySizePercentage,
        maxConnectedBodySizePercentage,
        sizeBias,
      ),
    );

    return this.radius * random(lowerSizePercentage, upperSizePercentage);
  }

  findConnectedBodyPlacement(connectedRadius, index, placements) {
    const minimumOrbit =
      this.radius + connectedRadius * orbitalBandSpacingScale;
    const maximumOrbit = this.connectionRadius - connectedRadius;

    if (maximumOrbit <= minimumOrbit) {
      return null;
    }

    for (let attempt = 0; attempt < connectedBodyPlacementAttempts; attempt++) {
      const bandRatio = (index + random(0.25, 0.85)) / this.connectedBodyCount;
      const orbitDistance = lerp(minimumOrbit, maximumOrbit, bandRatio);
      const angle = random(TWO_PI);

      if (
        this.meetsConnectedBodyEnergyMinimum(
          connectedRadius,
          orbitDistance,
          angle,
        ) &&
        this.hasEnoughOrbitalSpacing(
          connectedRadius,
          orbitDistance,
          angle,
          placements,
        )
      ) {
        return { orbitDistance, angle };
      }
    }

    return null;
  }

  meetsConnectedBodyEnergyMinimum(connectedRadius, orbitDistance, angle) {
    const childMass = this.calculateMassForRadius(connectedRadius);
    const childVelocity = this.calculateStableOrbitVelocity(
      childMass,
      orbitDistance,
      angle,
    );
    const relativeVelocity = p5.Vector.sub(childVelocity, this.velocity);
    const kineticEnergy = 0.5 * childMass * relativeVelocity.magSq();

    return (
      childMass >= minimumBodyMass && kineticEnergy >= minimumBodyKineticEnergy
    );
  }

  hasEnoughOrbitalSpacing(connectedRadius, orbitDistance, angle, placements) {
    const position = p5.Vector.fromAngle(angle, orbitDistance).add(
      this.position,
    );

    for (const placement of placements) {
      const otherPosition = p5.Vector.fromAngle(
        placement.angle,
        placement.orbitDistance,
      ).add(this.position);
      const requiredSpacing =
        (connectedRadius + placement.radius) * orbitalBandSpacingScale;

      const dx = position.x - otherPosition.x;
      const dy = position.y - otherPosition.y;

      if (dx * dx + dy * dy < requiredSpacing * requiredSpacing) {
        return false;
      }
    }

    return true;
  }

  createConnectedBody(connectedRadius, orbitDistance, angle) {
    const childPosition = p5.Vector.fromAngle(angle, orbitDistance).add(
      this.position,
    );
    const childMass = this.calculateMassForRadius(connectedRadius);
    const childVelocity = this.calculateStableOrbitVelocity(
      childMass,
      orbitDistance,
      angle,
    );

    return new PhysicsBody(
      childPosition.x,
      childPosition.y,
      connectedRadius,
      0,
      this.density,
      {
        isStatic: false,
        vx: childVelocity.x,
        vy: childVelocity.y,
        restitution: 0.5,
        color: color(130, 130, 145),
      },
    );
  }

  calculateMaterialStrength() {
    return this.density * materialStrengthScale;
  }

  createAtmosphere(atmosphereOptions) {
    if (atmosphereOptions === false) {
      return null;
    }

    if (atmosphereOptions == null) {
      return this.calculateDefaultAtmosphere();
    }

    if (typeof atmosphereOptions === "number") {
      return this.buildAtmosphere({ radius: atmosphereOptions });
    }

    if (atmosphereOptions.enabled === false) {
      return null;
    }

    return this.buildAtmosphere(atmosphereOptions);
  }

  calculateDefaultAtmosphere() {
    if (this.radius < minimumAtmosphereBodyRadius) {
      return null;
    }

    const densityDepthScale =
      1 + sqrt(max(this.density, 0)) * atmosphereDensityDepthScale;
    const massDepthScale =
      1 + sqrt(max(this.mass, 0)) * atmosphereMassDepthScale;
    const depth =
      this.radius *
      defaultAtmosphereDepthScale *
      densityDepthScale *
      massDepthScale;

    return this.buildAtmosphere({
      radius: this.radius + depth,
      isDerived: true,
    });
  }

  buildAtmosphere(atmosphereOptions) {
    const radius =
      atmosphereOptions.radius ??
      this.radius + (atmosphereOptions.depth ?? this.radius);

    if (radius <= this.radius) {
      return null;
    }

    return {
      radius,
      falloffExponent:
        atmosphereOptions.falloffExponent ?? atmosphereFalloffExponent,
      linearFrictionRate:
        atmosphereOptions.linearFrictionRate ?? atmosphereLinearFrictionRate,
      angularFrictionRate:
        atmosphereOptions.angularFrictionRate ?? atmosphereAngularFrictionRate,
      frictionHeatScale:
        atmosphereOptions.frictionHeatScale ?? atmosphereFrictionHeatScale,
      ownerHeatShare:
        atmosphereOptions.ownerHeatShare ?? atmosphereOwnerHeatShare,
      bloomAlpha: atmosphereOptions.bloomAlpha ?? atmosphereBloomAlpha,
      isDerived: atmosphereOptions.isDerived ?? false,
    };
  }

  calculateMassForRadius(radius) {
    return (4 / 3) * PI * radius * radius * radius * this.density * massScale;
  }

  calculateRadiusForMass(mass) {
    return pow((mass / (this.density * massScale)) * (3 / (4 * PI)), 1 / 3);
  }

  calculateRadiusForMassWithDensity(mass, density) {
    return pow((mass / (density * massScale)) * (3 / (4 * PI)), 1 / 3);
  }

  calculateDensityForMassAndRadius(mass, radius) {
    if (radius <= 0) {
      return this.density;
    }

    return mass / ((4 / 3) * PI * radius * radius * radius * massScale);
  }

  buildImpactFalloffGradient() {
    const gradient = [];

    for (let i = 0; i < impactFalloffSampleCount; i++) {
      const t = i / (impactFalloffSampleCount - 1);
      gradient.push({
        depthRatio: t,
        multiplier:
          pow(1 - t, this.impactFalloffExponent) *
          this.impactFalloffMultiplierScale,
      });
    }

    return gradient;
  }

  recalculateDerivedPhysics() {
    this.mass = this.calculateMassForRadius(this.radius);
    this.materialStrength = this.calculateMaterialStrength();
    this.attractionRadius = this.calculateAttractionRadius();
    this.connectionRadius = this.calculateConnectionRadius();

    if (this.atmosphere?.isDerived) {
      this.atmosphere = this.calculateDefaultAtmosphere();
    } else if (this.atmosphere) {
      this.atmosphere.radius = max(this.atmosphere.radius, this.radius);
    }
  }

  getKineticEnergy() {
    return 0.5 * this.mass * this.velocity.magSq();
  }

  shouldDecay() {
    return (
      !this.isStatic &&
      !this.isDecaying &&
      (this.mass < minimumBodyMass ||
        this.getKineticEnergy() < minimumBodyKineticEnergy ||
        this.radius < minimumBodyRadius)
    );
  }

  startDecay() {
    this.isDecaying = true;
    this.decayTimer = 0;
    this.fullRadius = this.radius;
    this.acceleration.set(0, 0);
    this.decayStoredHeatEnergy =
      this.getKineticEnergy() * decayKineticHeatTransferScale +
      this.heatEnergy * decayHeatTransferScale;
  }

  addHeatEnergy(amount) {
    if (!canSpawnPhysicsBodies() || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    this.heatEnergy += amount;
  }

  dissipateHeat(t) {
    if (this.heatEnergy <= 0) {
      return;
    }

    this.heatEnergy = max(
      0,
      this.heatEnergy - this.heatEnergy * heatDissipationRate * t,
    );
  }

  addAngularImpulse(impulse) {
    if (this.mass <= 0 || this.radius <= 0) {
      return;
    }

    const momentOfInertia = 0.5 * this.mass * this.radius * this.radius;
    this.angularVelocity += impulse / momentOfInertia;
  }

  applyGravityAlignmentTorque(targetPosition, accelerationMagnitude, t) {
    if (this.mass <= 0 || this.radius <= 0 || accelerationMagnitude <= 0) {
      return;
    }

    const pullDirection = p5.Vector.sub(targetPosition, this.position);

    if (pullDirection.magSq() <= 0) {
      return;
    }

    const targetAngle = pullDirection.heading();
    const angleDelta = Math.atan2(
      sin(targetAngle - this.angle),
      cos(targetAngle - this.angle),
    );

    this.angularVelocity +=
      angleDelta *
      accelerationMagnitude *
      gravitationalAlignmentTorqueScale *
      t;
  }

  updateDecay(t) {
    if (!this.isDecaying) {
      return;
    }

    this.decayTimer += t;
    const decayProgress = constrain(this.decayTimer / bodyDecayDuration, 0, 1);
    this.radius = lerp(this.fullRadius, 0, decayProgress);
    this.recalculateDerivedPhysics();
  }

  isExpired() {
    return this.isDecaying && this.decayTimer >= bodyDecayDuration;
  }

  resetForces() {
    this.acceleration.set(0, 0);
    this.gravityAccelerationThisFrame = 0;
  }

  attractBody(body, t = 1 / 60) {
    const dx = this.position.x - body.position.x;
    const dy = this.position.y - body.position.y;
    const rawDistance = sqrt(dx * dx + dy * dy);

    if (rawDistance <= 0) {
      return;
    }

    const distance = constrain(
      rawDistance,
      this.radius + body.radius,
      this.attractionRadius,
    );

    if (distance >= this.attractionRadius) {
      return;
    }

    const gravityScale =
      body.isLaser && typeof laserGravityScale !== "undefined"
        ? laserGravityScale
        : 1;
    const forceMagnitude =
      ((G * this.mass) / (distance * distance + gravitationalSoftening)) *
      gravityScale;
    const accelerationMagnitude = forceMagnitude;
    body.acceleration.x += (dx / rawDistance) * accelerationMagnitude;
    body.acceleration.y += (dy / rawDistance) * accelerationMagnitude;
    addGravityAcceleration(
      body,
      accelerationMagnitude,
      dx / rawDistance,
      dy / rawDistance,
    );
    applyGravityAlignmentTorque(body, this.position, accelerationMagnitude, t);
    addGravitationalHeat(this, body, accelerationMagnitude, distance, t);
  }

  applyMutualGravity(body) {
    const offset = p5.Vector.sub(body.position, this.position);
    const distance = max(
      offset.mag(),
      this.radius + body.radius + gravitationalSoftening,
    );
    const direction = offset.normalize();
    const accelerationA = (G * body.mass) / (distance * distance);
    const accelerationB = (G * this.mass) / (distance * distance);

    if (!this.isStatic) {
      this.acceleration.add(p5.Vector.mult(direction, accelerationA));
    }

    if (!body.isStatic) {
      body.acceleration.sub(p5.Vector.mult(direction, accelerationB));
    }
  }

  integrate(t) {
    if (this.isStatic) {
      return;
    }

    this.velocity.add(p5.Vector.mult(this.acceleration, t));
    this.position.add(p5.Vector.mult(this.velocity, t));
  }

  update(t) {
    if (this.shouldDecay()) {
      this.startDecay();
    }

    if (this.isDecaying) {
      this.updateDecay(t);
      this.velocity.add(p5.Vector.mult(this.acceleration, t));
      this.position.add(p5.Vector.mult(this.velocity, t));
      return [];
    }

    this.updateDecay(t);
    this.dissipateHeat(t);
    this.angle += this.angularVelocity * t;
    this.angularVelocity *= pow(angularDamping, t * 60);
    this.integrate(t);
    return this.updateRadiativeFracture(t);
  }

  updateRadiativeFracture(t) {
    if (
      this.isDecaying ||
      !this.canFracture ||
      !canSpawnPhysicsBodies() ||
      this.mass <= 0 ||
      this.getHeatRatio() <= this.radiativeHeatLimitRatio
    ) {
      return [];
    }

    const overheatRatio =
      (this.getHeatRatio() - this.radiativeHeatLimitRatio) /
      this.radiativeHeatLimitRatio;
    const minimumMass = this.calculateFragmentMass(minimumFragmentRadius);
    const heatLimitedMass =
      (this.heatEnergy - this.mass * this.radiativeHeatLimitRatio) /
      this.radiativeCoolingPerMass;
    const rateLimitedMass =
      this.mass * overheatRatio * this.radiativeFractureMassRate * t;
    const safeLostMass = min(
      rateLimitedMass,
      heatLimitedMass,
      this.mass - minimumMass,
    );

    if (safeLostMass <= minimumMass) {
      return [];
    }

    const remainingMass = this.mass - safeLostMass;

    if (remainingMass <= minimumMass) {
      this.startDecay();
      return [];
    }

    const previousRadius = this.radius;
    this.radius = this.calculateRadiusForMass(remainingMass);
    this.heatEnergy = max(
      0,
      this.heatEnergy - safeLostMass * this.radiativeCoolingPerMass,
    );
    this.recalculateDerivedPhysics();

    return this.createRadiativeFractureFragments(
      safeLostMass,
      previousRadius,
      this.radius,
    );
  }

  createRadiativeFractureFragments(lostMass, previousRadius, nextRadius) {
    const fragments = [];
    let remainingMass = lostMass;
    const areaBudget = this.calculateFragmentAreaBudget(
      previousRadius,
      nextRadius,
    );
    const targetFragmentArea =
      PI *
      pow(
        max(
          minimumFragmentRadius,
          this.radius * this.radiativeFragmentRadiusScale,
        ),
        2,
      );
    const fragmentCount = constrain(
      round(areaBudget / targetFragmentArea),
      1,
      maxRadiativeFragments,
    );
    const areaPerFragment = areaBudget / fragmentCount;
    const thermalSpeed =
      sqrt(max(this.getHeatRatio(), 0)) * radiativeFragmentVelocityScale;

    for (let i = 0; i < fragmentCount; i++) {
      const remainingFragments = fragmentCount - i;
      const fragmentMass =
        i === fragmentCount - 1
          ? remainingMass
          : (remainingMass * random(0.4, 0.9)) / remainingFragments;
      const fragmentRadius = sqrt(areaPerFragment / PI);
      const fragmentDensity = this.calculateDensityForMassAndRadius(
        fragmentMass,
        fragmentRadius,
      );

      remainingMass -= fragmentMass;

      if (fragmentRadius < minimumFragmentRadius) {
        continue;
      }

      const angle = random(TWO_PI);
      const ejectDirection = p5.Vector.fromAngle(angle);
      const spawnPosition = p5.Vector.add(
        this.position,
        p5.Vector.mult(ejectDirection, this.radius + fragmentRadius + 2),
      );
      const velocity = p5.Vector.add(
        this.velocity,
        p5.Vector.mult(ejectDirection, thermalSpeed * random(0.6, 1.25)),
      );

      fragments.push(
        new PhysicsBody(
          spawnPosition.x,
          spawnPosition.y,
          fragmentRadius,
          0,
          fragmentDensity,
          {
            isStatic: false,
            vx: velocity.x,
            vy: velocity.y,
            angularVelocity:
              this.angularVelocity +
              random(-1, 1) * thermalSpeed * fractureSpinScale,
            heatEnergy:
              fragmentMass *
              this.radiativeHeatLimitRatio *
              this.radiativeFragmentHeatRatio,
            restitution: 0.55,
            color: this.color,
          },
        ),
      );
    }

    return fragments;
  }

  getImpactFalloffMultiplier(collisionPoint, impactDirection) {
    const direction = impactDirection.copy().normalize();
    let weightedFalloff = 0;
    let totalWeight = 0;

    for (const sample of this.impactFalloffGradient) {
      const samplePoint = p5.Vector.add(
        collisionPoint,
        p5.Vector.mult(
          direction,
          this.radius * this.impactFalloffDepthScale * sample.depthRatio,
        ),
      );
      const distanceFromCenter = p5.Vector.dist(samplePoint, this.position);
      const insideBody = distanceFromCenter <= this.radius;

      totalWeight += sample.multiplier;

      if (insideBody) {
        weightedFalloff += sample.multiplier;
      }
    }

    if (totalWeight <= 0) {
      return 0;
    }

    return weightedFalloff / totalWeight;
  }

  fractureFromImpact(collisionPoint, impactDirection, impactEnergy, impactor) {
    if (!this.canFracture || !canSpawnPhysicsBodies()) {
      return [];
    }

    const falloffMultiplier = this.getImpactFalloffMultiplier(
      collisionPoint,
      impactDirection,
    );
    const damageEnergy =
      impactEnergy * fractureEnergyTransfer * falloffMultiplier;
    const lostMass = this.calculateLostMassFromImpact(damageEnergy, impactor);

    if (lostMass <= this.calculateFragmentMass(minimumFragmentRadius)) {
      return [];
    }

    const originalMass = this.mass;
    const safeLostMass = min(
      lostMass,
      originalMass - this.calculateFragmentMass(minimumFragmentRadius),
    );

    if (safeLostMass <= this.calculateFragmentMass(minimumFragmentRadius)) {
      return [];
    }

    const remainingMass = originalMass - safeLostMass;
    const previousRadius = this.radius;
    const nextRadius = this.calculateRadiusForMass(remainingMass);

    if (nextRadius <= minimumFragmentRadius) {
      return [];
    }

    this.radius = nextRadius;
    this.recalculateDerivedPhysics();

    const fragments = this.createFractureFragments(
      safeLostMass,
      collisionPoint,
      impactDirection,
      impactEnergy,
      impactor,
      previousRadius,
      nextRadius,
    );

    distributeHeatAcrossBodies([this, ...fragments], damageEnergy);

    return fragments;
  }

  fractureFromLaser(collisionPoint, impactDirection, impactEnergy, laser) {
    const directHeatEnergy = impactEnergy * laserDirectHeatEnergyRatio;

    if (!this.canFracture) {
      distributeHeatAcrossBodies([this], directHeatEnergy);
      return [];
    }

    const surfaceImpactEnergy = impactEnergy * laserSurfaceExplosionEnergyRatio;
    const falloffMultiplier = this.getImpactFalloffMultiplier(
      collisionPoint,
      impactDirection,
    );
    const damageEnergy =
      surfaceImpactEnergy * fractureEnergyTransfer * falloffMultiplier;
    const heatEnergy = directHeatEnergy;
    const lostMass = this.calculateLostMassFromImpact(damageEnergy, laser);

    if (lostMass <= this.calculateFragmentMass(minimumFragmentRadius)) {
      distributeHeatAcrossBodies([this], heatEnergy);
      return [];
    }

    const originalMass = this.mass;
    const safeLostMass = min(
      lostMass,
      originalMass - this.calculateFragmentMass(minimumFragmentRadius),
    );

    if (safeLostMass <= this.calculateFragmentMass(minimumFragmentRadius)) {
      distributeHeatAcrossBodies([this], heatEnergy);
      return [];
    }

    const remainingMass = originalMass - safeLostMass;
    const previousRadius = this.radius;
    const nextRadius = this.calculateRadiusForMass(remainingMass);

    if (nextRadius <= minimumFragmentRadius) {
      distributeHeatAcrossBodies([this], heatEnergy);
      return [];
    }

    this.radius = nextRadius;
    this.recalculateDerivedPhysics();

    if (!canSpawnPhysicsBodies()) {
      distributeHeatAcrossBodies([this], heatEnergy);
      return [];
    }

    const fragments = this.createFractureFragments(
      safeLostMass,
      collisionPoint,
      impactDirection,
      surfaceImpactEnergy,
      laser,
      previousRadius,
      nextRadius,
    );

    distributeHeatAcrossBodies([this, ...fragments], heatEnergy);

    return fragments;
  }

  calculateLostMassFromImpact(damageEnergy, impactor) {
    const contactPatchRadius = this.calculateContactPatchRadius(impactor);
    const localContactMass = this.calculateMassForRadius(contactPatchRadius);
    const energyLimitedMass = damageEnergy / this.materialStrength;

    return min(energyLimitedMass, localContactMass);
  }

  calculateContactPatchRadius(impactor) {
    const impactorContactRadius =
      impactor.contactPatchRadius || impactor.radius * contactPatchRadiusScale;

    return min(this.radius, max(minimumFragmentRadius, impactorContactRadius));
  }

  calculateFragmentMass(fragmentRadius) {
    return this.calculateMassForRadius(fragmentRadius);
  }

  calculateFragmentAreaBudget(previousRadius, nextRadius) {
    return max(
      PI *
        (previousRadius * previousRadius - nextRadius * nextRadius) *
        fragmentAreaBudgetScale,
      PI * minimumFragmentRadius * minimumFragmentRadius,
    );
  }

  createFractureFragments(
    lostMass,
    collisionPoint,
    impactDirection,
    impactEnergy,
    impactor,
    previousRadius,
    nextRadius,
  ) {
    const fragments = [];
    let remainingMass = lostMass;
    const contactPatchRadius = this.calculateContactPatchRadius(impactor);
    const impactFragmentRadiusScale =
      impactor.fragmentRadiusScale || fragmentRadiusScale;
    const areaBudget = this.calculateFragmentAreaBudget(
      previousRadius,
      nextRadius,
    );
    const targetFragmentArea =
      PI *
      pow(
        max(
          minimumFragmentRadius,
          contactPatchRadius * impactFragmentRadiusScale,
        ),
        2,
      );
    const fragmentCount = constrain(
      round(areaBudget / targetFragmentArea),
      1,
      maxCollisionFragments,
    );
    const areaPerFragment = areaBudget / fragmentCount;
    const inwardDirection = impactDirection.copy().normalize();
    const ejectDirection = p5.Vector.mult(inwardDirection, -1);
    const tangent = createVector(-ejectDirection.y, ejectDirection.x);
    const ejectionSpeed =
      sqrt((2 * impactEnergy) / max(impactor.mass, 1)) * fragmentVelocityScale;

    for (let i = 0; i < fragmentCount; i++) {
      const remainingFragments = fragmentCount - i;
      const fragmentMass =
        i === fragmentCount - 1
          ? remainingMass
          : (remainingMass * random(0.35, 0.75)) / remainingFragments;
      const fragmentRadius = sqrt(areaPerFragment / PI);
      const fragmentDensity = this.calculateDensityForMassAndRadius(
        fragmentMass,
        fragmentRadius,
      );

      remainingMass -= fragmentMass;

      if (fragmentRadius < minimumFragmentRadius) {
        continue;
      }

      const spread = map(i, 0, max(fragmentCount - 1, 1), -0.7, 0.7);
      const velocity = p5.Vector.add(
        this.velocity,
        p5.Vector.mult(ejectDirection, ejectionSpeed),
      );
      velocity.add(p5.Vector.mult(tangent, spread * ejectionSpeed * 0.45));

      const spawnPosition = p5.Vector.add(
        collisionPoint,
        p5.Vector.add(
          p5.Vector.mult(ejectDirection, fragmentRadius + 2),
          p5.Vector.mult(tangent, spread * fragmentRadius * 1.8),
        ),
      );

      fragments.push(
        new PhysicsBody(
          spawnPosition.x,
          spawnPosition.y,
          fragmentRadius,
          0,
          fragmentDensity,
          {
            isStatic: false,
            vx: velocity.x,
            vy: velocity.y,
            angularVelocity:
              this.angularVelocity + spread * ejectionSpeed * fractureSpinScale,
            restitution: 0.55,
            color: this.color,
          },
        ),
      );
    }

    return fragments;
  }

  drawDebugRadii() {
    noFill();
    stroke(70, 110, 180, 70);
    circle(this.position.x, this.position.y, this.attractionRadius * 2);
    stroke(80, 180, 140, 70);
    circle(this.position.x, this.position.y, this.connectionRadius * 2);
  }

  draw() {
    //this.drawDebugRadii();
    this.drawAtmosphereBloom();
    this.drawHeatBloom();

    noStroke();
    fill(this.color);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    circle(0, 0, this.radius * 2);
    stroke(255, 255, 255, 55);
    line(0, 0, this.radius * 0.65, 0);
    pop();
  }

  getHeatRatio() {
    if (this.mass <= 0) {
      return 0;
    }

    return this.heatEnergy / this.mass;
  }

  getBloomIntensity() {
    const activeHeatRatio = max(
      this.getHeatRatio() - heatBloomActivationRatio,
      0,
    );

    return constrain(
      pow(activeHeatRatio * heatBloomRatioScale, heatBloomExponent),
      0,
      maxHeatBloomIntensity,
    );
  }

  getBloomRadius() {
    const intensity = this.getBloomIntensity();
    return this.radius * (1 + intensity * heatBloomRadiusScale);
  }

  getAtmosphereRenderRadius() {
    return this.atmosphere ? this.atmosphere.radius : 0;
  }

  getAtmosphereInfluence(distance) {
    if (!this.atmosphere || distance >= this.atmosphere.radius) {
      return 0;
    }

    const atmosphereDepth = this.atmosphere.radius - this.radius;

    if (atmosphereDepth <= 0) {
      return 0;
    }

    const depthRatio = constrain(
      (this.atmosphere.radius - distance) / atmosphereDepth,
      0,
      1,
    );
    const exponent = this.atmosphere.falloffExponent;

    if (exponent <= 0) {
      return depthRatio;
    }

    return (Math.exp(exponent * depthRatio) - 1) / (Math.exp(exponent) - 1);
  }

  drawAtmosphereBloom() {
    if (!this.atmosphere || this.atmosphere.radius <= this.radius) {
      return;
    }

    noStroke();

    for (let i = atmosphereBloomLayerCount; i >= 1; i--) {
      const layerRatio = i / atmosphereBloomLayerCount;
      const shellRadius = lerp(this.radius, this.atmosphere.radius, layerRatio);
      const alpha =
        this.atmosphere.bloomAlpha * pow(1 - layerRatio, 0.75) * 0.45;

      fill(70, 155, 255, alpha);
      circle(this.position.x, this.position.y, shellRadius * 2);
    }
  }

  drawHeatBloom() {
    const intensity = this.getBloomIntensity();

    if (intensity <= 0 || this.radius <= 0) {
      return;
    }

    const bloomRadius = this.getBloomRadius();
    const bloomLayerCount = getHeatBloomLayerCountForZoom();

    noStroke();

    for (let i = bloomLayerCount; i >= 1; i--) {
      const layerRatio = i / bloomLayerCount;
      const alpha = 55 * intensity * (1 - layerRatio * 0.65);
      const layerRadius = lerp(this.radius, bloomRadius, layerRatio);

      fill(255, 128, 40, alpha);
      circle(this.position.x, this.position.y, layerRadius * 2);
    }
  }
}

function getHeatBloomLayerCountForZoom() {
  if (typeof cameraZoom === "undefined") {
    return heatBloomLayerCount;
  }

  if (cameraZoom < 0.7) {
    return 3;
  }

  if (cameraZoom < 1.6) {
    return 5;
  }

  return heatBloomLayerCount;
}

function resolveCollision(bodyA, bodyB, t) {
  if (bodyA.isLaser || bodyB.isLaser) {
    return resolveLaserCollision(bodyA, bodyB);
  }

  const offset = p5.Vector.sub(bodyB.position, bodyA.position);
  let distance = offset.mag();
  const minimumDistance = bodyA.radius + bodyB.radius;

  if (distance >= minimumDistance || minimumDistance <= 0) {
    return [];
  }

  if (distance <= 0) {
    offset.set(1, 0);
    distance = 1;
  }

  const normal = offset.div(distance);
  const overlap = minimumDistance - distance;
  const inverseMassA = bodyA.isStatic ? 0 : 1 / bodyA.mass;
  const inverseMassB = bodyB.isStatic ? 0 : 1 / bodyB.mass;
  const inverseMassTotal = inverseMassA + inverseMassB;

  if (inverseMassTotal <= 0) {
    return [];
  }

  const correction = p5.Vector.mult(
    normal,
    max(overlap - collisionSlop, 0) / inverseMassTotal,
  );

  if (!bodyA.isStatic) {
    bodyA.position.sub(p5.Vector.mult(correction, inverseMassA));
  }

  if (!bodyB.isStatic) {
    bodyB.position.add(p5.Vector.mult(correction, inverseMassB));
  }

  const relativeVelocity = p5.Vector.sub(bodyB.velocity, bodyA.velocity);
  const velocityAlongNormal = relativeVelocity.dot(normal);

  if (velocityAlongNormal > 0) {
    return [];
  }

  const restitution = min(bodyA.restitution ?? 0.45, bodyB.restitution ?? 0.45);
  const impactSpeed = abs(velocityAlongNormal);
  const impactEnergy = calculateImpactEnergy(inverseMassTotal, impactSpeed);
  distributeCollisionHeat(bodyA, bodyB, impactEnergy, restitution, impactSpeed);
  const impulseMagnitude =
    (-(1 + restitution) * velocityAlongNormal) / inverseMassTotal;
  const impulse = p5.Vector.mult(normal, impulseMagnitude);

  if (!bodyA.isStatic) {
    bodyA.velocity.sub(p5.Vector.mult(impulse, inverseMassA));
  }

  if (!bodyB.isStatic) {
    bodyB.velocity.add(p5.Vector.mult(impulse, inverseMassB));
  }

  applyCollisionSpin(bodyA, bodyB, normal, impulseMagnitude);
  applyContactFriction(bodyA, bodyB, normal, t);

  return createFracturesFromCollision(bodyA, bodyB, normal, impactEnergy);
}

function resolveLaserCollision(bodyA, bodyB) {
  const laser = bodyA.isLaser ? bodyA : bodyB.isLaser ? bodyB : null;
  const target = laser === bodyA ? bodyB : bodyA;

  if (!laser || target.isLaser || laser.isExpired) {
    return [];
  }

  const dx = laser.position.x - target.position.x;
  const dy = laser.position.y - target.position.y;
  const minimumDistance = laser.radius + target.radius;

  if (dx * dx + dy * dy >= minimumDistance * minimumDistance) {
    return [];
  }

  laser.destroy();

  if (!(target instanceof PhysicsBody)) {
    return [];
  }

  const impactDirection =
    laser.velocity.magSq() > 0
      ? laser.velocity.copy().normalize()
      : p5.Vector.sub(target.position, laser.position).normalize();

  return target.fractureFromLaser(
    laser.position.copy(),
    impactDirection,
    laser.damageEnergy,
    laser,
  );
}

function applyCollisionSpin(bodyA, bodyB, normal, impulseMagnitude) {
  const tangent = createVector(-normal.y, normal.x);
  const relativeVelocity = p5.Vector.sub(bodyB.velocity, bodyA.velocity);
  const tangentialSpeed = relativeVelocity.dot(tangent);
  const spinImpulse = impulseMagnitude * tangentialSpeed * collisionSpinScale;

  addAngularImpulse(bodyA, -spinImpulse);
  addAngularImpulse(bodyB, spinImpulse);
}

function applyContactFriction(bodyA, bodyB, normal, t) {
  const tangent = createVector(-normal.y, normal.x);
  const surfaceSpeedA = getTangentialSurfaceSpeed(bodyA, tangent, 1);
  const surfaceSpeedB = getTangentialSurfaceSpeed(bodyB, tangent, -1);
  const relativeSurfaceSpeed = surfaceSpeedB - surfaceSpeedA;

  if (abs(relativeSurfaceSpeed) <= 0.001) {
    return;
  }

  const effectiveInverseMass =
    getInverseMass(bodyA) +
    getInverseMass(bodyB) +
    getInverseRotationalMass(bodyA) +
    getInverseRotationalMass(bodyB);

  if (effectiveInverseMass <= 0) {
    return;
  }

  const frictionFraction = 1 - Math.exp(-contactFrictionRate * t);
  const frictionImpulse =
    (relativeSurfaceSpeed * frictionFraction) / effectiveInverseMass;
  const previousEnergy =
    getLinearKineticEnergy(bodyA) +
    getLinearKineticEnergy(bodyB) +
    getRotationalKineticEnergy(bodyA) +
    getRotationalKineticEnergy(bodyB);

  applyTangentialFrictionImpulse(bodyA, tangent, frictionImpulse, 1);
  applyTangentialFrictionImpulse(bodyB, tangent, -frictionImpulse, -1);

  const nextEnergy =
    getLinearKineticEnergy(bodyA) +
    getLinearKineticEnergy(bodyB) +
    getRotationalKineticEnergy(bodyA) +
    getRotationalKineticEnergy(bodyB);
  const lostEnergy = max(previousEnergy - nextEnergy, 0);

  distributeHeatBetweenBodies(
    bodyA,
    bodyB,
    lostEnergy * contactFrictionHeatMultiplier,
  );
}

function getTangentialSurfaceSpeed(body, tangent, contactSign) {
  const angularVelocity =
    body instanceof PhysicsBody ? body.angularVelocity : 0;
  return (
    body.velocity.dot(tangent) + angularVelocity * body.radius * contactSign
  );
}

function getInverseMass(body) {
  return body.isStatic ? 0 : 1 / body.mass;
}

function getInverseRotationalMass(body) {
  if (!(body instanceof PhysicsBody) || body.mass <= 0 || body.radius <= 0) {
    return 0;
  }

  const momentOfInertia = 0.5 * body.mass * body.radius * body.radius;
  return (body.radius * body.radius) / momentOfInertia;
}

function applyTangentialFrictionImpulse(body, tangent, impulse, contactSign) {
  if (!body.isStatic) {
    body.velocity.x += tangent.x * impulse * getInverseMass(body);
    body.velocity.y += tangent.y * impulse * getInverseMass(body);
  }

  if (body instanceof PhysicsBody) {
    body.addAngularImpulse(impulse * body.radius * contactSign);
  }
}

function getLinearKineticEnergy(body) {
  if (body.isStatic) {
    return 0;
  }

  return 0.5 * body.mass * body.velocity.magSq();
}

function getRotationalKineticEnergy(body) {
  if (!(body instanceof PhysicsBody) || body.mass <= 0 || body.radius <= 0) {
    return 0;
  }

  const momentOfInertia = 0.5 * body.mass * body.radius * body.radius;
  return 0.5 * momentOfInertia * body.angularVelocity * body.angularVelocity;
}

function addAngularImpulse(body, impulse) {
  if (typeof body.addAngularImpulse === "function") {
    body.addAngularImpulse(impulse);
  }
}

function addGravityAcceleration(
  body,
  accelerationMagnitude,
  directionX = 0,
  directionY = 0,
) {
  if (typeof body.addGravityAcceleration === "function") {
    body.addGravityAcceleration(accelerationMagnitude, directionX, directionY);
    return;
  }

  body.gravityAccelerationThisFrame =
    (body.gravityAccelerationThisFrame || 0) + accelerationMagnitude;
}

function applyGravityAlignmentTorque(
  body,
  targetPosition,
  accelerationMagnitude,
  t,
) {
  if (body instanceof PhysicsBody) {
    body.applyGravityAlignmentTorque(targetPosition, accelerationMagnitude, t);
  }
}

function calculateImpactEnergy(inverseMassTotal, impactSpeed) {
  const reducedMass = 1 / inverseMassTotal;
  return 0.5 * reducedMass * impactSpeed * impactSpeed;
}

function addGravitationalHeat(
  effector,
  body,
  accelerationMagnitude,
  distance,
  t,
) {
  if (
    !(body instanceof PhysicsBody) ||
    accelerationMagnitude <= 0 ||
    distance <= 0
  ) {
    return;
  }

  const rocheMultiplier =
    effector instanceof PhysicsBody
      ? calculateRocheHeatingMultiplier(effector, body, distance)
      : 1;
  const heating =
    body.mass *
    accelerationMagnitude *
    rocheMultiplier *
    (gravitationalHeatingScale +
      (body.radius / max(distance, 1)) * tidalHeatingScale) *
    t;

  addHeatEnergy(body, heating);

  if (effector instanceof PhysicsBody) {
    addHeatEnergy(effector, heating * 0.05);
  }
}

function calculateRocheHeatingMultiplier(effector, body, distance) {
  if (body.mass < minimumRocheHeatingMass) {
    return 1;
  }

  const rocheLimit = calculateRocheLimit(effector, body);

  if (distance >= rocheLimit) {
    return 1;
  }

  const proximityRatio = rocheLimit / max(distance, 1);

  return constrain(
    pow(proximityRatio, rocheHeatingExponent),
    1,
    maxRocheHeatingMultiplier,
  );
}

function calculateRocheLimit(effector, body) {
  const densityRatio = max(effector.density / max(body.density || 1, 0.001), 0);
  return effector.radius * rocheLimitScale * pow(densityRatio, 1 / 3);
}

function distributeCollisionHeat(
  bodyA,
  bodyB,
  impactEnergy,
  restitution,
  impactSpeed,
) {
  const effectiveSpeed = max(impactSpeed - collisionHeatDeadZoneSpeed, 0);

  if (effectiveSpeed <= 0) {
    return;
  }

  const heatRatio = pow(
    effectiveSpeed / max(impactSpeed, 1),
    collisionHeatExponent,
  );
  const lostEnergy = impactEnergy * (1 - restitution * restitution) * heatRatio;

  if (lostEnergy <= 0) {
    return;
  }

  distributeHeatBetweenBodies(bodyA, bodyB, lostEnergy);
}

function distributeHeatBetweenBodies(bodyA, bodyB, heatEnergy) {
  distributeHeatAcrossBodies([bodyA, bodyB], heatEnergy);
}

function distributeHeatAcrossBodies(heatBodies, heatEnergy) {
  const receivers = heatBodies.filter((body) => body instanceof PhysicsBody);
  const totalMass = receivers.reduce((sum, body) => sum + body.mass, 0);

  if (totalMass <= 0) {
    return;
  }

  for (const body of receivers) {
    addHeatEnergy(body, heatEnergy * (body.mass / totalMass));
  }
}

function addHeatEnergy(body, heatEnergy) {
  if (
    !canSpawnPhysicsBodies() ||
    !Number.isFinite(heatEnergy) ||
    heatEnergy <= 0
  ) {
    return;
  }

  if (body instanceof PhysicsBody && typeof body.addHeatEnergy === "function") {
    body.addHeatEnergy(heatEnergy);
  }
}

function canSpawnPhysicsBodies() {
  return typeof hasBodyCapacity !== "function" || hasBodyCapacity();
}

function createFracturesFromCollision(bodyA, bodyB, normal, impactEnergy) {
  const fragments = [];
  const bodyAContact = p5.Vector.add(
    bodyA.position,
    p5.Vector.mult(normal, bodyA.radius),
  );
  const bodyBContact = p5.Vector.sub(
    bodyB.position,
    p5.Vector.mult(normal, bodyB.radius),
  );

  if (bodyA instanceof PhysicsBody) {
    fragments.push(
      ...bodyA.fractureFromImpact(
        bodyAContact,
        p5.Vector.mult(normal, -1),
        impactEnergy,
        bodyB,
      ),
    );
  }

  if (bodyB instanceof PhysicsBody) {
    fragments.push(
      ...bodyB.fractureFromImpact(bodyBContact, normal, impactEnergy, bodyA),
    );
  }

  return fragments;
}

const physicsBody = PhysicsBody;
