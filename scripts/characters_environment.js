
/*=================================
=            Variables            =
=================================*/

/* main character variabes */
var mario, bricks,clouds,mountains,enemyMushrooms,pipes,platforms,coins;

/* Control variabes */
var control={
  up: "UP_ARROW", // 32=spaceBar
  left: 'LEFT_ARROW',
  right: 'RIGHT_ARROW'
}

//Inner game status, which might affect game balance or playability.
var gameConfig={
  
  // start, playing, over
  status: "start", 
  
  // initial lives of mario
  initialLifes: 4,

  // character moves speed
  moveSpeed: 5,
  enemyMoveSpeed: 1,

  // gravity and jump speed for all the characters
  gravity: 1,
  gravityEnemy: 10,
  jump:-15,

  // character starting point
  startingPoint: 500,

  // default canvas size
  screenX:1240,
  screenY:336,

  // scores
  timeScores: 0,
  scores: 0
}


/*=====  End of Variables  ======*/


/*====================================
=            Game Status             =
====================================*/

function game(){

  instializeInDraw();
  playAllMusic(mario);
  moveEnvironment(mario);
  enemys(enemyMushrooms);
  checkStatus(mario);

  drawSprites();
  scores(mario);
  
  if(gameConfig.status==='start'){
    fill(0,0,0,150);
    rect(0,0,gameConfig.screenX,gameConfig.screenY);

    fill(255, 255, 255);
    textSize(40);
    textAlign(CENTER);
    text("Press Any Key to Start ", gameConfig.screenX/2, gameConfig.screenY/2);
    textSize(40);

    stroke(255);
    strokeWeight(7);
    noFill();

    changeGameStatud();
  }
  
  if(gameConfig.status==='play'){
    positionOfCharacter(mario);
    // autoControl(mario);
    manualControl(mario);
 
  }

    // if game is over 
  if(gameConfig.status==='gameover'){
    fill(0,0,0,150);
    rect(0,0,gameConfig.screenX,gameConfig.screenY);

    fill(255, 255, 255);
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", gameConfig.screenX/2, gameConfig.screenY/2+105);
    textSize(40);
    text(round(gameConfig.scores),gameConfig.screenX/2,gameConfig.screenY/2-35);
    text("points",gameConfig.screenX/2,gameConfig.screenY/2);

    stroke(255);
    strokeWeight(7);
    noFill();
    ellipse(gameConfig.screenX/2,gameConfig.screenY/2-30,160,160)
    changeGameStatud()
  }
}  



function changeGameStatud(){
  if(keyIsPressed && gameConfig.status==="start") gameConfig.status= "play";
}




/*=====  End of Game Status   ======*/


/*=============================================
=                 Instialize                  =
=============================================*/

//initialize
function instializeInSetup(character){
	frameRate(120);
	
	character.scale=0.35;
	bricks.displace(bricks);
	platforms.displace(platforms);
  
	coins.displace(coins);
	coins.displace(platforms);
	coins.collide(pipes);
	coins.displace(bricks);
		
	//while killing 	
	character["killing"]=0;
	character["kills"]=0;
	character["live"]=true;
	character["liveNumber"]=gameConfig.initialLifes;
	character["status"]='live';
	character["coins"]=0;

	clouds.forEach(function(element){
		element.scale=random(1,1.5);
	})
}

function instializeInDraw(){
  background(109,143,252);
  
  //while killing
  if(mario.killing>0){
    mario.killing-=1;
  }else{
    mario.killing=0;
  }

  mario.velocity.x=0;
  mario.maxSpeed=20;
  pipes.displace(pipes);
  enemyMushrooms.displace(enemyMushrooms);
  enemyMushrooms.collide(pipes);
  clouds.displace(clouds);


  clouds.forEach(function(element){
    if(element.scale>=1){
    	element.velocity.x=0.12;
    }else{
    	element.velocity.x=0.02;
    }  
  })

  if(mario.live){
    bricks.displace(mario);
    pipes.displace(mario);
    enemyMushrooms.displace(mario);
    platforms.displace(mario);
  }
  mario["standOnObj"]=false;

}

