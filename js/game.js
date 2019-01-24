var playGame = function (game) {};

this.bulletTime = 0;
this.empTime = 0;
this.enemyBulletTime = 0;
this.livingEnemies = [];

var fontSize = Math.trunc(0.03548148148148148 * window.screen.width);

playGame.prototype = {

	preload: function () {

		this.loadingSprite = game.add.sprite(this.game.width / 2.5, this.game.height / 2, 'loading');
		this.loadingSprite.animations.add('loadingplay', [0, 1, 2], 1, true);
		this.loadingSprite.animations.play('loadingplay');
		this.loadingSprite.scale.setTo(2.5);

		//configs do jogo

		this.points = 0;

		this.wallkSpeed = 2;
		this.runSpeed = 4;
		this.playerSpeed = 300;

		this.playerMaxHealth = 10;

		this.playerMaxBullet = 100;
		this.playerBulletSpeed = 2750;
		this.playerBulletDelay = 75;

		this.enemySpeed = 425;
		this.enemyMaxBullet = 500;
		this.enemyBulletSpped = 2250;
		this.enemyBulletDelay = 40;

		this.enemyQnt = 45;

		this.load.spritesheet('player', 'assets/sprites/allare1.png', 32, 32);
		this.load.spritesheet('gun', 'assets/sprites/itens.png', 32, 32);
		this.load.spritesheet('enemies', 'assets/sprites/enemy.png', 32, 32);
		this.load.image('bullet', 'assets/sprites/bullet.png');
		this.load.image('bulletEnemy', 'assets/sprites/bulletEnemy.png');
		this.load.image('lives', 'assets/sprites/icon.png');

		this.load.tilemap('mapa', './assets/maps/mapa.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tiles', './assets/tiles/tiles.png');

		this.load.audio('playerShoot', 'assets/audio/Laser_Shoot.wav');
		this.load.audio('gameMusic', 'assets/audio/game.mp3');
		this.load.audio('hit', 'assets/audio/hit.mp3');

	},

	create: function () {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.savedData = localStorage.getItem("allare1") == null ? {
			score: 0
		}
		 : JSON.parse(localStorage.getItem("allare1"));

		this.shootSound = game.add.audio('playerShoot');

		this.hit = game.add.audio('hit');
		this.hit.volume = 0.4;

		this.music = game.add.audio('gameMusic');

		this.music.onDecoded.add(this.startMusic, this);

		this.music.onFadeComplete.add(this.loopMusic, this);

		this.shootSound.volume = 0.13;

		this.level1 = game.add.tilemap('mapa');
		this.level1.addTilesetImage('tiles');

		this.floor = this.level1.createLayer('floor');
		this.floor2 = this.level1.createLayer('floor2');
		this.bg = this.level1.createLayer('bg');
		this.wall = this.level1.createLayer('wall');
		this.wall2 = this.level1.createLayer('wall2');
		this.wall3 = this.level1.createLayer('wall3');

		this.bg.setScale(1.6);
		this.floor.setScale(1.6);
		this.floor2.setScale(1.6);
		this.wall.setScale(1.6);
		this.wall2.setScale(1.6);
		this.wall3.setScale(1.6);

		this.level1.setCollisionByExclusion([], true, this.bg);
		this.level1.setCollisionByExclusion([], true, this.wall);
		this.level1.setCollisionByExclusion([], true, this.wall2);
		this.level1.setCollisionByExclusion([], true, this.wall3);

		this.bg.resizeWorld();

		this.scoreAnimation = game.add.text(game.width / 1.75, game.height / 12, this.points, {
				font: "bold " + fontSize * 1.5 + "px Arial",
				fill: "#ffffff"
			});
		this.scoreAnimation.anchor.setTo(0.5, 0);
		this.scoreAnimation.fixedToCamera = true;

		this.scoreText = game.add.text(this.scoreAnimation.x - 175, this.scoreAnimation.y, "Pontos: ", {
				font: "bold " + fontSize * 1.5 + "px Arial",
				fill: "#ffffff"
			});
		this.scoreText.anchor.setTo(0.5, 0);
		this.scoreText.fixedToCamera = true;

		this.gameScore = game.add.text(game.width / 2, game.height / 1.9, "Seu Score foi de: " + this.points, {
				font: "bold " + fontSize * 1.5 + "px Arial",
				fill: "#ffffff"
			});
		this.gameScore.anchor.setTo(0.5, 0);
		this.gameScore.fixedToCamera = true;

		this.gameRecord = game.add.text(game.width / 2, game.height / 5, "Seu Record é de: ", {
				font: "bold " + fontSize * 1.5 + "px Arial",
				fill: "#ffffff"
			});
		this.gameRecord.anchor.setTo(0.5, 0);
		this.gameRecord.fixedToCamera = true;

		this.resetText = game.add.text(game.width / 2, game.height - 150, "Pressione 'R' para reiniciar", {
				font: "bold " + fontSize * 0.8 + "px Arial",
				fill: "#ffffff"
			});
		this.resetText.anchor.setTo(0.5, 0);
		this.resetText.fixedToCamera = true;

		this.exitText = game.add.text(game.width / 2, game.height - 100, "Pressione 'ESC' para voltar ao menu", {
				font: "bold " + fontSize * 0.8 + "px Arial",
				fill: "#ffffff"
			});
		this.exitText.anchor.setTo(0.5, 0);
		this.exitText.fixedToCamera = true;

		this.enemies = game.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

		for (var i = 0; i < this.enemyQnt; i++) {
			var c = this.enemies.create(game.world.randomX, game.world.randomY + 1500, 'enemies', game.rnd.integerInRange(0, 36));
			c.name = 'enemy' + i;
			c.body.immovable = true;
			c.scale.setTo(2);
			c.animations.add('right', [6, 7, 8, 7], 8, false);
			c.animations.add('left', [3, 4, 5, 4], 8, false);
			c.animations.add('up', [9, 10, 11, 10], 8, false);
			c.animations.add('down', [0, 1, 2, 1], 8, false);
			c.body.setSize(15, 22, 9, 3.5);
		}

		this.player = game.add.sprite(100, 100, 'player');
		this.player.name = 'player';
		this.player.anchor.set(0.5);
		this.player.health = this.playerMaxHealth;
		this.player.maxHealth = this.playerMaxHealth;

		this.lives = game.add.image(50, game.height - 50, 'lives');
		this.lives.anchor.setTo(0.5, 0);
		this.lives.scale.setTo(1.5)
		this.lives.fixedToCamera = true;

		this.livesText = game.add.text(this.lives.x + 40, this.lives.y, 'x' + this.player.health, {
				font: "bold 32px Arial",
				fill: "#ffffff"
			});
		this.livesText.anchor.setTo(0.5, 0);
		this.livesText.fixedToCamera = true;

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.setSize(15, 22, 9, 3.5);

		this.player.body.collideWorldBounds = true;
		this.player.scale.setTo(1.7);

		this.player.animations.add('right', [6, 7, 8, 7], 8, false);
		this.player.animations.add('left', [3, 4, 5, 4], 8, false);
		this.player.animations.add('up', [9, 10, 11, 10], 8, false);
		this.player.animations.add('down', [0, 1, 2, 1], 8, false);

		this.gun = game.add.sprite(this.player.x, this.player.y, 'gun');
		this.game.physics.arcade.enable(this.gun);
		this.gun.body.immovable = true;
		this.gun.anchor.set(0.5);
		this.gun.frame = 7;

		this.game.camera.follow(this.player);

		this.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.pointer = game.input.activePointer;

		this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);

		this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

		this.pause = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.pause.onDown.add(this.gamePause, this);

		this.exitButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

		this.reset = game.input.keyboard.addKey(Phaser.Keyboard.R);

		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(this.playerMaxBullet, 'bullet');
		this.bullets.setAll('exists', false);
		this.bullets.setAll('visible', false);
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('checkWorldBounds', true);

		this.enemyBullets = game.add.group();
		this.enemyBullets.enableBody = true;
		this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyBullets.createMultiple(this.enemyMaxBullet, 'bulletEnemy');
		this.enemyBullets.setAll('anchor.x', 0.5);
		this.enemyBullets.setAll('anchor.y', 0.5);
		this.enemyBullets.setAll('outOfBoundsKill', true);
		this.enemyBullets.setAll('checkWorldBounds', true);

	},

	update: function () {

		this.game.physics.arcade.collide([this.player, this.enemies], this.wall);
		this.game.physics.arcade.collide([this.player, this.enemies], this.wall2);
		this.game.physics.arcade.collide([this.player, this.enemies], this.wall3);
		this.game.physics.arcade.collide([this.player, this.enemies], this.bg);

		this.physics.arcade.overlap(this.bullets, this.enemies, this.collisionHandler, null, this);
		this.physics.arcade.overlap(this.enemyBullets, this.player, this.collisionEnemyBullet, null, this);

		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;

		this.playerRotation = this.game.physics.arcade.angleToPointer(this.player) - 4.7123123;
		this.gun.rotation = this.game.physics.arcade.angleToPointer(this.player) - 4.7123123;

		this.gun.body.y = this.player.body.y + 15;
		this.gun.body.x = this.player.body.x + 5;

		if (this.shift.isDown) {
			this.plusSpeed = this.runSpeed;
		} else {
			this.plusSpeed = this.wallkSpeed;
		}

		if (this.left.isDown) {
			this.player.body.velocity.x = -200 * this.plusSpeed;
		}
		if (this.right.isDown) {
			this.player.body.velocity.x = 200 * this.plusSpeed;
		}
		if (this.up.isDown) {
			this.player.body.velocity.y = -200 * this.plusSpeed;
		}
		if (this.down.isDown) {
			this.player.body.velocity.y = 200 * this.plusSpeed;
		}

		if (this.left.isDown || this.right.isDown || this.up.isDown || this.down.isDown) {
			this.playerMove = true;
		} else {
			this.playerMove = false;
		}

		if (this.playerRotation >= -5.19 && this.playerRotation <= -3.91) {
			this.playerLook = 'right';
			if (this.playerMove) {
				this.player.animations.play('right');
			} else {
				this.player.frame = 7;
			}
		} else if (this.playerRotation >= -3.9 && this.playerRotation <= -2.6) {
			this.playerLook = 'down';
			if (this.playerMove) {
				this.player.animations.play('down');
			} else {
				this.player.frame = 1;
			}
		} else if (this.playerRotation >= -6.8 && this.playerRotation <= -5.2) {
			this.playerLook = 'up';
			if (this.playerMove) {
				this.player.animations.play('up');
			} else {
				this.player.frame = 10;
			}
		} else {
			this.playerLook = 'left';
			if (this.playerMove) {
				this.player.animations.play('left');
			} else {
				this.player.frame = 4;
			}
		}

		if (this.enemyLook == 'left') {
			this.enemies.forEach(function (enemy) {
				enemy.animations.play('left');
			});
		}
		if (this.enemyLook == 'right') {
			this.enemies.forEach(function (enemy) {
				enemy.animations.play('right');
			});
		}
		if (this.enemyLook == 'up') {
			this.enemies.forEach(function (enemy) {
				enemy.animations.play('up');
			});
		}

		if (this.enemyLook == 'down') {
			this.enemies.forEach(function (enemy) {
				enemy.animations.play('down');
			});
		}

		if (this.pointer.isDown) {
			this.fireBullet();
		}

		if (!this.player.alive) {
			this.gun.visible = false;
			this.gun.exists = false;
		} else {
			this.gameScore.visible = false;
			this.gameRecord.visible = false;
			this.resetText.visible = false;
			this.exitText.visible = false;
		}

		if (!this.player.alive) {
			this.gameOver();
		}

		this.fireEnemyBullet();
	},

	gameOver: function () {

		localStorage.setItem("allare1", JSON.stringify({
				score: Math.max(this.savedData.score, this.points)
			}));

		this.scoreAnimation.visible = false;
		this.scoreText.visible = false;

		this.savedData = localStorage.getItem("allare1") == null ? {
			score: 0
		}
		 : JSON.parse(localStorage.getItem("allare1"));

		this.gameScore.setText("Seu Score foi de: " + this.points);
		this.gameRecord.setText("Seu Record é de: " + this.savedData.score.toString());

		this.gameScore.visible = true;
		this.gameRecord.visible = true;
		this.resetText.visible = true;
		this.exitText.visible = true;

		if (this.reset.isDown) {
			this.scoreAnimation.visible = true;
			this.scoreText.visible = true;

			this.points = 0;
			this.scoreAnimation.setText(this.points);

			this.player.reset(100, 100, 10);
			this.gun.visible = true;
			this.gun.exists = true;
			this.livesText.setText("X" + this.player.health);

			this.gameScore.visible = false;
			this.gameRecord.visible = false;
			this.resetText.visible = false;
			this.exitText.visible = false;
		}

		if (this.exitButton.isDown) {
			this.music.stop();
			this.game.state.start("GameTitle");
		}
	},

	fireBullet: function () {

		if (game.time.now > bulletTime && this.player.alive) {
			this.bullet = this.bullets.getFirstExists(false);

			if (this.bullet) {
				this.shootSound.play();
				this.bullet.reset(this.gun.x + 5, this.gun.y + 5);
				this.bullet.rotation = this.game.physics.arcade.angleToPointer(this.player) - 4.7123123;
				this.game.physics.arcade.moveToPointer(this.bullet, this.playerBulletSpeed);
				bulletTime = game.time.now + this.playerBulletDelay;
			}
		}

	},

	render: function () {},

	fireEnemyBullet: function () {
		livingEnemies.length = 0;

		this.enemies.forEachAlive(function (enemy) {
			livingEnemies.push(enemy);
		});

		if (this.time.now > enemyBulletTime && this.player.alive) {
			enemyBullet = this.enemyBullets.getFirstExists(false);
			if (enemyBullet && livingEnemies.length > 0) {
				this.shootSound.play();
				var random = this.rnd.integerInRange(0, livingEnemies.length - 1);
				var shooter = livingEnemies[random];
				game.physics.arcade.moveToObject(shooter, this.player, this.enemySpeed);
				enemyRotation = this.game.physics.arcade.angleToXY(shooter, this.player.x, this.player.y);
				if (enemyRotation >= -0.9 && enemyRotation <= 1) {
					this.enemyLook = 'right';
				} else if (enemyRotation >= 0 && enemyRotation <= 2) {
					this.enemyLook = 'down';
				} else if (enemyRotation >= -2 && enemyRotation <= -1) {
					this.enemyLook = 'up';
				} else {
					this.enemyLook = 'left';
				}

				enemyBullet.reset(shooter.body.x, shooter.body.y + 30);
				enemyBulletTime = this.time.now + this.enemyBulletDelay;
				enemyBullet.rotation = enemyRotation + 7.7126;
				this.physics.arcade.moveToObject(enemyBullet, this.player, this.enemyBulletSpped);
			}
		}
	},

	collisionEnemyBullet: function (player, bullet) {
		bullet.kill();
		this.hit.play();
		this.player.damage(1);
		this.livesText.setText('x' + this.player.health);
	},

	collisionHandler: function (bullet, enemy) {

		bullet.kill();
		enemy.kill();
		if (this.player.alive) {
			this.scoreAnimation.setText(this.points++);
		};
		this.newEnemy = this.enemies.create(game.world.randomX, game.world.randomY + 750, 'enemies', game.rnd.integerInRange(0, 36));
		this.newEnemy.scale.setTo(2);
		this.newEnemy.animations.add('right', [6, 7, 8, 7], 8, false);
		this.newEnemy.animations.add('left', [3, 4, 5, 4], 8, false);
		this.newEnemy.animations.add('up', [9, 10, 11, 10], 8, false);
		this.newEnemy.animations.add('down', [0, 1, 2, 1], 8, false);
		this.newEnemy.body.setSize(15, 22, 9, 3.5);
	},

	gamePause: function () {
		if (this.game.paused) {
			this.game.paused = false;
		} else {
			this.game.paused = true;
		}
	},

	startMusic: function () {
		this.music.fadeIn(1);
	},

	loopMusic: function () {
		this.music.loopFull(1);
	},

	resetLevel: function () {
		this.game.state.restart();
	}
}
