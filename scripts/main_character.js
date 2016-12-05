
/*=============================================
=                 Instialize                  =
=============================================*/

/* main character variabes */
var mario;
var bg;
var s,platform2;
var bricks,clouds,mountains,enemyMushrooms,pipes,platforms,coins;
var gravityForEnemy=10;
var game_state;
var marioFont,timeScores=0;
var initialLifes=4;


/* Control variabes */
var up="UP_ARROW"; // 32=spaceBar
var left='LEFT_ARROW';
var right='RIGHT_ARROW';




//initialize
function setupInstialize(character){
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
	character["liveNumber"]=initialLifes;
	character["status"]='live';
	character["coins"]=0;

	clouds.forEach(function(element){
		element.scale=random(1,1.5);
	})
}

function drawInstialize(){
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

//Get coins
function getCoins(coin,character){
  if( character.overlap(coin) && character.live && coin.get==false){
    character.coins+=1;
    coin.get=true;
    coinSound.play();
  };
}
    
function coinVanish(coin){
  if(coin.get){
    coin.position.x=random(50,innerGameStatus.screenX)+innerGameStatus.screenX;
    coin.get=false;
  };
}

/*=====  End of Interactive Elements  ======*/


/*=============================================
=    main character setting and control       =
=============================================*/

/* Make main character standing on objs */
function positionOfCharacter(character){
  //not on the platform
  if(!character.standOnObj&&character.live){
    //see if standing on bricks
    platforms.forEach(function(element){
      standOnObjs(character,element);
    });

    bricks.forEach(function(element){
      standOnObjs(character,element);
    });

    pipes.forEach(function(element){
      standOnObjs(character,element);
    });

    if(character.standOnObj&&character.live){
    	//standing on bricks
	   	jumping(character);
    }else if(character.live){
	    //not standing on bricks
    	falling(character);
    }

  }

  //Coins event
  coins.forEach(function(element){
    getCoins(element,mario);
    coinVanish(element);
  });

  //enemyMushrooms event
  enemyMushrooms.forEach(function(element){
    StepOnEnemy(character,element);
    die(mario,element);
  })

  //make it stay in the screen
  dontGetOutOfScreen(mario);
  character.scores=character.coins+character.kills+timeScores;

}

/* Auto control character */
function autoControl(character){
    character.velocity.x+=innerGameStatus.moveSpeed;
    character.changeAnimation('move');
    character.mirrorX(1);
}

/* Manual control character */
function manualControl(character){
  if(keyDown(left)&&character.live){
    character.velocity.x-=innerGameStatus.moveSpeed;
    character.changeAnimation('move');
    character.mirrorX(-1);
  }

  if(keyDown(right)&&character.live){
    character.velocity.x+=innerGameStatus.moveSpeed;
    character.changeAnimation('move');
    character.mirrorX(1);
  }

  if(!keyDown(left)&&!keyDown(right)&&!keyDown(up)&&character.live){
    character.changeAnimation('stand');
  }
}

/* Movements of character */
function jumping(character){
	if( (keyWentDown(up)&&character.live) || (touchIsDown&&character.live) ){
		character.velocity.y+=innerGameStatus.jump;
		jumpSound.play();
	}
}




/* Movements of character */
function falling(character){
	character.velocity.y += innerGameStatus.gravity;
  character.changeAnimation('jump');
}

/* See if  obj1 stand on obj2, mainly for see if standing on the platform*/
function stand(obj1,obj2){
  var obj1_Left=leftSide(obj1);
  var obj1_Right=rightSide(obj1);
  var obj1_Up=upSide(obj1);
  var obj1_Down=downSide(obj1);

  var obj2_Left=leftSide(obj2);
  var obj2_Right=rightSide(obj2);
  var obj2_Up=upSide(obj2);
  var obj2_Down=downSide(obj2);

  if(obj1_Right>=obj2_Left&&obj1_Left<=obj2_Right && obj1_Down<=obj2_Up+7 && obj1_Down>=obj2_Up-7&&obj1.live){
    // println("YES");
    obj1.velocity.y = 0;
    obj1.position.y=obj2_Up-(obj1.height/2)-1;
    return true;
  }else{
    return false;
  }
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

	if(obj1_Right>=obj2_Left&&obj1_Left<=obj2_Right && obj1_Down<=obj2_Up+7 && obj1_Down>=obj2_Up-7&&obj2.live==true&&obj2.touching.top){
		obj2.live=false;
    obj1.killing=30;
    obj1.kills++;
    if(obj1.velocity.y>=innerGameStatus.jump*0.8){
      obj1.velocity.y=innerGameStatus.jump*0.8;
    }else{
      obj1.velocity.y+=innerGameStatus.jump*0.8;
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
}

function revive(character){
  if( (character.live==false&&mario.liveNumber!=0) && (keyWentDown(left) ||keyWentDown(right) ||keyWentDown(up) || touchIsDown) ){
    character.live=true;
    character.status="live";
    character.position.x=500;
    character.position.y=40;
    character.velocity.y=0;
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
  if(character.position.y>innerGameStatus.screenY&&character.live){
  	character.live=false;
    if(character.liveNumber){ character.liveNumber--;}
  }

  if(character.position.x>innerGameStatus.screenX-(character.width*0.5)){
  	character.position.x=innerGameStatus.screenX-(character.width*0.5);
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
=          enemy setting and control          =
=============================================*/

/* Make enemy standing on objs */


function enemys(enemys){
    enemys.forEach(function(enemy){
	    positionOfEnemy(enemy);
	    stateOfEnemy(enemy);
	    
	    enemy.position.x-=1;
  });
} 

function stateOfEnemy(enemy){
	
  if (enemy.live==false||enemy.position.y>innerGameStatus.screenY+50){
    enemy.position.x=random(innerGameStatus.screenX*1.5,2*innerGameStatus.screenX+50);
    enemy.position.y=random(innerGameStatus.screenY*0.35,innerGameStatus.screenY*0.75);
    enemy.live=true;
  }
}

function positionOfEnemy(enemy){
	enemy["standOnObj"] = false;

	platforms.forEach(function(element){ enemyStandOnObjs(enemy, element); });
	bricks.forEach(function(element){ enemyStandOnObjs(enemy, element);});
  pipes.forEach(function(element){ enemyStandOnObjs(enemy, element); })
	
	if(!enemy.standOnObj){ enemy.position.y+=gravityForEnemy; };

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
    this.standOnObj= true;
  }
}



/*=====  End of enemy setting and control ======*/


/*===================================
=            Environment            =
===================================*/

function moveEnvironment(character){
  
  var environmentScrollingSpeed=innerGameStatus.moveSpeed*0.5+character.scores*0.01; 
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
      element.position.x=innerGameStatus.screenX+50;
      
      //if group is bricks, randomize its y position
      if(group===bricks){
        element.position.y=random(innerGameStatus.screenY*0.35,innerGameStatus.screenY*0.75);
      }

      //if group is bricks or mountains, randomize its x position
      if(group===pipes||group===mountains){
        element.position.x=random(50,innerGameStatus.screenX)+innerGameStatus.screenX;
      }

      //if group is clouds, randomize its x & y position
      if(group===clouds){
        element.position.x=random(50,innerGameStatus.screenX)+innerGameStatus.screenX;
        element.position.y=random(0,innerGameStatus.screenY*0.5);
        element.scale=random(0.3,1.5);
      }

      if(group===coins){
        element.position.x=random(0,innerGameStatus.screenX)+innerGameStatus.screenX;
        element.position.y=random(innerGameStatus.screenY*0.2,innerGameStatus.screenY*0.8);
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
  
  if(character.live){ timeScores+=0.05;}
  
  text("scores: "+round(character.scores),20,40);
  text("lives: "+character.liveNumber,20,80);
  if(mario.live==false && mario.liveNumber!=0){
    fill(0,0,0,150);
    rect(0,0,innerGameStatus.screenX,innerGameStatus.screenY);

    
    strokeWeight(7);
    noFill();
    
    stroke(255);
    ellipse(innerGameStatus.screenX/2,innerGameStatus.screenY/2-30,150,150)

    stroke("red");
    var ratio=(character.liveNumber/initialLifes);
    arc(innerGameStatus.screenX/2,innerGameStatus.screenY/2-30,150,150, PI+HALF_PI,(PI+HALF_PI)+(TWO_PI*ratio));
    fill(255, 255, 255);
    noStroke();
    textAlign(CENTER);
    textSize(40);
    text(round(character.liveNumber),innerGameStatus.screenX/2,innerGameStatus.screenY/2-35);
    text("lives",innerGameStatus.screenX/2,innerGameStatus.screenY/2);

    
  }

  // if game is over 
  if(mario.live==false && mario.liveNumber==0){
    fill(0,0,0,150);
    rect(0,0,innerGameStatus.screenX,innerGameStatus.screenY);

    fill(255, 255, 255);
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", innerGameStatus.screenX/2, innerGameStatus.screenY/2+105);
    textSize(40);
    text(round(character.scores),innerGameStatus.screenX/2,innerGameStatus.screenY/2-35);
    text("points",innerGameStatus.screenX/2,innerGameStatus.screenY/2);

    stroke(255);
    strokeWeight(7);
    noFill();
    ellipse(innerGameStatus.screenX/2,innerGameStatus.screenY/2-30,160,160)
    
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


