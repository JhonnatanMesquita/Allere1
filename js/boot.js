var boot = function (game) {};

this.game;

window.onload = function () {
	this.game = new Phaser.Game(1280, 720, Phaser.CANVAS, "");
	this.game.state.add("PlayGame", playGame);
	this.game.state.add("Boot", boot);
	this.game.state.add("GameTitle", gameTitle);
	this.game.state.add("Credits", credits);
	this.game.state.start("Boot");
}

boot.prototype = {
	preload: function () {

		this.game.load.spritesheet('loading', 'assets/sprites/loading.png', 80, 24);
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.setScreenSize = true;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
	},
	create: function () {
		this.game.state.start("GameTitle");
	}
}