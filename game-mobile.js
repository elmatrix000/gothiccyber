// GOTHALIENBOY 3D - MOBILE OPTIMIZED GAME ENGINE

// Game Configuration
const MOBILE_CONFIG = {
    GRAPHICS: {
        QUALITY: 'medium', // 'low', 'medium', 'high'
        SHADOWS: false,
        POSTPROCESSING: false,
        PARTICLES: 50,
        DRAW_DISTANCE: 500,
        TEXTURE_SIZE: 512
    },
    
    CONTROLS: {
        SENSITIVITY: 0.002,
        INVERT_Y: false,
        VIBRATION: true,
        AUTO_JUMP: false,
        TOUCH_DEADZONE: 0.1
    },
    
    PERFORMANCE: {
        TARGET_FPS: 60,
        FRAME_SKIP: 1,
        DYNAMIC_LOD: true,
        OBJECT_POOLING: true,
        MEMORY_LIMIT: 256 // MB
    }
};

// Game State
let game = {
    state: 'loading',
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    clock: new THREE.Clock(),
    
    // Player
    player: {
        position: new THREE.Vector3(0, 2, 0),
        velocity: new THREE.Vector3(),
        rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
        speed: 5,
        jumpForce: 8,
        isGrounded: false,
        health: 100,
        hackEnergy: 100,
        dataCollected: 0,
        score: 0,
        bitcoin: 0
    },
    
    // Mobile Controls
    mobileInput: {
        move: { x: 0, y: 0 },
        look: { x: 0, y: 0 },
        buttons: {
            shoot: false,
            jump: false,
            hack: false,
            cloak: false
        },
        touches: {},
        joystickActive: false,
        lookActive: false
    },
    
    // Game Objects
    enemies: [],
    bullets: [],
    particles: [],
    items: [],
    platforms: [],
    
    // Performance
    stats: {
        fps: 60,
        memory: 0,
        drawCalls: 0,
        triangles: 0
    },
    
    // UI
    ui: {
        healthFill: null,
        hackFill: null,
        scoreText: null,
        dataText: null
    }
};

// Initialize Game
async function initGame() {
    console.log('🚀 Initializing GothAlienBoy 3D Mobile...');
    
    // Setup Three.js scene
    setupScene();
    
    // Setup mobile controls
    setupMobileControls();
    
    // Setup game objects
    await setupGameObjects();
    
    // Setup UI
    setupUI();
    
    // Start game loop
    startGameLoop();
    
    // Show tutorial
    showTutorial();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();
}

// Setup Three.js Scene
function setupScene() {
    // Create scene
    game.scene = new THREE.Scene();
    game.scene.fog = new THREE.Fog(0x0a0a2a, 10, 500);
    
    // Setup camera (first person)
    game.camera = new THREE.PerspectiveCamera(
        75, // FOV - wider for mobile
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    game.camera.position.copy(game.player.position);
    
    // Setup renderer
    game.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('gameCanvas'),
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
    });
    
    game.renderer.setSize(window.innerWidth, window.innerHeight);
    game.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for mobile
    game.renderer.outputEncoding = THREE.sRGBEncoding;
    game.renderer.shadowMap.enabled = MOBILE_CONFIG.GRAPHICS.SHADOWS;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    game.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00ffea, 0.8);
    directionalLight.position.set(10, 20, 5);
    directionalLight.castShadow = MOBILE_CONFIG.GRAPHICS.SHADOWS;
    game.scene.add(directionalLight);
    
    // Add neon grid floor
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x0a0a2a,
        side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = 0;
    game.scene.add(floor);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(100, 20, 0x00ffea, 0x006666);
    gridHelper.position.y = 0.01;
    game.scene.add(gridHelper);
    
    // Create simple test environment
    createTestEnvironment();
}

