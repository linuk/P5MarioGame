var jumpSound, stompSound,coinSound,backgroundMusic,deadMusic,gameoverMusic;


function playBGMusic(){
	backgroundMusic.play();
	backgroundMusic.played = true;
}

// loading individual sound file
function loadingSound(soundName, url){

	// loading sound
	soundName = loadSound(url);
	// add property of played or not
	soundName['played']=false;
	return soundName;

};


function loadingAllSounds(){
	backgroundMusic = loadingSound(backgroundMusic, 'sounds/BG.mp3');
	deadMusic = loadingSound(deadMusic, 'sounds/dead.wav');
	gameoverMusic = loadingSound(deadMusic, 'sounds/gameover.wav');
	jumpSound = loadingSound(jumpSound, 'sounds/jump.wav');	
	stompSound = loadingSound(stompSound, 'sounds/stomp.wav');
	coinSound = loadingSound(coinSound, 'sounds/coin.wav')
}



// Stop the old music now playing and play new music 
function playNewMusic(newMusic, oldMusic){

	if(!newMusic.played){
      oldMusic.stop();
      oldMusic.played=false;
      newMusic.play();
      newMusic.played=true;
    };

};



function playAllMusic(character){

	// if character is alive
	if(character.live && character.liveNumber>0) playNewMusic(backgroundMusic, deadMusic);

	// if character is dead but not game over
	if(!character.live && character.liveNumber>0){
		playNewMusic(deadMusic, backgroundMusic);
		deadMusic.addCue(2.7, reviveAfterMusic, mario);
	};

	// if game is over
	if(!character.live && character.liveNumber==0) playNewMusic(gameoverMusic, backgroundMusic);

}

