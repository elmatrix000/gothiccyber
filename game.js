// GOTHALIENBOY: CYBERHEIST ESCAPE
// Main Game Engine

// Game State
const GameState = {
    MAIN_MENU: 'main_menu',
    STORY: 'story',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over',
    VICTORY: 'victory'
};

let currentState = GameState.MAIN_MENU;
let game = {
    phase: 1,
    score: 0,
    bitcoin: 0,
    dataStolen: 0,
    health: 100,
    hackEnergy: 100,
    weapons: ['Cyber Pistol', 'SMG-9X', 'Plasma Rifle', 'Railgun'],
    currentWeapon: 0,
    abilities: {
        hack: { unlocked: true, cooldown: 0 },
        cloak: { unlocked: false, cooldown: 0 },
        overload: { unlocked: false, cooldown: 0 },
        scan: { unlocked: true, cooldown: 0 }
    },
    inventory: [],
    timeElapsed: 0,
    enemiesDefeated: 0,
    securityBreached: 0,
    player: {
        x: 400,
        y: 300,
        width: 40,
        height: 60,
        speed: 5,
        isCloaked: false,
        cloakDuration: 0
    },
    enemies: [],
    bullets: [],
    particles: [],
    items: [],
    dialogues: [
        { phase: 1, text: "Kagiso streets. My home. Tonight's the last night I see these potholes.", speaker: "GOTHALIENBOY" },
        { phase: 1, text: "Nexus drones patrol every corner. Stay low, move fast.", speaker: "GOTHALIENBOY" },
        { phase: 2, text: "Nexus HQ mainframe. Time to earn my ticket out.", speaker: "GOTHALIENBOY" },
        { phase: 2, text: "Security systems online. Hack or be hacked.", speaker: "SYSTEM" },
        { phase: 3, text: "Cyberspace core. The AI knows I'm here.", speaker: "GOTHALIENBOY" },
        { phase: 3, text: "INTRUDER DETECTED. INITIATE TERMINATION PROTOCOL.", speaker: "PROMETHEUS AI" },
        { phase: 4, text: "Data secured! Time to vanish from this digital prison.", speaker: "GOTHALIENBOY" },
        { phase: 4, text: "ALERT: PURSUIT DRONES ACTIVATED. ESCAPE IMPOSSIBLE.", speaker: "NEXUS SECURITY" }
    ],
    currentDialogue: 0,
    gameTimer: null
};

