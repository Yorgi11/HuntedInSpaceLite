const starCellSize = 260;
const starViewPadding = starCellSize;
const minStarsPerCell = 2;
const maxStarsPerCell = 6;
const starClusterChance = 0.23;
const minClusterStars = 3;
const maxClusterStars = 11;
const starClusterRadius = 65;
const minStarRadius = 0.35;
const maxStarRadius = 1.75;
const starClusterRadiusBoost = 1.4;
const starGlowRadiusScale = 5;
const starCellImagePadding = 90;
const backgroundZoomBands = [
  {
    id: "z0",
    maxZoom: 0.45,
    starTileSpan: 6,
    cosmicTileSpan: 3,
    imageScale: 0.32,
    detailScale: 0.18,
    gasNebulaDensityScale: 0.35,
  },
  {
    id: "z1",
    maxZoom: 0.75,
    starTileSpan: 5,
    cosmicTileSpan: 3,
    imageScale: 0.42,
    detailScale: 0.26,
    gasNebulaDensityScale: 0.5,
  },
  {
    id: "z2",
    maxZoom: 1.15,
    starTileSpan: 4,
    cosmicTileSpan: 2,
    imageScale: 0.55,
    detailScale: 0.38,
    gasNebulaDensityScale: 0.65,
  },
  {
    id: "z3",
    maxZoom: 1.75,
    starTileSpan: 3,
    cosmicTileSpan: 2,
    imageScale: 0.7,
    detailScale: 0.55,
    gasNebulaDensityScale: 0.8,
  },
  {
    id: "z4",
    maxZoom: 2.6,
    starTileSpan: 2,
    cosmicTileSpan: 1,
    imageScale: 0.85,
    detailScale: 0.75,
    gasNebulaDensityScale: 0.9,
  },
  {
    id: "z5",
    maxZoom: Infinity,
    starTileSpan: 1,
    cosmicTileSpan: 1,
    imageScale: 1,
    detailScale: 1,
    gasNebulaDensityScale: 1,
  },
];
const backgroundStarPalette = [
  [235, 242, 255],
  [205, 225, 255],
  [255, 246, 220],
  [220, 255, 245],
];
const starParallaxLayers = [
  { parallax: 0.01, alphaScale: 0.35, radiusScale: 0.35 },
  { parallax: 0.05, alphaScale: 0.55, radiusScale: 0.55 },
  { parallax: 0.15, alphaScale: 0.75, radiusScale: 0.75 },
  { parallax: 0.25, alphaScale: 1.0, radiusScale: 1.0 },
];

const cosmicStructureCellSize = 520;
const cosmicStructureViewPadding = 1200;
const gasClusterChance = 0.2;
const galaxyChance = 0.025;
const nebulaChance = 0.1;
const maxGasClusterLayer = 2;
const maxGalaxyNebulaLayer = 1;
const gasClusterPalette = [
  [85, 160, 255],
  [180, 95, 255],
  [255, 120, 95],
  [95, 230, 205],
];
const nebulaPalette = [
  [255, 80, 145],
  [95, 130, 255],
  [255, 160, 75],
  [105, 240, 190],
];
const nebulaCoreColor = [255, 220, 170];
const nebulaDustColor = [5, 8, 16];
const nebulaRimColor = [245, 250, 255];
const nebulaPillarCountMin = 2;
const nebulaPillarCountMax = 5;
const nebulaPillarSegmentsMin = 5;
const nebulaPillarSegmentsMax = 9;
const nebulaTextureBlobCount = 18;
const nebulaDarkPocketCount = 7;
const nebulaFilamentCount = 14;

const minGalaxyArmCount = 2;
const maxGalaxyArmCount = 4;
const galaxyCloudsPerArm = 260;
const galaxyDustLaneCount = 16;
const galaxyClusterChance = 0.72;
const galaxyClusterStarsMin = 4;
const galaxyClusterStarsMax = 24;
const galaxyGasCloudsPerLayer = 220;
const galaxyCoreStarExclusionRatio = 0.05;
const galaxyCoreBloomLevelCount = 5;
const galaxyStarOrbitExponent = 1.75;
const galaxyGasOrbitExponent = 1.25;
const galaxyInnerClusterBoost = 1.45;
const galaxyOuterClusterScale = 0.38;
const galaxyArmBendMin = 3.4;
const galaxyArmBendMax = 5.8;
const galaxyArmAngularJitter = 0.12;
const galaxyInnerArmWidthScale = 0.034;
const galaxyOuterArmWidthScale = 0.012;
const galaxyClusterTangentStretch = 2.6;
const galaxyClusterNormalSqueeze = 0.42;
const galaxyStarPalette = [
  [160, 215, 255],
  [95, 170, 255],
  [230, 205, 255],
  [255, 230, 185],
  [255, 175, 135],
];
const galaxyGasPalette = [
  [45, 145, 255],
  [110, 90, 255],
  [255, 115, 180],
  [255, 170, 125],
];

const maxStarCellCacheEntries = 900;
const maxCosmicStructureTileCacheEntries = 1200;
const maxBackgroundImageCacheEntries = 700;
const maxBackgroundImageCachePixels = 180000000;
const maxBackgroundImageBuildsPerFrame = 18;
const maxCosmicImageBuildsPerFrame = 999;
const backgroundFadeInFrames = 0;
const backgroundZoomBandHysteresis = 0.12;
const gasNebulaZoomFadeWidth = 0.22;
const starCellCache = new Map();
const cosmicStructureTileCache = new Map();
const backgroundImageCache = new Map();
let backgroundImageCachePixels = 0;
let backgroundImageBuildsThisFrame = 0;
let cosmicImageBuildsThisFrame = 0;
let backgroundRenderTarget = null;
let visibleGalaxyCores = [];
let activeBackgroundZoomBandIndex = null;
let directBackgroundDetailScale = null;
let directBackgroundAlphaScale = 1;

function getBackgroundZoomBand() {
  const targetIndex = getBackgroundZoomBandIndex();

  if (activeBackgroundZoomBandIndex === null) {
    activeBackgroundZoomBandIndex = targetIndex;
    return backgroundZoomBands[activeBackgroundZoomBandIndex];
  }

  if (targetIndex > activeBackgroundZoomBandIndex) {
    const currentBand = backgroundZoomBands[activeBackgroundZoomBandIndex];

    if (cameraZoom > currentBand.maxZoom * (1 + backgroundZoomBandHysteresis)) {
      activeBackgroundZoomBandIndex = targetIndex;
    }
  } else if (targetIndex < activeBackgroundZoomBandIndex) {
    const previousBand = backgroundZoomBands[activeBackgroundZoomBandIndex - 1];

    if (cameraZoom <= previousBand.maxZoom * (1 - backgroundZoomBandHysteresis)) {
      activeBackgroundZoomBandIndex = targetIndex;
    }
  }

  return backgroundZoomBands[activeBackgroundZoomBandIndex];
}

function getBackgroundZoomBandIndex() {
  for (let i = 0; i < backgroundZoomBands.length; i++) {
    if (cameraZoom <= backgroundZoomBands[i].maxZoom) {
      return i;
    }
  }

  return backgroundZoomBands.length - 1;
}

function drawStarField() {
  noStroke();
  visibleGalaxyCores = [];
  backgroundImageBuildsThisFrame = 0;
  cosmicImageBuildsThisFrame = 0;

  for (
    let layerIndex = 0;
    layerIndex < starParallaxLayers.length;
    layerIndex++
  ) {
    const layer = starParallaxLayers[layerIndex];
    drawCosmicStructures(layer, layerIndex);

    drawStarCells(layer, layerIndex);
  }

  drawVisibleGalaxyCores();
}

function drawStarCells(layer, layerIndex) {
  const zoomBand = getBackgroundZoomBand();
  const tileCellSpan = zoomBand.starTileSpan;
  const tileWorldSize = starCellSize * tileCellSpan;
  const bounds = getParallaxCameraWorldBounds(layer.parallax, starViewPadding);
  const minTileX = floor(bounds.left / tileWorldSize);
  const maxTileX = floor(bounds.right / tileWorldSize);
  const minTileY = floor(bounds.top / tileWorldSize);
  const maxTileY = floor(bounds.bottom / tileWorldSize);

  for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
    for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
      drawStarTile(tileX, tileY, zoomBand, layer, layerIndex);
    }
  }
}

