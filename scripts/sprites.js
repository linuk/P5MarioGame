

var mountainImages = [ 'imgs/scene/mountains01.png', 'imgs/scene/mountains02.png', 'imgs/scene/mountains03.png', 'imgs/scene/mountains04.png'];
var cloudImages = [ 'imgs/scene/cloud01.png', 'imgs/scene/cloud02.png'];
var brickImages = [ 'imgs/blocks/blocks001.png', 'imgs/blocks/blocks002.png', 'imgs/blocks/blocks003.png'];
var coinsImags = [ 'imgs/blocks/coin01.png', 'imgs/blocks/coin05.png' ];
var pipeImages = [ 'imgs/scene/tube.png' ];
var platformImages = [ 'imgs/scene/platform.png' ];
var enemyMushroomImage = [ 'imgs/enemy/enemyMushroom01.png','imgs/enemy/enemyMushroom02.png'];




  
function setSprites(){
 
  setSpriteGroups();
  loadStaticObjects( mountains, mountainImages, 6 ,1.5, innerGameStatus.screenX, innerGameStatus.screenY-35, innerGameStatus.screenY-35);
  loadStaticObjects( clouds, cloudImages, 10, 0, innerGameStatus.screenX, 20, innerGameStatus.screenY*0.5 );
  loadStaticObjects( bricks, brickImages, 15, 0, innerGameStatus.screenX, innerGameStatus.screenY*0.1, innerGameStatus.screenY*0.7 );
  loadStaticObjects( pipes, pipeImages, 5, 50, innerGameStatus.screenX, innerGameStatus.screenY-20, innerGameStatus.screenY+10 );
  loadAnimatedObjects( coins, coinsImags, 'shine', 25, "get", false, 0, innerGameStatus.screenX, innerGameStatus.screenY*0.35, innerGameStatus.screenY*0.75 );
  loadAnimatedObjects( enemyMushrooms, enemyMushroomImage, 'move', 5, 'live', true, 200, 1000, innerGameStatus.screenY*0.35, innerGameStatus.screenY*0.75 );
  loadPlatforms();
}


function setSpriteGroups(){
  //groups 
  bricks = new Group();
  enemyMushrooms = new Group();
  clouds = new Group();
  mountains = new Group();
  pipes = new Group();
  platforms = new Group();
  coins = new Group();
};


function loadStaticObjects( group, imageArray, spriteNumber, randomPosStartX, randomPosEndX, randomPosStartY, randomPosEndY) {
  for(var i = 0; i < spriteNumber; i++) {
    
    // load random image in image array
    var randomNumber=floor((random()*10)%imageArray.length);
    var img = loadImage(imageArray[randomNumber]);

    group[i] = createSprite(random(randomPosStartX, randomPosEndX), random(randomPosStartY, randomPosEndY));
    group[i].addImage(img);
    // group[i].scale=scales;
  }
};


function loadAnimatedObjects( group, imageArray, animationName, spriteNumber, spriteStatusName, spriteStatusValue,  randomPosStartX, randomPosEndX, randomPosStartY, randomPosEndY) {
  for(var i = 0; i < spriteNumber; i++) {
    
    group[i] = createSprite(random(randomPosStartX, randomPosEndX), random(randomPosStartY, randomPosEndY));
    group[i].addAnimation(animationName, imageArray[0], imageArray[1]);
    group[i].scale = 1.5;
    group[i][spriteStatusName] = spriteStatusValue;

  };
};


// load platforms
function loadPlatforms() {
  img=loadImage('imgs/scene/platform.png');
  for(i=0;i<70;i++){
    randomNumber=random();
    if(randomNumber>0.2){
      platforms[i]=createSprite(innerGameStatus.screenX-i*19,innerGameStatus.screenY-10);
    }else{
      platforms[i]=createSprite(random(0,innerGameStatus.screenX),innerGameStatus.screenY-10);
    }
    platforms[i].addImage(img);
  };
};



// load mario
function MarioAnimation(){
  mario=createSprite(innerGameStatus.startingPoint, 0, innerGameStatus.startingPoint, 0.30);
  mario.addAnimation("stand",'imgs/mario/mario06.png');
  mario.addAnimation("move",'imgs/mario/mario01.png','imgs/mario/mario03.png');
  mario.addAnimation("crouch",'imgs/mario/mario18.png');
  mario.addAnimation("jump",'imgs/mario/mario05.png');
  mario.addAnimation("dead",'imgs/mario/mario24.png');
};





