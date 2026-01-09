/* =====================================================
   GOTHALIENBOY — CYBER HEIST (LOGIC FIXED)
===================================================== */

const W = 360;
const H = 640;

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 } }
  },
  scene: { preload, create, update }
};

new Phaser.Game(config);

let player, bullets, enemies, boss;
let moveDir = 0;
let canShoot = true;
let bossHealth = 15;
let gameOver = false;

/* ================= PRELOAD ================= */

function preload() {
  this.load.image("player", "player.PNG");
  this.load.image("enemy", "enemy.PNG");
  this.load.image("boss", "boss.PNG");
}

/* ================= CREATE ================= */

function create() {
  this.add.rectangle(0, 0, W, H, 0x0b1f1a).setOrigin(0);

  player = this.physics.add.sprite(W / 2, H - 80, "player")
    .setScale(0.6)
    .setCollideWorldBounds(true);

  bullets = this.physics.add.group();
  enemies = this.physics.add.group();

  spawnEnemies(this);

  this.physics.add.overlap(bullets, enemies, destroyEnemy, null, this);
  this.physics.add.overlap(bullets, boss, hitBoss, null, this);

  createUI(this);
}

/* ================= UPDATE ================= */

function update() {
  if (gameOver) return;

  player.setVelocityX(moveDir * 200);

  enemies.children.iterate(e => {
    if (e) e.y += 0.8;
  });

  if (boss) boss.y += 0.2;
}

/* ================= GAMEPLAY ================= */

function spawnEnemies(scene) {
  for (let i = 0; i < 6; i++) {
    enemies.create(
      40 + i * 50,
      -50,
      "enemy"
    ).setScale(0.6);
  }
}

function fire(scene) {
  if (!canShoot || gameOver) return;

  const bullet = bullets.create(player.x, player.y - 20, "player");
  bullet.setScale(0.2);
  bullet.setVelocityY(-400);

  canShoot = false;
  scene.time.delayedCall(300, () => canShoot = true);
}

function destroyEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();

  if (enemies.countActive(true) === 0 && !boss) {
    spawnBoss(this);
  }
}

function spawnBoss(scene) {
  boss = scene.physics.add.sprite(W / 2, -120, "boss").setScale(0.5);
}

function hitBoss(bullet, bossSprite) {
  bullet.destroy();
  bossHealth--;

  if (bossHealth <= 0) {
    bossSprite.destroy();
    endGame(this);
  }
}

function endGame(scene) {
  gameOver = true;

  scene.add.rectangle(0, 0, W, H, 0x000000, 0.85).setOrigin(0);

  scene.add.text(
    W / 2,
    H / 2,
    "SYSTEM BREACHED\nGOTHALIENBOY IS FREE",
    {
      fontSize: "20px",
      color: "#00ffcc",
      align: "center"
    }
  ).setOrigin(0.5);
}

/* ================= UI CONTROLS ================= */

function createUI(scene) {
  const btnStyle = {
    fontSize: "24px",
    backgroundColor: "#111",
    color: "#00ffcc",
    padding: { x: 14, y: 6 }
  };

  const left = scene.add.text(20, H - 60, "◀", btnStyle).setInteractive();
  const right = scene.add.text(80, H - 60, "▶", btnStyle).setInteractive();
  const fireBtn = scene.add.text(W - 70, H - 60, "🔥", btnStyle).setInteractive();

  left.on("pointerdown", () => moveDir = -1);
  left.on("pointerup", () => moveDir = 0);
  left.on("pointerout", () => moveDir = 0);

  right.on("pointerdown", () => moveDir = 1);
  right.on("pointerup", () => moveDir = 0);
  right.on("pointerout", () => moveDir = 0);

  fireBtn.on("pointerdown", () => fire(scene));
}