// DOM Elements
const screens = {
    mainMenu: document.getElementById('mainMenu'),
    storyScreen: document.getElementById('storyScreen'),
    gameScreen: document.getElementById('gameScreen'),
    pauseMenu: document.getElementById('pauseMenu'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    victoryScreen: document.getElementById('victoryScreen')
};

const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

// Initialize canvas
gameCanvas.width = 800;
gameCanvas.height = 500;

// Input handling
const keys = {};
const mouse = { x: 0, y: 0, down: false };

// Event Listeners
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    // Global shortcuts
    if (e.key === 'Escape') {
        if (currentState === GameState.PLAYING) togglePause();
        else if (currentState === GameState.PAUSED) togglePause();
    }
    
    if (e.key === 'p' || e.key === 'P') {
        if (currentState === GameState.PLAYING || currentState === GameState.PAUSED) {
            togglePause();
        }
    }
    
    if (e.key === ' ') { // Space for shooting
        if (currentState === GameState.PLAYING) {
            shoot();
        }
    }
    
    // Number keys for weapons
    if (e.key >= '1' && e.key <= '4') {
        const weaponIndex = parseInt(e.key) - 1;
        if (weaponIndex < game.weapons.length) {
            switchWeapon(weaponIndex);
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

gameCanvas.addEventListener('mousemove', (e) => {
    const rect = gameCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

gameCanvas.addEventListener('mousedown', () => {
    mouse.down = true;
    if (currentState === GameState.PLAYING) {
        shoot();
    }
});

gameCanvas.addEventListener('mouseup', () => {
    mouse.down = false;
});

// Button Event Listeners
document.getElementById('startGameBtn').addEventListener('click', startGame);
document.getElementById('continueBtn').addEventListener('click', continueGame);
document.getElementById('settingsBtn').addEventListener('click', showSettings);
document.getElementById('creditsBtn').addEventListener('click', showStory);
document.getElementById('backFromStory').addEventListener('click', backToMenu);
document.getElementById('pauseBtn').addEventListener('click', togglePause);
document.getElementById('resumeBtn').addEventListener('click', togglePause);
document.getElementById('restartBtn').addEventListener('click', restartPhase);
document.getElementById('quitBtn').addEventListener('click', quitToMenu);
document.getElementById('retryBtn').addEventListener('click', retryGame);
document.getElementById('gameOverMenuBtn').addEventListener('click', backToMenu);
document.getElementById('victoryMenuBtn').addEventListener('click', backToMenu);
document.getElementById('newGamePlusBtn').addEventListener('click', newGamePlus);

// Ability buttons
document.getElementById('hackBtn').addEventListener('click', () => useAbility('hack'));
document.getElementById('stealthBtn').addEventListener('click', () => useAbility('cloak'));
document.getElementById('overloadBtn').addEventListener('click', () => useAbility('overload'));
document.getElementById('scanBtn').addEventListener('click', () => useAbility('scan'));

// Weapon buttons
document.getElementById('prevWeapon').addEventListener('click', () => switchWeapon(game.currentWeapon - 1));
document.getElementById('nextWeapon').addEventListener('click', () => switchWeapon(game.currentWeapon + 1));

// Close dialogue
document.getElementById('closeDialogue').addEventListener('click', () => {
    document.getElementById('dialogueBox').classList.remove('active');
});

// Screen switching
function switchScreen(toScreen) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    screens[toScreen].classList.add('active');
    currentState = GameState[toScreen.toUpperCase().replace('SCREEN', '').replace('MENU', '_MENU')];
    
    if (toScreen === 'gameScreen') {
        startGameLoop();
    } else {
        stopGameLoop();
    }
}

// Game Functions
function startGame() {
    resetGame();
    switchScreen('gameScreen');
    playSound('bgMusic', 0.3, true);
    showDialogue(0);
    
    // Start game timer
    game.gameTimer = setInterval(() => {
        game.timeElapsed++;
        updateHUD();
    }, 1000);
}

function continueGame() {
    // Load saved game
    const savedGame = localStorage.getItem('gothalienboy_save');
    if (savedGame) {
        game = JSON.parse(savedGame);
        switchScreen('gameScreen');
        playSound('bgMusic', 0.3, true);
    } else {
        alert('No saved game found! Starting new heist...');
        startGame();
    }
}

function showSettings() {
    alert('Settings: Music Volume, SFX Volume, Controls\n(To be implemented in full version)');
}

function showStory() {
    switchScreen('storyScreen');
}

function backToMenu() {
    switchScreen('mainMenu');
    stopGameLoop();
    if (game.gameTimer) clearInterval(game.gameTimer);
}

function togglePause() {
    if (currentState === GameState.PLAYING) {
        currentState = GameState.PAUSED;
        switchScreen('pauseMenu');
        
        // Update pause stats
        document.getElementById('pauseTime').textContent = formatTime(game.timeElapsed);
        document.getElementById('pauseDrones').textContent = game.enemiesDefeated;
        document.getElementById('pauseSecurity').textContent = `${game.securityBreached}%`;
    } else if (currentState === GameState.PAUSED) {
        currentState = GameState.PLAYING;
        switchScreen('gameScreen');
    }
}

function restartPhase() {
    game.health = 100;
    game.hackEnergy = 100;
    game.enemies = [];
    game.bullets = [];
    game.particles = [];
    game.items = [];
    
    currentState = GameState.PLAYING;
    switchScreen('gameScreen');
}

function quitToMenu() {
    if (confirm('Abandon heist and return to menu? Progress will be lost.')) {
        backToMenu();
    }
}

function retryGame() {
    restartPhase();
    switchScreen('gameScreen');
}

function newGamePlus() {
    game.phase = 1;
    game.score = 0;
    game.bitcoin = 0;
    game.dataStolen = 0;
    game.health = 150; // Bonus health
    game.hackEnergy = 150;
    game.enemiesDefeated = 0;
    game.securityBreached = 0;
    game.timeElapsed = 0;
    
    // Unlock all abilities for NG+
    Object.keys(game.abilities).forEach(ability => {
        game.abilities[ability].unlocked = true;
    });
    
    startGame();
}

// Game Mechanics
function shoot() {
    if (currentState !== GameState.PLAYING) return;
    
    const weapon = game.weapons[game.currentWeapon];
    const bullet = {
        x: game.player.x + game.player.width / 2,
        y: game.player.y,
        width: 5,
        height: 15,
        speed: 10,
        damage: getWeaponDamage(weapon),
        color: getWeaponColor(weapon)
    };
    
    game.bullets.push(bullet);
    playSound('shootSound', 0.2);
    
    // Update HUD
    updateHUD();
}

function getWeaponDamage(weapon) {
    const damages = {
        'Cyber Pistol': 10,
        'SMG-9X': 15,
        'Plasma Rifle': 25,
        'Railgun': 50
    };
    return damages[weapon] || 10;
}

function getWeaponColor(weapon) {
    const colors = {
        'Cyber Pistol': '#00ffea',
        'SMG-9X': '#ff9900',
        'Plasma Rifle': '#ff0066',
        'Railgun': '#7700ff'
    };
    return colors[weapon] || '#00ffea';
}

function switchWeapon(index) {
    if (index < 0) index = game.weapons.length - 1;
    if (index >= game.weapons.length) index = 0;
    
    game.currentWeapon = index;
    document.getElementById('weaponName').textContent = game.weapons[index];
    document.getElementById('ammoCount').textContent = '∞/∞'; // Infinite ammo for now
}

function useAbility(ability) {
    if (currentState !== GameState.PLAYING) return;
    if (!game.abilities[ability].unlocked) return;
    if (game.abilities[ability].cooldown > 0) return;
    
    switch(ability) {
        case 'hack':
            if (game.hackEnergy >= 20) {
                game.hackEnergy -= 20;
                hackNearestEnemy();
                game.abilities.hack.cooldown = 60; // 1 second cooldown
                playSound('hackSound', 0.3);
            }
            break;
            
        case 'cloak':
            if (game.hackEnergy >= 30 && !game.player.isCloaked) {
                game.hackEnergy -= 30;
                game.player.isCloaked = true;
                game.player.cloakDuration = 300; // 5 seconds
                game.abilities.cloak.cooldown = 180; // 3 second cooldown
            }
            break;
            
        case 'overload':
            if (game.hackEnergy >= 40) {
                game.hackEnergy -= 40;
                createExplosion(game.player.x, game.player.y, 100);
                game.abilities.overload.cooldown = 120; // 2 second cooldown
                playSound('explosionSound', 0.4);
            }
            break;
            
        case 'scan':
            if (game.hackEnergy >= 10) {
                game.hackEnergy -= 10;
                scanArea();
                game.abilities.scan.cooldown = 30; // 0.5 second cooldown
            }
            break;
    }
    
    updateHUD();
}

function hackNearestEnemy() {
    let nearest = null;
    let nearestDist = Infinity;
    
    game.enemies.forEach(enemy => {
        const dist = Math.sqrt(
            Math.pow(enemy.x - game.player.x, 2) + 
            Math.pow(enemy.y - game.player.y, 2)
        );
        
        if (dist < 150 && dist < nearestDist) {
            nearest = enemy;
            nearestDist = dist;
        }
    });
    
    if (nearest) {
        nearest.health -= 50;
        if (nearest.health <= 0) {
            destroyEnemy(nearest);
        }
        createParticles(nearest.x, nearest.y, '#00ffea', 10);
    }
}

function createExplosion(x, y, radius) {
    // Damage enemies in radius
    game.enemies.forEach(enemy => {
        const dist = Math.sqrt(
            Math.pow(enemy.x - x, 2) + 
            Math.pow(enemy.y - y, 2)
        );
        
        if (dist < radius) {
            enemy.health -= 75;
            if (enemy.health <= 0) {
                destroyEnemy(enemy);
            }
        }
    });
    
    // Create explosion particles
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            color: ['#ff0066', '#ff9900', '#ffff00'][Math.floor(Math.random() * 3)],
            life: 30
        };
        game.particles.push(particle);
    }
}

function scanArea() {
    // Create scan wave particles
    for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        const particle = {
            x: game.player.x + game.player.width / 2,
            y: game.player.y + game.player.height / 2,
            size: 3,
            speedX: Math.cos(angle) * 8,
            speedY: Math.sin(angle) * 8,
            color: '#00ffea',
            life: 40
        };
        game.particles.push(particle);
    }
}

function spawnEnemy() {
    if (game.enemies.length >= getMaxEnemies()) return;
    
    const type = Math.random() < 0.7 ? 'drone' : 'guard';
    const enemy = {
        x: Math.random() < 0.5 ? -50 : gameCanvas.width + 50,
        y: Math.random() * (gameCanvas.height - 100) + 50,
        width: type === 'drone' ? 40 : 50,
        height: type === 'drone' ? 40 : 60,
        speed: 1 + game.phase * 0.3,
        health: type === 'drone' ? 30 : 60,
        damage: type === 'drone' ? 10 : 20,
        type: type,
        color: type === 'drone' ? '#ff9900' : '#ff0066'
    };
    
    game.enemies.push(enemy);
}

function destroyEnemy(enemy) {
    game.score += enemy.type === 'drone' ? 100 : 200;
    game.bitcoin += enemy.type === 'drone' ? 10 : 25;
    game.enemiesDefeated++;
    game.securityBreached = Math.min(100, game.securityBreached + 5);
    
    // Remove enemy
    const index = game.enemies.indexOf(enemy);
    if (index > -1) {
        game.enemies.splice(index, 1);
    }
    
    // Create explosion
    createParticles(enemy.x, enemy.y, enemy.color, 15);
    
    // Chance to drop item
    if (Math.random() < 0.3) {
        spawnItem(enemy.x, enemy.y);
    }
    
    playSound('explosionSound', 0.3);
    updateHUD();
}

function spawnItem(x, y) {
    const items = ['health', 'hack', 'bitcoin', 'data'];
    const type = items[Math.floor(Math.random() * items.length)];
    
    const item = {
        x: x,
        y: y,
        width: 20,
        height: 20,
        type: type,
        color: getItemColor(type)
    };
    
    game.items.push(item);
}

function getItemColor(type) {
    const colors = {
        health: '#00ff00',
        hack: '#00ffea',
        bitcoin: '#ff9900',
        data: '#7700ff'
    };
    return colors[type] || '#ffffff';
}

function collectItem(item) {
    switch(item.type) {
        case 'health':
            game.health = Math.min(100, game.health + 20);
            break;
        case 'hack':
            game.hackEnergy = Math.min(100, game.hackEnergy + 30);
            break;
        case 'bitcoin':
            game.bitcoin += 50;
            break;
        case 'data':
            game.dataStolen = Math.min(100, game.dataStolen + 10);
            if (game.dataStolen >= 100) {
                completePhase();
            }
            break;
    }
    
    // Remove item
    const index = game.items.indexOf(item);
    if (index > -1) {
        game.items.splice(index, 1);
    }
    
    createParticles(item.x, item.y, item.color, 10);
    updateHUD();
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            color: color,
            life: 30
        };
        game.particles.push(particle);
    }
}

