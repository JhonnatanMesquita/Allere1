var boot = function(game){};

//variaveis do jogo
this.game;

//instâncias das cenas do jogo
window.onload = function() {	
	 this.game = new Phaser.Game(window.screen.width, window.screen.height, Phaser.CANVAS, "");
     this.game.state.add("PlayGame", playGame);
	 this.game.state.add("Boot", boot);
     this.game.state.add("GameTitle", gameTitle);
	 // this.game.state.add("GameOver", GameOver);
     this.game.state.start("Boot");
}

//O boot vai carregar todos os assets e configurações necessarias para iniciar o jogo
boot.prototype = {
     preload: function(){
		this.game.load.image("button", "assets/sprites/button.png")
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;  //modo de escala que mostra o jogo inteiro enquanto mantém as proporções
		this.game.scale.setScreenSize = true;
        this.game.scale.pageAlignHorizontally = true;
		// this.game.scale.pageAlignVertically = true;
     },
  	create: function(){
		this.game.state.start("GameTitle");
	}
}