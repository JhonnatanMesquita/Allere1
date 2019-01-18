var gameTitle = function(game){};



gameTitle.prototype = {
	preload: function(){
		this.game.stage.backgroundColor = 0x000;
	},
	
	create: function(){
		
		this.game.input.mouse.capture = true;
		
		this.tittle = game.add.text(this.game.width / 2, this.game.height / 12, "GAME TESTE", {font: "bold 52px Arial", fill: "#FFF"});
		this.tittle.anchor.set(0.5);
	
	
		this.classicText = game.add.text(this.game.width / 2, this.game.height - 50, "Click or Press \n SPACEBAR to continue", { font: "bold 32px Arial", fill: "#FFF", align: "center"});
		this.classicText.anchor.set(0.5);
		

		this.start = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.click = game.input.pointer1.isDown;
				
	},
	
	update: function(){
		
		if(this.start.isDown || game.input.pointer1.isDown || this.click){
			this.game.state.start("PlayGame");
		}
		
	}
}