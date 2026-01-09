// GOTHALIENBOY: GTA-STYLE GAME ENGINE
// Main Game Systems

// ================ GAME CONFIGURATION ================
const CONFIG = {
    GRAPHICS: {
        QUALITY: 'medium', // low, medium, high, ultra
        SHADOWS: true,
        ANTI_ALIASING: true,
        DRAW_DISTANCE: 2000,
        TEXTURE_QUALITY: 512,
        PARTICLE_COUNT: 100
    },
    
    GAMEPLAY: {
        DIFFICULTY: 'normal', // easy, normal, hard, expert
        AUTO_AIM: true,
        MINIMAP: true,
        HINTS: true,
        SAVE_INTERVAL: 300 // seconds
    },
    
    CONTROLS: {
        SENSITIVITY: 1.0,
        INVERT_Y: false,
        VIBRATION: true,
        KEYBINDS: {
            MOVE_FORWARD: 'KeyW',
            MOVE_BACK: 'KeyS',
            MOVE_LEFT: 'KeyA',
            MOVE_RIGHT: 'KeyD',
            JUMP: 'Space',
            SPRINT: 'ShiftLeft',
            CROUCH: 'ControlLeft',
            ENTER_VEHICLE: 'KeyF',
            FIRE: 'Mouse0',
            AIM: 'Mouse1',
            RELOAD: 'KeyR',
            HACK: 'KeyH',
            PHONE: 'KeyP',
            MAP: 'KeyM',
            PAUSE: 'Escape'
        }
    }
};

// ================ GAME STATE ================
let GAME = {
    // Core
    state: 'loading',
    scene: null,
    camera: null,
    renderer: null,
    physics: null,
    clock: new THREE.Clock(),
    
    // Player
    player: {
        entity: null,
        vehicle: null,
        health: 100,
        armor: 0,
        money: 5000,
        wantedLevel: 0,
        weapons: [
            { name: 'Cyber Pistol', ammo: 30, maxAmmo: 120, unlocked: true },
            { name: 'SMG-9X', ammo: 60, maxAmmo: 240, unlocked: false },
            { name: 'Shotgun', ammo: 8, maxAmmo: 32, unlocked: false },
            { name: 'Railgun', ammo: 5, maxAmmo: 20, unlocked: false }
        ],
        currentWeapon: 0,
        abilities: {
            hack: { level: 1, cooldown: 0 },
            cloak: { level: 0, cooldown: 0 },
            overload: { level: 0, cooldown: 0 },
            scan: { level: 1, cooldown: 0 }
        },
        inventory: [],
        skills: {
            driving: 0,
            shooting: 0,
            hacking: 0,
            stealth: 0
        }
    },
    
    // World
    world: {
        time: 12, // 0-24 hours
        weather: 'clear', // clear, rain, storm, fog
        districts: {
            kagiso: { unlocked: true, control: 'gangs' },
            downtown: { unlocked: false, control: 'corporation' },
            industrial: { unlocked: false, control: 'police' }
        },
        npcs: [],
        vehicles: [],
        traffic: [],
        props: []
    },
    
    // Missions
    missions: {
        current: null,
        checkpoint: null,
        completed: [],
        available: ['m1_kagiso_nights'],
        failed: []
    },
    
    // UI
    ui: {
        elements: {},
        notifications: [],
        radar: {
            blips: [],
            scale: 1.0
        }
    },
    
    // Input
    input: {
        keys: {},
        mouse: { x: 0, y: 0, down: false },
        touch: { active: false, position: { x: 0, y: 0 } }
    },
    
    // Performance
    performance: {
        fps: 60,
        memory: 0,
        drawCalls: 0,
        lastUpdate: 0
    }
};

// ================ INITIALIZATION ================
async function initGame() {
    console.log('🚀 Initializing GothAlienBoy: GTA Edition...');
    
    try {
        // 1. Setup Three.js
        setupThreeJS();
        
        // 2. Setup Physics
        setupPhysics();
        
        // 3. Load Assets
        await loadAssets();
        
        // 4. Create World
        createWorld();
        
        // 5. Setup Player
        setupPlayer();
        
        // 6. Setup UI
        setupUI();
        
        // 7. Setup Audio
        setupAudio();
        
        // 8. Start Game Loop
        startGameLoop();
        
        // 9. Start First Mission
        startMission('m1_kagiso_nights');
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showError('Failed to load game. Please refresh.');
    }
}