function getMaxEnemies() {
    return 5 + game.phase * 2;
}

function completePhase() {
    game.phase++;
    game.dataStolen = 0;
    game.securityBreached = 0;
    
    if (game.phase > 4) {
        victory();
        return;
    }
    
    // Unlock abilities based on phase
    if (game.phase === 2) {
        game.abilities.cloak.unlocked = true;
    } else if (game.phase === 3) {
        game.abilities.overload.unlocked = true;
    }
    
    // Show phase completion dialogue
    showDialogue((game.phase - 1) * 2);
    
    updateHUD();
}

function showDialogue(index) {
    if (index < game.dialogues.length) {
        const dialogue = game.dialogues[index];
        document.getElementById('dialogueSpeaker').textContent = dialogue.speaker;
        document.getElementById('dialogueText').textContent = dialogue.text;
        document.getElementById('dialogueBox').classList.add('active');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            document.getElementById('dialogueBox').classList.remove('active');
        }, 5000);
    }
}

function updateHUD() {
    // Update health and hack bars
    const healthFill = document.getElementById('healthFill');
    const hackFill = document.getElementById('hackFill');
    const healthText = document.getElementById('healthText');
    const hackText = document.getElementById('hackText');
    
    healthFill.style.width = `${game.health}%`;
    hackFill.style.width = `${game.hackEnergy}%`;
    healthText.textContent = `${Math.round(game.health)}%`;
    hackText.textContent = `${Math.round(game.hackEnergy)}%`;
    
    // Update values
    document.getElementById('bitcoinValue').textContent = game.bitcoin;
    document.getElementById('dataValue').textContent = `${game.dataStolen}%`;
    
    // Update phase
    const phases = ['KAGISO STREETS', 'NEXUS HQ INFILTRATION', 'CYBERSPACE CORE', 'DATA EXTRACTION'];
    document.getElementById('phaseValue').textContent = phases[game.phase - 1] || 'COMPLETED';
    document.getElementById('objectiveText').textContent = `Steal data: ${game.dataStolen}%`;
    
    // Update weapon display
    document.getElementById('weaponName').textContent = game.weapons[game.currentWeapon];
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateGame() {
    if (currentState !== GameState.PLAYING) return;
    
    // Player movement
    let moveX = 0;
    let moveY = 0;
    
    if (keys['arrowleft'] || keys['a']) moveX = -game.player.speed;
    if (keys['arrowright'] || keys['d']) moveX = game.player.speed;
    if (keys['arrowup'] || keys['w']) moveY = -game.player.speed;
    if (keys['arrowdown'] || keys['s']) moveY = game.player.speed;
    
    // Diagonal movement normalization
    if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.7071; // 1/√2
        moveY *= 0.7071;
    }
    
    game.player.x += moveX;
    game.player.y += moveY;
    
    // Keep player in bounds
    game.player.x = Math.max(0, Math.min(gameCanvas.width - game.player.width, game.player.x));
    game.player.y = Math.max(0, Math.min(gameCanvas.height - game.player.height, game.player.y));
    
    // Update cloak
    if (game.player.isCloaked) {
        game.player.cloakDuration--;
        if (game.player.cloakDuration <= 0) {
            game.player.isCloaked = false;
        }
    }
    
    // Update ability cooldowns
    Object.keys(game.abilities).forEach(ability => {
        if (game.abilities[ability].cooldown > 0) {
            game.abilities[ability].cooldown--;
        }
    });
    
    // Regenerate hack energy
    if (game.hackEnergy < 100) {
        game.hackEnergy += 0.1;
    }
    
    // Spawn enemies
    if (Math.random() < 0.02) {
        spawnEnemy();
    }
    
    // Update enemies
    game.enemies.forEach(enemy => {
        // Move towards player
        const dx = game.player.x - enemy.x;
        const dy = game.player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
        }
        
        // Check collision with player
        if (!game.player.isCloaked && 
            enemy.x < game.player.x + game.player.width &&
            enemy.x + enemy.width > game.player.x &&
            enemy.y < game.player.y + game.player.height &&
            enemy.y + enemy.height > game.player.y) {
            
            game.health -= enemy.damage;
            destroyEnemy(enemy);
            
            if (game.health <= 0) {
                gameOver();
            }
        }
    });
    
    // Update bullets
    game.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        
        // Check collision with enemies
        for (let i = game.enemies.length - 1; i >= 0; i--) {
            const enemy = game.enemies[i];
            
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                
                enemy.health -= bullet.damage;
                if (enemy.health <= 0) {
                    destroyEnemy(enemy);
                }
                
                // Remove bullet
                game.bullets.splice(index, 1);
                break;
            }
        }
        
        // Remove if off screen
        if (bullet.y < -bullet.height) {
            game.bullets.splice(index, 1);
        }
    });
    
    // Update particles
    game.particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life--;
        
        if (particle.life <= 0) {
            game.particles.splice(index, 1);
        }
    });
    
    // Update items
    game.items.forEach((item, index) => {
        // Check collision with player
        if (item.x < game.player.x + game.player.width &&
            item.x + item.width > game.player.x &&
            item.y < game.player.y + game.player.height &&
            item.y + item.height > game.player.y) {
            
            collectItem(item);
        }
        
        // Float animation
        item.y += Math.sin(Date.now() / 500 + index) * 0.5;
    });
}

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Draw background based on phase
    drawBackground();
    
    // Draw items
    game.items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    // Draw enemies
    game.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Draw health bar
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.health / (enemy.type === 'drone' ? 30 : 60)) * enemy.width, 5);
        
        // Type indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.fillText(enemy.type.toUpperCase(), enemy.x + 5, enemy.y + enemy.height/2);
    });
    
    // Draw bullets
    game.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Glow
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
    });
    
    // Draw particles
    game.particles.forEach(particle => {
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
    
    // Draw player
    if (!game.player.isCloaked || Math.floor(Date.now() / 200) % 2 === 0) {
        ctx.fillStyle = game.player.isCloaked ? 'rgba(0, 255, 234, 0.5)' : '#00ffea';
        ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
        
        // Draw player details
        ctx.fillStyle = '#000';
        ctx.font = '20px Orbitron';
        ctx.fillText('GAB', game.player.x + 5, game.player.y + game.player.height/2 + 7);
        
        // Cloak indicator
        if (game.player.isCloaked) {
            ctx.strokeStyle = '#00ffea';
            ctx.lineWidth = 2;
            ctx.strokeRect(game.player.x - 5, game.player.y - 5, game.player.width + 10, game.player.height + 10);
        }
    }
    
    // Draw data progress
    ctx.fillStyle = 'rgba(119, 0, 255, 0.3)';
    ctx.fillRect(20, gameCanvas.height - 30, gameCanvas.width - 40, 20);
    ctx.fillStyle = '#7700ff';
    ctx.fillRect(20, gameCanvas.height - 30, (game.dataStolen / 100) * (gameCanvas.width - 40), 20);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Orbitron';
    ctx.fillText(`DATA STOLEN: ${game.dataStolen}%`, 30, gameCanvas.height - 15);
}

function drawBackground() {
    // Phase-specific backgrounds
    switch(game.phase) {
        case 1: // Kagiso streets
            ctx.fillStyle = '#0a0a2a';
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            // Draw buildings
            ctx.fillStyle = '#1a1a4a';
            for (let i = 0; i < 5; i++) {
                const x = i * 160;
                const height = 100 + Math.sin(i) * 50;
                ctx.fillRect(x, gameCanvas.height - height, 80, height);
            }
            
            // Draw street
            ctx.fillStyle = '#333366';
            ctx.fillRect(0, gameCanvas.height - 50, gameCanvas.width, 50);
            
            // Draw street lines
            ctx.fillStyle = '#ffff00';
            for (let i = 0; i < gameCanvas.width; i += 40) {
                ctx.fillRect(i, gameCanvas.height - 25, 20, 5);
            }
            break;
            
        case 2: // Nexus HQ
            ctx.fillStyle = '#001a33';
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            // Draw tech patterns
            ctx.strokeStyle = '#00ffea';
            ctx.lineWidth = 1;
            for (let i = 0; i < gameCanvas.width; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, gameCanvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < gameCanvas.height; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(gameCanvas.width, i);
                ctx.stroke();
            }
            break;
            
        case 3: // Cyberspace
            // Animated cyberspace background
            const time = Date.now() / 1000;
            ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            ctx.strokeStyle = '#00ffea';
            for (let i = 0; i < 20; i++) {
                const x = (i * 80 + time * 50) % (gameCanvas.width + 160) - 80;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x - 80, gameCanvas.height);
                ctx.stroke();
            }
            break;
            
        case 4: // Escape route
            ctx.fillStyle = '#330033';
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            // Draw moving tunnel effect
            const offset = Date.now() / 50;
            ctx.strokeStyle = '#ff0066';
            ctx.lineWidth = 2;
            for (let i = 0; i < 10; i++) {
                const y = (i * 60 + offset) % (gameCanvas.height + 120) - 60;
                ctx.beginPath();
                ctx.arc(gameCanvas.width/2, y, 100 + i * 20, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;
    }
}

function gameOver() {
    currentState = GameState.GAME_OVER;
    switchScreen('gameOverScreen');
    
    // Update game over stats
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalData').textContent = `${game.dataStolen}%`;
    document.getElementById('finalBitcoin').textContent = `₿${game.bitcoin}`;
    
    const phases = ['Kagiso Streets', 'Nexus HQ', 'Cyberspace Core', 'Data Extraction'];
    document.getElementById('finalPhase').textContent = phases[game.phase - 1] || 'Completed';
    
    // Game over messages
    const messages = [
        "Nexus Security got you. Back to the township repair shop.",
        "The heist failed. Maybe next time, GothAlienBoy.",
        "Prometheus AI detected your intrusion. You've been wiped.",
        "Your neural link was severed. Waking up in a Nexus detention cell."
    ];
    document.getElementById('gameOverMessage').textContent = messages[Math.floor(Math.random() * messages.length)];
    
    if (game.gameTimer) clearInterval(game.gameTimer);
}

function victory() {
    currentState = GameState.VICTORY;
    switchScreen('victoryScreen');
    
    // Calculate final payout
    const payout = game.bitcoin * 1000 + game.score * 10;
    document.getElementById('victoryPayout').textContent = `₿${payout.toLocaleString()}`;
    
    if (game.gameTimer) clearInterval(game.gameTimer);
}

function resetGame() {
    game = {
        phase: 1,
        score: 0,
        bitcoin: 0,
        dataStolen: 0,
        health: 100,
        hackEnergy: 100,
        weapons: ['Cyber Pistol', 'SMG-9X', 'Plasma Rifle', 'Railgun'],
        currentWeapon: 0,
        abilities: {
            hack: { unlocked: true, cooldown: 0 },
            cloak: { unlocked: false, cooldown: 0 },
            overload: { unlocked: false, cooldown: 0 },
            scan: { unlocked: true, cooldown: 0 }
        },
        inventory: [],
        timeElapsed: 0,
        enemiesDefeated: 0,
        securityBreached: 0,
        player: {
            x: 400,
            y: 300,
            width: 40,
            height: 60,
            speed: 5,
            isCloaked: false,
            cloakDuration: 0
        },
        enemies: [],
        bullets: [],
        particles: [],
        items: [],
        currentDialogue: 0
    };
    
    updateHUD();
}

function playSound(soundId, volume = 1.0, loop = false) {
    try {
        const sound = document.getElementById(soundId);
        sound.volume = volume;
        sound.loop = loop;
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
        console.log("Sound error:", e);
    }
}

// Game Loop
let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    updateGame();
    drawGame();
    
    requestAnimationFrame(gameLoop);
}

function startGameLoop() {
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
    // Nothing needed for now
}

// Initialize the game
window.addEventListener('load', () => {
    // Set up ability button states
    updateAbilityButtons();
    updateHUD();
    
    // Start with main menu
    switchScreen('mainMenu');
    
    // Auto-save every 30 seconds
    setInterval(() => {
        if (currentState === GameState.PLAYING) {
            localStorage.setItem('gothalienboy_save', JSON.stringify(game));
        }
    }, 30000);
});

function updateAbilityButtons() {
    const abilities = ['hackBtn', 'stealthBtn', 'overloadBtn', 'scanBtn'];
    abilities.forEach((btnId, index) => {
        const ability = Object.keys(game.abilities)[index];
        const btn = document.getElementById(btnId);
        if (game.abilities[ability].unlocked) {
            btn.disabled = false;
            btn.title = ability.toUpperCase() + ' (Ready)';
        } else {
            btn.disabled = true;
            btn.title = `LOCKED - Reach Phase ${index + 1} to unlock`;
        }
    });
}