// Create Test Environment (Placeholder)
function createTestEnvironment() {
    // Create some basic buildings/obstacles
    const buildingGeometry = new THREE.BoxGeometry(5, 10, 5);
    const buildingMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a1a4a,
        wireframe: false
    });
    
    for (let i = 0; i < 20; i++) {
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(
            (Math.random() - 0.5) * 80,
            5,
            (Math.random() - 0.5) * 80
        );
        building.userData = { type: 'building' };
        game.scene.add(building);
        game.platforms.push(building);
    }
    
    // Add some collectibles
    const itemGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const itemMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8
    });
    
    for (let i = 0; i < 10; i++) {
        const item = new THREE.Mesh(itemGeometry, itemMaterial);
        item.position.set(
            (Math.random() - 0.5) * 50,
            2,
            (Math.random() - 0.5) * 50
        );
        item.userData = { type: 'data', value: 10 };
        game.scene.add(item);
        game.items.push(item);
    }
}

// Setup Mobile Controls
function setupMobileControls() {
    console.log('🕹️ Setting up mobile controls...');
    
    const joystick = document.querySelector('.joystick-container');
    const joystickHandle = document.querySelector('.joystick-handle');
    const lookArea = document.getElementById('lookArea');
    const actionButtons = document.querySelectorAll('.action-btn');
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    // Movement Joystick
    let joystickRect = joystick.getBoundingClientRect();
    let joystickCenter = {
        x: joystickRect.left + joystickRect.width / 2,
        y: joystickRect.top + joystickRect.height / 2
    };
    let joystickRadius = joystickRect.width / 2;
    
    joystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        game.mobileInput.joystickActive = true;
        updateJoystick(e.touches[0]);
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (game.mobileInput.joystickActive) {
            e.preventDefault();
            updateJoystick(e.touches[0]);
        }
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
        game.mobileInput.joystickActive = false;
        game.mobileInput.move.x = 0;
        game.mobileInput.move.y = 0;
        joystickHandle.style.transform = 'translate(-50%, -50%)';
    });
    
    function updateJoystight(touch) {
        const x = touch.clientX - joystickCenter.x;
        const y = touch.clientY - joystickCenter.y;
        const distance = Math.sqrt(x * x + y * y);
        const angle = Math.atan2(y, x);
        
        const normalizedX = Math.cos(angle) * Math.min(distance / joystickRadius, 1);
        const normalizedY = Math.sin(angle) * Math.min(distance / joystickRadius, 1);
        
        game.mobileInput.move.x = normalizedX;
        game.mobileInput.move.y = normalizedY;
        
        const handleX = normalizedX * joystickRadius * 0.7;
        const handleY = normalizedY * joystickRadius * 0.7;
        joystickHandle.style.transform = `translate(calc(-50% + ${handleX}px), calc(-50% + ${handleY}px))`;
    }
    
    // Look Controls (right side of screen)
    let lastTouch = null;
    
    lookArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        game.mobileInput.lookActive = true;
        lastTouch = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }, { passive: false });
    
    lookArea.addEventListener('touchmove', (e) => {
        if (game.mobileInput.lookActive && lastTouch) {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - lastTouch.x;
            const deltaY = touch.clientY - lastTouch.y;
            
            game.mobileInput.look.x = deltaX * MOBILE_CONFIG.CONTROLS.SENSITIVITY;
            game.mobileInput.look.y = deltaY * MOBILE_CONFIG.CONTROLS.SENSITIVITY;
            
            lastTouch = {
                x: touch.clientX,
                y: touch.clientY
            };
        }
    }, { passive: false });
    
    lookArea.addEventListener('touchend', () => {
        game.mobileInput.lookActive = false;
        game.mobileInput.look.x = 0;
        game.mobileInput.look.y = 0;
        lastTouch = null;
    });
    
    // Action Buttons
    actionButtons.forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const action = btn.getAttribute('data-action');
            game.mobileInput.buttons[action] = true;
            
            // Visual feedback
            btn.style.transform = 'scale(0.9)';
            btn.style.boxShadow = '0 0 30px rgba(255, 0, 102, 0.8)';
            
            // Haptic feedback
            if (MOBILE_CONFIG.CONTROLS.VIBRATION && navigator.vibrate) {
                navigator.vibrate(50);
            }
        }, { passive: false });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            const action = btn.getAttribute('data-action');
            game.mobileInput.buttons[action] = false;
            
            // Reset visual feedback
            btn.style.transform = '';
            btn.style.boxShadow = '';
        }, { passive: false });
    });
    
    // Quick Buttons (Pause, Menu)
    quickButtons.forEach(btn => {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const action = btn.getAttribute('data-action');
            
            switch(action) {
                case 'pause':
                    togglePause();
                    break;
                case 'menu':
                    showMobileMenu();
                    break;
            }
        }, { passive: false });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        joystickRect = joystick.getBoundingClientRect();
        joystickCenter = {
            x: joystickRect.left + joystickRect.width / 2,
            y: joystickRect.top + joystickRect.height / 2
        };
        joystickRadius = joystickRect.width / 2;
        
        game.camera.aspect = window.innerWidth / window.innerHeight;
        game.camera.updateProjectionMatrix();
        game.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Setup Game Objects