/*=====       End of Instialize        ======*/



/*============================================
=            Interactive Elements            =
============================================*/

// Character get coins
function getCoins(coin,character){
  if( character.overlap(coin) && character.live && coin.get==false){
    character.coins+=1;
    coin.get=true;
    coinSound.play();
  };
}
    
// Reappear coin after goin is got.
function coinVanish(coin){
  if(coin.get){
    coin.position.x=random(50,gameConfig.screenX)+gameConfig.screenX;
    coin.get=false;
  };
}

/*=====  End of Interactive Elements  ======*/


/*=============================================
=    Main character setting and control       =
=============================================*/

/* Make main character standing on objs */
function positionOfCharacter(character){
  
  // Not on the platform
  if(character.live){
    
    // See if standing on bricks
    platforms.forEach(function(element){ standOnObjs(character,element); });
    bricks.forEach(function(element){ standOnObjs(character,element); });
    pipes.forEach(function(element){ standOnObjs(character,element); });
    
    // Character affected by gravity
    falling(character);

    // If character can only jump if standing on the object
    if(character.standOnObj) jumping(character);
      
  }

  // Coins event
  coins.forEach(function(element){
    getCoins(element,mario);
    coinVanish(element);
  });

  // EnemyMushrooms event
  enemyMushrooms.forEach(function(element){
    StepOnEnemy(character,element);
    die(mario,element);
  })

  // Make it stay in the screen
  dontGetOutOfScreen(mario);
  gameConfig.scores=character.coins+character.kills+gameConfig.timeScores;

}

/* Auto moving character  */
function autoControl(character){
    character.velocity.x+=gameConfig.moveSpeed;
    character.changeAnimation('move');
    character.mirrorX(1);
}

/* Manual control character */
function manualControl(character){
  
  if(character.live){
    if(keyDown(control.left)){
      character.velocity.x-=gameConfig.moveSpeed;
      character.changeAnimation('move');
      character.mirrorX(-1);
    }

    if(keyDown(control.right)){
      character.velocity.x+=gameConfig.moveSpeed;
      character.changeAnimation('move');
      character.mirrorX(1);
    }

    if(!keyDown(control.left)&&!keyDown(control.right)&&!keyDown(control.up)){ 
      character.changeAnimation('stand');
    }
  }
 
}

/* Movements of character */
function jumping(character){
	if( (keyWentDown(control.up)&&character.live) || (touchIsDown&&character.live) ){
		character.velocity.y+=gameConfig.jump;
		jumpSound.play();
	}
}


/* Movements of character */
function falling(character){
	character.velocity.y += gameConfig.gravity;
  character.changeAnimation('jump');
}


/* See if  obj1 stand on obj2, mainly for see if standing on the objcs*/
function standOnObjs(obj1,obj2){
  
	var obj1_Left=leftSide(obj1);
	var obj1_Right=rightSide(obj1);
	var obj1_Up=upSide(obj1);
	var obj1_Down=downSide(obj1);

	var obj2_Left=leftSide(obj2);
	var obj2_Right=rightSide(obj2);
	var obj2_Up=upSide(obj2);
	var obj2_Down=downSide(obj2);

	if(obj1_Right>=obj2_Left&&obj1_Left<=obj2_Right && obj1_Down<=obj2_Up+7 && obj1_Down>=obj2_Up-7){
		// println("YES");
		obj1.velocity.y = 0;
		obj1.position.y=obj2_Up-(obj1.height/2)-1;
		obj1.standOnObj= true;
	}
}

