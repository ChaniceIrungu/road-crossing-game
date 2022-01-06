//create new scene
let gameScene = new Phaser.Scene("Game");

gameScene.init = function () {
  this.playerSpeed = 2;

  //enemy speed
  this.dragonMinSpeed = 2;
  this.dragonMaxSpeed = 5;

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

gameScene.create = function () {
  //create bg sprite
  let bg = this.add.sprite(0, 0, "background");
  bg.setPosition(640 / 2, 360 / 2);

  //player
  this.player = this.add.sprite(50, this.sys.game.config.height / 2, "player");
  this.player.setScale(0.5);

  //treasure
  this.treasure = this.add.sprite(580, 180, "treasure");
  this.treasure.setScale(0.5);

  //enemy
  this.dragons = this.add.group();

  this.dragon = this.add.sprite(150, 180, "dragon");
  this.dragon.setScale(0.6);
  this.dragon.flipX = true;

  this.dragons.add(this.dragon);

  console.log(this.dragons);

  //set enemy speed
  let direction = Math.random() < 0.5 ? 1 : -1;
  let speed =
    this.dragonMinSpeed +
    Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed);

  this.dragon.speed = direction * speed;
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

  this.dragon.y += this.dragon.speed;

  //check we havent passed min or max Y
  let conditionUp = this.dragon.speed < 0 && this.dragon.y <= this.dragonMinY;
  let conditionDown = this.dragon.speed > 0 && this.dragon.y >= this.dragonMaxY;

  //if the upper or lower limit is passed reverse
  if (conditionUp || conditionDown) {
    this.dragon.speed *= -1;
  }
};

//  configuration of the game
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
};

//create new game, pass the configuration
let game = new Phaser.Game(config);
