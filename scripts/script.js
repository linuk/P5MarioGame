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

//Inner game status 
var InnerGameStatus={

}

var standing=false;
var jump=-15;
var gravity=1;
var moveSpeed=5;
var startingPoint=500;
var screenX=1240;
var screenY=224*1.5;


var mountainImages = ['imgs/scene/mountains01.png', 'imgs/scene/mountains02.png', 'imgs/scene/mountains03.png', 'imgs/scene/mountains04.png'];

function loadEnvironment(img_url, group, spriteNumber,  starX, endX, startY, endY) {
  for(var i = 0; i < spriteNumber; i++) {
    var randomNumber=floor((random()*10)%img_url.length);
    var img = loadImage(img_url[randomNumber]);
    group[i] = createSprite(random(starX, endX), random(startY, endY));
    group[i].addImage(img);
    // group[i].scale=scales;
  }
}

function preload() {

  //loading font
  // marioFont=loadFont("fonts/Georgia.ttf");
  // textFont(marioFont);
  loadingAllSounds();  

  //groups 
  objects = new Group();
  mushrooms = new Group();
  clouds = new Group();
  mountains = new Group();
  pipes = new Group();
  platforms = new Group();
  coins = new Group();

  //mountains
  loadEnvironment(mountainImages, mountains, 5,  1.5, screenX, screenY-35, screenY-35);

  // clouds
  for (var i=0;i<=10;i++){
    if(random()>0.5){
      img=loadImage('imgs/scene/cloud01.png');
    }else{
      img=loadImage('imgs/scene/cloud02.png');
    }
    clouds[i]=createSprite(random(0,screenX),random(20,screenY*0.5));
    clouds[i].addImage(img);
  }

  //bricks
  img=loadImage('imgs/blocks/blocks01-2.png');
  for (var i=0;i<=10;i++){
    objects[i]=createSprite(random(0,screenX),random(screenY*0.1,screenY*0.7));
    objects[i].addImage(img);
  }

  //coins
  for (i=0;i<=25;i++){
    coins[i]=createSprite(random(0,screenX),random(screenY*0.35,screenY*0.75));
    coins[i].addAnimation("move",'imgs/blocks/coin01.png','imgs/blocks/coin05.png');
    coins[i].scale=1.5;
    coins[i]["get"]=false;
  }

  //mushrooms
  for (i=0;i<=5;i++){
    mushrooms[i]=createSprite(random(200,1000),random(screenY*0.35,screenY*0.75));
    mushrooms[i].addAnimation("move",'imgs/enemy/enemy01.png','imgs/enemy/enemy02.png');
    mushrooms[i].scale=1.3;
    mushrooms[i]["live"] = true;
  }

  //pipes
  for ( i=0;i<=5 ;i++){
    img=loadImage('imgs/scene/tube.png');
    pipes[i]=createSprite(random(50,screenX),random(screenY-20,screenY+10));
    pipes[i].addImage(img);
  }

  //platforms
  img=loadImage('imgs/scene/platform.png');
  for(i=0;i<70;i++){
    randomNumber=random();
    if(randomNumber>0.2){
      platforms[i]=createSprite(screenX-i*19,screenY-10);
    }else{
      platforms[i]=createSprite(random(0,screenX),screenY-10);
    }
    platforms[i].addImage(img);
  }

 

  //Mario
  MarioAnimation();

  stroke(255);
  strokeWeight(2);
  noFill();

}

function setup() {
  createCanvas(screenX,screenY);
  setupInstialize(mario);
  frameRate(120);
  
  //play background music
  backgroundMusic.play();
  backgroundMusic.played = true;
}

function draw() {
  //background setting
	drawInstialize();
	playAllMusic(mario);
  positionOfCharacter(mario);
	moveEnvironment(mario);

	enemys(mushrooms);
	// autoControl(mario);
 	manualControl(mario);
	checkStatus(mario);
	// revive(mario);

	drawSprites();
	scores(mario);

}






