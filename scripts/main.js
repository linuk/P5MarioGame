/**

  TODO:
  - MAKE variables LOCAL
  - Name functions with at least TWO words
  - Adding sprite in function  
  - making sprites randomly appears in different area
  - USING holes or a pile of platforms as a platforms pile to form a platform 
  - using fonts
 */



function preload() {

	loadingAllSounds();  
	setSprites();
	MarioAnimation();
}


function setup() {

	createCanvas(gameConfig.screenX,gameConfig.screenY);
	instializeInSetup(mario);
	playBGMusic();

}

function draw() {

	game()
}