function StepOnEnemy(obj1,obj2){
  
	var obj1_Left=leftSide(obj1);
	var obj1_Right=rightSide(obj1);
	var obj1_Up=upSide(obj1);
	var obj1_Down=downSide(obj1);

	var obj2_Left=leftSide(obj2);
	var obj2_Right=rightSide(obj2);
	var obj2_Up=upSide(obj2);
	var obj2_Down=downSide(obj2);

	if(obj1_Right>=obj2_Left-2&&obj1_Left<=obj2_Right+2 && obj1_Down<=obj2_Up+7 && obj1_Down>=obj2_Up-7 && obj2.live==true && obj2.touching.top){
		obj2.live=false;
    obj1.killing=30;
    obj1.kills++;
    if(obj1.velocity.y>=gameConfig.jump*0.8){
      obj1.velocity.y=gameConfig.jump*0.8;
    }else{
      obj1.velocity.y+=gameConfig.jump*0.8;
    }

   stompSound.play(); 
	}
}


function die(character,enemy){

  if((enemy.touching.left||enemy.touching.right)&&character.live&&character.killing===0){
    character.live=false;
    character.liveNumber--;
    character.status="dead";
    character.changeAnimation('dead');
    character.velocity.y-=2;

  } 
}

function checkStatus(character){    
  if(character.live==false){
    character.changeAnimation('dead');
  }
  if(character.live==false && character.liveNumber==0){
    gameConfig.status="gameover"
  }
}

function reviveAfterMusic(character){
  if( (character.live==false&&mario.liveNumber!=0)){
    character.live=true;
    character.status="live";
    character.position.x=500;
    character.position.y=40;
    character.velocity.y=0;
  }
}


/* See if  obj1 stand on obj2, mainly for see if standing on the objcs*/
function dontGetOutOfScreen(character){
  
  //die if drop in the holes 
  if(character.position.y>gameConfig.screenY&&character.live){
  	character.live=false;
    if(character.liveNumber){ character.liveNumber--;}
  }

  if(character.position.x>gameConfig.screenX-(character.width*0.5)){
  	character.position.x=gameConfig.screenX-(character.width*0.5);
  }else if(character.position.x<character.width*0.5){
    if(character==mario){
      character.position.x=character.width*0.5;
    }else{ 
      character.live=false; 
    }
  }

}

/*=====  End of main character setting and control ======*/


/*=============================================
=          Enemy setting and control          =
=============================================*/

/* Make enemy standing on objs */

function enemys(enemys){
    enemys.forEach(function(enemy){
      stateOfEnemy(enemy);
	    positionOfEnemy(enemy);
	    enemy.position.x-=gameConfig.enemyMoveSpeed;
  });
} 

function stateOfEnemy(enemy){
	
  if (enemy.live==false||enemy.position.y>gameConfig.screenY+50){
    enemy.position.x=random(gameConfig.screenX*1.5,2*gameConfig.screenX+50);
    enemy.position.y=random(gameConfig.screenY*0.35,gameConfig.screenY*0.75);
    enemy.live=true;
  }
}

function positionOfEnemy(enemy){

	platforms.forEach(function(element){ enemyStandOnObjs(enemy, element); });
	bricks.forEach(function(element){ enemyStandOnObjs(enemy, element);});
  pipes.forEach(function(element){ enemyStandOnObjs(enemy, element); })
	
	enemy.position.y+=gameConfig.gravityEnemy;

	dontGetOutOfScreen(enemy);
}


/* See if  obj1 stand on obj2, mainly for see if standing on the objcs*/
function enemyStandOnObjs(obj1,obj2){
  
  var obj1_Left=leftSide(obj1);
  var obj1_Right=rightSide(obj1);
  var obj1_Up=upSide(obj1);
  var obj1_Down=downSide(obj1);

  var obj2_Left=leftSide(obj2);
  var obj2_Right=rightSide(obj2);
  var obj2_Up=upSide(obj2);
  var obj2_Down=downSide(obj2);

  if(obj1_Right>=obj2_Left&&obj1_Left<=obj2_Right && obj1_Down<=obj2_Up+7 && obj1_Down>=obj2_Up-7){
    // println("YES");
    obj1.velocity.y = 0;
    obj1.position.y=obj2_Up-(obj1.height);
  }
}



/*=====  End of enemy setting and control ======*/


/*===================================
=            Environment            =
===================================*/

