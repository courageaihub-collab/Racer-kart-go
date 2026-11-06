import * as THREE from 'three';

export const CHARACTERS = [
  {
    id: 'blaze',
    name: 'Blaze',
    tag: 'Route 77 Fire Racer',
    perk: 'Inferno Boost (+15% Turbo)',
    helmetColor: '#1a5ec4',
    helmetDecal: '#ff4400',
    suitColor: '#2563eb',
    suitAccent: '#ff3b30',
    badge: 'ROUTE 77',
    iconEmoji: '🔥',
    avatarGradient: 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)',
    desc: 'Fearless speed demon with a legendary flame helmet and supercharged nitro.',
    speedMod: 1.05,
    accelMod: 1.15,
    driftMod: 1.0,
    stats: { speed: 94, accel: 96, drift: 84, boost: 98 },
  },
  {
    id: 'neo',
    name: 'Neo',
    tag: 'Eagle Drift Ace',
    perk: 'Aero Glide (+20% Drift Grip)',
    helmetColor: '#84cc16',
    helmetDecal: '#2563eb',
    suitColor: '#1d4ed8',
    suitAccent: '#f97316',
    badge: 'EAGLE NEO',
    iconEmoji: '🦅',
    avatarGradient: 'linear-gradient(135deg, #166534 0%, #1d4ed8 50%, #f97316 100%)',
    desc: 'Master of high-speed banked turns and precision coaster sliding.',
    speedMod: 1.02,
    accelMod: 1.05,
    driftMod: 1.2,
    stats: { speed: 89, accel: 90, drift: 99, boost: 88 },
  },
  {
    id: 'viper',
    name: 'Viper',
    tag: 'Scuderia Master',
    perk: 'Apex Velocity (+10% Top Speed)',
    helmetColor: '#171717',
    helmetDecal: '#dc2626',
    suitColor: '#b91c1c',
    suitAccent: '#facc15',
    badge: 'SCUDERIA',
    iconEmoji: '🏎️',
    avatarGradient: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #facc15 100%)',
    desc: 'World champion go-kart driver with extreme straight-line velocity.',
    speedMod: 1.10,
    accelMod: 1.0,
    driftMod: 1.05,
    stats: { speed: 99, accel: 91, drift: 87, boost: 91 },
  },
  {
    id: 'luna',
    name: 'Luna',
    tag: 'Cyber Nitro Pilot',
    perk: 'Overdrive (+25% Boost Duration)',
    helmetColor: '#06b6d4',
    helmetDecal: '#a855f7',
    suitColor: '#3b0764',
    suitAccent: '#00e5ff',
    badge: 'CYBER-X',
    iconEmoji: '⚡',
    avatarGradient: 'linear-gradient(135deg, #3b0764 0%, #06b6d4 100%)',
    desc: 'Futuristic arena racer with an overclocked kinetic battery.',
    speedMod: 1.04,
    accelMod: 1.10,
    driftMod: 1.10,
    stats: { speed: 92, accel: 94, drift: 92, boost: 97 },
  },
];