function drawCosmicStructures(layer, layerIndex) {
  const zoomBand = getBackgroundZoomBand();
  const tileCellSpan = zoomBand.cosmicTileSpan;
  const tileWorldSize = cosmicStructureCellSize * tileCellSpan;
  const bounds = getParallaxCameraWorldBounds(layer.parallax, cosmicStructureViewPadding);
  const minTileX = floor(bounds.left / tileWorldSize);
  const maxTileX = floor(bounds.right / tileWorldSize);
  const minTileY = floor(bounds.top / tileWorldSize);
  const maxTileY = floor(bounds.bottom / tileWorldSize);

  for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
    for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
      drawCosmicStructureTileImage(tileX, tileY, zoomBand, layer, layerIndex);
    }
  }
}

function drawCosmicStructureTileImage(
  tileX,
  tileY,
  zoomBand,
  layer,
  layerIndex,
) {
  const tileCellSpan = zoomBand.cosmicTileSpan;
  const structures = getCosmicStructuresForTile(
    tileX,
    tileY,
    tileCellSpan,
    layerIndex,
  );

  if (structures.length <= 0) {
    return;
  }

  queueGalaxyCoresForTile(structures, layer);

  for (const structure of structures) {
    drawCosmicStructureImage(structure, zoomBand, layer, layerIndex);
  }
}

function getCosmicStructuresForTile(tileX, tileY, tileCellSpan, layerIndex) {
  const cacheKey = `${tileCellSpan}:${layerIndex}:${tileX}:${tileY}`;
  const cachedStructures = cosmicStructureTileCache.get(cacheKey);

  if (cachedStructures) {
    cosmicStructureTileCache.delete(cacheKey);
    cosmicStructureTileCache.set(cacheKey, cachedStructures);
    return cachedStructures;
  }

  const structures = buildCosmicStructuresForTile(
    tileX,
    tileY,
    tileCellSpan,
    layerIndex,
  );

  cosmicStructureTileCache.set(cacheKey, structures);

  if (cosmicStructureTileCache.size > maxCosmicStructureTileCacheEntries) {
    cosmicStructureTileCache.delete(cosmicStructureTileCache.keys().next().value);
  }

  return structures;
}

function buildCosmicStructuresForTile(tileX, tileY, tileCellSpan, layerIndex) {
  const structures = [];
  const startCellX = tileX * tileCellSpan;
  const startCellY = tileY * tileCellSpan;

  for (let offsetY = 0; offsetY < tileCellSpan; offsetY++) {
    for (let offsetX = 0; offsetX < tileCellSpan; offsetX++) {
      addCosmicStructuresForCell(
        structures,
        startCellX + offsetX,
        startCellY + offsetY,
        layerIndex,
      );
    }
  }

  return structures;
}

function addCosmicStructuresForCell(structures, cellX, cellY, layerIndex) {
  const seedOffset = layerIndex * 3000;
  const originX = cellX * cosmicStructureCellSize;
  const originY = cellY * cosmicStructureCellSize;
  const centerX =
    originX +
    hashRandom(cellX, cellY, seedOffset + 201) * cosmicStructureCellSize;
  const centerY =
    originY +
    hashRandom(cellX, cellY, seedOffset + 202) * cosmicStructureCellSize;

  if (hasGasClusterInCell(cellX, cellY, layerIndex)) {
    structures.push({
      type: "gas",
      cellX,
      cellY,
      centerX,
      centerY,
      seedOffset,
    });
  }

  if (hasGalaxyInCell(cellX, cellY, layerIndex)) {
    structures.push({
      type: "galaxy",
      cellX,
      cellY,
      centerX,
      centerY,
      seedOffset,
    });
  }

  if (hasNebulaInCell(cellX, cellY, layerIndex)) {
    structures.push({
      type: "nebula",
      cellX,
      cellY,
      centerX,
      centerY,
      seedOffset,
    });
  }
}

function getDirectGasNebulaAlphaScale(structure, layerIndex) {
  const densityScale = getBackgroundZoomBand().gasNebulaDensityScale;
  const visibilityValue = hashRandom(
    structure.cellX,
    structure.cellY,
    layerIndex * 3000 + getDirectGasNebulaVisibilitySeed(structure) + 900,
  );

  return backgroundSmoothstep(
    densityScale + gasNebulaZoomFadeWidth,
    densityScale - gasNebulaZoomFadeWidth,
    visibilityValue,
  );
}

function getDirectGasNebulaVisibilitySeed(structure) {
  return structure.type === "gas" ? 203 : 205;
}

function queueGalaxyCoresForTile(structures, layer) {
  for (const structure of structures) {
    if (structure.type !== "galaxy") {
      continue;
    }

    queueGalaxyCore(
      structure.cellX,
      structure.cellY,
      structure.centerX,
      structure.centerY,
      layer,
      structure.seedOffset,
    );
  }
}

function drawCosmicStructureImage(structure, zoomBand, layer, layerIndex) {
  if (structure.type === "gas" || structure.type === "nebula") {
    const alphaScale = getDirectGasNebulaAlphaScale(structure, layerIndex);

    if (alphaScale <= 0) {
      return;
    }

    if (
      !isBoundsVisibleInParallax(
        getCosmicStructureImageBounds(structure),
        layer.parallax,
      )
    ) {
      return;
    }

    drawDirectCosmicStructure(structure, zoomBand, layer, alphaScale);

    return;
  }

  const bounds = getCosmicStructureImageBounds(structure);

  if (!isBoundsVisibleInParallax(bounds, layer.parallax)) {
    return;
  }

  const imageWidth = bounds.right - bounds.left;
  const imageHeight = bounds.bottom - bounds.top;
  const imageScale = zoomBand.imageScale;
  const cacheKey = `cosmic:${zoomBand.id}:${layerIndex}:${structure.type}:${structure.cellX}:${structure.cellY}`;
  const structureEntry = getBackgroundCellImageEntry(
    cacheKey,
    ceil(imageWidth * imageScale),
    ceil(imageHeight * imageScale),
    "cosmic",
    (graphics) => {
      drawIntoBackgroundImage(
        bounds.left,
        bounds.top,
        graphics,
        imageScale,
        zoomBand.detailScale,
        () => {
          graphics.clear();
          drawCosmicStructure(structure, layer, false);
        },
      );
    },
  );

  if (!structureEntry) {
    return;
  }

  drawBackgroundCellImage(
    structureEntry,
    bounds.left,
    bounds.top,
    layer,
    imageWidth,
    imageHeight,
  );
}

function getCosmicStructureImageBounds(structure) {
  const extent = getCosmicStructureExtent(structure);

  return {
    left: structure.centerX - extent,
    right: structure.centerX + extent,
    top: structure.centerY - extent,
    bottom: structure.centerY + extent,
  };
}

function getCosmicStructureExtent(structure) {
  if (structure.type === "galaxy") {
    const radius = lerp(
      180,
      430,
      hashRandom(structure.cellX, structure.cellY, structure.seedOffset + 231),
    );
    return radius * 1.75;
  }

  if (structure.type === "gas") {
    const spread = lerp(
      180,
      420,
      hashRandom(structure.cellX, structure.cellY, structure.seedOffset + 212),
    );
    return spread + 1050;
  }

  const spread = lerp(
    110,
    260,
    hashRandom(structure.cellX, structure.cellY, structure.seedOffset + 252),
  );
  return spread + 1250;
}

function hasCosmicStructureInCell(cellX, cellY, layerIndex) {
  return (
    hasGasClusterInCell(cellX, cellY, layerIndex) ||
    hasGalaxyInCell(cellX, cellY, layerIndex) ||
    hasNebulaInCell(cellX, cellY, layerIndex)
  );
}

function hasGasClusterInCell(cellX, cellY, layerIndex) {
  const seedOffset = layerIndex * 3000;

  return (
    layerIndex <= maxGasClusterLayer &&
    hashRandom(cellX, cellY, seedOffset + 203) < gasClusterChance
  );
}

function hasGalaxyInCell(cellX, cellY, layerIndex) {
  const seedOffset = layerIndex * 3000;

  return (
    layerIndex <= maxGalaxyNebulaLayer &&
    hashRandom(cellX, cellY, seedOffset + 204) < galaxyChance
  );
}

function hasNebulaInCell(cellX, cellY, layerIndex) {
  const seedOffset = layerIndex * 3000;

  return (
    layerIndex <= maxGalaxyNebulaLayer &&
    hashRandom(cellX, cellY, seedOffset + 205) < nebulaChance
  );
}