// ================ THREE.JS SETUP ================
function setupThreeJS() {
    // Create scene
    GAME.scene = new THREE.Scene();
    GAME.scene.fog = new THREE.Fog(0x0a0a2a, 10, 2000);
    
    // Create camera (third person)
    GAME.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
    );
    GAME.camera.position.set(0, 10, 20);
    
    // Create renderer
    GAME.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('gameCanvas'),
        antialias: CONFIG.GRAPHICS.ANTI_ALIASING,
        alpha: false,
        powerPreference: 'high-performance'
    });
    
    GAME.renderer.setSize(window.innerWidth, window.innerHeight);
    GAME.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    GAME.renderer.shadowMap.enabled = CONFIG.GRAPHICS.SHADOWS;
    GAME.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    GAME.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Add lighting
    setupLighting();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function setupLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x404040, 0.5);
    GAME.scene.add(ambient);
    
    // Main directional light (sun)
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(100, 200, 100);
    sun.castShadow = CONFIG.GRAPHICS.SHADOWS;
    if (CONFIG.GRAPHICS.SHADOWS) {
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 500;
        sun.shadow.camera.left = -100;
        sun.shadow.camera.right = 100;
        sun.shadow.camera.top = 100;
        sun.shadow.camera.bottom = -100;
    }
    GAME.scene.add(sun);
    
    // Skybox
    const skybox = new THREE.CubeTextureLoader()
        .setPath('assets/textures/skybox/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    GAME.scene.background = skybox;
}

// ================ PHYSICS SETUP ================
function setupPhysics() {
    // Initialize Cannon.js world
    GAME.physics = {
        world: new CANNON.World(),
        bodies: new Map(),
        materials: new Map(),
        constraints: []
    };
    
    GAME.physics.world.gravity.set(0, -9.82, 0);
    GAME.physics.world.broadphase = new CANNON.NaiveBroadphase();
    GAME.physics.world.solver.iterations = 10;
    
    // Create ground material
    const groundMaterial = new CANNON.Material('ground');
    GAME.physics.materials.set('ground', groundMaterial);
    
    // Create default contact material
    const groundContactMaterial = new CANNON.ContactMaterial(
        groundMaterial,
        groundMaterial,
        {
            friction: 0.4,
            restitution: 0.3
        }
    );
    GAME.physics.world.addContactMaterial(groundContactMaterial);
}

// ================ ASSET LOADING ================
async function loadAssets() {
    const assets = {
        models: {},
        textures: {},
        audio: {}
    };
    
    // Loading manager
    const manager = new THREE.LoadingManager();
    
    manager.onStart = (url, itemsLoaded, itemsTotal) => {
        updateLoadingProgress(itemsLoaded / itemsTotal * 100);
    };
    
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        updateLoadingProgress(itemsLoaded / itemsTotal * 100);
    };
    
    manager.onLoad = () => {
        console.log('✅ All assets loaded');
        document.getElementById('loadingScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        GAME.state = 'playing';
    };
    
    manager.onError = (url) => {
        console.error('❌ Error loading asset:', url);
    };
    
    // GLTF Loader
    const gltfLoader = new THREE.GLTFLoader(manager);
    
    // Load essential assets
    try {
        // Load player model
        assets.models.player = await loadGLTF(gltfLoader, 'assets/models/player.glb');
        
        // Load vehicle models
        assets.models.vehicles = {
            sedan: await loadGLTF(gltfLoader, 'assets/models/vehicles/sedan.glb'),
            sports: await loadGLTF(gltfLoader, 'assets/models/vehicles/sports.glb'),
            bike: await loadGLTF(gltfLoader, 'assets/models/vehicles/bike.glb')
        };
        
        // Load weapon models
        assets.models.weapons = {
            pistol: await loadGLTF(gltfLoader, 'assets/models/weapons/pistol.glb'),
            smg: await loadGLTF(gltfLoader, 'assets/models/weapons/smg.glb')
        };
        
        console.log('✅ Models loaded successfully');
        
    } catch (error) {
        console.warn('Using placeholder models:', error);
        createPlaceholderModels();
    }
    
    // Store assets
    GAME.assets = assets;
}