export const CARS = [
  {
    id: 'inferno',
    name: 'Inferno Cyber-Kart',
    theme: 'Candy Red Cyber Aero',
    primaryColor: '#d91828',
    secondaryColor: '#00e5ff',
    iconEmoji: '🚀',
    accentOptions: ['#00e5ff', '#ffaa00', '#a855f7', '#ffffff'],
    stats: { speed: 94, accel: 92, drift: 86, boost: 96 },
    features: ['Dual Ice-Blue LED Headlights', 'Polished Chrome Twin Turbos', 'Carbon Ground Diffuser'],
  },
  {
    id: 'wildfire',
    name: 'Wildfire #26',
    theme: 'Fiery Flame Sprint Kart',
    primaryColor: '#16181e',
    secondaryColor: '#ff8800',
    iconEmoji: '🔥',
    accentOptions: ['#ff8800', '#ff2200', '#ffd700', '#3b82f6'],
    stats: { speed: 88, accel: 98, drift: 84, boost: 90 },
    features: ['Hand-Painted Fire Nosecone', 'Tubular Steel Roll Hoop', 'Torque-Tuned Sprint Motor'],
  },
  {
    id: 'aerodrift',
    name: 'Aero Drift Blue',
    theme: 'Tubular Spaceframe Racer',
    primaryColor: '#38a2e5',
    secondaryColor: '#111827',
    iconEmoji: '🌪️',
    accentOptions: ['#111827', '#00ffcc', '#ff0055', '#ffffff'],
    stats: { speed: 86, accel: 88, drift: 99, boost: 85 },
    features: ['Lightweight Open-Wheel Cage', 'Twin-Strut High GT Wing', 'Agile Drift Geometry'],
  },
  {
    id: 'scuderia',
    name: 'Scuderia Rosso F1',
    theme: 'Grand Prix Aerodynamic Kart',
    primaryColor: '#e10600',
    secondaryColor: '#ffffff',
    iconEmoji: '🏁',
    accentOptions: ['#ffffff', '#facc15', '#000000', '#10b981'],
    stats: { speed: 99, accel: 93, drift: 88, boost: 89 },
    features: ['F1 High-Downforce Front Wing', 'Pirelli Lettered Slicks', 'Dual Sidepod Intakes'],
  },
  {
    id: 'gokartpro',
    name: 'Gokart PRO Giallo',
    theme: 'Lamborghini Yellow Superkart',
    primaryColor: '#ffd000',
    secondaryColor: '#1a1d24',
    iconEmoji: '⚡',
    accentOptions: ['#1a1d24', '#ff3b30', '#00e5ff', '#10b981'],
    stats: { speed: 91, accel: 93, drift: 93, boost: 91 },
    features: ['Giallo Orion Supercar Fairing', 'Racing Bucket Seat', 'Aerodynamic Rear Spoiler'],
  },
];

export const LEVELS = [
  {
    id: 'desktop',
    levelNum: 1,
    name: 'Desktop Circuit',
    subtitle: 'Signature HO-Scale Miniature Circuit',
    badge: 'LEVEL 1 · ROOKIE CUP',
    mood: 'Warm Evening Lamp & Ambient Golden Hour',
    trackSurface: 'Isotropic Crushed Basalt Asphalt',
    lapTarget: '00:54.00',
    previewBg: 'linear-gradient(135deg, #2b1f1c 0%, #171110 100%)',
    thumbnailClass: 'thumb-desktop',
  },
  {
    id: 'nitrodome',
    levelNum: 2,
    name: 'TAK Nitro Dome',
    subtitle: 'Cyberpunk Indoor Stadium Arena',
    badge: 'LEVEL 2 · NIGHT ARENA',
    mood: 'Pulsing Magenta & Cyan Holographic Lights, Flame Torches',
    trackSurface: 'High-Grip Purple Synthetic Polymer',
    lapTarget: '00:50.00',
    previewBg: 'linear-gradient(135deg, #4a044e 0%, #1e1035 100%)',
    thumbnailClass: 'thumb-nitrodome',
  },
  {
    id: 'grandprix',
    levelNum: 3,
    name: 'Grand Prix Park',
    subtitle: 'Outdoor Championship Parkland',
    badge: 'LEVEL 3 · DAYLIGHT GP',
    mood: 'Lush Green Grass, Red-and-White FIA Curbs & Clear Blue Sky',
    trackSurface: 'Monza Championship Blacktop',
    lapTarget: '00:48.00',
    previewBg: 'linear-gradient(135deg, #14532d 0%, #064e3b 100%)',
    thumbnailClass: 'thumb-grandprix',
  },
  {
    id: 'festival',
    levelNum: 4,
    name: 'Festival Arena Oval',
    subtitle: 'High-Speed Horizon Arena with Hot Air Balloons',
    badge: 'LEVEL 4 · HIGH SPEED',
    mood: 'Festival Canopies, Stadium Stands, Hot Air Balloons',
    trackSurface: 'Supersonic Banked Speedway Asphalt',
    lapTarget: '00:45.00',
    previewBg: 'linear-gradient(135deg, #7c2d12 0%, #311109 100%)',
    thumbnailClass: 'thumb-festival',
  },
  {
    id: 'endless',
    levelNum: '∞',
    name: 'Offline Endless Survival',
    subtitle: 'Continuous Infinite Racing with Dynamic Checkpoints',
    badge: 'BONUS · SURVIVAL',
    mood: 'Dynamic Day-to-Night Atmosphere Shift',
    trackSurface: 'Extreme Drift Surface',
    lapTarget: 'SURVIVE',
    previewBg: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
    thumbnailClass: 'thumb-endless',
  },
];