function drawGalaxyCore(
  cellX,
  cellY,
  centerX,
  centerY,
  coreRadius,
  angle,
  layer,
  seedOffset,
) {
  const visualCoreRadius = coreRadius * 0.5;

  noStroke();

  for (let i = 7; i >= 1; i--) {
    const ratio = i / 7;
    const glowRadius = visualCoreRadius * lerp(8.5, 1.1, 1 - ratio);
    const alpha = 10 * ratio * ratio * layer.alphaScale;

    drawGalaxyCoreEllipse(
      centerX,
      centerY,
      glowRadius,
      glowRadius * 0.62,
      angle,
      [255, 100, 100],
      alpha,
      layer.parallax,
    );
  }

  let mainCoreRadiusStretched = visualCoreRadius * 0.58;

  drawGalaxyCoreEllipse(
    centerX,
    centerY,
    visualCoreRadius,
    mainCoreRadiusStretched,
    angle,
    [255, 255, 255],
    255,
    layer.parallax,
  );
  for (let i = 1; i <= galaxyCoreBloomLevelCount; i++) {
    drawGalaxyCoreEllipse(
      centerX,
      centerY,
      visualCoreRadius * (1 + i * 0.1),
      mainCoreRadiusStretched * (1 + i * 0.1),
      angle,
      [255, 255, 255],
      map(i, 1, galaxyCoreBloomLevelCount, 100, 0),
      layer.parallax,
    );
  }
}

function queueGalaxyCore(cellX, cellY, centerX, centerY, layer, seedOffset) {
  const angle = hashRandom(cellX, cellY, seedOffset + 230) * TWO_PI;
  const radius = lerp(180, 430, hashRandom(cellX, cellY, seedOffset + 231));
  const coreRadius =
    radius * lerp(0.12, 0.22, hashRandom(cellX, cellY, seedOffset + 233));

  visibleGalaxyCores.push({
    cellX,
    cellY,
    centerX,
    centerY,
    coreRadius,
    angle,
    layer,
    seedOffset,
  });
}

function drawVisibleGalaxyCores() {
  for (const core of visibleGalaxyCores) {
    drawGalaxyCore(
      core.cellX,
      core.cellY,
      core.centerX,
      core.centerY,
      core.coreRadius,
      core.angle,
      core.layer,
      core.seedOffset,
    );
  }
}

function drawCosmicStructure(structure, layer, shouldDrawGalaxyCore = true) {
  if (structure.type === "gas") {
    drawGasCluster(
      structure.cellX,
      structure.cellY,
      structure.centerX,
      structure.centerY,
      layer,
      structure.seedOffset,
    );
    return;
  }

  if (structure.type === "galaxy") {
    drawDistantGalaxy(
      structure.cellX,
      structure.cellY,
      structure.centerX,
      structure.centerY,
      layer,
      structure.seedOffset,
      shouldDrawGalaxyCore,
    );
    return;
  }

  if (structure.type === "nebula") {
    drawNebula(
      structure.cellX,
      structure.cellY,
      structure.centerX,
      structure.centerY,
      layer,
      structure.seedOffset,
    );
  }
}

function drawDirectCosmicStructure(structure, zoomBand, layer, alphaScale) {
  const previousDirectDetailScale = directBackgroundDetailScale;
  const previousDirectAlphaScale = directBackgroundAlphaScale;

  directBackgroundDetailScale = zoomBand.detailScale;
  directBackgroundAlphaScale = alphaScale;

  try {
    drawCosmicStructure(structure, layer, false);
  } finally {
    directBackgroundDetailScale = previousDirectDetailScale;
    directBackgroundAlphaScale = previousDirectAlphaScale;
  }
}

function drawCosmicStructureCell(
  cellX,
  cellY,
  layer,
  layerIndex,
  shouldDrawGalaxyCore = true,
) {
  const seedOffset = layerIndex * 3000;
  const originX = cellX * cosmicStructureCellSize;
  const originY = cellY * cosmicStructureCellSize;
  const centerX =
    originX +
    hashRandom(cellX, cellY, seedOffset + 201) * cosmicStructureCellSize;
  const centerY =
    originY +
    hashRandom(cellX, cellY, seedOffset + 202) * cosmicStructureCellSize;

  if (hasGasClusterInCell(cellX, cellY, layerIndex)) {
    drawCosmicStructure(
      { type: "gas", cellX, cellY, centerX, centerY, seedOffset },
      layer,
      shouldDrawGalaxyCore,
    );
  }

  if (hasGalaxyInCell(cellX, cellY, layerIndex)) {
    drawCosmicStructure(
      { type: "galaxy", cellX, cellY, centerX, centerY, seedOffset },
      layer,
      shouldDrawGalaxyCore,
    );
  }

  if (hasNebulaInCell(cellX, cellY, layerIndex)) {
    drawCosmicStructure(
      { type: "nebula", cellX, cellY, centerX, centerY, seedOffset },
      layer,
      shouldDrawGalaxyCore,
    );
  }
}

function drawGasCluster(cellX, cellY, centerX, centerY, layer, seedOffset) {
  const colorIndex = floor(
    hashRandom(cellX, cellY, seedOffset + 210) * gasClusterPalette.length,
  );
  const gasColor = gasClusterPalette[colorIndex];
  const cloudCount = getScaledDetailCount(
    floor(lerp(4, 9, hashRandom(cellX, cellY, seedOffset + 211))),
    2,
  );
  const spread = lerp(180, 420, hashRandom(cellX, cellY, seedOffset + 212));

  for (let i = 0; i < cloudCount; i++) {
    const angle = hashRandom(cellX, cellY, seedOffset + i * 4 + 213) * TWO_PI;
    const distance =
      pow(hashRandom(cellX, cellY, seedOffset + i * 4 + 214), 0.8) * spread;
    const radius = lerp(
      120,
      280,
      hashRandom(cellX, cellY, seedOffset + i * 4 + 215),
    );
    const alpha =
      lerp(10, 24, hashRandom(cellX, cellY, seedOffset + i * 4 + 216)) *
      layer.alphaScale;

    drawTexturedNebulaCloud(
      cellX,
      cellY,
      seedOffset + i * 30 + 218,
      centerX + cos(angle) * distance,
      centerY + sin(angle) * distance,
      radius,
      radius *
        lerp(0.55, 1.25, hashRandom(cellX, cellY, seedOffset + i * 4 + 217)),
      angle,
      gasColor,
      alpha,
      layer.parallax,
    );
  }
}

function drawDistantGalaxy(
  cellX,
  cellY,
  centerX,
  centerY,
  layer,
  seedOffset,
  shouldDrawCore = true,
) {
  const angle = hashRandom(cellX, cellY, seedOffset + 230) * TWO_PI;
  const radius = lerp(180, 430, hashRandom(cellX, cellY, seedOffset + 231));
  const armCount = calculateGalaxyArmCount(cellX, cellY, seedOffset);
  const flattening = lerp(
    0.18,
    0.38,
    hashRandom(cellX, cellY, seedOffset + 232),
  );
  const coreRadius =
    radius * lerp(0.12, 0.22, hashRandom(cellX, cellY, seedOffset + 233));

  drawGalaxyDiskBase(centerX, centerY, radius, flattening, angle, layer);
  drawGalaxyGasLayer(
    cellX,
    cellY,
    centerX,
    centerY,
    layer,
    seedOffset,
    angle,
    radius,
    flattening,
    armCount,
    0,
  );
  drawGalaxySpiralStars(
    cellX,
    cellY,
    centerX,
    centerY,
    layer,
    seedOffset,
    angle,
    radius,
    flattening,
    armCount,
  );
  drawGalaxyGasLayer(
    cellX,
    cellY,
    centerX,
    centerY,
    layer,
    seedOffset,
    angle,
    radius,
    flattening,
    armCount,
    1,
  );
  drawGalaxyDustLanes(
    cellX,
    cellY,
    centerX,
    centerY,
    layer,
    seedOffset,
    angle,
    radius,
    flattening,
    armCount,
  );

  if (shouldDrawCore) {
    drawGalaxyCore(
      cellX,
      cellY,
      centerX,
      centerY,
      coreRadius,
      angle,
      layer,
      seedOffset,
    );
  }
}

function drawGalaxyDiskBase(
  centerX,
  centerY,
  radius,
  flattening,
  angle,
  layer,
) {
  drawParallaxCloud(
    centerX,
    centerY,
    radius * 1.12,
    radius * flattening,
    angle,
    [75, 120, 210],
    1.2 * layer.alphaScale,
    layer.parallax,
    0,
  );
}

function calculateGalaxyArmCount(cellX, cellY, seedOffset) {
  return floor(
    lerp(
      minGalaxyArmCount,
      maxGalaxyArmCount + 1,
      hashRandom(cellX, cellY, seedOffset + 234),
    ),
  );
}