async function setupGameObjects() {
    console.log('🎮 Setting up game objects...');
    
    // Create player placeholder (simple capsule)
    const playerGeometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    const playerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffea,
        wireframe: true
    });
    game.player.mesh = new THREE.Mesh(playerGeometry, playerMaterial);
    game.scene.add(game.player.mesh);
    
    // Create simple enemy placeholder
    const enemyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const enemyMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0066,
        wireframe: true
    });
    
    for (let i = 0; i < 5; i++) {
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemy.position.set(
            (Math.random() - 0.5) * 30,
            1,
            (Math.random() - 0.5) * 30
        );
        enemy.userData = {
            type: 'enemy',
            health: 50,
            speed: 2,
            target: game.player.position
        };
        game.scene.add(enemy);
        game.enemies.push(enemy);
    }
}

// Setup UI
function setupUI() {
    console.log('📱 Setting up mobile UI...');
    
    // Cache UI elements
    game.ui.healthFill = document.querySelector('.health-fill');
    game.ui.hackFill = document.querySelector('.hack-fill');
    game.ui.healthText = document.querySelector('.health-text');
    game.ui.hackText = document.querySelector('.hack-text');
    game.ui.scoreDisplay = document.querySelector('.score span');
    game.ui.dataDisplay = document.querySelector('.data-display span');
    
    // Mobile menu buttons
    const menuOptions = document.querySelectorAll('.menu-option');
    menuOptions.forEach(option => {
        option.addEventListener('click', () => {
            const action = option.getAttribute('data-action');
            handleMenuAction(action);
        });
    });
    
    // Tutorial buttons
    const tutorialNext = document.querySelectorAll('.tutorial-next');
    tutorialNext.forEach(btn => {
        btn.addEventListener('click', nextTutorialSlide);
    });
}

// Game Loop
function startGameLoop() {
    console.log('🔄 Starting game loop...');
    
    // Hide loading screen
    hideLoadingScreen();
    
    // Start game
    game.state = 'playing';
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const deltaTime = game.clock.getDelta();
        
        // Skip frames if needed for performance
        if (MOBILE_CONFIG.PERFORMANCE.FRAME_SKIP > 1) {
            if (Math.floor(performance.now() / 1000) % MOBILE_CONFIG.PERFORMANCE.FRAME_SKIP !== 0) {
                return;
            }
        }
        
        // Update game state
        if (game.state === 'playing') {
            updatePlayer(deltaTime);
            updateCamera();
            updateEnemies(deltaTime);
            updateBullets(deltaTime);
            updateParticles(deltaTime);
            updateItems(deltaTime);
            checkCollisions();
            updateUI();
        }
        
        // Render scene
        game.renderer.render(game.scene, game.camera);
        
        // Update performance stats
        updatePerformanceStats();
    }
    
    animate();
}

