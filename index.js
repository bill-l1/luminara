var tabPositions = [ [ 0, 0, 2, 4, 0, 0 ],
 								 		 [ 0, 0, 0, 4, 0, 0 ],
                     [ 2, 2, 0, 2, 2, 4 ],
                     [ 0, 6, 6, 4, 6, 6 ],
                     [ 0, 0, 0, 4, 0, 0 ],
										 [ 0, 0, 0, 6, 0, 0 ] ]

var frequencies =	[[39, 41, 43, 45, 46, 48],
									[50, 51, 53, 55, 57, 58],
									[60, 62, 63, 65, 67, 69],
									[70, 72, 74, 75, 77, 79],
									[81, 82, 84, 86, 87, 89],
									[91, 93, 94, 96, 98, 99]]

//Bb major scale starting on Eb
//Bb and Eb

var players = [];
var particles = [];

var tabImg;
var sineImg;
var triImg;

function preload() {
	tabImg = loadImage('tab.png');
	sineImg = loadImage('circle.png');
	triImg = loadImage('triangle.png');
}

var wave;
var env;

var tabOffsetX;
var tabOffsetY;

var rectSize = 125;

var paused = true;

function createTabs(){
	tabOffsetX = window.innerWidth/2-(rectSize*3);
	tabOffsetY = window.innerHeight/2-(rectSize*3);
	for(var i = 0; i < 6; i++){
		for(var j = 0; j < 6; j++){
			push();
				translate(i*rectSize+tabOffsetX+rectSize/2, j*rectSize+tabOffsetY+rectSize/2);
				rotate(tabPositions[j][i]*(PI/4))
				translate(-rectSize/2, -rectSize/2);
				image(tabImg, 0, 0);
			pop();
			
		}
	}

}

function rotateTab(X, Y){
	tabPositions[Y][X]++;
	if(tabPositions[Y][X] == 8){
		tabPositions[Y][X] = 0;
	}
	playNote(frequencies[Y][X]);
}

function playNote(Freq){
	wave.freq(midiToFreq(Freq));
	env.play();
}

function initPlayer(){
	players = [];
	particles = [];
	var testPlayer = new Player(4, 2, 10, 'triangle', 0.1);
	var testPlayer2 = new Player(1, 2, 4.8, 'sine', 0.3);
	players.push(testPlayer);
	players.push(testPlayer2);
	paused = true;
	updateScreen();
}

function setup() {

  createCanvas(window.innerWidth, window.innerHeight)
	createTabs();

  textSize(32);
	textFont('Helvetica');

	env = new p5.Env();
	env.setADSR(0.001, 0.2, 0.5, 0.1);
	env.setRange(0.5, 0);

	wave = new p5.Oscillator();	
	wave.setType('sine');
	wave.amp(env);
	wave.freq(0);
	wave.start();
	
	initPlayer();
	getAudioContext().suspend()
}

function initStartScreen(){
	push();
		fill(0, 0, 0, 100);
		rect(0, 0, window.innerWidth, window.innerHeight);
		fill(255, 255, 255);
		translate(window.innerWidth/2-250, window.innerHeight/2-250)
		rect(0, 0, 500, 500);
	pop();
	push();
		translate(window.innerWidth/2-250, window.innerHeight/2-250)
		textSize(50);
		text("welcome to luminara!", 15, 60);
		textSize(32);
		text("click the tabs to change direction", 15, 200);
		text("press SPACE to start/pause", 55, 250);
		text("press R to reset", 135, 300);
		textStyle(BOLD);
		text("click anywhere to start", 90, 475);
	pop();
}

function updateScreen(){
	background(0, 0, 0);  
	push();
		fill(255, 255, 255);
		text("luminara", 30, 30)
	pop();
	createTabs();
	for(var i = 0; i < players.length; i++){
		players[i].draw();
	}
	for(var i = 0; i < particles.length; i++){
		particles[i].draw();
	}

}


function draw() {
	updateScreen();
	if(!paused){
		for(var i = 0; i < players.length; i++){
			players[i].move();
		}
	}
	if (getAudioContext().state !== 'running') {
		initStartScreen();
	}
	
}


function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

	var particle = new Particle(0, 0, null, 20);
	particles.push(particle);

	if(mouseX >= tabOffsetX && mouseY >= tabOffsetY && mouseX <= window.innerWidth-tabOffsetX && mouseY <= window.innerHeight-tabOffsetY){
		rotateTab(floor((mouseX-tabOffsetX)/rectSize), floor((mouseY-tabOffsetY)/rectSize));
		env.play();
	}
	
	updateScreen();
}

function keyPressed(){
	if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

	if(keyCode == 32){
		paused = !paused;
		console.log(tabPositions);
	}
	
	if(keyCode == 82){
		initPlayer();
	}


}


function windowResized(){
	resizeCanvas(window.innerWidth, window.innerHeight);
}