function drawGalaxyGasLayer(
  cellX,
  cellY,
  centerX,
  centerY,
  layer,
  seedOffset,
  galaxyAngle,
  radius,
  flattening,
  armCount,
  layerPass,
) {
  const cloudCount = getScaledDetailCount(galaxyGasCloudsPerLayer, 45);

  for (let i = 0; i < cloudCount; i++) {
    const seed = seedOffset + layerPass * 5000 + i * 9 + 620;
    const arm = floor(hashRandom(cellX, cellY, seed) * armCount);
    const ratio = lerp(
      galaxyCoreStarExclusionRatio * 0.75,
      1,
      pow(hashRandom(cellX, cellY, seed + 1), galaxyGasOrbitExponent),
    );
    const point = getGalaxySpiralScatterPoint(
      cellX,
      cellY,
      seed,
      arm,
      ratio,
      radius,
      flattening,
      galaxyAngle,
      armCount,
      seedOffset,
    );
    const gasColor = mixColor(
      getPaletteColor(galaxyGasPalette, hashRandom(cellX, cellY, seed + 4)),
      getPaletteColor(galaxyStarPalette, hashRandom(cellX, cellY, seed + 5)),
      lerp(0.12, 0.38, 1 - ratio),
    );
    const gasRadius =
      lerp(
        minStarRadius * 0.5,
        maxStarRadius * 2,
        hashRandom(cellX, cellY, seed + 6),
      ) *
      lerp(1.25, 0.55, ratio) *
      layer.radiusScale;
    const alpha =
      lerp(9, 2, ratio) *
      lerp(0.45, 1, hashRandom(cellX, cellY, seed + 7)) *
      layer.alphaScale *
      (layerPass === 0 ? 1.0 : 0.7);

    drawGalaxyParticle(
      centerX + point.x,
      centerY + point.y,
      gasRadius,
      gasColor,
      alpha,
      layer.parallax,
      lerp(5, 9, hashRandom(cellX, cellY, seed + 8)),
    );
  }
}

function drawGalaxySpiralStars(
  cellX,
  cellY,
  centerX,
  centerY,
  layer,
  seedOffset,
  galaxyAngle,
  radius,
  flattening,
  armCount,
) {
  const cloudsPerArm = getScaledDetailCount(galaxyCloudsPerArm, 55);

  for (let arm = 0; arm < armCount; arm++) {
    for (let i = 0; i < cloudsPerArm; i++) {
      const seed = seedOffset + arm * 3000 + i * 20 + 300;
      const normalizedIndex = (i + 1) / cloudsPerArm;
      const ratio = lerp(
        galaxyCoreStarExclusionRatio,
        1,
        pow(normalizedIndex, galaxyStarOrbitExponent),
      );
      const point = getGalaxySpiralScatterPoint(
        cellX,
        cellY,
        seed,
        arm,
        ratio,
        radius,
        flattening,
        galaxyAngle,
        armCount,
        seedOffset,
      );
      const starColor = mixColor(
        getPaletteColor(galaxyStarPalette, hashRandom(cellX, cellY, seed + 6)),
        getPaletteColor(galaxyStarPalette, hashRandom(cellX, cellY, seed + 7)),
        hashRandom(cellX, cellY, seed + 8) * lerp(0.15, 0.55, 1 - ratio),
      );
      const starRadius =
        lerp(minStarRadius, maxStarRadius, hashRandom(cellX, cellY, seed + 9)) *
        lerp(1.1, 0.55, ratio) *
        layer.radiusScale;
      const alpha =
        lerp(80, 185, hashRandom(cellX, cellY, seed + 10)) *
        lerp(1.0, 0.45, ratio) *
        layer.alphaScale;

      drawGalaxyParticle(
        centerX + point.x,
        centerY + point.y,
        starRadius,
        starColor,
        alpha,
        layer.parallax,
        lerp(2.5, 5.5, hashRandom(cellX, cellY, seed + 11)),
      );

      const clusterChance =
        galaxyClusterChance *
        lerp(galaxyInnerClusterBoost, galaxyOuterClusterScale, ratio);

      if (hashRandom(cellX, cellY, seed + 12) < clusterChance) {
        drawGalaxyStarCluster(
          cellX,
          cellY,
          seed,
          centerX + point.x,
          centerY + point.y,
          starRadius,
          starColor,
          alpha * lerp(1.25, 0.75, ratio),
          layer,
          point,
        );
      }
    }
  }
}

function drawGalaxyStarCluster(
  cellX,
  cellY,
  seed,
  centerX,
  centerY,
  starRadius,
  starColor,
  alpha,
  layer,
  spiralPoint,
) {
  const starCount = getScaledDetailCount(
    floor(
      lerp(
        galaxyClusterStarsMin,
        galaxyClusterStarsMax + 1,
        hashRandom(cellX, cellY, seed + 11),
      ),
    ),
    3,
  );
  const clusterRadius =
    starRadius * lerp(4, 10, hashRandom(cellX, cellY, seed + 12));

  for (let i = 0; i < starCount; i++) {
    const angle = hashRandom(cellX, cellY, seed + i * 3 + 13) * TWO_PI;
    const distance =
      pow(hashRandom(cellX, cellY, seed + i * 3 + 14), 1.8) * clusterRadius;
    const clumpRatio = 1 - distance / clusterRadius;
    const tangentOffset =
      cos(angle) * distance * galaxyClusterTangentStretch;
    const normalOffset = sin(angle) * distance * galaxyClusterNormalSqueeze;
    const offsetX =
      spiralPoint.tangentX * tangentOffset + spiralPoint.normalX * normalOffset;
    const offsetY =
      spiralPoint.tangentY * tangentOffset + spiralPoint.normalY * normalOffset;

    drawGalaxyParticle(
      centerX + offsetX,
      centerY + offsetY,
      starRadius * lerp(0.75, 1.85, clumpRatio),
      starColor,
      alpha * lerp(0.5, 1.25, clumpRatio),
      layer.parallax,
      lerp(2.5, 6.5, clumpRatio),
    );
  }
}

function drawGalaxyDustLanes(
  cellX,
  cellY,
  centerX,
  centerY,
  layer,
  seedOffset,
  galaxyAngle,
  radius,
  flattening,
  armCount,
) {
  const laneCount = getScaledDetailCount(galaxyDustLaneCount, 4);

  for (let i = 0; i < laneCount; i++) {
    const ratio = lerp(0.22, 0.96, i / max(laneCount - 1, 1));
    const laneAngle =
      ratio * 4.5 +
      lerp(-0.5, 0.5, hashRandom(cellX, cellY, seedOffset + i * 8 + 420));
    const orbitRadius = radius * ratio;
    const arm = i % armCount;
    const armOffset = (arm * TWO_PI) / armCount;
    const localStart = {
      x: cos(armOffset + laneAngle - 0.28) * orbitRadius,
      y: sin(armOffset + laneAngle - 0.28) * orbitRadius * flattening,
    };
    const localMid = {
      x: cos(armOffset + laneAngle) * orbitRadius * 1.04,
      y: sin(armOffset + laneAngle) * orbitRadius * flattening * 1.04,
    };
    const localEnd = {
      x: cos(armOffset + laneAngle + 0.36) * orbitRadius * 1.08,
      y: sin(armOffset + laneAngle + 0.36) * orbitRadius * flattening * 1.08,
    };
    const start = rotateLocalPoint(localStart.x, localStart.y, galaxyAngle);
    const mid = rotateLocalPoint(localMid.x, localMid.y, galaxyAngle);
    const end = rotateLocalPoint(localEnd.x, localEnd.y, galaxyAngle);

    drawTaperedParallaxCurve(
      centerX + start.x,
      centerY + start.y,
      centerX + mid.x,
      centerY + mid.y,
      centerX + end.x,
      centerY + end.y,
      nebulaDustColor,
      lerp(10, 3, ratio) * layer.alphaScale,
      lerp(3.2, 0.8, ratio),
      0.25,
      layer.parallax,
    );
  }
}

function drawGalaxyCoreEllipse(
  x,
  y,
  radiusX,
  radiusY,
  angle,
  ellipseColor,
  alpha,
  parallax,
) {
  const drawPoint = getParallaxDrawPosition(x, y, parallax);

  bgPush();
  bgTranslate(drawPoint.x, drawPoint.y);
  bgRotate(angle);
  bgNoStroke();
  bgFill(ellipseColor[0], ellipseColor[1], ellipseColor[2], alpha);
  bgEllipse(0, 0, radiusX * 2, radiusY * 2);
  bgPop();
}

function drawGalaxyParticle(
  x,
  y,
  radius,
  particleColor,
  alpha,
  parallax,
  glowScale = 3,
) {
  const drawPoint = getParallaxDrawPosition(x, y, parallax);

  bgNoStroke();

  if (radius > 0.85) {
    bgFill(particleColor[0], particleColor[1], particleColor[2], alpha * 0.18);
    bgCircle(drawPoint.x, drawPoint.y, radius * glowScale);
  }

  bgFill(particleColor[0], particleColor[1], particleColor[2], alpha);
  bgCircle(drawPoint.x, drawPoint.y, radius * 2);
}