export const GAME_MODES = [
  {
    id: 'cup',
    name: 'Career & 3-Lap Cup',
    badge: 'CHAMPIONSHIP',
    desc: '3 intense laps against the clock with progressive level unlocks.',
  },
  {
    id: 'endless',
    name: 'Offline Endless Survival',
    badge: 'ENDLESS',
    desc: '100% offline continuous racing! Build distance records, drift multipliers, and high scores.',
  },
];

export class GameCustomizer {
  constructor() {
    this.selectedCharacter = localStorage.getItem('dr_character') || 'blaze';
    this.selectedCar = localStorage.getItem('dr_car') || 'inferno';
    this.selectedLevel = localStorage.getItem('dr_level') || 'desktop';
    this.selectedMode = localStorage.getItem('dr_mode') || 'cup';

    this.coins = parseInt(localStorage.getItem('dr_coins') || '125400', 10);
    this.gems = parseInt(localStorage.getItem('dr_gems') || '1250', 10);
    this.xp = parseInt(localStorage.getItem('dr_xp') || '1850', 10);
    this.playerLevel = parseInt(localStorage.getItem('dr_player_lvl') || '12', 10);
    this.vipActive = true;

    this.careerLevel = parseInt(localStorage.getItem('dr_career_lvl') || '1', 10);
    const savedUnlocked = localStorage.getItem('dr_unlocked_levels');
    this.unlockedLevels = savedUnlocked
      ? JSON.parse(savedUnlocked)
      : ['desktop', 'nitrodome', 'grandprix', 'festival', 'endless'];

    this.onSelectionChange = () => {};
    this.onStartRaceCallback = () => {};
  }

  nextCar() {
    const idx = CARS.findIndex((c) => c.id === this.selectedCar);
    const nextIdx = (idx + 1) % CARS.length;
    this.setCar(CARS[nextIdx].id);
  }

  prevCar() {
    const idx = CARS.findIndex((c) => c.id === this.selectedCar);
    const prevIdx = (idx - 1 + CARS.length) % CARS.length;
    this.setCar(CARS[prevIdx].id);
  }

  addCoins(amount) {
    this.coins += amount;
    localStorage.setItem('dr_coins', String(this.coins));
    this.updateShowcaseMenuUI();
  }

  addGems(amount) {
    this.gems += amount;
    localStorage.setItem('dr_gems', String(this.gems));
    this.updateShowcaseMenuUI();
  }

  isLevelUnlocked(levelId) {
    if (this.unlockedLevels.includes(levelId)) return true;
    const lvl = LEVELS.find((l) => l.id === levelId);
    if (lvl && typeof lvl.levelNum === 'number') {
      return lvl.levelNum <= this.careerLevel;
    }
    return true;
  }

  unlockNextCareerLevel(completedLevelId) {
    const lvl = LEVELS.find((l) => l.id === completedLevelId);
    if (lvl && typeof lvl.levelNum === 'number') {
      const nextLvlNum = lvl.levelNum + 1;
      if (nextLvlNum > this.careerLevel) {
        this.careerLevel = Math.min(4, nextLvlNum);
        localStorage.setItem('dr_career_lvl', String(this.careerLevel));
      }
      const nextLvl = LEVELS.find((l) => l.levelNum === nextLvlNum);
      if (nextLvl && !this.unlockedLevels.includes(nextLvl.id)) {
        this.unlockedLevels.push(nextLvl.id);
        localStorage.setItem('dr_unlocked_levels', JSON.stringify(this.unlockedLevels));
      }
    }
    this.updateShowcaseMenuUI();
  }

  setCharacter(id) {
    if (CHARACTERS.some((c) => c.id === id)) {
      this.selectedCharacter = id;
      localStorage.setItem('dr_character', id);
      this.updateShowcaseMenuUI();
      this.onSelectionChange('character', id);
    }
  }

  setCar(id) {
    if (CARS.some((c) => c.id === id)) {
      this.selectedCar = id;
      localStorage.setItem('dr_car', id);
      this.updateShowcaseMenuUI();
      this.onSelectionChange('car', id);
    }
  }