// Update Player
function updatePlayer(deltaTime) {
    // Apply movement from joystick
    const moveSpeed = game.player.speed * deltaTime;
    const moveX = game.mobileInput.move.x * moveSpeed;
    const moveZ = -game.mobileInput.move.y * moveSpeed; // Invert Y for forward/back
    
    // Convert local movement to world space
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(game.camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(game.camera.quaternion);
    
    forward.y = 0;
    right.y = 0;
    forward.normalize();
    right.normalize();
    
    // Calculate movement vector
    const moveVector = new THREE.Vector3();
    moveVector.addScaledVector(forward, moveZ);
    moveVector.addScaledVector(right, moveX);
    
    // Apply gravity
    game.player.velocity.y -= 20 * deltaTime; // Gravity
    
    // Jump if button pressed and grounded
    if (game.mobileInput.buttons.jump && game.player.isGrounded) {
        game.player.velocity.y = game.player.jumpForce;
        game.player.isGrounded = false;
        
        // Haptic feedback
        if (MOBILE_CONFIG.CONTROLS.VIBRATION && navigator.vibrate) {
            navigator.vibrate(100);
        }
    }
    
    // Add movement to velocity
    game.player.velocity.x = moveVector.x * 10;
    game.player.velocity.z = moveVector.z * 10;
    
    // Update position
    game.player.position.addScaledVector(game.player.velocity, deltaTime);
    
    // Simple ground collision
    if (game.player.position.y < 1) {
        game.player.position.y = 1;
        game.player.velocity.y = 0;
        game.player.isGrounded = true;
    }
    
    // Update player mesh position
    if (game.player.mesh) {
        game.player.mesh.position.copy(game.player.position);
    }
    
    // Handle shooting
    if (game.mobileInput.buttons.shoot) {
        shoot();
        game.mobileInput.buttons.shoot = false; // Reset for tap-to-shoot
    }
    
    // Handle hacking
    if (game.mobileInput.buttons.hack && game.player.hackEnergy >= 20) {
        hack();
        game.mobileInput.buttons.hack = false;
    }
    
    // Regenerate hack energy
    game.player.hackEnergy = Math.min(100, game.player.hackEnergy + 5 * deltaTime);
}

// Update Camera
function updateCamera() {
    // Apply look rotation
    if (game.mobileInput.lookActive) {
        game.player.rotation.y -= game.mobileInput.look.x;
        game.player.rotation.x -= game.mobileInput.look.y * (MOBILE_CONFIG.CONTROLS.INVERT_Y ? -1 : 1);
        
        // Clamp vertical look
        game.player.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, game.player.rotation.x));
    }
    
    // Update camera position and rotation
    game.camera.position.copy(game.player.position);
    game.camera.position.y += 1.6; // Eye height
    
    // Set camera rotation
    game.camera.rotation.set(game.player.rotation.x, game.player.rotation.y, 0, 'YXZ');
}

// Update Enemies
function updateEnemies(deltaTime) {
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        
        // Simple AI: move toward player
        const direction = new THREE.Vector3();
        direction.subVectors(game.player.position, enemy.position);
        direction.y = 0;
        
        if (direction.length() > 0) {
            direction.normalize();
            enemy.position.addScaledVector(direction, enemy.userData.speed * deltaTime);
            
            // Face player
            enemy.lookAt(game.player.position);
        }
        
        // Update enemy mesh
        enemy.position.y = Math.sin(Date.now() * 0.001 + i) * 0.1 + 1;
    }
}