function getGalaxySpiralPoint(
  armOffset,
  ratio,
  bend,
  radius,
  flattening,
  galaxyAngle,
) {
  const spiralAngle = armOffset + ratio * bend;
  const orbitRadius = radius * lerp(0.08, 1.0, pow(ratio, 0.84));
  const localX = cos(spiralAngle) * orbitRadius;
  const localY = sin(spiralAngle) * orbitRadius * flattening;

  return rotateLocalPoint(localX, localY, galaxyAngle);
}

function getGalaxySpiralScatterPoint(
  cellX,
  cellY,
  seed,
  arm,
  ratio,
  radius,
  flattening,
  galaxyAngle,
  armCount,
  galaxySeedOffset,
) {
  const armOffset = (arm * TWO_PI) / armCount;
  const bend = getGalaxyArmBend(cellX, cellY, galaxySeedOffset, arm);
  const jitter =
    lerp(
      -galaxyArmAngularJitter,
      galaxyArmAngularJitter,
      hashRandom(cellX, cellY, seed + 3),
    ) *
    lerp(1.0, 0.45, ratio);
  const crossArmOffset =
    lerp(-1, 1, hashRandom(cellX, cellY, seed + 4)) *
    radius *
    lerp(galaxyInnerArmWidthScale, galaxyOuterArmWidthScale, ratio);
  const point = getGalaxySpiralPoint(
    armOffset + jitter,
    ratio,
    bend,
    radius,
    flattening,
    galaxyAngle,
  );
  const tangentAngle = armOffset + ratio * bend + HALF_PI;
  const localTangent = {
    x: cos(tangentAngle),
    y: sin(tangentAngle) * flattening,
  };
  const localNormal = {
    x: cos(tangentAngle + HALF_PI),
    y: sin(tangentAngle + HALF_PI) * flattening,
  };
  const normalOffset = rotateLocalPoint(
    localNormal.x * crossArmOffset,
    localNormal.y * crossArmOffset,
    galaxyAngle,
  );
  const tangent = normalizePoint(
    rotateLocalPoint(
      localTangent.x,
      localTangent.y,
      galaxyAngle,
    ),
  );
  const normal = normalizePoint(
    rotateLocalPoint(
      localNormal.x,
      localNormal.y,
      galaxyAngle,
    ),
  );

  return {
    x: point.x + normalOffset.x,
    y: point.y + normalOffset.y,
    tangentX: tangent.x,
    tangentY: tangent.y,
    normalX: normal.x,
    normalY: normal.y,
  };
}

function getGalaxyArmBend(cellX, cellY, seedOffset, arm) {
  return lerp(
    galaxyArmBendMin,
    galaxyArmBendMax,
    hashRandom(cellX, cellY, seedOffset + arm * 37 + 236),
  );
}

function normalizePoint(point) {
  const magnitude = sqrt(point.x * point.x + point.y * point.y);

  if (magnitude <= 0) {
    return { x: 1, y: 0 };
  }

  return {
    x: point.x / magnitude,
    y: point.y / magnitude,
  };
}

function drawNebula(cellX, cellY, centerX, centerY, layer, seedOffset) {
  const colorIndex = floor(
    hashRandom(cellX, cellY, seedOffset + 250) * nebulaPalette.length,
  );
  const nebulaColor = nebulaPalette[colorIndex];
  const lobeCount = getScaledDetailCount(
    floor(lerp(5, 10, hashRandom(cellX, cellY, seedOffset + 251))),
    2,
  );
  const spread = lerp(110, 260, hashRandom(cellX, cellY, seedOffset + 252));
  const baseAngle = hashRandom(cellX, cellY, seedOffset + 258) * TWO_PI;

  drawTexturedNebulaCloud(
    cellX,
    cellY,
    seedOffset + 360,
    centerX,
    centerY,
    spread * 1.45,
    spread * 0.95,
    baseAngle,
    nebulaColor,
    10 * layer.alphaScale,
    layer.parallax,
  );

  drawTexturedNebulaCloud(
    cellX,
    cellY,
    seedOffset + 390,
    centerX,
    centerY,
    spread * 0.72,
    spread * 0.42,
    baseAngle + HALF_PI * 0.2,
    nebulaCoreColor,
    24 * layer.alphaScale,
    layer.parallax,
  );

  for (let i = 0; i < lobeCount; i++) {
    const angle = hashRandom(cellX, cellY, seedOffset + i * 5 + 253) * TWO_PI;
    const distance =
      pow(hashRandom(cellX, cellY, seedOffset + i * 5 + 254), 0.65) * spread;
    const radius = lerp(
      75,
      190,
      hashRandom(cellX, cellY, seedOffset + i * 5 + 255),
    );
    const alpha = lerp(
      12,
      32,
      hashRandom(cellX, cellY, seedOffset + i * 5 + 256),
    );

    drawTexturedNebulaCloud(
      cellX,
      cellY,
      seedOffset + i * 40 + 410,
      centerX + cos(angle) * distance,
      centerY + sin(angle) * distance,
      radius,
      radius *
        lerp(0.45, 1.1, hashRandom(cellX, cellY, seedOffset + i * 5 + 257)),
      angle + baseAngle * 0.35,
      nebulaColor,
      alpha * layer.alphaScale,
      layer.parallax,
    );
  }

  drawNebulaFilaments(
    cellX,
    cellY,
    centerX,
    centerY,
    layer,
    seedOffset,
    spread,
  );
  drawNebulaPillars(cellX, cellY, centerX, centerY, layer, seedOffset);
  drawNebulaSparks(cellX, cellY, centerX, centerY, layer, seedOffset, spread);
}

function drawTexturedNebulaCloud(
  cellX,
  cellY,
  seed,
  x,
  y,
  radiusX,
  radiusY,
  angle,
  cloudColor,
  alpha,
  parallax,
) {
  drawParallaxCloud(
    x,
    y,
    radiusX,
    radiusY,
    angle,
    cloudColor,
    alpha * 0.28,
    parallax,
    0,
  );

  const textureBlobCount = getScaledDetailCount(nebulaTextureBlobCount, 5);

  for (let i = 0; i < textureBlobCount; i++) {
    const localAngle = hashRandom(cellX, cellY, seed + i * 7) * TWO_PI;
    const localDistance =
      pow(hashRandom(cellX, cellY, seed + i * 7 + 1), 0.7) * 0.86;
    const offsetX = cos(localAngle) * radiusX * localDistance;
    const offsetY = sin(localAngle) * radiusY * localDistance;
    const rotatedX = offsetX * cos(angle) - offsetY * sin(angle);
    const rotatedY = offsetX * sin(angle) + offsetY * cos(angle);
    const blobRadiusX =
      radiusX * lerp(0.16, 0.48, hashRandom(cellX, cellY, seed + i * 7 + 2));
    const blobRadiusY =
      radiusY * lerp(0.14, 0.5, hashRandom(cellX, cellY, seed + i * 7 + 3));
    const warmth = hashRandom(cellX, cellY, seed + i * 7 + 4);
    const blobColor = mixColor(cloudColor, nebulaCoreColor, warmth * 0.32);

    drawParallaxCloud(
      x + rotatedX,
      y + rotatedY,
      blobRadiusX,
      blobRadiusY,
      angle + lerp(-0.9, 0.9, hashRandom(cellX, cellY, seed + i * 7 + 5)),
      blobColor,
      alpha * lerp(0.08, 0.28, hashRandom(cellX, cellY, seed + i * 7 + 6)),
      parallax,
      0,
    );
  }

  const darkPocketCount = getScaledDetailCount(nebulaDarkPocketCount, 2);

  for (let i = 0; i < darkPocketCount; i++) {
    const localAngle = hashRandom(cellX, cellY, seed + i * 5 + 160) * TWO_PI;
    const localDistance =
      pow(hashRandom(cellX, cellY, seed + i * 5 + 161), 0.55) * 0.72;
    const offsetX = cos(localAngle) * radiusX * localDistance;
    const offsetY = sin(localAngle) * radiusY * localDistance;
    const rotatedX = offsetX * cos(angle) - offsetY * sin(angle);
    const rotatedY = offsetX * sin(angle) + offsetY * cos(angle);

    drawParallaxCloud(
      x + rotatedX,
      y + rotatedY,
      radiusX * lerp(0.08, 0.24, hashRandom(cellX, cellY, seed + i * 5 + 162)),
      radiusY * lerp(0.08, 0.28, hashRandom(cellX, cellY, seed + i * 5 + 163)),
      angle + lerp(-1.2, 1.2, hashRandom(cellX, cellY, seed + i * 5 + 164)),
      nebulaDustColor,
      alpha * 0.85,
      parallax,
      0,
    );
  }
}