function createPlaceholderModels() {
    // Create simple placeholder models
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const capsuleGeometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    
    // Player placeholder
    const playerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffea,
        wireframe: true
    });
    GAME.assets.models.player = {
        scene: new THREE.Mesh(capsuleGeometry, playerMaterial)
    };
    
    // Vehicle placeholder
    const vehicleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0066,
        wireframe: true
    });
    GAME.assets.models.vehicles = {
        sedan: { scene: new THREE.Mesh(boxGeometry, vehicleMaterial) },
        sports: { scene: new THREE.Mesh(boxGeometry, vehicleMaterial) },
        bike: { scene: new THREE.Mesh(boxGeometry, vehicleMaterial) }
    };
    
    // Weapon placeholder
    const weaponMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
    });
    GAME.assets.models.weapons = {
        pistol: { scene: new THREE.Mesh(sphereGeometry, weaponMaterial) },
        smg: { scene: new THREE.Mesh(sphereGeometry, weaponMaterial) }
    };
}

// ================ WORLD CREATION ================
function createWorld() {
    console.log('🌍 Creating game world...');
    
    // Create ground
    createGround();
    
    // Create Kagiso Township
    createKagisoDistrict();
    
    // Create roads
    createRoadNetwork();
    
    // Create buildings
    createBuildings();
    
    // Spawn NPCs
    spawnNPCs(50);
    
    // Spawn traffic
    spawnTraffic(20);
    
    // Create props
    createProps();
}

function createGround() {
    // Ground mesh
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    GAME.scene.add(ground);
    
    // Ground physics body
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
        mass: 0,
        material: GAME.physics.materials.get('ground')
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    GAME.physics.world.addBody(groundBody);
    GAME.physics.bodies.set(ground.uuid, groundBody);
}

function createKagisoDistrict() {
    // Create township buildings (simple boxes for now)
    const buildingCount = 100;
    const buildingGeometry = new THREE.BoxGeometry(10, Math.random() * 20 + 5, 10);
    
    for (let i = 0; i < buildingCount; i++) {
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0x333333 + 0x222222,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const building = new THREE.Mesh(buildingGeometry, material);
        building.position.set(
            (Math.random() - 0.5) * 1000,
            0,
            (Math.random() - 0.5) * 1000
        );
        building.castShadow = true;
        building.receiveShadow = true;
        
        GAME.scene.add(building);
        GAME.world.props.push(building);
        
        // Add physics body
        const shape = new CANNON.Box(new CANNON.Vec3(5, building.geometry.parameters.height / 2, 5));
        const body = new CANNON.Body({
            mass: 0,
            position: new CANNON.Vec3(
                building.position.x,
                building.position.y + building.geometry.parameters.height / 2,
                building.position.z
            )
        });
        body.addShape(shape);
        GAME.physics.world.addBody(body);
        GAME.physics.bodies.set(building.uuid, body);
    }
    
    console.log(`🏘️ Created ${buildingCount} township buildings`);
}

// ================ PLAYER SYSTEM ================
function setupPlayer() {
    console.log('👤 Setting up player...');
    
    // Create player entity
    const playerModel = GAME.assets.models.player.scene.clone();
    playerModel.scale.set(1, 1, 1);
    playerModel.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    GAME.player.entity = {
        mesh: playerModel,
        body: null,
        cameraOffset: new THREE.Vector3(0, 2, 5),
        state: 'idle',
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
        isGrounded: false,
        isDriving: false,
        isAiming: false
    };
    
    GAME.scene.add(playerModel);
    
    // Create player physics body
    const playerShape = new CANNON.Sphere(0.5);
    const playerBody = new CANNON.Body({
        mass: 70,
        position: new CANNON.Vec3(0, 5, 0),
        shape: playerShape,
        linearDamping: 0.9,
        angularDamping: 0.9
    });
    
    GAME.physics.world.addBody(playerBody);
    GAME.player.entity.body = playerBody;
    GAME.physics.bodies.set(playerModel.uuid, playerBody);
    
    // Position camera
    updateCameraPosition();
    
    console.log('✅ Player setup complete');
}

// ================ VEHICLE SYSTEM ================
class Vehicle {
    constructor(type, position) {
        this.type = type;
        this.model = GAME.assets.models.vehicles[type].scene.clone();
        this.position = position;
        this.rotation = new THREE.Euler();
        this.speed = 0;
        this.maxSpeed = type === 'sports' ? 50 : type === 'bike' ? 40 : 30;
        this.acceleration = 0.2;
        this.braking = 0.4;
        this.turnSpeed = 0.03;
        this.health = 100;
        this.occupied = false;
        
        this.setupPhysics();
        this.setupModel();
    }
    
