/**

  TODO:
  - MAKE variables LOCAL
  - Name functions with at least TWO words
  - Adding sprite in function  
  - making sprites randomly appears in different area
  - USING holes or a pile of platforms as a platforms pile to form a platform 
  - using fonts


 */


//character and environment setting
var GameStatus={

};

//Inner game status, which might affect game balance or playability.
var innerGameStatus={
  
  // character moves speed
  moveSpeed: 5,
  
  //gravity and jump speed for all the characters
  gravity: 1,
  jump:-15,

  // character starting point
  startingPoint: 500,

  // canvas size
  screenX:1240,
  screenY:336

}



function preload() {

	loadingAllSounds();  
	setSprites();
	MarioAnimation();

}

function setup() {

	createCanvas(innerGameStatus.screenX,innerGameStatus.screenY);
	setupInstialize(mario);
	backgroundMusic.play();
	backgroundMusic.played = true;

}

function draw() {

	drawInstialize();
	playAllMusic(mario);
  	positionOfCharacter(mario);
	moveEnvironment(mario);

	enemys(enemyMushrooms);
	// autoControl(mario);
 	manualControl(mario);
	checkStatus(mario);
	// revive(mario);

	drawSprites();
	scores(mario);

}