function moveEnvironment(character){
  
  var environmentScrollingSpeed=gameConfig.moveSpeed*0.3; 
  environmentScrolling(platforms,environmentScrollingSpeed);
  environmentScrolling(bricks,environmentScrollingSpeed);
  environmentScrolling(clouds,environmentScrollingSpeed*0.5);
  environmentScrolling(mountains,environmentScrollingSpeed*0.3); 
  environmentScrolling(pipes,environmentScrollingSpeed); 
  environmentScrolling(enemyMushrooms,environmentScrollingSpeed); 
  environmentScrolling(coins,environmentScrollingSpeed); 


  character.position.x-=environmentScrollingSpeed;
}

function environmentScrolling(group,environmentScrollingSpeed){
  
  group.forEach(function(element){
    if(element.position.x>-50){
      element.position.x-=environmentScrollingSpeed;
    }else{
      element.position.x=gameConfig.screenX+50;
      
      //if group is bricks, randomize its y position
      if(group===bricks){
        element.position.y=random(gameConfig.screenY*0.35,gameConfig.screenY*0.75);
      }

      //if group is bricks or mountains, randomize its x position
      if(group===pipes||group===mountains){
        element.position.x=random(50,gameConfig.screenX)+gameConfig.screenX;
      }

      //if group is clouds, randomize its x & y position
      if(group===clouds){
        element.position.x=random(50,gameConfig.screenX)+gameConfig.screenX;
        element.position.y=random(0,gameConfig.screenY*0.5);
        element.scale=random(0.3,1.5);
      }

      if(group===coins){
        element.position.x=random(0,gameConfig.screenX)+gameConfig.screenX;
        element.position.y=random(gameConfig.screenY*0.2,gameConfig.screenY*0.8);
      }

    }

  })
}

/*=====  End of Environment  ======*/


/*=====================================
=            For Debugging            =
=====================================*/

/* for position state of character */
function debugging(character){
	strokeWeight(1);
	fill(255);
	textSize(12);
	text(bricks.length,20,20);
	// text("v: "+character.velocity.y,150,20);
	noFill();
	// outline(tube01);
	stroke(251);
	strokeWeight(2);

	outline(character);

	pipes.forEach(function(element){ outline(element); });
  enemyMushrooms.forEach(function(element){ outline(element); });

}

function scores(character){

  strokeWeight(0);
  fill(255, 255, 255, 71);
  textSize(40);


  if(character.live) gameConfig.timeScores+=0.05;
  
  text("scores: "+round(gameConfig.scores),20,40);
  text("lives: "+character.liveNumber,20,80);

  if(mario.live==false && mario.liveNumber!=0){
    fill(0,0,0,150);
    rect(0,0,gameConfig.screenX,gameConfig.screenY);
    
    strokeWeight(7);
    noFill();
    
    stroke(255);
    ellipse(gameConfig.screenX/2,gameConfig.screenY/2-30,150,150)

    stroke("red");
    var ratio=(character.liveNumber/gameConfig.initialLifes);
    arc(gameConfig.screenX/2,gameConfig.screenY/2-30,150,150, PI+HALF_PI,(PI+HALF_PI)+(TWO_PI*ratio));
    fill(255, 255, 255);
    noStroke();
    textAlign(CENTER);
    textSize(40);
    text(round(character.liveNumber),gameConfig.screenX/2,gameConfig.screenY/2-35);
    text("lives",gameConfig.screenX/2,gameConfig.screenY/2);

    
  }


}

/* make outline of obj*/
function outline(obj){ rect(leftSide(obj),upSide(obj),rightSide(obj)-leftSide(obj),downSide(obj)-upSide(obj));}

/* get each side position of obj*/
function leftSide(obj){ return obj.position.x-(obj.width/2);}
function rightSide(obj){ return obj.position.x+(obj.width/2);}
function upSide(obj){ return obj.position.y-(obj.height/2);}
function downSide(obj){ return obj.position.y+(obj.height/2);}

/*=====  End of For Debugging  ======*/


