//create new scene
let gameScene = new Phaser.Scene("Game");

gameScene.init = function () {
  this.playerSpeed = 4.5;

  //enemy speed
  this.dragonMinSpeed = 2;
  this.dragonMaxSpeed = 5;

  // boundaries
  this.dragonMinY = 40;
  this.dragonMaxY = 298;

  //we are definitely not terminating
  this.isTerminating = false;
};

//load assets
gameScene.preload = function () {
  //load images  debugger;
  this.load.image("background", "assets/background.png");
  this.load.image("player", "assets/player.png");
  this.load.image("dragon", "assets/dragon.png");
  this.load.image("treasure", "assets/treasure.png");
};

(gameScene.create = function () {
  //create bg sprite
  let bg = this.add.sprite(0, 0, "background");
  bg.setPosition(640 / 2, 360 / 2);

  //player
  this.player = this.add.sprite(50, this.sys.game.config.height / 2, "player");
  this.player.setScale(0.5);

  //treasure
  this.treasure = this.add.sprite(580, 180, "treasure");
  this.treasure.setScale(0.5);

  //enemy Group
  this.dragons = this.add.group({
    key: "dragon",
    repeat: 3,
    setXY: {
      x: 120,
      y: 100,
      stepX: 120,
      stepY: 40,
    },
  });

  //setting scale to all group elements
  Phaser.Actions.ScaleXY(this.dragons.getChildren(), -0.4, -0.4);

  //set flipX and speed
  Phaser.Actions.Call(
    this.dragons.getChildren(),
    function (dragon) {
      dragon.flipX = true;
      let direction = Math.random() < 0.5 ? 1 : -1;
      let speed =
        this.dragonMinSpeed +
        Math.random() * (this.dragonMaxSpeed - this.dragonMinSpeed);

      dragon.speed = direction * speed;
    },
    this
  );

  //set enemy speed
}),
  (gameScene.update = function () {
    //don't execute if we are terminating
    if (this.isTerminating) {
      return;
    }
    if (this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }

    // treasure overlap check
    let playerRectangle = this.player.getBounds();
    let treasureRect = this.treasure.getBounds();

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(playerRectangle, treasureRect)
    ) {
      console.log("reached goal!");

      // restart the Scene
      return this.gameOver();
    }

    //get the enemies
    let dragons = this.dragons.getChildren();
    let numOfDragons = dragons.length;

    for (let i = 0; i < numOfDragons; i++) {
      //enemy movement
      dragons[i].y += dragons[i].speed;

      //check we havent passed min or max Y
      let conditionUp = dragons[i].speed < 0 && dragons[i].y <= this.dragonMinY;
      let conditionDown =
        dragons[i].speed > 0 && dragons[i].y >= this.dragonMaxY;

      //if the upper or lower limit is passed reverse
      if (conditionUp || conditionDown) {
        dragons[i].speed *= -1;
      }

      //check enemy overlap and

      let dragonRectangle = dragons[i].getBounds();

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          playerRectangle,
          dragonRectangle
        )
      ) {
        console.log("Game Over");
        return this.gameOver();
      }
    }
  });

gameScene.gameOver = function () {
  //initiated game over sequence
  this.isTerminating = true;
  //shake camera
  this.cameras.main.shake(500);

  //listen for camera event completion
  this.cameras.main.on(
    "camerashakecomplete",
    function (camera, effect) {
      //fade out
      this.cameras.main.fade(500);
    },
    this
  );
  this.cameras.main.on(
    "camerafadeoutcomplete",
    function (camera, effect) {
      this.scene.restart();
    },
    this
  );
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