// Shoot Bullet
function shoot() {
    if (game.player.hackEnergy < 5) return;
    
    game.player.hackEnergy -= 5;
    
    // Create bullet
    const bulletGeometry = new THREE.SphereGeometry(0.1, 4, 4);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    // Set position and direction
    bullet.position.copy(game.camera.position);
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(game.camera.quaternion);
    bullet.userData = {
        velocity: direction.multiplyScalar(50),
        lifetime: 2.0
    };
    
    game.scene.add(bullet);
    game.bullets.push(bullet);
    
    // Haptic feedback
    if (MOBILE_CONFIG.CONTROLS.VIBRATION && navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // Create muzzle flash particle
    createParticle(game.camera.position, 0xff9900, 0.3);
}

// Update Bullets
function updateBullets(deltaTime) {
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        
        // Update position
        bullet.position.addScaledVector(bullet.userData.velocity, deltaTime);
        
        // Check lifetime
        bullet.userData.lifetime -= deltaTime;
        if (bullet.userData.lifetime <= 0) {
            game.scene.remove(bullet);
            game.bullets.splice(i, 1);
            continue;
        }
        
        // Check collision with enemies
        for (let j = game.enemies.length - 1; j >= 0; j--) {
            const enemy = game.enemies[j];
            const distance = bullet.position.distanceTo(enemy.position);
            
            if (distance < 1.5) {
                // Hit!
                enemy.userData.health -= 25;
                
                // Create hit particle
                createParticle(enemy.position, 0xff0000, 0.5);
                
                // Remove bullet
                game.scene.remove(bullet);
                game.bullets.splice(i, 1);
                
                // Check if enemy is dead
                if (enemy.userData.health <= 0) {
                    game.scene.remove(enemy);
                    game.enemies.splice(j, 1);
                    game.player.score += 100;
                    game.player.bitcoin += 10;
                    
                    // Create explosion particles
                    for (let k = 0; k < 10; k++) {
                        createParticle(enemy.position, 0xff0066, 0.2);
                    }
                }
                
                break;
            }
        }
    }
}

// Hack Ability
function hack() {
    if (game.player.hackEnergy < 20) return;
    
    game.player.hackEnergy -= 20;
    
    // Disable nearest enemy
    let nearestEnemy = null;
    let nearestDistance = Infinity;
    
    for (const enemy of game.enemies) {
        const distance = enemy.position.distanceTo(game.player.position);
        if (distance < 10 && distance < nearestDistance) {
            nearestEnemy = enemy;
            nearestDistance = distance;
        }
    }
    
    if (nearestEnemy) {
        // Stun enemy
        nearestEnemy.userData.speed = 0;
        
        // Visual effect - change color
        nearestEnemy.material.color.set(0x00ff00);
        
        // Restore after 3 seconds
        setTimeout(() => {
            if (nearestEnemy.parent) {
                nearestEnemy.userData.speed = 2;
                nearestEnemy.material.color.set(0xff0066);
            }
        }, 3000);
        
        // Create hack particles
        createParticle(nearestEnemy.position, 0x00ff00, 0.5);
    }
    
    // Haptic feedback
    if (MOBILE_CONFIG.CONTROLS.VIBRATION && navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
    }
}

// Create Particle
function createParticle(position, color, size) {
    if (game.particles.length >= MOBILE_CONFIG.GRAPHICS.PARTICLES) {
        // Remove oldest particle if at limit
        const oldParticle = game.particles.shift();
        game.scene.remove(oldParticle);
    }
    
    const particleGeometry = new THREE.SphereGeometry(size, 3, 3);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.copy(position);
    particle.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            Math.random() * 3,
            (Math.random() - 0.5) * 5
        ),
        lifetime: 1.0
    };
    
    game.scene.add(particle);
    game.particles.push(particle);
}

// Update Particles
function updateParticles(deltaTime) {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const particle = game.particles[i];
        
        // Update position
        particle.position.addScaledVector(particle.userData.velocity, deltaTime);
        
        // Apply gravity
        particle.userData.velocity.y -= 10 * deltaTime;
        
        // Update lifetime
        particle.userData.lifetime -= deltaTime;
        particle.material.opacity = particle.userData.lifetime;
        
        // Remove dead particles
        if (particle.userData.lifetime <= 0) {
            game.scene.remove(particle);
            game.particles.splice(i, 1);
        }
    }
}

// Update Items
function updateItems(deltaTime) {
    for (let i = game.items.length - 1; i >= 0; i--) {
        const item = game.items[i];
        
        // Float animation
        item.position.y = Math.sin(Date.now() * 0.001 + i) * 0.5 + 2;
        item.rotation.y += deltaTime;
        
        // Check collection
        const distance = item.position.distanceTo(game.player.position);
        if (distance < 2) {
            // Collect item
            game.player.dataCollected += item.userData.value;
            game.player.score += 50;
            
            // Create collection particles
            for (let j = 0; j < 5; j++) {
                createParticle(item.position, 0x00ff00, 0.2);
            }
            
            // Remove item
            game.scene.remove(item);
            game.items.splice(i, 1);
        }
    }
}

