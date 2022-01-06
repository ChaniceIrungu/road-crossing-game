//create new scene
let gameScene = new Phaser.Scene("Game");

gameScene.init = function () {
  this.playerSpeed = 2;
  this.dragonSpeed = 3;

  // boundaries
  this.dragonMinY = 40;
  this.dragonMaxY = 280;
};

//load assets
gameScene.preload = function () {
  //load images  debugger;
  this.load.image("background", "assets/background.png");
  this.load.image("player", "assets/player.png");
  this.load.image("dragon", "assets/dragon.png");
  this.load.image("treasure", "assets/treasure.png");
};

//called once after the preload ends
gameScene.create = function () {
  //create bg sprite
  let bg = this.add.sprite(0, 0, "background");
  // bg.setOrigin(0, 0);
  bg.setPosition(640 / 2, 360 / 2);

  this.player = this.add.sprite(50, this.sys.game.config.height / 2, "player");
  // player.setPosition(640 / 4, 360 / 2);
  //set scale for changing size of sprite (can multiply h and w can be done by multiplying by 2, and half the size  * by 0.5)
  this.player.setScale(0.5);

  this.dragon = this.add.sprite(150, 180, "dragon");
  this.dragon.setScale(0.6);
  this.dragon.flipX = true;

  this.dragon2 = this.add.sprite(400, 180, "dragon");
  this.dragon2.displayWidth = 100;
  this.dragon2.flipX = true;

  this.dragon3 = this.add.sprite(500, 180, "dragon");
  this.dragon3.angle = 45;

  this.treasure = this.add.sprite(580, 180, "treasure");
  this.treasure.setScale(0.5);
};

gameScene.update = function () {
  if (this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }

  let playerRectangle = this.player.getBounds();
  let treasureRectangle = this.treasure.getBounds();

  if (
    Phaser.Geom.Intersects.RectangleToRectangle(
      playerRectangle,
      treasureRectangle
    )
  ) {
    this.scene.manager.bootScene(this);
  }

  // if (this.dragon2.scaleX < 2) {
  //   this.dragon2.scaleX += 0.01;
  //   this.dragon2.scaleY += 0.01;
  // }

  this.dragon.y += this.dragonSpeed;

  //check we havent passed min or max Y
  let conditionUp = this.dragonSpeed < 0 && this.dragon.y <= this.dragonMinY;
  let conditionDown = this.dragonSpeed > 0 && this.dragon.y >= this.dragonMaxY;

  //if the upper or lower limit is passed reverse
  if (conditionUp || conditionDown) {
    this.dragonSpeed *= -1;
  }

  this.dragon3.angle += 1;
};

// set configuration of the game
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
};

//create new game, pass the configuration
let game = new Phaser.Game(config);