    setupPhysics() {
        // Create vehicle physics body
        const size = this.getSize();
        const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
        
        this.body = new CANNON.Body({
            mass: 1000,
            position: new CANNON.Vec3(
                this.position.x,
                this.position.y + size.y / 2,
                this.position.z
            ),
            shape: shape,
            angularVelocity: new CANNON.Vec3(0, 0, 0),
            linearDamping: 0.99,
            angularDamping: 0.99
        });
        
        GAME.physics.world.addBody(this.body);
    }
    
    setupModel() {
        this.model.position.copy(this.position);
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        GAME.scene.add(this.model);
    }
    
    getSize() {
        switch(this.type) {
            case 'sedan': return new THREE.Vector3(4, 1.5, 2);
            case 'sports': return new THREE.Vector3(3.5, 1.2, 1.8);
            case 'bike': return new THREE.Vector3(2, 1, 0.8);
            default: return new THREE.Vector3(4, 1.5, 2);
        }
    }
    
    update(deltaTime) {
        if (this.occupied) {
            this.handleInput();
        }
        
        // Update physics
        this.applyForces();
        
        // Sync model with physics body
        this.model.position.set(
            this.body.position.x,
            this.body.position.y - this.getSize().y / 2,
            this.body.position.z
        );
        
        this.model.quaternion.copy(this.body.quaternion);
        
        // Apply damage if moving fast and hit something
        if (this.speed > 30 && this.body.velocity.length() < 1) {
            this.health -= 10;
            if (this.health <= 0) {
                this.explode();
            }
        }
    }
    
    handleInput() {
        // Vehicle controls
        const forward = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_FORWARD];
        const backward = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_BACK];
        const left = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_LEFT];
        const right = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_RIGHT];
        
        // Acceleration
        if (forward) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else if (backward) {
            this.speed = Math.max(this.speed - this.braking, -this.maxSpeed / 2);
        } else {
            // Natural deceleration
            this.speed *= 0.95;
        }
        
        // Steering
        let turn = 0;
        if (left) turn += this.turnSpeed;
        if (right) turn -= this.turnSpeed;
        
        // Apply rotation based on speed
        if (Math.abs(this.speed) > 0.1) {
            this.body.angularVelocity.y = turn * (this.speed / this.maxSpeed);
        }
    }
    
    applyForces() {
        // Calculate forward direction
        const forward = new CANNON.Vec3(0, 0, -1);
        forward.applyQuaternion(this.body.quaternion);
        
        // Apply force in forward direction
        const forceMagnitude = this.speed * 100;
        this.body.applyForce(
            forward.scale(forceMagnitude),
            this.body.position
        );
        
        // Apply downforce for stability
        const downForce = new CANNON.Vec3(0, -500, 0);
        this.body.applyForce(downForce, this.body.position);
    }
    
    explode() {
        // Create explosion effect
        for (let i = 0; i < 50; i++) {
            createParticle(
                this.body.position,
                new THREE.Color(0xff6600),
                2,
                new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    Math.random() * 10,
                    (Math.random() - 0.5) * 10
                )
            );
        }
        
        // Remove vehicle
        this.remove();
    }
    
    remove() {
        GAME.scene.remove(this.model);
        GAME.physics.world.removeBody(this.body);
        const index = GAME.world.vehicles.indexOf(this);
        if (index > -1) {
            GAME.world.vehicles.splice(index, 1);
        }
    }
    
    enter(player) {
        this.occupied = true;
        GAME.player.vehicle = this;
        GAME.player.entity.isDriving = true;
        
        // Position player in vehicle
        player.body.position.copy(this.body.position);
        player.body.position.y += 1;
        
        // Change camera mode
        GAME.camera.position.set(0, 5, 10);
        
        showNotification('Press F to exit vehicle', 'info');
    }
    
    exit() {
        this.occupied = false;
        GAME.player.vehicle = null;
        GAME.player.entity.isDriving = false;
        
        // Position player near vehicle
        const offset = new THREE.Vector3(3, 0, 0);
        offset.applyQuaternion(this.body.quaternion);
        
        GAME.player.entity.body.position.set(
            this.body.position.x + offset.x,
            this.body.position.y + 1,
            this.body.position.z + offset.z
        );
        
        // Reset camera
        updateCameraPosition();
    }
}

