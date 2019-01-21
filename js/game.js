var playGame = function(game){};

this.bulletTime = 0;      //setando o timer para o personagem atirar, sem essa variavel o jogo não funciona
this.empTime = 0;
this.enemyBulletTime = 0; //setando o timer para o inimigo atirar, sem essa variavel o jogo não funciona
this.livingEnemies = [];  //'instanciando' os inimigos vivos em cena, essa variavel é necessaria para o funcionamento do jogo

var dialog = [
['Não posso exterminar humanos sem poder bélico...'],
['Preciso achar um dos acampamentos militares da floresta'],
['Mas que infortuno! A passagem está bloqueada.']
];

playGame.prototype = {
	
	//No preload nos apenas carregamos os arquivos necessarios para o jogo
	//No preload nada é renderizado no jogo
    preload: function() {
		
	//configs do jogo

	this.wallkSpeed = 1;	  		//setando o fator de multiplicação da vecilade ao andar com personagem
	this.runSpeed = 2;	      		//setando o fator de multiplicação da vecilade ao correr com personagem
	this.playerSpeed = 200;  		//setando a velocidade do player

	this.playerMaxHealth = 10;		//setando o maximo de vidas do player

	this.playerMaxBullet = 15;		//maximo de bullets do player renderizadas na tela
	this.playerBulletSpeed = 1200;	//setando a velocidade da bullet do player
	this.playerBulletDelay = 350;	//setando o delay de espera para o proximo disparo do player
	this.empDelay = 3500;

	this.enemySpeed = 300;    		//setando a velocidade do inimigo
	this.enemyMaxBullet = 15;		//maximo de bullets do inimigo renderizadas na tela
	this.enemyBulletSpped = 1000;		//setando a velocidade da bullet do inimigo
	this.enemyBulletDelay = 450;	//setando o delay de espera para o proximo disparo do inimigo
	

	this.enemyQnt = 2;
	
	//SpriteSheet é um conjunto de sprites/imagens em um unico arquivo de imagem
	//No SpriteSheet é renderizado no jogo somente um pedaço da imagem por vez,
	//o tamanho desse pedaço é definido na hora de carregar o spritesheet
	//image é um unico sprite/imagem, o jogo renderiza o arquivo de imagem por completo
	
	//os ids dos SpriteSheet são contado a cada frame que compõe o sprite (definido na hora de carregar o spritesheet)
	//por exemplo o spritesheet 'gun', é definido que cada sprite terá 32 pixels de altura e 32 pixels de largura
	//o jogo (e você também) deverá contar o primeiro quadrado do canto superior esquerdo do tamanho 32x32 como id 0
	//o quadrado do lado (64x32) como id 1, o do lado desse (96x32) como id 2 e assim sucessivamente
	
	
	//A syntax do spritesheet é: game.load.spritesheet('nome_sprite', 'local_da_img', altura, largura)
	//O nome do sprite definido aqui pode ser qualquer um, desde que você se lembre dele na hora de definir o sprite no codigo
	
	//A syntax do image segue o mesmo principio, porem aqui não é definido o tamanho dos sprites, somente é definido o nome e o local da imagem
	
	
	this.load.image("closeButton", "./assets/sprites/closeButton.png");
	this.load.image("boxBack", "./assets/sprites/boxBack.png");
	
    this.load.spritesheet('player', 'assets/sprites/allare1.png', 32,32); //carrega o SpriteSheet do player, definindo que cara sprite terá 32x32 px
    this.load.image('player2', 'assets/sprites/robozin2.png'); //carrega o SpriteSheet do player, definindo que cara sprite terá 32x32 px
    this.load.image('player3', 'assets/sprites/robozin3.png'); //carrega o SpriteSheet do player, definindo que cara sprite terá 32x32 px
    this.load.image('player4', 'assets/sprites/robozin4.png'); //carrega o SpriteSheet do player, definindo que cara sprite terá 32x32 px
    this.load.spritesheet('gun', 'assets/sprites/itens.png', 32, 32);       //carrega o SpriteSheet da arma, definindo que cara sprite terá 32x32 px
    this.load.spritesheet('enemies', 'assets/sprites/charTest.png',32,32);	 	//carrega a imagem dos inimigos
	this.load.image('bullet', 'assets/sprites/bullet0.png');	//carrega a imagem dos tiros
	
	this.load.spritesheet('shock', 'assets/animations/shock.png', 200, 200);
	
	
	//A syntax do tilemap é: game.load.tilemap('nome_mapa', 'local_mapa', null, Phaser.Tilemap.TILED_JSON)
	
	//é necessario carregar os tiles usados no arquivo JSON do mapa
	//Eu estou o nome da imagem que vai para o jogo com o mesmo nome da imagem do tile
	//Mas é possivel usar um nome diferente ao carregar a imagem do tile
	//ex : this.load.image('nome_tile'), './assets/maps/Futuristic_A4.png');
	//porem com isso, quando for adicionar os tileset do mapa, teremos que colocar o nome do tile no arquivo Json
	//e o nome que definimos neste exemplo
	this.load.tilemap('mapa', './assets/maps/floresta/mapa.json', null, Phaser.Tilemap.TILED_JSON);  //carrega o tilemap/mapa da fase,
	this.load.image('2', './assets/maps/floresta/grass.png');	//carrega a imagem que sera usada no tile do mapa
	this.load.image('1', './assets/maps/floresta/trees-and-bushes.png');	//carrega a imagem que sera usada no tile do mapa
	
	
	//carrega os audios do jogo
	this.load.audio('playerShoot', 'assets/audio/Laser_Shoot.wav');
	this.load.audio('emp_explo', 'assets/audio/emp_explo.wav');

	},
	
	//o create cria/renderiza os elementos na tela, aqui definimos os sprites que serão renderizados
	//e definimos as configurações dos sprites e do proprio jogo 
	create: function() {
		
		//define que o systema/fisica do jogo será a ARCADE
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.shootSound = game.add.audio('playerShoot');
		this.emp_explo = game.add.audio('emp_explo');
		
		this.level1 = game.add.tilemap('mapa');  //definindo que a variavel level1 será o nosso 'mapa' (arquivo JSON do tilemap)
		//seguindo o exemplo de como carregar o tile com nome diferente do arquivo JSON:
		//A syntax fica assim: this.level1.addTilesetImage('nome do tile no JSON', 'nome_tile')
		this.level1.addTilesetImage('2'); //adiciona o tileset 'Futuristic_A4' ao level1 
		this.level1.addTilesetImage('1'); //adiciona o tileset 'Futuristic_A5' ao level1 
		
		//setando as layers do mapa
		//A sytax de criação de layer é:
		// variavel = variavel_mapa.createLayer('nome_layer_JSON')
		this.bg = this.level1.createLayer('bg');        //definindo que bd sera a layer bg do arquivo JSON
		this.floor = this.level1.createLayer('floor'); //definindo que floor sera a layer floor do arquivo JSON
		this.wall = this.level1.createLayer('wall');   //definindo que wall sera a layer wall do arquivo JSON
			
		//Mudando a escala das layers, as dobrando de tamanho
		this.bg.setScale(2);
		this.floor.setScale(2);
		this.wall.setScale(2);
		
		//os ids do tileset são contados da mesma maneira que os do spritesheet, mas há um porém
		//como os tamanhos não são definidos aqui no codigo, você terá que saber o tamanho definido do tileset no arquivo JSON do mapa
		//o desse jogo o tilemap/tileset foi definido como 16x16
		
		//definindo os tiles que não terão colisões
		//quando há [], quer dizer que todos os tiles da layer terá colisão
		//Syntax: variavel_mapa.setCollisionByExclusion([ids_dos_tiles], true, variavel_da_layer)
		this.level1.setCollisionByExclusion([2,3,18,19], true, this.floor);
		this.level1.setCollisionByExclusion([], true, this.bg);
		this.level1.setCollisionByExclusion([], true, this.wall);
		
		//redimenciona o background do mapa
		//é necessario para que haja o scroll do mapa, sem isso o mapa fica fixo na tela
		this.bg.resizeWorld();

		
		this.enemies = game.add.group();	//adicionando um grupo à variavel enemies
		this.enemies.enableBody = true;		//definindo que o grupo terá um corpo
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE; //definindo a fisica do corpo de todos elementos do grupo
		
		//laço de repetição para criar inimigos, no segundo 'i' é definido o nº de iminigos a serem criados
		for (var i = 0; i < this.enemyQnt; i++){
			//cria um inimigo em uma posição aleatoria em X e em Y
			var c = this.enemies.create(game.world.randomX, game.world.randomY, 'enemies', game.rnd.integerInRange(0, 36));
			c.name = 'enemy' + i; //define um nome para o inimigo criado, ex: 'enemy1'
			c.body.immovable = true; //define que o inimigo ficará imovel ao ser criado
		}
		
		this.player = game.add.sprite(500, 500, 'player'); //define que player será o sprite 'player', ele é renderizado na posição 500x 500y
		this.player.name = 'player'; //define o nome do jogador
		this.player.anchor.set(0.5); //ancora o jogador no jogo
		this.player.health = this.playerMaxHealth;
		this.player.maxHealth = this.playerMaxHealth;

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE); //define que o player terá fisica no corpo

		this.player.body.collideWorldBounds = true; //define que o jogado colidirá com as bordas do jogo
		this.player.scale.setTo(1.7); //define a escala do player, ele vai dobrar de tamanho em x e em y
		
		//syntax: variavel_sprite.animations.add('nome_animacao', [ids_dos_sprites], nº de frames, false)
		this.player.animations.add('right', [6, 7, 8, 7], 8, false); //setando as animações do jogador
		this.player.animations.add('left', [3, 4, 5, 4], 8, false); //setando as animações do jogador
		this.player.animations.add('up', [9, 10, 11, 10], 8, false); //setando as animações do jogador
		this.player.animations.add('down', [0, 1, 2, 1], 8, false); //setando as animações do jogador
		
		this.gun = game.add.sprite(this.player.x, this.player.y, 'gun'); //define que gun será renderizada na posição em x e y do player
		this.game.physics.arcade.enable(this.gun); //definindo fisica ao corpo da gun
		this.gun.body.immovable = true;  //definindo que a gun não se moverá
		this.gun.anchor.set(0.5); //ancorando a gun
		this.gun.frame = 7;  //definindo o sprite da gun (id do sprite)
		// this.gun.scale.setTo(1, 1); //mudando a escala da gun para 1.22x o tamanho em x e y

		this.shock = game.add.sprite (0, 0, 'shock');
		this.shock.anchor.set(.5);
		this.game.physics.arcade.enable(this.shock); //definindo fisica ao corpo da gun
		this.shock.body.immovable = false;
		this.shock.exists = false;
		this.shock.visible = false;
		this.shock.body.setSize(82,82,55,55);
		
		this.shock.animations.add('shockAtk', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32], 82, false);

		this.game.camera.follow(this.player);  //define que a camera seguirá o jogador		
		
		this.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //definindo que start será a tecla Spaço
		this.pointer = game.input.activePointer; //definindo que pointer será o click do mouse
		
		
		//definindo as teclas do jogo
		this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);         //up = W
		this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);		//left = A
		this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);		//right = S
		this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);		//down = D
		this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); //shift = shift
		
		this.reset = game.input.keyboard.addKey(Phaser.Keyboard.R);  //reset  = R

		this.pause = game.input.keyboard.addKey(Phaser.Keyboard.ESC); //reset  = ESC
		this.pause.onDown.add(this.gamePause, this);
		
		
		//esse codigo cria todas as balas que o personagem e os inimigos poderão disparar
		//elas são criadas e "renderizadas"  no jogo (ta no jogo, mas ta invisivel e sem corpo), elas sempre estarão no jogo
		//porem essas balas ficam escondidas
		//checar função fireBullet, para melhor entendimento		
		this.bullets = game.add.group();  //cria um grupo de bullets do personagem
		this.bullets.enableBody = true;  //ativa o corpo do bullet do personagem
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE; //define a fisica do corpo
		this.bullets.createMultiple(this.playerMaxBullet, 'bullet'); //cria 15 sprites 'bullet' no grupo (maximo de balas do personagem na tela)
		this.bullets.setAll('exists', false);	//define que a bullet não existirá
		this.bullets.setAll('visible', false);	//define que a bullet ficará invisivel
		this.bullets.setAll('anchor.x', 0.5); //ancora todas as bullets do grupo
		this.bullets.setAll('anchor.y', 0.5);
		this.bullets.setAll('outOfBoundsKill', true); //se a bullet sair da borda do jogo, a bala 'morrerá', deixará de ser renderizada (reseta a bala)
		this.bullets.setAll('checkWorldBounds', true);  //define que a bullet passará da borda do jogo		
		
		this.enemyBullets = game.add.group(); //cria um grupo de bullets dos inimigos
		this.enemyBullets.enableBody = true;  //ativa o corpo da bullet
		this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE; //define a fisica do corpo 
		this.enemyBullets.createMultiple(this.enemyMaxBullet, 'bullet'); //cria 15 sprites 'bullet' no grupo (maximo de balas dos inimigos na tela)
		this.enemyBullets.setAll('anchor.x', 0.5); //ancora todas as bullets do grupo
		this.enemyBullets.setAll('anchor.y', 0.5);
		this.enemyBullets.setAll('outOfBoundsKill', true); //se a bullet sair da borda do jogo, a bala 'morrerá', deixará de ser renderizada (reseta a bala)
		this.enemyBullets.setAll('checkWorldBounds', true); //define que a bullet passará da borda do jogo

	},
	
	//o update é o responsavel por dar vida ao jogo, ele rederiza a tela a cada frame
	//Ele que é responsavel pela a interação do jogo
	update: function() {
		
		//define que o player e os enemies terão a colisão checada pelas layers wall e bg
		//sem essa definição a colisão não é checada, oq quer dizer que os dois atravessarão tudo
		this.game.physics.arcade.collide([this.player, this.enemies], this.wall);
		this.game.physics.arcade.collide([this.player, this.enemies], this.bg);

		//checa a colisão das bullets, se a bullet do player encostar no enemies, a função collisionHandler é disparada
		//Se a bullet do enemies enconstar no player a função collisionEnemyBullet é disparada
		this.physics.arcade.overlap(this.bullets, this.enemies, this.collisionHandler, null, this);
		this.physics.arcade.overlap(this.enemyBullets, this.player, this.collisionEnemyBullet, null, this);
		this.physics.arcade.overlap(this.shock, this.enemies, this.empCollision, null, this);
		
		//define que o player ficará parado em y e x se o jogador não fizer nada
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
		//define que a rotação da gun será igual ao angulo entre a gun e o cursor do mouse + 44.86525 (corrigindo o angulo da arma, pois o sprite ta torto :D)
		this.playerRotation = this.game.physics.arcade.angleToPointer(this.player) - 4.7123123;
		this.gun.rotation = this.game.physics.arcade.angleToPointer(this.player) - 4.7123123;
		
		//define que a posição da arma sempre será igual a posição do player (com alguns ajustes XD)
		this.gun.body.y = this.player.body.y + 20;
		this.gun.body.x = this.player.body.x + 20;
		
		if (this.shift.isDown){ //se a variavel shift (botão Shift) for prescionada
			this.plusSpeed = this.runSpeed;  //plusSpeed será igual a runSpeed, runSpeed definida no começo do codigo
		}else {		//se não for precioda a tecla shift
			this.plusSpeed = this.wallkSpeed; //plusSpeed será igual a wallkSpeed, wallkSpeed definida no começo do codigo
		}
		
		if (this.left.isDown) { //se a variavel left (botão A) for prescionada
			this.player.body.velocity.x = -200 * this.plusSpeed; //define que o player se deslocara em no eixo negativo em X com a velocidade -200 * plusSpeed
		}
		if (this.right.isDown) {
			this.player.body.velocity.x = 200 * this.plusSpeed; //define que o player se deslocara em no eixo positivo em X com a velocidade -200 * plusSpeed
		}
		if (this.up.isDown) {
			this.player.body.velocity.y = -200 * this.plusSpeed; //define que o player se deslocara em no eixo negativo em Y com a velocidade -200 * plusSpeed
		}
		if (this.down.isDown) {	
			this.player.body.velocity.y = 200 * this.plusSpeed; //define que o player se deslocara em no eixo positivo em Y com a velocidade -200 * plusSpeed
		}

		if(this.left.isDown || this.right.isDown || this.up.isDown || this.down.isDown){
			this.playerMove = true;
		}else{
			this.playerMove = false;
		}
		
		if(this.playerRotation >= -5.19 && this.playerRotation <= -3.91){
			this.playerLook = 'right';
			if(this.playerMove){
				this.player.animations.play('right'); //mostra a animação 'right'
			}else{
				this.player.frame = 7;
			}
		}

		else if(this.playerRotation >= -3.9 && this.playerRotation <= -2.6){	
			this.playerLook = 'down';		
			if(this.playerMove){
				this.player.animations.play('down'); //mostra a animação 'right'
			}else{
				this.player.frame = 1;
			}
		}

		else if(this.playerRotation >= -6.8 && this.playerRotation <= -5.2){
			this.playerLook = 'up';
			if(this.playerMove){
				this.player.animations.play('up'); //mostra a animação 'up'
			}else{
				this.player.frame = 10;
			}
		}

		else{
			this.playerLook = 'left';
			if(this.playerMove){
				this.player.animations.play('left'); //mostra a animação 'left'
			}else{
				this.player.frame = 4;
			}
		}
		
		if(this.spaceBar.isDown){
			this.emp();
		}
		
		if (this.pointer.isDown){	//se a variavel start (botão Spaço) for precioda ou a variavel pointer (click do mouse) for	prescionada	
			this.fireBullet();	//dispara a função fireBullet
		}
		if (this.reset.isDown){  //se a variavel reset (botão R) for precionada
			this.resetLevel();	//dispara a função resetLevel
		}
		
		if(!this.player.alive){
			this.gun.visible = false;
			this.gun.exists = false;
		}
		
		//como esse codigo ta solto dentro do update, em todo frame/fps desse jogo este codigo será chamado, e disparará a função fireBullet 
		this.fireEnemyBullet(); //dispara a função fireBullet
	},
	
	//função fireBullet
	//função responsavel pelos disparos do jogador
	fireBullet: function () {

		if (game.time.now > bulletTime && this.player.alive) { //verifica se o tempo do jogo é maior que o tempo do dalay estipulado para o proximo disparo
			this.bullet = this.bullets.getFirstExists(false); //define que bullet 'pegará' a primera bullet do grupo bullets, caso essa bala não exista (definida no create, que a bala não existirá, e sempre que a bala sai dos limites do jogo ela 'morre', ou seja deixa de exixtir)

			if (this.bullet) { //se a variavel bullet for verdadeira (se ela conseguir pegar uma bala inexistente do grupo)
				this.shootSound.play();
				this.bullet.reset(this.gun.x + 5, this.gun.y + 5); //define a origem da bullet nos eixos x e y de gun
				this.bullet.rotation = this.game.physics.arcade.angleToPointer(this.player) - 4.7123123;
				this.game.physics.arcade.moveToPointer(this.bullet, this.playerBulletSpeed); //define que a bullet se moverá em direção do cursor na velocidade de 1200
				// if(this.playerLook == 'right'){					
					// this.bullet.rotation = this.player.rotation - 4.7;
					// this.bullet.body.velocity.x = this.playerBulletSpeed;
				// }
				// if(this.playerLook == 'down'){					
					// this.bullet.rotation = this.player.rotation - 9.4;
					// this.bullet.body.velocity.y = this.playerBulletSpeed;
				// }
				// if(this.playerLook == 'left'){					
					// this.bullet.rotation = this.player.rotation + 4.7;
					// this.bullet.body.velocity.x = -this.playerBulletSpeed;
				// }
				// if(this.playerLook == 'up'){					
					// this.bullet.rotation = -this.player.rotation;
					// this.bullet.body.velocity.y = -this.playerBulletSpeed;
				// }
				bulletTime = game.time.now + this.playerBulletDelay; //define o delay do proximo tiro para 150
			}
		}

	},
	
	//função render, serve para debugar o jogo
	render: function() {
		// game.debug.body(this.shock); //hitbox do player
	},
	
	//função fireEnemyBullet
	//função responsavel pelos disparos dos inimigos
    fireEnemyBullet: function() {
        livingEnemies.length = 0; 	//define que a variavel livingEnemies terá o 'tamanho' = 0
		
		//percorre todo o grupo de enemies que estão vivos
        this.enemies.forEachAlive(function(enemy){ //ao percorrer este grupo, cada inimigo encontrado será mandado para função interna e a executará
            livingEnemies.push(enemy)  //adiciona o inimigo encontrado à variavel livingEnemies
        });
		
		
        if(this.time.now > enemyBulletTime && this.player.alive) {  //verifica se o tempo do jogo é maior que o tempo do dalay estipulado para o proximo disparo
            enemyBullet = this.enemyBullets.getFirstExists(false);  //define que bullet 'pegará' a primera bullet do grupo enemyBullets, caso essa bala não exista (definida no create, que a bala não existirá, e sempre que a bala sai dos limites do jogo ela 'morre', ou seja deixa de exixtir)
            if(enemyBullet && livingEnemies.length > 0) {	//se a variavel bullet for verdadeira (se ela conseguir pegar uma bala inexistente do grupo) e se houver um inimigo vivo ( se a variavel livingEnemies.length for maior que 0 )
				this.shootSound.play(); //executa o som enemyShotSound
				var random = this.rnd.integerInRange(0, livingEnemies.length - 1); //define que a variavel random será igual a um inimigo aleatorio do grupo
				var shooter = livingEnemies[random];	//o inimigo atirador será um inimigo aleatorio
				game.physics.arcade.moveToObject(shooter, this.player, this.enemySpeed); //define que o inimigo que ta efetuando o disparo ande em direção do player com a velocidade de 60
				enemyBullet.reset(shooter.body.x, shooter.body.y + 30);  //define a origem da bullet nos eixos x e y do enemy
				enemyBulletTime = this.time.now + this.enemyBulletDelay;  //define o delay do proximo tiro para 200
				enemyBullet.rotation = shooter.rotation + 90; //define a rotação da bala igual a rotação do inimigo atirador + 90
				this.physics.arcade.moveToObject(enemyBullet, this.player, this.enemyBulletSpped); //define que a enemyBullet se moverá na direção do jogador com a velocidade de 800
            }
        }   
    },
	
	emp: function(){
		if(this.time.now > empTime && this.player.alive) {
			this.shock.x = this.player.x;
			this.shock.y = this.player.y;
			this.shock.visible = true;
			this.shock.exists = true;			
			this.shock.body.enable = true;
			this.emp_explo.play();
			this.shock.scale.set(2);
			anim = this.shock.animations.play('shockAtk');
			anim.onComplete.add(this.animationStopped, this);
			empTime = this.time.now + this.empDelay;
		}
	},
	
	animationStopped: function(){
		this.shock.visible = false;
		this.shock.exists = false;
		this.shock.body.enable = false;
	},
	
	//função collisionEnemyBullet
	//função responsavel pela colisão da bala do inimigo com o player
    collisionEnemyBullet: function(player, bullet) { // se a função for disparada a função receberá a bala que colidiu e o player e executará o codigo
        bullet.kill(); //mata a bullet do inimigo
		this.player.damage(1);
    },

	//função collisionHandler
	//função responsavel pela colisão da bala do jogador com o inimigo
	collisionHandler: function(bullet, enemy) {  //se a função for disparada a função receberá a bala que colidiu e o inimigo colidido e executará o codigo

		bullet.kill(); //mata a bullet do jogador
		enemy.kill();  //mata o inimigo que foi atingido
		
		this.showMessageBox(dialog[1], window.screen.width, this.game.height * .15);
	},
	
	empCollision: function(shock, enemy) {  //se a função for disparada a função receberá a bala que colidiu e o inimigo colidido e executará o codigo

		enemy.kill();  //mata o inimigo que foi atingido
		
		this.showMessageBox(dialog[1], window.screen.width, this.game.height * .15);
	},

	gamePause: function () {
		if (this.game.paused) {
			this.game.paused = false;
		} else {
			this.game.paused = true;
		}
	},
	
	showMessageBox(text, w = 300, h = 300) {
        if (this.msgBox) {
            this.msgBox.destroy();
        }
		this.game.paused = true;
        var msgBox = game.add.group();
        var back = game.add.sprite(0, 0, "boxBack");
        var closeButton = game.add.sprite(0, 0, "closeButton");
        var text1 = game.add.text(0, 0, text);
        text1.wordWrap = true;
        text1.wordWrapWidth = w * .9;
        
        back.width = w;
        back.height = h;
        
        msgBox.add(back);
        msgBox.add(closeButton);
        msgBox.add(text1);
		
		msgBox.fixedToCamera = true;
		
        closeButton.x = back.width / 2 - closeButton.width / 2;
        closeButton.y = back.height - closeButton.height;
         
        closeButton.inputEnabled = true;
         
        closeButton.events.onInputDown.add(this.hideBox, this);
		
		okbutton = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		okbutton.onDown.add(this.hideBox, this);
		
		okbutton2 = game.input.keyboard.addKey(Phaser.Keyboard.E);  
		okbutton2.onDown.add(this.hideBox, this);
		
		okbutton3 = game.input.keyboard.addKey(Phaser.Keyboard.ESC);  
		okbutton3.onDown.add(this.hideBox, this);
		 
        text1.x = back.width / 2 - text1.width / 2;
        text1.y = back.height / 12 - text1.height / 12;
         
        this.msgBox = msgBox;
    },
    hideBox() {
    	//destroy the box when the button is pressed
		this.game.paused = false;
        this.msgBox.destroy();
    },
	
	//função resetLevel
	//responsavel por reiniciar a fase
	resetLevel: function(){ //se a função for disparada ela executara o codigo
		this.game.state.restart();  //reseta a fase
	}
}
