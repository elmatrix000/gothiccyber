/* =====================================================
   GOTHALIENBOY — CYBER HEIST (MOBILE FIXED)
===================================================== */

const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;

const config = {
  type: Phaser.AUTO,
  parent: "game-container",

  width: GAME_WIDTH,
  height: GAME_HEIGHT,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

let player;
let bullets;
let enemies;
let drones;
let boss;

let moveLeft = false;
let moveRight = false;
let firing = false;
let episode = 1;
let bossAlive = false;
let gameWon = false;

/* ================= PRELOAD ================= */

function preload() {
  this.load.image("player", "./player.PNG");
  this.load.image("enemy", "./enemy.PNG");
  this.load.image("drone", "./drone.PNG");
  this.load.image("boss", "./boss.PNG");
  this.load.image("bullet", "./player.PNG"); // temp
}

/* ================= CREATE ================= */

function create() {
  // Background
  this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0b1f1a)
    .setOrigin(0);

  // Player
  player = this.physics.add.sprite(
    GAME_WIDTH / 2,
    GAME_HEIGHT - 80,
    "player"
  );

  player.setScale(0.6);
  player.setCollideWorldBounds(true);

  bullets = this.physics.add.group({
    classType: Phaser.Physics.Arcade.Image,
    maxSize: 20
  });

  enemies = this.physics.add.group();
  drones = this.physics.add.group();

  spawnWave(this);

  this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
  this.physics.add.overlap(bullets, drones, hitEnemy, null, this);
  this.physics.add.overlap(bullets, boss, hitBoss, null, this);

  setupTouchControls(this);
}

/* ================= UPDATE ================= */

function update() {
  if (gameWon) return;

  player.setVelocityX(0);

  if (moveLeft) player.setVelocityX(-200);
  if (moveRight) player.setVelocityX(200);

  if (firing && Phaser.Math.Between(0, 10) > 8) {
    fireBullet();
  }

  enemies.children.iterate(e => {
    if (e) e.y += 1.2;
  });

  drones.children.iterate(d => {
    if (d) d.y += 2;
  });

  if (bossAlive && boss) {
    boss.y += 0.4;
  }
}

/* ================= GAME LOGIC ================= */

function fireBullet() {
  const bullet = bullets.get(player.x, player.y - 20, "bullet");
  if (!bullet) return;

  bullet.setActive(true);
  bullet.setVisible(true);
  bullet.setScale(0.25);
  bullet.body.enable = true;
  bullet.setVelocityY(-400);
}

function spawnWave(scene) {
  for (let i = 0; i < 5; i++) {
    enemies.create(
      Phaser.Math.Between(40, GAME_WIDTH - 40),
      Phaser.Math.Between(-200, -40),
      "enemy"
    ).setScale(0.6);
  }

  if (episode >= 2) {
    drones.create(
      Phaser.Math.Between(40, GAME_WIDTH - 40),
      -300,
      "drone"
    ).setScale(0.6);
  }
}

function hitEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();

  if (
    enemies.countActive(true) === 0 &&
    drones.countActive(true) === 0 &&
    !bossAlive
  ) {
    episode++;

    if (episode === 3) {
      spawnBoss(this);
    } else {
      spawnWave(this);
    }
  }
}

function spawnBoss(scene) {
  bossAlive = true;

  boss = scene.physics.add.sprite(
    GAME_WIDTH / 2,
    -120,
    "boss"
  );

  boss.setScale(0.5);
}

function hitBoss(bullet, bossSprite) {
  bullet.destroy();

  bossSprite.health = (bossSprite.health || 10) - 1;

  if (bossSprite.health <= 0) {
    bossSprite.destroy();
    winGame(this);
  }
}

function winGame(scene) {
  gameWon = true;

  scene.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8)
    .setOrigin(0);

  scene.add.text(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2,
    "SYSTEM BREACHED\nGOTHALIENBOY IS FREE",
    {
      fontSize: "18px",
      color: "#00ffcc",
      align: "center"
    }
  ).setOrigin(0.5);
}

/* ================= TOUCH CONTROLS ================= */

function setupTouchControls(scene) {
  const leftZone = scene.add.zone(0, 0, GAME_WIDTH / 2, GAME_HEIGHT)
    .setOrigin(0)
    .setInteractive();

  const rightZone = scene.add.zone(GAME_WIDTH / 2, 0, GAME_WIDTH / 2, GAME_HEIGHT)
    .setOrigin(0)
    .setInteractive();

  leftZone.on("pointerdown", () => moveLeft = true);
  leftZone.on("pointerup", () => moveLeft = false);
  leftZone.on("pointerout", () => moveLeft = false);

  rightZone.on("pointerdown", () => moveRight = true);
  rightZone.on("pointerup", () => moveRight = false);
  rightZone.on("pointerout", () => moveRight = false);

  scene.input.on("pointerdown", () => firing = true);
  scene.input.on("pointerup", () => firing = false);
}