function drawNebulaFilaments(
  cellX,
  cellY,
  centerX,
  centerY,
  layer,
  seedOffset,
  spread,
) {
  const filamentCount = getScaledDetailCount(nebulaFilamentCount, 3);

  for (let i = 0; i < filamentCount; i++) {
    const angle = hashRandom(cellX, cellY, seedOffset + i * 9 + 520) * TWO_PI;
    const length = lerp(
      spread * 0.35,
      spread * 1.45,
      hashRandom(cellX, cellY, seedOffset + i * 9 + 521),
    );
    const startDistance =
      hashRandom(cellX, cellY, seedOffset + i * 9 + 522) * spread * 0.45;
    const bend = lerp(
      -0.75,
      0.75,
      hashRandom(cellX, cellY, seedOffset + i * 9 + 523),
    );
    const startX = centerX + cos(angle) * startDistance;
    const startY = centerY + sin(angle) * startDistance;
    const midX = startX + cos(angle + bend * 0.55) * length * 0.55;
    const midY = startY + sin(angle + bend * 0.55) * length * 0.55;
    const endX = startX + cos(angle + bend) * length;
    const endY = startY + sin(angle + bend) * length;
    const alpha =
      lerp(5, 18, hashRandom(cellX, cellY, seedOffset + i * 9 + 524)) *
      layer.alphaScale;

    drawTaperedParallaxCurve(
      startX,
      startY,
      midX,
      midY,
      endX,
      endY,
      nebulaRimColor,
      alpha,
      lerp(0.6, 2.2, hashRandom(cellX, cellY, seedOffset + i * 9 + 525)),
      0.12,
      layer.parallax,
    );
  }
}

function drawNebulaPillars(cellX, cellY, centerX, centerY, layer, seedOffset) {
  const pillarCount = getScaledDetailCount(
    floor(
      lerp(
        nebulaPillarCountMin,
        nebulaPillarCountMax + 1,
        hashRandom(cellX, cellY, seedOffset + 270),
      ),
    ),
    1,
  );

  for (let pillar = 0; pillar < pillarCount; pillar++) {
    const pillarSeed = seedOffset + pillar * 20;
    const angle =
      -HALF_PI + lerp(-0.55, 0.55, hashRandom(cellX, cellY, pillarSeed + 271));
    const length = lerp(150, 340, hashRandom(cellX, cellY, pillarSeed + 272));
    const baseDistance = lerp(
      35,
      125,
      hashRandom(cellX, cellY, pillarSeed + 273),
    );
    const sideOffset = lerp(
      -145,
      145,
      hashRandom(cellX, cellY, pillarSeed + 274),
    );
    const baseX = centerX + cos(angle + HALF_PI) * sideOffset;
    const baseY = centerY + sin(angle + HALF_PI) * sideOffset + baseDistance;
    const segments = getScaledDetailCount(
      floor(
        lerp(
          nebulaPillarSegmentsMin,
          nebulaPillarSegmentsMax + 1,
          hashRandom(cellX, cellY, pillarSeed + 275),
        ),
      ),
      3,
    );
    const wobblePhase = hashRandom(cellX, cellY, pillarSeed + 276) * TWO_PI;
    const pillarPoints = [];

    for (let segment = 0; segment < segments; segment++) {
      const ratio = segment / max(segments - 1, 1);
      const wobble =
        sin(ratio * PI * 2 + wobblePhase) * 28 * (1 - ratio * 0.35);
      const x =
        baseX + cos(angle) * length * ratio + cos(angle + HALF_PI) * wobble;
      const y =
        baseY + sin(angle) * length * ratio + sin(angle + HALF_PI) * wobble;
      const radius =
        lerp(58, 18, ratio) *
        lerp(
          0.75,
          1.35,
          hashRandom(cellX, cellY, seedOffset + pillar * 40 + segment + 280),
        );

      pillarPoints.push({ x, y, radius, ratio });

      drawParallaxCloud(
        x,
        y,
        radius * 0.72,
        radius * 1.4,
        angle,
        nebulaDustColor,
        lerp(24, 44, 1 - ratio) * layer.alphaScale,
        layer.parallax,
        0,
      );

      drawParallaxCloud(
        x + cos(angle - HALF_PI) * radius * 0.46,
        y + sin(angle - HALF_PI) * radius * 0.46,
        radius * 0.16,
        radius * 1.1,
        angle,
        nebulaRimColor,
        lerp(2, 7, 1 - ratio) * layer.alphaScale,
        layer.parallax,
        0,
      );
    }

    drawNebulaDustSilhouette(pillarPoints, angle, layer);
    drawNebulaPillarRidges(pillarPoints, angle, layer);
  }
}

function drawNebulaDustSilhouette(points, angle, layer) {
  if (points.length < 2) {
    return;
  }

  const leftEdge = [];
  const rightEdge = [];

  for (const point of points) {
    const width = point.radius * lerp(0.95, 0.38, point.ratio);
    leftEdge.push({
      x: point.x + cos(angle - HALF_PI) * width,
      y: point.y + sin(angle - HALF_PI) * width,
    });
    rightEdge.unshift({
      x: point.x + cos(angle + HALF_PI) * width * 0.82,
      y: point.y + sin(angle + HALF_PI) * width * 0.82,
    });
  }

  drawParallaxPolygon(
    [...leftEdge, ...rightEdge],
    nebulaDustColor,
    82 * layer.alphaScale,
    layer.parallax,
  );
}

function drawNebulaPillarRidges(points, angle, layer) {
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const point = points[i];
    const ridgeOffset = point.radius * 0.72;
    const startX = previous.x + cos(angle - HALF_PI) * ridgeOffset;
    const startY = previous.y + sin(angle - HALF_PI) * ridgeOffset;
    const endX = point.x + cos(angle - HALF_PI) * ridgeOffset * 0.65;
    const endY = point.y + sin(angle - HALF_PI) * ridgeOffset * 0.65;
    const midX = (startX + endX) * 0.5 + cos(angle - HALF_PI) * point.radius;
    const midY = (startY + endY) * 0.5 + sin(angle - HALF_PI) * point.radius;

    drawTaperedParallaxCurve(
      startX,
      startY,
      midX,
      midY,
      endX,
      endY,
      nebulaRimColor,
      lerp(8, 2, point.ratio) * layer.alphaScale,
      lerp(1.1, 0.45, point.ratio),
      0.2,
      layer.parallax,
    );
  }
}

function drawNebulaSparks(
  cellX,
  cellY,
  centerX,
  centerY,
  layer,
  seedOffset,
  spread,
) {
  const sparkCount = floor(
    lerp(10, 22, hashRandom(cellX, cellY, seedOffset + 320)),
  );

  for (let i = 0; i < sparkCount; i++) {
    const angle = hashRandom(cellX, cellY, seedOffset + i * 3 + 321) * TWO_PI;
    const distance =
      pow(hashRandom(cellX, cellY, seedOffset + i * 3 + 322), 0.55) *
      spread *
      1.2;
    const radius = lerp(
      0.65,
      1.9,
      hashRandom(cellX, cellY, seedOffset + i * 3 + 323),
    );
    const alpha = lerp(
      60,
      160,
      hashRandom(cellX, cellY, seedOffset + i * 3 + 324),
    );

    drawStarAtParallax(
      centerX + cos(angle) * distance,
      centerY + sin(angle) * distance,
      radius * layer.radiusScale,
      alpha * layer.alphaScale,
      layer.parallax,
    );
  }
}

function drawParallaxCloud(
  x,
  y,
  radiusX,
  radiusY,
  angle,
  cloudColor,
  alpha,
  parallax,
  coreRatio = 0.18,
) {
  const drawX = x + cameraPosition.x * (1 - parallax);
  const drawY = y + cameraPosition.y * (1 - parallax);

  bgPush();
  bgTranslate(drawX, drawY);
  bgRotate(angle);
  bgNoStroke();
  bgFill(cloudColor[0], cloudColor[1], cloudColor[2], alpha);
  bgEllipse(0, 0, radiusX * 2, radiusY * 2);

  if (coreRatio > 0) {
    bgFill(255, 255, 255, alpha * 0.18);
    bgEllipse(0, 0, radiusX * coreRatio * 2, radiusY * coreRatio * 2);
  }

  bgPop();
}

