var playGame = function(game){};


this.bulletTime = 0;      //setando o timer para o personagem atirar, sem essa variavel o jogo não funciona
this.wallkSpeed = 1;	      //setando o fator de multiplicação da vecilade ao andar com personagem
this.runSpeed = 3;	      //setando o fator de multiplicação da vecilade ao correr com personagem
this.livingEnemies = [];  //'instanciando' os inimigos vivos em cena, essa variavel é necessaria para o funcionamento do jogo
this.enemyBulletTime = 0; //setando o timer para o inimigo atirar, sem essa variavel o jogo não funciona

playGame.prototype = {
	
	//No preload nos apenas carregamos os arquivos necessarios para o jogo
	//No preload nada é renderizado no jogo
    preload: function() {
	
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
    this.load.spritesheet('player', 'assets/sprites/robotTest.png', 32, 32); //carrega o SpriteSheet do player, definindo que cara sprite terá 32x32 px
    this.load.spritesheet('gun', 'assets/sprites/itens.png', 32, 32);       //carrega o SpriteSheet da arma, definindo que cara sprite terá 32x32 px
    this.load.image('enemies', 'assets/sprites/hero.png');	 	//carrega a imagem dos inimigos
	this.load.image('bullet', 'assets/sprites/bullet0.png');	//carrega a imagem dos tiros
	
	
	//A syntax do tilemap é: game.load.tilemap('nome_mapa', 'local_mapa', null, Phaser.Tilemap.TILED_JSON)
	
	//é necessario carregar os tiles usados no arquivo JSON do mapa
	//Eu estou o nome da imagem que vai para o jogo com o mesmo nome da imagem do tile
	//Mas é possivel usar um nome diferente ao carregar a imagem do tile
	//ex : this.load.image('nome_tile'), './assets/maps/Futuristic_A4.png');
	//porem com isso, quando for adicionar os tileset do mapa, teremos que colocar o nome do tile no arquivo Json
	//e o nome que definimos neste exemplo
	this.load.tilemap('mapa', './assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);  //carrega o tilemap/mapa da fase,
	this.load.image('Futuristic_A4', './assets/maps/Futuristic_A4.png');	//carrega a imagem que sera usada no tile do mapa
	this.load.image('Futuristic_A5', './assets/maps/Futuristic_A5.png');	//carrega a imagem que sera usada no tile do mapa

	},
	
	//o create cria/renderiza os elementos na tela, aqui definimos os sprites que serão renderizados
	//e definimos as configurações dos sprites e do proprio jogo 
	create: function() {
		
		//define que o systema/fisica do jogo será a ARCADE
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		this.level1 = game.add.tilemap('mapa');  //definindo que a variavel level1 será o nosso 'mapa' (arquivo JSON do tilemap)
		//seguindo o exemplo de como carregar o tile com nome diferente do arquivo JSON:
		//A syntax fica assim: this.level1.addTilesetImage('nome do tile no JSON', 'nome_tile')
		this.level1.addTilesetImage('Futuristic_A4'); //adiciona o tileset 'Futuristic_A4' ao level1 
		this.level1.addTilesetImage('Futuristic_A5'); //adiciona o tileset 'Futuristic_A5' ao level1 
		
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
		for (var i = 0; i < 0; i++){
			//cria um inimigo em uma posição aleatoria em X e em Y
			var c = this.enemies.create(game.world.randomX, game.world.randomY, 'enemies', game.rnd.integerInRange(0, 36));
			c.name = 'enemy' + i; //define um nome para o inimigo criado, ex: 'enemy1'
			c.body.immovable = true; //define que o inimigo ficará imovel ao ser criado
		}
		
		this.player = game.add.sprite(500, 500, 'player'); //define que player será o sprite 'player', ele é renderizado na posição 500x 500y
		this.player.name = 'player'; //define o nome do jogador
		this.player.anchor.set(0.5); //ancora o jogador no jogo

		this.game.physics.enable(this.player, Phaser.Physics.ARCADE); //define que o player terá fisica no corpo

		this.player.body.collideWorldBounds = true; //define que o jogado colidirá com as bordas do jogo
		// this.player.body.bounce.set(0.8);
		// this.player.body.immovable = true;
		this.player.scale.setTo(2, 2); //define a escala do player, ele vai dobrar de tamanho em x e em y

		//syntax: variavel_sprite.animations.add('nome_animacao', [ids_dos_sprites], nº de frames, false)
		this.player.animations.add('right', [6,7,8,7], 8, false); //setando as animações do jogador
		this.player.animations.add('left', [3,4,5,4], 8, false); //setando as animações do jogador
		this.player.animations.add('up', [9,10,11,10], 8, false); //setando as animações do jogador
		this.player.animations.add('down', [0,1,2,1], 8, false); //setando as animações do jogador

		this.game.camera.follow(this.player);  //define que a camera seguirá o jogador		
		
		this.gun = game.add.sprite(this.player.x, this.player.y, 'gun'); //define que gun será renderizada na posição em x e y do player
		this.game.physics.arcade.enable(this.gun); //definindo fisica ao corpo da gun
		this.gun.body.immovable = true;  //definindo que a gun não se moverá
		this.gun.anchor.set(0.5); //ancorando a gun
		this.gun.frame = 7;  //definindo o sprite da gun (id do sprite)
		this.gun.scale.setTo(1.22, 1.22); //mudando a escala da gun para 1.22x o tamanho em x e y

		
		this.start = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //definindo que start será a tecla Spaço
		this.pointer = game.input.activePointer; //definindo que pointer será o click do mouse
		
		
		//definindo as teclas do jogo
		this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);         //up = W
		this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);		//left = A
		this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);		//right = S
		this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);		//down = D
		this.shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); //shift = shift
		
		this.reset = game.input.keyboard.addKey(Phaser.Keyboard.R);  //reset  = R
		
		
		//esse codigo cria todas as balas que o personagem e os inimigos poderão disparar
		//elas são criadas e "renderizadas"  no jogo (ta no jogo, mas ta invisivel e sem corpo), elas sempre estarão no jogo
		//porem essas balas ficam escondidas
		//checar função fireBullet, para melhor entendimento
		
		this.bullets = game.add.group();  //cria um grupo de bullets do personagem
		this.bullets.enableBody = true;  //ativa o corpo do bullet do personagem
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE; //define a fisica do corpo
		this.bullets.createMultiple(10, 'bullet'); //cria 15 sprites 'bullet' no grupo (maximo de balas do personagem na tela)
		this.bullets.setAll('exists', false);	//define que a bullet não existirá
		this.bullets.setAll('visible', false);	//define que a bullet ficará invisivel
		this.bullets.setAll('outOfBoundsKill', true); //se a bullet sair da borda do jogo, a bala 'morrerá', deixará de ser renderizada (reseta a bala)
		this.bullets.setAll('checkWorldBounds', true);  //define que a bullet passará da borda do jogo

		//talvez eu vá usar ainda, não sei, deixa ai :D
		//faz a mesma coisa que o codigo das bullets ai de cima, porem aqui é usado um laço de repetição
		// for (var i = 0; i < 10; i++){
			// this.b = this.bullets.create(0, 0, 'bullet'); //cria a bullet na posição 0x0
			// this.b.name = 'bullet' + i; //define o nome da bullet
			// this.b.exists = false; //define que a bullet não existirá
			// this.b.visible = false;	//define que a bullet ficará invisivel
			// this.b.checkWorldBounds = true; //define que a bullet passará da borda do jogo
			// this.b.events.onOutOfBounds.add(this.resetBullet, this); //se a bullet sair da borda do jogo, a função resetBullet será disparada
		// }
		
		
		this.enemyBullets = game.add.group(); //cria um grupo de bullets dos inimigos
		this.enemyBullets.enableBody = true;  //ativa o corpo da bullet
		this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE; //define a fisica do corpo 
		this.enemyBullets.createMultiple(15, 'bullet'); //cria 15 sprites 'bullet' no grupo (maximo de balas dos inimigos na tela)
		// this.enemyBullets.setAll('anchor.x', 0.5); //ancora todas as bullets do grupo
		// this.enemyBullets.setAll('anchor.y', 1);
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
		
		//define que o player ficará parado em y e x se o jogador não fizer nada
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		// this.player.body.angularVelocity = 0;
		
		//define que a rotação da gun será igual ao angulo entre a gun e o cursor do mouse + 44.86525 (corrigindo o angulo da arma, pois o sprite ta torto :D)
		this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun) - 4.7123123; 
		
		//define que a posição da arma sempre será igual a posição do player (com alguns ajustes XD)
		this.gun.body.y = this.player.body.y + 20;
		this.gun.body.x = this.player.body.x + 20;
		
		if (this.shift.isDown){ //se a variavel shift (botão Shift) for prescionada
			this.plusSpeed = 3;  //plusSpeed será igual a runSpeed, runSpeed definida no começo do codigo
		}else {		//se não for precioda a tecla shift
			this.plusSpeed = 1; //plusSpeed será igual a wallkSpeed, wallkSpeed definida no começo do codigo
		}
		
		if (this.left.isDown){ //se a variavel left (botão A) for prescionada
			this.player.body.velocity.x = -200 * this.plusSpeed; //define que o player se deslocara em no eixo negativo em X com a velocidade -200 * plusSpeed
			this.player.animations.play('left');	//mostra a animação 'left'
		}
		if (this.right.isDown){
			this.player.body.velocity.x = 200 * this.plusSpeed; //define que o player se deslocara em no eixo positivo em X com a velocidade -200 * plusSpeed
			this.player.animations.play('right');	 //mostra a animação 'right'
		}
		if (this.up.isDown){
			this.player.body.velocity.y = -200 * this.plusSpeed; //define que o player se deslocara em no eixo negativo em Y com a velocidade -200 * plusSpeed
			this.player.animations.play('up');	 //mostra a animação 'up'
		}
		if (this.down.isDown){
			this.player.body.velocity.y = 200 * this.plusSpeed; //define que o player se deslocara em no eixo positivo em Y com a velocidade -200 * plusSpeed
			this.player.animations.play('down');	//mostra a animação 'down'
		}
		
		if (this.start.isDown || this.pointer.isDown){	//se a variavel start (botão Spaço) for precioda ou a variavel pointer (click do mouse) for	prescionada	
			this.fireBullet();	//dispara a função fireBullet
		}
		if (this.reset.isDown){  //se a variavel reset (botão R) for precionada
			this.resetLevel();	//dispara a função resetLevel
		}
		
		//como esse codigo ta solto dentro do update, em todo frame/fps desse jogo este codigo será chamado, e disparará a função fireBullet 
		this.fireEnemyBullet(); //dispara a função fireBullet
	},
	
	//função fireBullet
	//função responsavel pelos disparos do jogador
	fireBullet: function() {		
		
		if (game.time.now > bulletTime && this.player.alive){  //verifica se o tempo do jogo é maior que o tempo do dalay estipulado para o proximo disparo
			this.bullet = this.bullets.getFirstExists(false);  //define que bullet 'pegará' a primera bullet do grupo bullets, caso essa bala não exista (definida no create, que a bala não existirá, e sempre que a bala sai dos limites do jogo ela 'morre', ou seja deixa de exixtir)

			if (this.bullet){  //se a variavel bullet for verdadeira (se ela conseguir pegar uma bala inexistente do grupo)
				this.bullet.reset(this.gun.x + 10, this.gun.y -5); //define a origem da bullet nos eixos x e y de gun
				this.bullet.rotation = this.gun.rotation ;  //a rotação da bullet será igual a rotação da gun + 7
				this.game.physics.arcade.moveToPointer(this.bullet, 1200); //define que a bullet se moverá em direção do cursor na velocidade de 1200
				bulletTime = game.time.now + 150; //define o delay do proximo tiro para 150
			}
		}

	},
	
	//função render, serve para debugar o jogo
	render: function() {
	},

	//talvez eu vá usar ainda, não sei, deixa ai :D
	//usada no laço de repetição de criação das bullets
	//função resetBullet
	// resetBullet: function(bullet) {
		// bullet.kill();
	// },
	
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
				// enemyShotSound.play(); //executa o som enemyShotSound
				var random = this.rnd.integerInRange(0, livingEnemies.length - 1); //define que a variavel random será igual a um inimigo aleatorio do grupo
				var shooter = livingEnemies[random];	//o inimigo atirador será um inimigo aleatorio
				game.physics.arcade.moveToObject(shooter, this.player, 60); //define que o inimigo que ta efetuando o disparo ande em direção do player com a velocidade de 60
				enemyBullet.reset(shooter.body.x, shooter.body.y + 30);  //define a origem da bullet nos eixos x e y do enemy
				enemyBulletTime = this.time.now + 200;  //define o delay do proximo tiro para 200
				enemyBullet.rotation = shooter.rotation + 90; //define a rotação da bala igual a rotação do inimigo atirador + 90
				this.physics.arcade.moveToObject(enemyBullet,this.player,800); //define que a enemyBullet se moverá na direção do jogador com a velocidade de 800
            }
        }   
    },
	
	//função collisionEnemyBullet
	//função responsavel pela colisão da bala do inimigo com o player
    collisionEnemyBullet: function(enemyBullets, player) { // se a função for disparada a função receberá a bala que colidiu e o player e executará o codigo
        // this.emitter.on = false;
        // explosionSound.play();
        // playerShipExplosion.x = this.player.x;
        // playerShipExplosion.y = this.player.y;
        // playerShipExplosion.start(true, 100000, null, 7);
        enemyBullets.kill();  //mata a bullet do inimigo
        player.kill();		  //mata o jogador
    },

	//função collisionHandler
	//função responsavel pela colisão da bala do jogador com o inimigo
	collisionHandler: function(bullet, enemy) {  //se a função for disparada a função receberá a bala que colidiu e o inimigo colidido e executará o codigo

		bullet.kill(); //mata a bullet do jogador
		enemy.kill();  //mata o inimigo que foi atingido
	},
	
	//talvez eu vá usar ainda, não sei, deixa ai :D
	//seria uma função responsavel pela movimentação dos inimigos
	//função enemyMove
	// enemyMove: function(){
		
	// },
	
	//função resetLevel
	//responsavel por reiniciar a fase
	resetLevel: function(){ //se a função for disparada ela executara o codigo
		this.game.state.restart();  //reseta a fase
	}
}