// ================ MISSION SYSTEM ================
const MISSIONS = {
    m1_kagiso_nights: {
        id: 'm1_kagiso_nights',
        name: 'Kagiso Nights',
        type: 'main',
        difficulty: 'easy',
        giver: 'Oracle',
        
        objectives: [
            {
                id: 'meet_oracle',
                description: 'Meet Oracle at the chop shop',
                type: 'goto',
                position: { x: 100, y: 0, z: 100 },
                radius: 10,
                completed: false,
                onComplete: () => {
                    showNotification('Oracle: "About time you showed up."', 'mission');
                    startDialogue('oracle_intro');
                }
            },
            {
                id: 'steal_car',
                description: 'Steal a car for the heist',
                type: 'steal',
                vehicleType: 'sedan',
                completed: false,
                onComplete: () => {
                    showNotification('Vehicle acquired. Press F to enter.', 'success');
                }
            },
            {
                id: 'escape_drones',
                description: 'Escape the Nexus patrol drones',
                type: 'escape',
                enemies: 3,
                completed: false,
                onComplete: () => {
                    showNotification('Drones evaded. Good driving!', 'success');
                    completeMission('m1_kagiso_nights');
                }
            }
        ],
        
        rewards: {
            money: 5000,
            reputation: 10,
            unlock: ['m2_digital_shadows']
        },
        
        start: () => {
            showNotification('Mission started: Kagiso Nights', 'mission');
            showMissionObjective('Meet Oracle at the chop shop');
            
            // Spawn Oracle NPC
            spawnNPC('oracle', { x: 100, y: 0, z: 100 });
            
            // Spawn patrol drones
            for (let i = 0; i < 3; i++) {
                spawnEnemy('drone', {
                    x: Math.random() * 200 - 100,
                    y: 10,
                    z: Math.random() * 200 - 100
                });
            }
        },
        
        update: () => {
            // Mission-specific updates
            if (GAME.player.wantedLevel > 0) {
                increaseWantedLevel(1);
            }
        }
    },
    
    m2_digital_shadows: {
        id: 'm2_digital_shadows',
        name: 'Digital Shadows',
        type: 'main',
        difficulty: 'medium',
        giver: 'Oracle',
        
        objectives: [
            // ... mission objectives
        ],
        
        rewards: {
            money: 10000,
            reputation: 20,
            weapon: 'SMG-9X'
        }
    }
};

function startMission(missionId) {
    const mission = MISSIONS[missionId];
    if (!mission) return;
    
    GAME.missions.current = mission;
    mission.start();
    
    // Update mission display
    document.getElementById('missionObjective').textContent = mission.objectives[0].description;
    
    console.log(`🎮 Mission started: ${mission.name}`);
}

function updateMission() {
    if (!GAME.missions.current) return;
    
    const mission = GAME.missions.current;
    
    // Check objectives
    for (const objective of mission.objectives) {
        if (!objective.completed) {
            checkObjective(objective);
            break; // Only check first incomplete objective
        }
    }
    
    // Run mission-specific updates
    if (mission.update) {
        mission.update();
    }
}

function checkObjective(objective) {
    const playerPos = GAME.player.entity.body.position;
    
    switch(objective.type) {
        case 'goto':
            const distance = Math.sqrt(
                Math.pow(playerPos.x - objective.position.x, 2) +
                Math.pow(playerPos.z - objective.position.z, 2)
            );
            
            if (distance <= objective.radius) {
                completeObjective(objective);
            }
            break;
            
        case 'kill':
            if (objective.enemies <= 0) {
                completeObjective(objective);
            }
            break;
            
        case 'collect':
            if (objective.collected >= objective.required) {
                completeObjective(objective);
            }
            break;
    }
}

function completeObjective(objective) {
    objective.completed = true;
    
    if (objective.onComplete) {
        objective.onComplete();
    }
    
    // Check if all objectives are complete
    const mission = GAME.missions.current;
    const allComplete = mission.objectives.every(obj => obj.completed);
    
    if (allComplete) {
        completeMission(mission.id);
    } else {
        // Show next objective
        const nextObj = mission.objectives.find(obj => !obj.completed);
        if (nextObj) {
            showMissionObjective(nextObj.description);
            showNotification('Objective updated', 'info');
        }
    }
}