  setLevel(id) {
    if (LEVELS.some((l) => l.id === id)) {
      this.selectedLevel = id;
      localStorage.setItem('dr_level', id);
      if (id === 'endless') {
        this.selectedMode = 'endless';
        localStorage.setItem('dr_mode', 'endless');
      } else {
        this.selectedMode = 'cup';
        localStorage.setItem('dr_mode', 'cup');
      }
      this.updateShowcaseMenuUI();
      this.onSelectionChange('level', id);
    }
  }

  setMode(id) {
    if (GAME_MODES.some((m) => m.id === id)) {
      this.selectedMode = id;
      localStorage.setItem('dr_mode', id);
      this.updateShowcaseMenuUI();
      this.onSelectionChange('mode', id);
    }
  }

  getCharacterData() {
    return CHARACTERS.find((c) => c.id === this.selectedCharacter) || CHARACTERS[0];
  }

  getCarData() {
    return CARS.find((c) => c.id === this.selectedCar) || CARS[0];
  }

  getLevelData() {
    return LEVELS.find((l) => l.id === this.selectedLevel) || LEVELS[0];
  }

  getModeData() {
    return GAME_MODES.find((m) => m.id === this.selectedMode) || GAME_MODES[0];
  }

  onSelectionChanged(callback) {
    this.onSelectionChange = callback;
  }

  onStartRace(callback) {
    this.onStartRaceCallback = callback;
  }

