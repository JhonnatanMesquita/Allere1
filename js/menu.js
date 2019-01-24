var gameTitle = function (game) {};

gameTitle.prototype = {
	preload: function () {
		this.game.stage.backgroundColor = 0x000;
		this.load.image('splash', 'assets/sprites/splash.jpg');

		this.load.audio('menuMusic', 'assets/audio/menu.mp3');
		this.load.audio('confirmSound', 'assets/audio/confirm.mp3');
	},

	create: function () {

		this.music = game.add.audio('menuMusic');

		this.confirmSound = game.add.audio('confirmSound');

		this.music.onDecoded.add(this.startMusic, this);

		this.music.onFadeComplete.add(this.loopMusic, this);

		// this.game.input.mouse.capture = true;
		this.splash = game.add.image(0, 0, 'splash');

		this.startText = game.add.text(this.game.width / 3.25, this.game.height / 2, "START GAME", {
				font: "bold 48px Arial",
				fill: "#FFF",
				align: "center"
			});
		this.startText.anchor.set(0.5);

		this.creditosText = game.add.text(this.game.width / 3.3, this.game.height / 1.5, "CREDITOS", {
				font: "bold 48px Arial",
				fill: "#FFF",
				align: "center"
			});
		this.creditosText.anchor.set(0.5);

		this.startText.inputEnabled = true;
		this.startText.events.onInputOver.add(this.textoOver, this);
		this.startText.events.onInputOut.add(this.textoOut, this);

		this.startText.events.onInputDown.add(this.startGame, this);
		this.startText.events.onInputUp.add(this.startGame, this);

		this.creditosText.inputEnabled = true;
		this.creditosText.events.onInputOver.add(this.textoOver, this);
		this.creditosText.events.onInputOut.add(this.textoOut, this);

		this.creditosText.events.onInputDown.add(this.credits, this);
		this.creditosText.events.onInputUp.add(this.credits, this);

	},

	update: function () {},

	startMusic: function () {
		this.music.fadeIn(1);
	},

	loopMusic: function () {
		this.music.loopFull(1);
	},

	textoOver: function (text) {
		text.fill = "#ff0044";
	},

	textoOut: function (text) {
		text.fill = "#fff";
	},

	credits: function () {
		this.confirmSound.play();
		this.game.state.start("Credits");
	},

	startGame: function () {
		this.confirmSound.play();
		this.music.stop();
		this.game.state.start("PlayGame");
	}
}