function completeMission(missionId) {
    const mission = MISSIONS[missionId];
    
    // Give rewards
    GAME.player.money += mission.rewards.money;
    
    // Unlock next missions
    if (mission.rewards.unlock) {
        mission.rewards.unlock.forEach(nextId => {
            if (!GAME.missions.available.includes(nextId)) {
                GAME.missions.available.push(nextId);
            }
        });
    }
    
    // Add to completed
    GAME.missions.completed.push(missionId);
    
    // Clear current mission
    GAME.missions.current = null;
    
    // Show mission complete screen
    showMissionComplete(mission);
    
    console.log(`✅ Mission completed: ${mission.name}`);
}

// ================ COMBAT SYSTEM ================
class Weapon {
    constructor(name, damage, fireRate, range, ammo, reloadTime) {
        this.name = name;
        this.damage = damage;
        this.fireRate = fireRate;
        this.range = range;
        this.ammo = ammo;
        this.maxAmmo = ammo;
        this.reloadTime = reloadTime;
        this.lastFire = 0;
        this.isReloading = false;
        this.model = null;
    }
    
    fire() {
        if (this.isReloading || this.ammo <= 0) {
            if (this.ammo <= 0) {
                this.reload();
            }
            return false;
        }
        
        const now = Date.now();
        if (now - this.lastFire < 1000 / this.fireRate) {
            return false;
        }
        
        this.ammo--;
        this.lastFire = now;
        
        // Create bullet
        createBullet();
        
        // Play sound
        playSound('shoot');
        
        // Recoil
        applyRecoil();
        
        // Muzzle flash
        createMuzzleFlash();
        
        return true;
    }
    
    reload() {
        if (this.isReloading || this.ammo === this.maxAmmo) return;
        
        this.isReloading = true;
        showNotification(`Reloading ${this.name}...`, 'info');
        
        setTimeout(() => {
            this.ammo = this.maxAmmo;
            this.isReloading = false;
            showNotification(`${this.name} reloaded`, 'success');
        }, this.reloadTime);
    }
}

function createBullet() {
    // Calculate bullet direction from camera
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(GAME.camera.quaternion);
    
    // Create bullet object
    const bullet = {
        position: GAME.camera.position.clone(),
        velocity: direction.multiplyScalar(100),
        damage: GAME.player.weapons[GAME.player.currentWeapon].damage,
        owner: 'player',
        lifetime: 2.0
    };
    
    GAME.world.bullets.push(bullet);
    
    // Check for hits
    checkBulletHit(bullet);
}

// ================ UI SYSTEM ================
function setupUI() {
    console.log('📱 Setting up UI...');
    
    // Cache DOM elements
    GAME.ui.elements = {
        healthFill: document.getElementById('healthFill'),
        healthValue: document.getElementById('healthValue'),
        armorFill: document.getElementById('armorFill'),
        armorValue: document.getElementById('armorValue'),
        moneyValue: document.getElementById('moneyValue'),
        weaponName: document.getElementById('weaponName'),
        ammoCount: document.getElementById('ammoCount'),
        missionObjective: document.getElementById('missionObjective'),
        wantedLevel: document.getElementById('wantedLevel')
    };
    
    // Setup event listeners
    setupEventListeners();
    
    // Start UI update loop
    setInterval(updateUI, 100);
}

function updateUI() {
    if (GAME.state !== 'playing') return;
    
    // Update health and armor
    GAME.ui.elements.healthFill.style.width = `${GAME.player.health}%`;
    GAME.ui.elements.healthValue.textContent = Math.round(GAME.player.health);
    GAME.ui.elements.armorFill.style.width = `${GAME.player.armor}%`;
    GAME.ui.elements.armorValue.textContent = Math.round(GAME.player.armor);
    
    // Update money
    GAME.ui.elements.moneyValue.textContent = `₿${GAME.player.money.toLocaleString()}`;
    
    // Update weapon info
    const weapon = GAME.player.weapons[GAME.player.currentWeapon];
    GAME.ui.elements.weaponName.textContent = weapon.name;
    GAME.ui.elements.ammoCount.textContent = `${weapon.ammo}/${weapon.maxAmmo}`;
    
    // Update wanted level
    if (GAME.player.wantedLevel > 0) {
        GAME.ui.elements.wantedLevel.classList.add('active');
        const stars = GAME.ui.elements.wantedLevel.querySelectorAll('.fa-star');
        stars.forEach((star, i) => {
            star.style.color = i < GAME.player.wantedLevel ? '#ffff00' : '#666';
        });
    } else {
        GAME.ui.elements.wantedLevel.classList.remove('active');
    }
}

