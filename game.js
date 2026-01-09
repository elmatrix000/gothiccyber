/* =====================================================
   GOTHALIENBOY — CYBER HEIST (FIXED VERSION)
===================================================== */

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,
  height: window.innerHeight,

  scale: {
    mode: Phaser.Scale.RESIZE,
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

/* ================= PRELOAD ================= */

function preload() {
  // ROOT-LEVEL FILES — MATCHING .PNG CASE
  this.load.image("player", "./player.PNG");
  this.load.image("enemy", "./enemy.PNG");
  this.load.image("drone", "./drone.PNG");
  this.load.image("boss", "./boss.PNG");
  this.load.image("bullet", "./player.PNG"); // temp reuse
}

/* ================= CREATE ================= */

function create() {
  const width = this.scale.width;
  const height = this.scale.height;

  // FAKE BACKGROUND (UNTIL bg.png EXISTS)
  this.add.rectangle(0, 0, width * 2, height * 2, 0x0b1f1a)
    .setOrigin(0);

  // PLAYER
  player = this.physics.add.sprite(
    width / 2,
    height - 120,
    "player"
  );

  player.setScale(1);
  player.setDepth(10);
  player.setCollideWorldBounds(true);

  bullets = this.physics.add.group();
  enemies = this.physics.add.group();
  drones = this.physics.add.group();

  spawnWave(this);

  this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
  this.physics.add.overlap(bullets, drones, hitEnemy, null, this);

  setupTouchControls(this);
}

/* ================= UPDATE ================= */

function update() {
  player.setVelocityX(0);

  if (moveLeft) player.setVelocityX(-350);
  if (moveRight) player.setVelocityX(350);

  if (firing && Phaser.Math.Between(0, 10) > 7) {
    fireBullet();
  }

  enemies.children.iterate(e => {
    if (e) e.y += 1.5;
  });

  drones.children.iterate(d => {
    if (d) d.y += 2.5;
  });
}

/* ================= GAME LOGIC ================= */

function fireBullet() {
  const bullet = bullets.create(player.x, player.y - 30, "bullet");
  bullet.setVelocityY(-700);
  bullet.setScale(0.25);
}

function spawnWave(scene) {
  for (let i = 0; i < 4 + episode; i++) {
    enemies.create(
      Phaser.Math.Between(60, scene.scale.width - 60),
      Phaser.Math.Between(-300, -60),
      "enemy"
    );
  }

  if (episode >= 2) {
    drones.create(
      Phaser.Math.Between(60, scene.scale.width - 60),
      Phaser.Math.Between(-600, -200),
      "drone"
    );
  }
}

function hitEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();

  if (enemies.countActive() === 0 && drones.countActive() === 0) {
    episode++;

    if (episode === 3) {
      spawnBoss(this);
    } else {
      spawnWave(this);
    }
  }
}

function spawnBoss(scene) {
  boss = scene.physics.add.sprite(
    scene.scale.width / 2,
    -200,
    "boss"
  );

  boss.setVelocityY(60);

  scene.physics.add.overlap(bullets, boss, () => {
    boss.destroy();
    alert("SYSTEM BREACHED.\nGOTHALIENBOY IS FREE.");
  });
}

/* ================= TOUCH CONTROLS ================= */

function setupTouchControls(scene) {
  const leftZone = scene.add.zone(0, 0, scene.scale.width / 2, scene.scale.height)
    .setOrigin(0)
    .setInteractive();

  const rightZone = scene.add.zone(scene.scale.width / 2, 0, scene.scale.width / 2, scene.scale.height)
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