function drawTaperedParallaxCurve(
  startX,
  startY,
  controlX,
  controlY,
  endX,
  endY,
  curveColor,
  alpha,
  thickness,
  endThicknessRatio,
  parallax,
) {
  const segmentCount = 8;

  bgPush();
  bgNoFill();

  for (let i = 0; i < segmentCount; i++) {
    const startRatio = i / segmentCount;
    const endRatio = (i + 1) / segmentCount;
    const segmentStart = getQuadraticBezierPoint(
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      startRatio,
    );
    const segmentEnd = getQuadraticBezierPoint(
      startX,
      startY,
      controlX,
      controlY,
      endX,
      endY,
      endRatio,
    );
    const drawStart = getParallaxDrawPosition(
      segmentStart.x,
      segmentStart.y,
      parallax,
    );
    const drawEnd = getParallaxDrawPosition(
      segmentEnd.x,
      segmentEnd.y,
      parallax,
    );
    const taper = 1 - startRatio;

    bgStroke(
      curveColor[0],
      curveColor[1],
      curveColor[2],
      alpha * taper * taper,
    );
    bgStrokeWeight(lerp(thickness * endThicknessRatio, thickness, taper));
    bgLine(drawStart.x, drawStart.y, drawEnd.x, drawEnd.y);
  }

  bgPop();
}

function getQuadraticBezierPoint(
  startX,
  startY,
  controlX,
  controlY,
  endX,
  endY,
  t,
) {
  const inverseT = 1 - t;

  return {
    x:
      inverseT * inverseT * startX + 2 * inverseT * t * controlX + t * t * endX,
    y:
      inverseT * inverseT * startY + 2 * inverseT * t * controlY + t * t * endY,
  };
}

function drawParallaxCurve(
  startX,
  startY,
  controlX,
  controlY,
  endX,
  endY,
  curveColor,
  alpha,
  thickness,
  parallax,
) {
  const start = getParallaxDrawPosition(startX, startY, parallax);
  const control = getParallaxDrawPosition(controlX, controlY, parallax);
  const end = getParallaxDrawPosition(endX, endY, parallax);

  bgPush();
  bgNoFill();
  bgStroke(curveColor[0], curveColor[1], curveColor[2], alpha);
  bgStrokeWeight(thickness);
  bgBezier(
    start.x,
    start.y,
    control.x,
    control.y,
    control.x,
    control.y,
    end.x,
    end.y,
  );
  bgPop();
}

function drawParallaxPolygon(points, polygonColor, alpha, parallax) {
  if (points.length < 3) {
    return;
  }

  bgPush();
  bgNoStroke();
  bgFill(polygonColor[0], polygonColor[1], polygonColor[2], alpha);
  bgBeginShape();

  for (const point of points) {
    const drawPoint = getParallaxDrawPosition(point.x, point.y, parallax);
    bgVertex(drawPoint.x, drawPoint.y);
  }

  bgEndShape(CLOSE);
  bgPop();
}

function getParallaxDrawPosition(x, y, parallax) {
  if (backgroundRenderTarget && !backgroundRenderTarget.isDirect) {
    return {
      x: x - backgroundRenderTarget.originX,
      y: y - backgroundRenderTarget.originY,
    };
  }

  return {
    x: x + cameraPosition.x * (1 - parallax),
    y: y + cameraPosition.y * (1 - parallax),
  };
}

function rotateLocalPoint(x, y, angle) {
  return {
    x: x * cos(angle) - y * sin(angle),
    y: x * sin(angle) + y * cos(angle),
  };
}

function getPaletteColor(palette, value) {
  const index = floor(constrain(value, 0, 0.999999) * palette.length);
  return palette[index];
}

function mixColor(colorA, colorB, amount) {
  return [
    lerp(colorA[0], colorB[0], amount),
    lerp(colorA[1], colorB[1], amount),
    lerp(colorA[2], colorB[2], amount),
  ];
}

function getBackgroundDetailScale() {
  return (
    directBackgroundDetailScale ??
    backgroundRenderTarget?.detailScale ??
    getBackgroundZoomBand().detailScale
  );
}

function getBackgroundAlphaScale() {
  return directBackgroundAlphaScale;
}

function getScaledDetailCount(baseCount, minimumCount = 1) {
  return max(minimumCount, floor(baseCount * getBackgroundDetailScale()));
}

function backgroundSmoothstep(edge0, edge1, value) {
  const t = constrain((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function getParallaxCameraWorldBounds(parallax, padding = 0) {
  const halfWidth = width / (cameraZoom * 2);
  const halfHeight = height / (cameraZoom * 2);
  const offsetX = cameraPosition.x * (1 - parallax);
  const offsetY = cameraPosition.y * (1 - parallax);

  return {
    left: cameraPosition.x - halfWidth - padding - offsetX,
    right: cameraPosition.x + halfWidth + padding - offsetX,
    top: cameraPosition.y - halfHeight - padding - offsetY,
    bottom: cameraPosition.y + halfHeight + padding - offsetY,
  };
}

function isBoundsVisibleInParallax(bounds, parallax) {
  const viewBounds = getParallaxCameraWorldBounds(parallax);

  return (
    bounds.right >= viewBounds.left &&
    bounds.left <= viewBounds.right &&
    bounds.bottom >= viewBounds.top &&
    bounds.top <= viewBounds.bottom
  );
}

function getBackgroundCellImageEntry(
  cacheKey,
  imageWidth,
  imageHeight,
  imageType,
  buildImage,
) {
  const cachedEntry = backgroundImageCache.get(cacheKey);

  if (cachedEntry) {
    backgroundImageCache.delete(cacheKey);
    backgroundImageCache.set(cacheKey, cachedEntry);
    return cachedEntry;
  }

  if (!canBuildBackgroundImage(imageType)) {
    return null;
  }

  backgroundImageBuildsThisFrame++;

  if (imageType === "cosmic") {
    cosmicImageBuildsThisFrame++;
  }

  const cellImage = createGraphics(imageWidth, imageHeight);
  const pixelCount = imageWidth * imageHeight;

  cellImage.pixelDensity(1);
  buildImage(cellImage);
  backgroundImageCache.set(cacheKey, {
    graphics: cellImage,
    pixels: pixelCount,
    createdFrame: frameCount,
  });
  backgroundImageCachePixels += pixelCount;
  pruneBackgroundImageCache();
  return backgroundImageCache.get(cacheKey);
}

function canBuildBackgroundImage(imageType) {
  if (backgroundImageBuildsThisFrame >= maxBackgroundImageBuildsPerFrame) {
    return false;
  }

  return (
    imageType !== "cosmic" ||
    cosmicImageBuildsThisFrame < maxCosmicImageBuildsPerFrame
  );
}

function pruneBackgroundImageCache() {
  while (
    backgroundImageCache.size > maxBackgroundImageCacheEntries ||
    backgroundImageCachePixels > maxBackgroundImageCachePixels
  ) {
    const oldestKey = backgroundImageCache.keys().next().value;
    const oldestEntry = backgroundImageCache.get(oldestKey);

    if (oldestEntry) {
      backgroundImageCachePixels -= oldestEntry.pixels;

      if (
        oldestEntry.graphics &&
        typeof oldestEntry.graphics.remove === "function"
      ) {
        oldestEntry.graphics.remove();
      }
    }

    backgroundImageCache.delete(oldestKey);
  }
}

function drawIntoBackgroundImage(
  originX,
  originY,
  graphics,
  imageScale,
  detailScale,
  drawImageContent,
) {
  const previousTarget = backgroundRenderTarget;

  backgroundRenderTarget = {
    graphics,
    originX,
    originY,
    detailScale,
  };

  try {
    graphics.push();
    graphics.scale(imageScale);
    drawImageContent();
  } finally {
    graphics.pop();
    backgroundRenderTarget = previousTarget;
  }
}

function drawBackgroundCellImage(
  cellImageOrEntry,
  x,
  y,
  layer,
  displayWidth = null,
  displayHeight = null,
  alphaScale = 1,
) {
  const cellImage = cellImageOrEntry.graphics || cellImageOrEntry;
  const imageAlpha = getBackgroundImageAlpha(cellImageOrEntry) * alphaScale;
  const drawX = x + cameraPosition.x * (1 - layer.parallax);
  const drawY = y + cameraPosition.y * (1 - layer.parallax);
  const widthValue = displayWidth ?? cellImage.width;
  const heightValue = displayHeight ?? cellImage.height;

  if (imageAlpha < 1) {
    push();
    tint(255, 255 * imageAlpha);
    image(cellImage, drawX, drawY, widthValue, heightValue);
    pop();
    return;
  }

  image(cellImage, drawX, drawY, widthValue, heightValue);
}

function getBackgroundImageAlpha(cellImageOrEntry) {
  if (backgroundFadeInFrames <= 0 || !cellImageOrEntry.createdFrame) {
    return 1;
  }

  return constrain(
    (frameCount - cellImageOrEntry.createdFrame) / backgroundFadeInFrames,
    0,
    1,
  );
}

function bgPush() {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.push()
    : push();
}

function bgPop() {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.pop()
    : pop();
}

function bgTranslate(x, y) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.translate(x, y)
    : translate(x, y);
}

function bgRotate(angle) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.rotate(angle)
    : rotate(angle);
}

function bgNoStroke() {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.noStroke()
    : noStroke();
}

function bgNoFill() {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.noFill()
    : noFill();
}

function bgFill(r, g, b, a) {
  const scaledAlpha = a === undefined ? a : a * getBackgroundAlphaScale();

  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.fill(r, g, b, scaledAlpha)
    : fill(r, g, b, scaledAlpha);
}

function bgStroke(r, g, b, a) {
  const scaledAlpha = a === undefined ? a : a * getBackgroundAlphaScale();

  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.stroke(r, g, b, scaledAlpha)
    : stroke(r, g, b, scaledAlpha);
}

function bgStrokeWeight(weight) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.strokeWeight(weight)
    : strokeWeight(weight);
}

