var playGame = function(game){};


this.bulletTime = 0;
this.runSpeed = 1;
this.livingEnemies = [];
this.enemyBulletTime = 0;

playGame.prototype = {
    preload: function() {

    this.load.spritesheet('player', 'assets/sprites/charTest.png', 32, 32);
    this.load.spritesheet('gun', 'assets/sprites/itens.png', 32, 32);
    this.load.image('enemies', 'assets/sprites/hero.png');
	this.load.image('bullet', 'assets/sprites/bullet0.png');

	this.load.tilemap('mapa', './assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);  //Json do mapeamento da fase
	this.load.image('Futuristic_A4', './assets/maps/Futuristic_A4.png');
	this.load.image('Futuristic_A5', './assets/maps/Futuristic_A5.png');

	},

	create: function() {

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.level1 = game.add.tilemap('mapa');
		this.level1.addTilesetImage('Futuristic_A4');
		this.level1.addTilesetImage('Futuristic_A5');

		this.bg = this.level1.createLayer('bg'); //setando as layers do mapa
		this.floor = this.level1.createLayer('floor');
		this.wall = this.level1.createLayer('wall');

		this.bg.setScale(2);
		this.floor.setScale(2);
		this.wall.setScale(2);

		this.level1.setCollisionByExclusion([2,3,18,19], true, this.floor);
		this.level1.setCollisionByExclusion([], true, this.bg);
		this.level1.setCollisionByExclusion([], true, this.wall);

		this.bg.resizeWorld();

		this.enemies = game.add.group();
		// this.enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

		for (var i = 0; i < 2; i++)
		{
			var c = this.enemies.create(game.world.randomX, Math.random() * 500, 'enemies', game.rnd.integerInRange(0, 36));
			c.name = 'veg' + i;
			c.body.immovable = true;
		}

		this.player = game.add.sprite(500, 500, 'player');
		this.player.name = 'player';
		this.player.anchor.set(0.5);

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.set(0.8);
		this.player.body.allowRotation = true;
		this.player.body.immovable = true;
		this.player.scale.setTo(2, 2);

		this.player.animations.add('right', [6,7,8,7], 8, false); //setando as animações do jogador
		this.player.animations.add('left', [3,4,5,4], 8, false); //setando as animações do jogador
		this.player.animations.add('up', [9,10,11,10], 8, false); //setando as animações do jogador
		this.player.animations.add('down', [0,1,2,1], 8, false); //setando as animações do jogador

		this.game.camera.follow(this.player); 		
		
		this.gun = game.add.sprite(0, 0, 'gun');
		this.game.physics.arcade.enable(this.gun);
		this.gun.body.immovable = true;
		this.gun.scale.x = -1;
		this.gun.frame = 39;
		// this.gun.body.enable = false;
		this.gun.body.allowGravity = false;

		this.cursors = game.input.keyboard.createCursorKeys();
		
		this.start = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.pt = game.input.activePointer;

		this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		
		this.reset = game.input.keyboard.addKey(Phaser.Keyboard.R);
		
		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

		for (var i = 0; i < 20; i++)
		{
			this.b = this.bullets.create(0, 0, 'bullet');
			this.b.name = 'bullet' + i;
			this.b.exists = false;
			this.b.visible = false;
			this.b.checkWorldBounds = true;
			this.b.events.onOutOfBounds.add(this.resetBullet, this);
		}
		
		this.enemyBullets = game.add.group();
		this.enemyBullets.enableBody = true; 
		this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE; 
		this.enemyBullets.createMultiple(30, 'bullet');
		this.enemyBullets.setAll('anchor.x', 0.5);
		this.enemyBullets.setAll('anchor.y', 1);
		this.enemyBullets.setAll('outOfBoundsKill', true);
		this.enemyBullets.setAll('checkWorldBounds', true);

	},

	update: function() {
		
		this.game.physics.arcade.collide(this.player, this.wall);
		this.game.physics.arcade.collide(this.player, this.bg);


		this.physics.arcade.overlap(this.bullets, this.enemies, this.collisionHandler, null, this);
		this.physics.arcade.overlap(this.enemyBullets, this.player, this.collisionEnemyBullet, null, this);
		

		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		this.player.body.angularVelocity = 0;

		this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun) + 45;
		
		this.gun.body.y = this.player.body.y + 40;
		this.gun.body.x = this.player.body.x +10;
		
		if (this.left.isDown){
			this.player.body.velocity.x = -200 * this.runSpeed;
			this.player.animations.play('left');
		}
		if (this.right.isDown){
			this.player.body.velocity.x = 200 * this.runSpeed;
			this.player.animations.play('right');	
		}
		if (this.up.isDown){
			this.player.body.velocity.y = -200 * this.runSpeed;
			this.player.animations.play('up');	
		}
		if (this.down.isDown){
			this.player.body.velocity.y = 200 * this.runSpeed;
			this.player.animations.play('down');	
		}
		
		if (this.start.isDown || this.pt.isDown){			
			this.fireBullet();
		}
		if (this.reset.isDown){
			this.resetLevel();
		}
		if (this.shift.isDown){
			this.runSpeed = 2;
		}else {
			this.runSpeed = 1;
		}
		
		this.fireEnemyBullet();
	},
	
	fireBullet: function() {		

		if (game.time.now > bulletTime && this.player.alive)
		{
			this.bullet = this.bullets.getFirstExists(false);

			if (this.bullet)
			{
				this.bullet.reset(this.gun.x, this.gun.y);
				this.bullet.rotation = this.gun.rotation + 7;
				this.game.physics.arcade.moveToPointer(this.bullet, 1200);
				bulletTime = game.time.now + 150;
			}
		}

	},

	render: function() {
	},

	//  Called if the bullet goes out of the screen
	resetBullet: function(bullet) {

		bullet.kill();

	},
	
    fireEnemyBullet: function() {
        livingEnemies.length = 0; 
        this.enemies.forEachAlive(function(enemy){
            livingEnemies.push(enemy)
        });

        if(this.time.now > enemyBulletTime && this.player.alive) { 
            enemyBullet = this.enemyBullets.getFirstExists(false); 
            if(enemyBullet && livingEnemies.length > 0) {
				// enemyShotSound.play();
				var random = this.rnd.integerInRange(0, livingEnemies.length - 1);
				var shooter = livingEnemies[random];
				game.physics.arcade.moveToObject(shooter, this.player, 60);
				enemyBullet.reset(shooter.body.x, shooter.body.y + 30);
				enemyBulletTime = this.time.now + 200;
				enemyBullet.rotation = shooter.rotation + 90;
				this.physics.arcade.moveToObject(enemyBullet,this.player,800);
            }
        }   
    },
	
    collisionEnemyBullet: function(enemyBullets, player) {
        // this.emitter.on = false;
        // explosionSound.play();
        // playerShipExplosion.x = this.player.x;
        // playerShipExplosion.y = this.player.y;
        // playerShipExplosion.start(true, 100000, null, 7);
        enemyBullets.kill();
        // player.kill();
    },

	//  Called if the bullet hits one of the veg sprites
	collisionHandler: function(bullet, enemy) {

		bullet.kill();
		enemy.kill();
	},
	
	enemyMove: function(){
		
	},
	
	resetLevel: function(){
		this.game.state.restart();
	}
}