// Check Collisions
function checkCollisions() {
    // Check enemy collisions with player
    for (const enemy of game.enemies) {
        const distance = enemy.position.distanceTo(game.player.position);
        if (distance < 2) {
            // Take damage
            game.player.health -= 10 * game.clock.getDelta();
            
            // Visual feedback
            showDamageIndicator();
            
            // Haptic feedback
            if (MOBILE_CONFIG.CONTROLS.VIBRATION && navigator.vibrate) {
                navigator.vibrate(200);
            }
            
            // Check if player died
            if (game.player.health <= 0) {
                gameOver();
            }
        }
    }
}

// Update UI
function updateUI() {
    // Update health and hack bars
    game.ui.healthFill.style.width = `${game.player.health}%`;
    game.ui.hackFill.style.width = `${game.player.hackEnergy}%`;
    game.ui.healthText.textContent = `${Math.round(game.player.health)}%`;
    game.ui.hackText.textContent = `${Math.round(game.player.hackEnergy)}%`;
    
    // Update score and data
    game.ui.scoreDisplay.textContent = `₿${game.player.bitcoin}`;
    game.ui.dataDisplay.textContent = `${Math.min(100, game.player.dataCollected)}%`;
    
    // Check win condition
    if (game.player.dataCollected >= 100) {
        gameWin();
    }
}

// Game Over
function gameOver() {
    game.state = 'gameover';
    
    // Show game over message
    showNotification('HEIST FAILED - Nexus Security captured you', 'error');
    
    // Disable controls
    document.getElementById('mobileControls').style.display = 'none';
    
    // Restart after 3 seconds
    setTimeout(() => {
        restartGame();
    }, 3000);
}

// Game Win
function gameWin() {
    game.state = 'win';
    
    // Show victory message
    showNotification('HEIST SUCCESSFUL! You escaped Kagiso!', 'success');
    
    // Celebration particles
    for (let i = 0; i < 50; i++) {
        createParticle(game.player.position, 0x00ffea, 0.3);
    }
    
    // Haptic celebration
    if (MOBILE_CONFIG.CONTROLS.VIBRATION && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
}

// Restart Game
function restartGame() {
    // Reset player state
    game.player.health = 100;
    game.player.hackEnergy = 100;
    game.player.dataCollected = 0;
    game.player.score = 0;
    game.player.bitcoin = 0;
    game.player.position.set(0, 2, 0);
    game.player.velocity.set(0, 0, 0);
    
    // Remove all enemies and items
    game.enemies.forEach(enemy => game.scene.remove(enemy));
    game.enemies = [];
    
    game.items.forEach(item => game.scene.remove(item));
    game.items = [];
    
    // Reset camera
    game.player.rotation.set(0, 0, 0);
    
    // Create new enemies and items
    createTestEnvironment();
    
    // Re-enable controls
    document.getElementById('mobileControls').style.display = '';
    
    // Set state back to playing
    game.state = 'playing';
}

// Toggle Pause
function togglePause() {
    if (game.state === 'playing') {
        game.state = 'paused';
        showMobileMenu();
    } else if (game.state === 'paused') {
        game.state = 'playing';
        hideMobileMenu();
    }
}

// Show Mobile Menu
function showMobileMenu() {
    document.getElementById('mobileMenu').classList.add('active');
}

// Hide Mobile Menu
function hideMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
}

// Handle Menu Actions
function handleMenuAction(action) {
    switch(action) {
        case 'resume':
            game.state = 'playing';
            hideMobileMenu();
            break;
        case 'restart':
            restartGame();
            hideMobileMenu();
            break;
        case 'settings':
            showSettings();
            break;
        case 'quit':
            showMainMenu();
            break;
    }
}

// Show Tutorial
function showTutorial() {
    // Check if tutorial has been shown before
    const tutorialShown = localStorage.getItem('gothalienboy_tutorial');
    
    if (!tutorialShown) {
        document.getElementById('tutorial').classList.add('active');
        game.state = 'paused';
    }
}