function bgCircle(x, y, diameter) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.circle(x, y, diameter)
    : circle(x, y, diameter);
}

function bgEllipse(x, y, widthValue, heightValue) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.ellipse(x, y, widthValue, heightValue)
    : ellipse(x, y, widthValue, heightValue);
}

function bgLine(x1, y1, x2, y2) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.line(x1, y1, x2, y2)
    : line(x1, y1, x2, y2);
}

function bgBezier(x1, y1, x2, y2, x3, y3, x4, y4) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.bezier(x1, y1, x2, y2, x3, y3, x4, y4)
    : bezier(x1, y1, x2, y2, x3, y3, x4, y4);
}

function bgBeginShape() {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.beginShape()
    : beginShape();
}

function bgVertex(x, y) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.vertex(x, y)
    : vertex(x, y);
}

function bgEndShape(mode) {
  backgroundRenderTarget && !backgroundRenderTarget.isDirect
    ? backgroundRenderTarget.graphics.endShape(mode)
    : endShape(mode);
}

function drawStarTile(tileX, tileY, zoomBand, layer, layerIndex) {
  const tileCellSpan = zoomBand.starTileSpan;
  const originX = tileX * starCellSize * tileCellSpan;
  const originY = tileY * starCellSize * tileCellSpan;
  const padding = starCellImagePadding;
  const imageWorldSize = starCellSize * tileCellSpan + padding * 2;
  const tileBounds = {
    left: originX - padding,
    right: originX + starCellSize * tileCellSpan + padding,
    top: originY - padding,
    bottom: originY + starCellSize * tileCellSpan + padding,
  };

  if (!isBoundsVisibleInParallax(tileBounds, layer.parallax)) {
    return;
  }

  const imageScale = zoomBand.imageScale;
  const imageSize = ceil(imageWorldSize * imageScale);
  const cacheKey = `stars:${zoomBand.id}:${layerIndex}:${tileX}:${tileY}`;
  const cellEntry = getBackgroundCellImageEntry(
    cacheKey,
    imageSize,
    imageSize,
    "star",
    (graphics) => {
      drawIntoBackgroundImage(
        originX - padding,
        originY - padding,
        graphics,
        imageScale,
        zoomBand.detailScale,
        () => {
          graphics.clear();
          drawStarTileContent(tileX, tileY, tileCellSpan, layer, layerIndex);
        },
      );
    },
  );

  if (!cellEntry) {
    return;
  }

  drawBackgroundCellImage(
    cellEntry,
    originX - padding,
    originY - padding,
    layer,
    imageWorldSize,
    imageWorldSize,
  );
}

function drawStarTileContent(tileX, tileY, tileCellSpan, layer, layerIndex) {
  const startCellX = tileX * tileCellSpan;
  const startCellY = tileY * tileCellSpan;

  for (let offsetY = 0; offsetY < tileCellSpan; offsetY++) {
    for (let offsetX = 0; offsetX < tileCellSpan; offsetX++) {
      const stars = getStarCellData(
        startCellX + offsetX,
        startCellY + offsetY,
        layer,
        layerIndex,
      );

      for (const star of stars) {
        drawStarAtParallax(
          star.x,
          star.y,
          star.radius,
          star.alpha,
          layer.parallax,
          star.starColor,
        );
      }
    }
  }
}

function getStarCellData(cellX, cellY, layer, layerIndex) {
  const cacheKey = `${layerIndex}:${cellX}:${cellY}`;
  const cachedStars = starCellCache.get(cacheKey);

  if (cachedStars) {
    return cachedStars;
  }

  const stars = buildStarCellData(cellX, cellY, layer, layerIndex);
  starCellCache.set(cacheKey, stars);

  if (starCellCache.size > maxStarCellCacheEntries) {
    starCellCache.delete(starCellCache.keys().next().value);
  }

  return stars;
}

function buildStarCellData(cellX, cellY, layer, layerIndex) {
  const originX = cellX * starCellSize;
  const originY = cellY * starCellSize;
  const seedOffset = layerIndex * 1000;
  const stars = [];
  const starCount = floor(
    lerp(
      minStarsPerCell,
      maxStarsPerCell + 1,
      hashRandom(cellX, cellY, seedOffset + 1),
    ),
  );

  for (let i = 0; i < starCount; i++) {
    const x =
      originX + hashRandom(cellX, cellY, seedOffset + i * 4 + 2) * starCellSize;
    const y =
      originY + hashRandom(cellX, cellY, seedOffset + i * 4 + 3) * starCellSize;
    const radius =
      lerp(
        minStarRadius,
        maxStarRadius,
        hashRandom(cellX, cellY, seedOffset + i * 4 + 4),
      ) * layer.radiusScale;
    const alpha =
      lerp(70, 155, hashRandom(cellX, cellY, seedOffset + i * 4 + 5)) *
      layer.alphaScale;
    const starColor = getPaletteColor(
      backgroundStarPalette,
      hashRandom(cellX, cellY, seedOffset + i * 4 + 6),
    );

    stars.push({ x, y, radius, alpha, starColor });
  }

  if (hashRandom(cellX, cellY, seedOffset + 80) <= starClusterChance) {
    addStarClusterToCellData(
      stars,
      cellX,
      cellY,
      originX,
      originY,
      layer,
      layerIndex,
    );
  }

  return stars;
}

function addStarClusterToCellData(
  stars,
  cellX,
  cellY,
  originX,
  originY,
  layer,
  layerIndex,
) {
  const seedOffset = layerIndex * 1000;
  const centerX =
    originX + hashRandom(cellX, cellY, seedOffset + 81) * starCellSize;
  const centerY =
    originY + hashRandom(cellX, cellY, seedOffset + 82) * starCellSize;
  const clusterCount = floor(
    lerp(
      minClusterStars,
      maxClusterStars + 1,
      hashRandom(cellX, cellY, seedOffset + 83),
    ),
  );

  for (let i = 0; i < clusterCount; i++) {
    const angle = hashRandom(cellX, cellY, seedOffset + i * 5 + 84) * TWO_PI;
    const distance =
      pow(hashRandom(cellX, cellY, seedOffset + i * 5 + 85), 1.8) *
      starClusterRadius;
    const clumpRatio = 1 - distance / starClusterRadius;
    const x = centerX + cos(angle) * distance;
    const y = centerY + sin(angle) * distance;
    const radius =
      (lerp(
        minStarRadius,
        maxStarRadius,
        hashRandom(cellX, cellY, seedOffset + i * 5 + 86),
      ) +
        clumpRatio * starClusterRadiusBoost) *
      layer.radiusScale;
    const alpha = lerp(110, 225, clumpRatio) * layer.alphaScale;
    const starColor = getPaletteColor(
      backgroundStarPalette,
      hashRandom(cellX, cellY, seedOffset + i * 5 + 87),
    );

    stars.push({ x, y, radius, alpha, starColor });
  }
}

function drawStarAtParallax(
  x,
  y,
  radius,
  alpha,
  parallax,
  starColor = backgroundStarPalette[0],
) {
  const drawPoint = getParallaxDrawPosition(x, y, parallax);

  bgNoStroke();

  if (radius > maxStarRadius) {
    bgFill(starColor[0], starColor[1], starColor[2], alpha * 0.16);
    bgCircle(drawPoint.x, drawPoint.y, radius * starGlowRadiusScale);
  }

  bgFill(starColor[0], starColor[1], starColor[2], alpha);
  bgCircle(drawPoint.x, drawPoint.y, radius * 2);
}

function hashRandom(a, b, seed = 0) {
  const value = sin(a * 127.1 + b * 311.7 + seed * 74.7) * 43758.5453123;
  return value - floor(value);
}
