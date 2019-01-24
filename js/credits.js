var credits = function (game) {};

credits.prototype = {
	preload: function () {
		this.game.stage.backgroundColor = 0x000;
		this.load.image('splash', 'assets/sprites/splash.jpg');
		this.load.image('back', 'assets/sprites/boxBack.png');

		this.load.audio('confirmSound', 'assets/audio/confirm.mp3');
	},

	create: function () {

		this.confirmSound = game.add.audio('confirmSound');

		this.game.input.mouse.capture = true;
		this.back = game.add.image(0, 0, 'back');
		this.splash = game.add.image(0, 0, 'splash');
		this.splash.alpha = 0.15;

		this.JhonText = game.add.text(this.game.width / 2, this.game.height / 3, "Jhonnatan M. | @JhonnatanMesquita (Github)", {
				font: "bold 48px Arial",
				fill: "#000",
				align: "center"
			});
		this.JhonText.anchor.set(0.5);

		this.MathText = game.add.text(this.game.width / 2, this.game.height / 2, "Matheus C. | @Jovem_mundano (Instagram)", {
				font: "bold 48px Arial",
				fill: "#000",
				align: "center"
			});
		this.MathText.anchor.set(0.5);

		this.IgorText = game.add.text(this.game.width / 2, this.game.height / 1.5, "Igor S. | @Strochit (Facebook)", {
				font: "bold 48px Arial",
				fill: "#000",
				align: "center"
			});
		this.IgorText.anchor.set(0.5);

		this.IgorText = game.add.text(this.game.width / 2, this.game.height - 50, "Pressione 'ESC' para voltar ao menu", {
				font: "bold 24px Arial",
				fill: "#000",
				align: "center"
			});
		this.IgorText.anchor.set(0.5);

		this.exitButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC); //reset  = ESC
		this.exitButton.onDown.add(this.backGame, this);
	},

	update: function () {},

	backGame: function () {
		this.confirmSound.play();
		this.game.state.start("GameTitle");
	}
}