function showNotification(message, type = 'info') {
    const notificationCenter = document.getElementById('notificationCenter');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationCenter.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function showMissionObjective(text) {
    GAME.ui.elements.missionObjective.textContent = text;
}

// ================ INPUT HANDLING ================
function setupEventListeners() {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
        GAME.input.keys[e.code] = true;
        
        // Handle special keys
        switch(e.code) {
            case CONFIG.CONTROLS.KEYBINDS.PAUSE:
                togglePause();
                break;
            case CONFIG.CONTROLS.KEYBINDS.ENTER_VEHICLE:
                enterNearestVehicle();
                break;
            case CONFIG.CONTROLS.KEYBINDS.HACK:
                useAbility('hack');
                break;
            case CONFIG.CONTROLS.KEYBINDS.PHONE:
                togglePhone();
                break;
            case CONFIG.CONTROLS.KEYBINDS.MAP:
                toggleMap();
                break;
        }
    });
    
    window.addEventListener('keyup', (e) => {
        GAME.input.keys[e.code] = false;
    });
    
    // Mouse events
    const canvas = document.getElementById('gameCanvas');
    
    canvas.addEventListener('mousedown', (e) => {
        GAME.input.mouse.down = true;
        if (e.button === 0) { // Left click
            fireWeapon();
        }
    });
    
    canvas.addEventListener('mouseup', (e) => {
        GAME.input.mouse.down = false;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement === canvas) {
            handleMouseLook(e.movementX, e.movementY);
        }
    });
    
    // Request pointer lock on click
    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
}

function handleMouseLook(deltaX, deltaY) {
    if (GAME.player.entity.isDriving) return;
    
    const sensitivity = CONFIG.CONTROLS.SENSITIVITY * 0.002;
    
    // Update player rotation
    GAME.player.entity.rotation.y -= deltaX * sensitivity;
    GAME.player.entity.rotation.x -= deltaY * sensitivity * (CONFIG.CONTROLS.INVERT_Y ? -1 : 1);
    
    // Clamp vertical look
    GAME.player.entity.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, GAME.player.entity.rotation.x));
}

// ================ GAME LOOP ================
function startGameLoop() {
    console.log('🔄 Starting game loop...');
    
    function animate() {
        requestAnimationFrame(animate);
        
        const deltaTime = GAME.clock.getDelta();
        
        if (GAME.state === 'playing') {
            // Update physics
            updatePhysics(deltaTime);
            
            // Update player
            updatePlayer(deltaTime);
            
            // Update vehicles
            updateVehicles(deltaTime);
            
            // Update NPCs
            updateNPCs(deltaTime);
            
            // Update particles
            updateParticles(deltaTime);
            
            // Update mission
            updateMission();
            
            // Update camera
            updateCamera(deltaTime);
            
            // Update time of day
            updateTimeOfDay(deltaTime);
            
            // Update minimap
            updateMinimap();
        }
        
        // Render scene
        GAME.renderer.render(GAME.scene, GAME.camera);
        
        // Update performance stats
        updatePerformanceStats();
    }
    
    animate();
}

function updatePhysics(deltaTime) {
    GAME.physics.world.step(1/60, deltaTime, 3);
    
    // Sync Three.js objects with physics bodies
    GAME.physics.bodies.forEach((body, uuid) => {
        const obj = GAME.scene.getObjectByProperty('uuid', uuid);
        if (obj) {
            obj.position.copy(body.position);
            obj.quaternion.copy(body.quaternion);
        }
    });
}