  /**
   * Applies car style and driver character customization to the 3D MicroKart instance
   */
  applyToKart(microKart) {
    if (!microKart || !microKart.chassisGroup) return;

    const car = this.getCarData();
    const char = this.getCharacterData();

    const carColor = new THREE.Color(car.primaryColor);
    const accentColor = new THREE.Color(car.secondaryColor);
    const helmetCol = new THREE.Color(char.helmetColor);
    const suitCol = new THREE.Color(char.suitColor);

    // Update Fairing & Body Materials
    microKart.chassisGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const name = (child.name || '').toLowerCase();

        // Nosecone and Sidepods
        if (
          name.includes('nose') ||
          name.includes('fairing') ||
          name.includes('sidepod') ||
          (mat.color && (mat.color.getHexString() === 'ff2b1e' || mat.color.getHexString() === 'ffaa44'))
        ) {
          mat.color.copy(carColor);
          mat.roughness = car.id === 'aerodrift' ? 0.45 : 0.22;
          mat.metalness = car.id === 'inferno' ? 0.75 : car.id === 'scuderia' ? 0.35 : 0.55;
          mat.needsUpdate = true;
        }

        // Accent Number Plate / Stripes
        if (name.includes('number') || name.includes('stripe')) {
          mat.color.copy(accentColor);
          mat.needsUpdate = true;
        }

        // Driver Suit
        if (name.includes('torso') || name.includes('suit') || (mat.color && mat.color.getHexString() === 'f0f4fa')) {
          mat.color.copy(suitCol);
          mat.needsUpdate = true;
        }

        // Driver Helmet
        if (name.includes('helmet') || (child.geometry && child.geometry.type === 'SphereGeometry' && child.position.y > 0.003)) {
          mat.color.copy(helmetCol);
          mat.roughness = 0.2;
          mat.metalness = char.id === 'luna' ? 0.8 : 0.4;
          mat.needsUpdate = true;
        }
      }
    });

    // Special Additions based on Car Style
    let customPropsGroup = microKart.chassisGroup.getObjectByName('ThemedCustomKartProps');
    if (!customPropsGroup) {
      customPropsGroup = new THREE.Group();
      customPropsGroup.name = 'ThemedCustomKartProps';
      microKart.chassisGroup.add(customPropsGroup);
    }

    // Clear previous themed add-on geometries
    while (customPropsGroup.children.length > 0) {
      const c = customPropsGroup.children[0];
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
      customPropsGroup.remove(c);
    }

    // 1. Wildfire #26 Tubular Steel Roll Hoop
    if (car.id === 'wildfire') {
      const hoopGeo = new THREE.TorusGeometry(0.0032, 0.00045, 8, 16, Math.PI);
      const hoopMat = new THREE.MeshStandardMaterial({ color: 0x22242a, metalness: 0.9, roughness: 0.2 });
      const hoop = new THREE.Mesh(hoopGeo, hoopMat);
      hoop.position.set(0, 0.0076, -0.0035);
      hoop.rotation.y = Math.PI;
      customPropsGroup.add(hoop);
    }

    // 2. Aero Drift Blue High Twin-Strut GT Rear Wing
    if (car.id === 'aerodrift') {
      const wingGeo = new THREE.BoxGeometry(0.0145, 0.0006, 0.0035);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.4 });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.position.set(0, 0.0092, -0.0082);
      wing.rotation.x = -0.15;
      customPropsGroup.add(wing);

      // Twin Struts
      for (const sx of [-0.0042, 0.0042]) {
        const strutGeo = new THREE.CylinderGeometry(0.00025, 0.00025, 0.005, 8);
        const strut = new THREE.Mesh(strutGeo, wingMat);
        strut.position.set(sx, 0.0068, -0.0080);
        strut.rotation.x = -0.18;
        customPropsGroup.add(strut);
      }
    }

    // 3. Inferno Cyber-Kart Dual Glowing Cyan Headlight Splitters
    if (car.id === 'inferno') {
      const lightGeo = new THREE.BoxGeometry(0.0022, 0.0006, 0.001);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      for (const lx of [-0.0032, 0.0032]) {
        const lightMesh = new THREE.Mesh(lightGeo, lightMat);
        lightMesh.position.set(lx, 0.0026, 0.0091);
        customPropsGroup.add(lightMesh);
      }
    }

    // 4. Scuderia Rosso F1 Aerodynamic Front Wing Splitter
    if (car.id === 'scuderia') {
      const fWingGeo = new THREE.BoxGeometry(0.0135, 0.0005, 0.0025);
      const fWingMat = new THREE.MeshStandardMaterial({ color: 0xe10600, roughness: 0.25 });
      const fWing = new THREE.Mesh(fWingGeo, fWingMat);
      fWing.position.set(0, 0.0016, 0.0094);
      customPropsGroup.add(fWing);
    }
  }

  /**
   * Applies the selected Level / Track environment theme
   */
  applyToEnvironment(scene, diorama, coaster, atmosphere, roomEnv) {
    const level = this.getLevelData();

    // 1. TAK Nitro Dome (Cyberpunk Stadium Arena)
    if (level.id === 'nitrodome') {
      scene.background = new THREE.Color(0x0e0618);
      scene.fog = new THREE.FogExp2(0x0e0618, 0.024);

      if (atmosphere.lampKeyLight) {
        atmosphere.lampKeyLight.color.setHex(0xb537f2); // Magenta / Violet Arena Key Light
        atmosphere.lampKeyLight.intensity = 1.35;
      }
      if (coaster.underTrackLedGroup) {
        coaster.underTrackLedGroup.visible = true;
        coaster.underTrackLedGroup.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.color.setHex(0x00e5ff); // Cyan Track Neon
          }
        });
      }
    }
    // 2. Grand Prix Park (Outdoor Sunny Championship)
    else if (level.id === 'grandprix') {
      scene.background = new THREE.Color(0x60a5fa); // Sky Blue
      scene.fog = new THREE.FogExp2(0x8bc0f8, 0.008);

      if (atmosphere.sunLight) {
        atmosphere.sunLight.color.setHex(0xffffff);
        atmosphere.sunLight.intensity = 1.4;
      }
      if (atmosphere.lampKeyLight) {
        atmosphere.lampKeyLight.color.setHex(0xfff7ed);
        atmosphere.lampKeyLight.intensity = 0.8;
      }
      // Green grass tabletop accent
      if (diorama.tableTopMesh && diorama.tableTopMesh.material) {
        diorama.tableTopMesh.material.color.setHex(0x2d6a4f); // Rich emerald grass
        diorama.tableTopMesh.material.roughness = 0.85;
      }
    }
    // 3. Festival Arena Oval (Sunset Horizon Festival)
    else if (level.id === 'festival') {
      scene.background = new THREE.Color(0x381812);
      scene.fog = new THREE.FogExp2(0x381812, 0.016);

      if (atmosphere.lampKeyLight) {
        atmosphere.lampKeyLight.color.setHex(0xff7722); // Warm sunset orange
        atmosphere.lampKeyLight.intensity = 1.45;
      }
    }
    // 4. Desktop Circuit (Default warm cozy night diorama)
    else {
      scene.background = new THREE.Color(0x181312);
      scene.fog = new THREE.FogExp2(0x181312, 0.018);

      if (atmosphere.lampKeyLight) {
        atmosphere.lampKeyLight.color.setHex(0xffe6b8);
        atmosphere.lampKeyLight.intensity = 1.15;
      }
      if (diorama.tableTopMesh && diorama.tableTopMesh.material) {
        diorama.tableTopMesh.material.color.setHex(0x281e18); // Warm dark oak
      }
    }
  }

  /**
   * Syncs the live Full-Screen Game Menu UI with current selections & specs
   */
  updateShowcaseMenuUI() {
    const char = this.getCharacterData();
    const car = this.getCarData();
    const lvl = this.getLevelData();

    // 0. Currency & Profile HUD Sync
    const elCoins = document.getElementById('hud-coins-val');
    const elGems = document.getElementById('hud-gems-val');
    const elPlayerLvl = document.getElementById('hud-player-lvl');
    const elXpFill = document.getElementById('hud-xp-fill');

    if (elCoins) elCoins.textContent = this.coins.toLocaleString();
    if (elGems) elGems.textContent = this.gems.toLocaleString();
    if (elPlayerLvl) elPlayerLvl.textContent = `LVL ${this.playerLevel}`;
    if (elXpFill) elXpFill.style.width = `${Math.min(100, (this.xp / 2500) * 100)}%`;

    // 1. Driver Showcase
    const elDriverName = document.getElementById('sc-driver-name');
    const elDriverTag = document.getElementById('sc-driver-tag');
    const elDriverPerk = document.getElementById('sc-driver-perk');
    const elDriverBadge = document.getElementById('sc-driver-badge');
    const elDriverAvatar = document.getElementById('sc-driver-avatar');
    const elDriverSpeedBar = document.getElementById('sc-driver-stat-speed');
    const elDriverAccelBar = document.getElementById('sc-driver-stat-accel');
    const elDriverDriftBar = document.getElementById('sc-driver-stat-drift');

    if (elDriverName) elDriverName.textContent = char.name.toUpperCase();
    if (elDriverTag) elDriverTag.textContent = char.tag;
    if (elDriverPerk) elDriverPerk.textContent = char.perk;
    if (elDriverBadge) elDriverBadge.textContent = char.badge;
    if (elDriverAvatar) {
      elDriverAvatar.style.background = char.avatarGradient;
      elDriverAvatar.innerHTML = `<span class="driver-avatar-emoji">${char.iconEmoji}</span><span class="driver-helmet-dot" style="background:${char.helmetColor}"></span>`;
    }
    if (elDriverSpeedBar) elDriverSpeedBar.style.width = `${char.stats.speed}%`;
    if (elDriverAccelBar) elDriverAccelBar.style.width = `${char.stats.accel}%`;
    if (elDriverDriftBar) elDriverDriftBar.style.width = `${char.stats.drift}%`;

    // Highlight active driver picker button
    document.querySelectorAll('.sc-picker-driver-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.driver === char.id);
    });

    // 2. Car Showcase
    const elCarName = document.getElementById('sc-car-name');
    const elCarClass = document.getElementById('sc-car-class');
    const elCarTheme = document.getElementById('sc-car-theme');
    const elCarFeatures = document.getElementById('sc-car-features');
    const elCarSpeedBar = document.getElementById('sc-car-stat-speed');
    const elCarAccelBar = document.getElementById('sc-car-stat-accel');
    const elCarDriftBar = document.getElementById('sc-car-stat-drift');
    const elCarBoostBar = document.getElementById('sc-car-stat-boost');
    const elCarColorPreview = document.getElementById('sc-car-pedestal-glow');

    const carClassMap = {
      inferno: 'S-CLASS · PP 780',
      wildfire: 'A-CLASS · PP 740',
      aerodrift: 'A-CLASS · PP 720',
      scuderia: 'S-CLASS · PP 810',
      gokartpro: 'S-CLASS · PP 760',
    };

    if (elCarName) elCarName.textContent = car.name.toUpperCase();
    if (elCarClass) elCarClass.textContent = carClassMap[car.id] || 'S-CLASS · PP 750';
    if (elCarTheme) elCarTheme.textContent = car.theme;
    if (elCarFeatures) {
      elCarFeatures.innerHTML = car.features
        .map((f) => `<span class="car-feature-chip">${f}</span>`)
        .join('');
    }
    if (elCarSpeedBar) elCarSpeedBar.style.width = `${car.stats.speed}%`;
    if (elCarAccelBar) elCarAccelBar.style.width = `${car.stats.accel}%`;
    if (elCarDriftBar) elCarDriftBar.style.width = `${car.stats.drift}%`;
    if (elCarBoostBar) elCarBoostBar.style.width = `${car.stats.boost}%`;
    if (elCarColorPreview) {
      elCarColorPreview.style.background = `radial-gradient(circle, ${car.primaryColor}88 0%, ${car.secondaryColor}33 50%, transparent 70%)`;
      elCarColorPreview.style.boxShadow = `0 0 35px ${car.primaryColor}55`;
    }

    // Highlight active car picker button across all UI selectors
    document.querySelectorAll('.sc-picker-car-btn, .garage-car-card, .shop-car-card').forEach((btn) => {
      const cId = btn.dataset.car;
      btn.classList.toggle('active', cId === car.id);
    });

    // 3. Level & Career Progression Cards
    const elLevelName = document.getElementById('sc-selected-level-name');
    const elLevelBadge = document.getElementById('sc-selected-level-badge');
    const elLevelSurface = document.getElementById('sc-selected-level-surface');
    const elLevelTarget = document.getElementById('sc-selected-level-target');

    if (elLevelName) elLevelName.textContent = lvl.name.toUpperCase();
    if (elLevelBadge) elLevelBadge.textContent = lvl.badge;
    if (elLevelSurface) elLevelSurface.textContent = lvl.trackSurface;
    if (elLevelTarget) elLevelTarget.textContent = lvl.lapTarget;

    document.querySelectorAll('.sc-level-card').forEach((card) => {
      const cardLvlId = card.dataset.level;
      const isActive = cardLvlId === lvl.id;
      const isUnlocked = this.isLevelUnlocked(cardLvlId);
      card.classList.toggle('active', isActive);
      card.classList.toggle('locked', !isUnlocked);
    });

    // 4. Continue Button Label
    const elContinueLvlText = document.getElementById('txt-continue-lvl');
    if (elContinueLvlText) {
      elContinueLvlText.textContent = String(this.careerLevel);
    }
    const elRankText = document.getElementById('sc-player-rank');
    if (elRankText) {
      const titles = ['ROOKIE RACER', 'SPEED DEMON', 'CHAMPION', 'LEGEND'];
      const rankTitle = titles[Math.min(titles.length - 1, this.careerLevel - 1)] || 'PRO';
      elRankText.textContent = `★ ${rankTitle} · LEVEL ${this.careerLevel}`;
    }
  }

  /**
   * Initialize DOM event handlers for the full-screen game menu
   */
  initUI() {
    this.updateShowcaseMenuUI();

    // Driver selector buttons
    document.querySelectorAll('.sc-picker-driver-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dId = btn.dataset.driver;
        if (dId) this.setCharacter(dId);
      });
    });

    // Car selector buttons
    document.querySelectorAll('.sc-picker-car-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cId = btn.dataset.car;
        if (cId) this.setCar(cId);
      });
    });

    // Level progression cards
    document.querySelectorAll('.sc-level-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const lvlId = card.dataset.level;
        if (lvlId && this.isLevelUnlocked(lvlId)) {
          this.setLevel(lvlId);
        }
      });
    });

    // START CAR & DRIVER · LEVEL 1
    const btnStartLvl1 = document.getElementById('btn-start-level-1');
    if (btnStartLvl1) {
      btnStartLvl1.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setLevel('desktop');
        this.setMode('cup');
        this.onStartRaceCallback({
          levelNum: 1,
          levelId: 'desktop',
          character: this.selectedCharacter,
          car: this.selectedCar,
        });
      });
    }

    // CONTINUE CAREER (LEVEL X)
    const btnContinue = document.getElementById('btn-continue-career');
    if (btnContinue) {
      btnContinue.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetLvl = LEVELS.find((l) => l.levelNum === this.careerLevel) || LEVELS[0];
        this.setLevel(targetLvl.id);
        this.setMode(targetLvl.id === 'endless' ? 'endless' : 'cup');
        this.onStartRaceCallback({
          levelNum: this.careerLevel,
          levelId: targetLvl.id,
          character: this.selectedCharacter,
          car: this.selectedCar,
        });
      });
    }
  }
}