// Next Tutorial Slide
function nextTutorialSlide() {
    const slides = document.querySelectorAll('.tutorial-slide');
    const currentSlide = document.querySelector('.tutorial-slide.active');
    const currentIndex = Array.from(slides).indexOf(currentSlide);
    
    if (currentIndex < slides.length - 1) {
        // Go to next slide
        currentSlide.classList.remove('active');
        slides[currentIndex + 1].classList.add('active');
    } else {
        // End tutorial
        document.getElementById('tutorial').classList.remove('active');
        localStorage.setItem('gothalienboy_tutorial', 'true');
        game.state = 'playing';
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.getElementById('gameContainer').appendChild(notification);
    
    // Show for 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Show Damage Indicator
function showDamageIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'damage-overlay';
    indicator.innerHTML = '<div class="damage-flash"></div>';
    
    document.getElementById('gameContainer').appendChild(indicator);
    
    // Flash effect
    setTimeout(() => {
        indicator.style.opacity = '0.5';
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                indicator.remove();
            }, 300);
        }, 200);
    }, 10);
}

// Setup Performance Monitoring
function setupPerformanceMonitoring() {
    // Update FPS counter
    setInterval(() => {
        const fpsElement = document.querySelector('.fps');
        if (fpsElement) {
            fpsElement.textContent = `FPS: ${Math.round(game.stats.fps)}`;
        }
    }, 1000);
    
    // Check memory usage if available
    if (performance.memory) {
        setInterval(() => {
            const memElement = document.querySelector('.memory');
            if (memElement) {
                const mbUsed = Math.round(performance.memory.usedJSHeapSize / 1048576);
                memElement.textContent = `MEM: ${mbUsed}MB`;
                
                // Show warning if memory is high
                if (mbUsed > MOBILE_CONFIG.PERFORMANCE.MEMORY_LIMIT) {
                    showPerformanceWarning();
                }
            }
        }, 5000);
    }
}

// Update Performance Stats
function updatePerformanceStats() {
    // Calculate FPS
    const delta = game.clock.getDelta();
    game.stats.fps = 1 / delta;
    
    // Dynamic quality adjustment
    if (MOBILE_CONFIG.PERFORMANCE.DYNAMIC_LOD) {
        if (game.stats.fps < 30) {
            // Lower quality
            MOBILE_CONFIG.GRAPHICS.QUALITY = 'low';
            game.renderer.setPixelRatio(1);
        } else if (game.stats.fps > 50) {
            // Increase quality
            MOBILE_CONFIG.GRAPHICS.QUALITY = 'medium';
            game.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }
}

// Show Performance Warning
function showPerformanceWarning() {
    const warning = document.querySelector('.performance-warning');
    if (warning) {
        warning.style.display = 'block';
        setTimeout(() => {
            warning.style.display = 'none';
        }, 5000);
    }
}

// Hide Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// Initialize when page loads
window.addEventListener('load', () => {
    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) {
        // Show desktop warning
        showNotification('For best experience, play on a mobile device', 'warning');
    }
    
    // Start game
    initGame();
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    // Update camera aspect ratio
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Show/hide orientation warning
    const orientationWarning = document.querySelector('.orientation-warning');
    if (orientationWarning) {
        if (window.innerHeight > window.innerWidth) {
            // Portrait mode - show warning
            orientationWarning.classList.add('active');
        } else {
            // Landscape mode - hide warning
            orientationWarning.classList.remove('active');
        }
    }
});

// Battery saving mode
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', () => {
            if (battery.level < 0.2) {
                // Enable battery saving
                MOBILE_CONFIG.GRAPHICS.QUALITY = 'low';
                MOBILE_CONFIG.GRAPHICS.PARTICLES = 20;
                MOBILE_CONFIG.GRAPHICS.SHADOWS = false;
                
                // Show battery saving indicator
                document.querySelector('.battery-saving').style.display = 'block';
            }
        });
    });
}