function updatePlayer(deltaTime) {
    if (GAME.player.entity.isDriving) {
        // Player is in vehicle
        return;
    }
    
    // Movement
    const moveSpeed = 5;
    const sprintMultiplier = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.SPRINT] ? 2 : 1;
    
    const forward = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_FORWARD];
    const backward = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_BACK];
    const left = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_LEFT];
    const right = GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.MOVE_RIGHT];
    
    let moveX = 0;
    let moveZ = 0;
    
    if (forward) moveZ -= 1;
    if (backward) moveZ += 1;
    if (left) moveX -= 1;
    if (right) moveX += 1;
    
    // Normalize diagonal movement
    if (moveX !== 0 && moveZ !== 0) {
        moveX *= 0.7071;
        moveZ *= 0.7071;
    }
    
    // Calculate movement direction based on player rotation
    const forwardVector = new THREE.Vector3(0, 0, -1);
    const rightVector = new THREE.Vector3(1, 0, 0);
    
    forwardVector.applyEuler(GAME.player.entity.rotation);
    rightVector.applyEuler(GAME.player.entity.rotation);
    
    const moveVector = new THREE.Vector3();
    moveVector.addScaledVector(forwardVector, moveZ);
    moveVector.addScaledVector(rightVector, moveX);
    moveVector.normalize();
    
    // Apply movement force
    const forceMagnitude = moveSpeed * sprintMultiplier * 100;
    GAME.player.entity.body.applyForce(
        new CANNON.Vec3(
            moveVector.x * forceMagnitude,
            0,
            moveVector.z * forceMagnitude
        ),
        GAME.player.entity.body.position
    );
    
    // Jump
    if (GAME.input.keys[CONFIG.CONTROLS.KEYBINDS.JUMP] && GAME.player.entity.isGrounded) {
        GAME.player.entity.body.applyImpulse(
            new CANNON.Vec3(0, 400, 0),
            GAME.player.entity.body.position
        );
        GAME.player.entity.isGrounded = false;
    }
    
    // Update player model rotation
    GAME.player.entity.mesh.rotation.y = GAME.player.entity.rotation.y;
    
    // Check ground collision
    checkGroundCollision();
}

function updateCamera(deltaTime) {
    if (GAME.player.entity.isDriving) {
        // Vehicle camera
        const vehicle = GAME.player.vehicle;
        const offset = new THREE.Vector3(0, 5, 10);
        offset.applyQuaternion(vehicle.body.quaternion);
        
        const targetPosition = new THREE.Vector3(
            vehicle.body.position.x + offset.x,
            vehicle.body.position.y + offset.y,
            vehicle.body.position.z + offset.z
        );
        
        GAME.camera.position.lerp(targetPosition, 0.1);
        GAME.camera.lookAt(vehicle.body.position);
    } else {
        // Third-person camera
        const offset = new THREE.Vector3(0, 2, 5);
        offset.applyEuler(GAME.player.entity.rotation);
        
        const targetPosition = new THREE.Vector3(
            GAME.player.entity.body.position.x + offset.x,
            GAME.player.entity.body.position.y + offset.y,
            GAME.player.entity.body.position.z + offset.z
        );
        
        // Smooth camera movement
        GAME.camera.position.lerp(targetPosition, 0.1);
        
        // Look at player
        const lookAt = new THREE.Vector3(
            GAME.player.entity.body.position.x,
            GAME.player.entity.body.position.y + 1,
            GAME.player.entity.body.position.z
        );
        GAME.camera.lookAt(lookAt);
    }
}

// ================ UTILITY FUNCTIONS ================
function onWindowResize() {
    GAME.camera.aspect = window.innerWidth / window.innerHeight;
    GAME.camera.updateProjectionMatrix();
    GAME.renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateLoadingProgress(percent) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }
    
    if (progressText) {
        progressText.textContent = `LOADING... ${Math.round(percent)}%`;
    }
}

function showError(message) {
    alert(`GAME ERROR: ${message}\nPlease refresh the page.`);
}

// ================ PUBLIC FUNCTIONS ================
// These would be called from HTML event handlers
window.startNewGame = () => {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    GAME.state = 'playing';
    initGame();
};

window.togglePause = () => {
    if (GAME.state === 'playing') {
        GAME.state = 'paused';
        document.getElementById('pauseMenu').classList.add('active');
    } else if (GAME.state === 'paused') {
        GAME.state = 'playing';
        document.getElementById('pauseMenu').classList.remove('active');
    }
};

window.enterNearestVehicle = () => {
    if (GAME.player.entity.isDriving) {
        // Exit current vehicle
        GAME.player.vehicle.exit();
        return;
    }
    
    // Find nearest vehicle
    let nearest = null;
    let nearestDistance = Infinity;
    
    for (const vehicle of GAME.world.vehicles) {
        if (vehicle.occupied) continue;
        
        const distance = GAME.player.entity.body.position.distanceTo(vehicle.body.position);
        if (distance < 5 && distance < nearestDistance) {
            nearest = vehicle;
            nearestDistance = distance;
        }
    }
    
    if (nearest) {
        nearest.enter(GAME.player.entity);
    }
};

// ================ INITIALIZE GAME ================
// Start loading when page loads
window.addEventListener('load', () => {
    console.log('🕹️ GothAlienBoy: Kagiso Cyberheist loading...');
    
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.remove('active');
        document.getElementById('mainMenu').classList.add('active');
    }, 3000);
});
