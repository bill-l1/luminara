function Player(X, Y, Speed, Wave, Volume){
	
	this.state = false;
	//0 - stopped
	//1 - moving

	this.gridX = X;
	this.gridY = Y;

	this.targetGridX = X;
	this.targetGridY = Y;

	this.speed = Speed;

	this.x = tabOffsetX+X*rectSize;
	this.y = tabOffsetY+Y*rectSize;

	this.targetX = tabOffsetX+X*rectSize;
	this.targetY = tabOffsetY+Y*rectSize;

	var tabSpot = tabPositions[this.gridY][this.gridX];

	this.dirX = 0;
	this.dirY = 0;

	this.dist = 0;
	this.targetDist = 125;

	this.env = new p5.Env();
	this.env.setADSR(0.01, 0.2, 0.5, 0.1);
	this.env.setRange(Volume, 0);
 
	this.wave = new p5.Oscillator();	
	this.wave.setType(Wave);
	this.wave.amp(this.env);
	this.wave.freq(0);
	this.wave.start();

	this.waveType = Wave;

	if(Wave == 'triangle'){
		this.img = triImg;
	}else{
		this.img = sineImg;
	}

	this.draw = function(){
		var imgSize = rectSize+50*((this.targetDist-this.dist)/(this.targetDist));

		push();
			translate(this.x-(imgSize-rectSize)/2, this.y-(imgSize-rectSize)/2);
			image(this.img, 0, 0, imgSize, imgSize);
		pop();

	}

	this.playNote = function(Freq){
		this.wave.freq(midiToFreq(Freq));
		this.env.play();
	}

	this.createParticle = function(){
		var particle = new Particle(this.gridX, this.gridY, this.waveType, 20);
		particles.push(particle);
	}
	this.move = function(){

		if(!this.state){
			tabSpot = tabPositions[this.gridY][this.gridX];
			if(tabSpot == 0){
				this.targetGridY--;
			}
			if(tabSpot == 1){
				this.targetGridY--;
				this.targetGridX++;
			}
			if(tabSpot == 2){
				this.targetGridX++;
			}
			if(tabSpot == 3){
				this.targetGridY++;
				this.targetGridX++;
			}
			if(tabSpot == 4){
				this.targetGridY++;
			}
			if(tabSpot == 5){
				this.targetGridY++;
				this.targetGridX--;
			}
			if(tabSpot == 6){
				this.targetGridX--;
			}
			if(tabSpot == 7){
				this.targetGridY--;
				this.targetGridX--;
			}
			
			this.dirX = Math.sign(this.targetGridX-this.gridX);
			this.dirY = Math.sign(this.targetGridY-this.gridY);

			this.targetDist = abs(this.dirX)*rectSize + abs(this.dirY)*rectSize;

			if(this.targetGridX == -1){
				this.targetGridX = 5;
			}
			if(this.targetGridY == -1){
				this.targetGridY = 5;
			}
			if(this.targetGridX == 6){
				this.targetGridX = 0;
			}
			if(this.targetGridY == 6){
				this.targetGridY = 0;
			}

			this.playNote(frequencies[this.gridY][this.gridX]);
			this.createParticle();

			this.targetX = tabOffsetX + this.targetGridX * rectSize;
			this.targetY = tabOffsetY + this.targetGridY * rectSize;
			this.state = true;

		}else{
			
			this.x += this.speed*this.dirX;
			this.y += this.speed*this.dirY;

			this.dist += abs(this.speed*this.dirX) + abs(this.speed*this.dirY);

			if(this.x < tabOffsetX-rectSize/2){
				this.x = window.innerWidth-tabOffsetX-rectSize/2;
			}
			if(this.y < tabOffsetY-rectSize/2){
				this.y = window.innerHeight-tabOffsetY-rectSize/2;
			}

			if(this.x > window.innerWidth-tabOffsetX-rectSize/2){
				this.x = tabOffsetX-rectSize/2;
			}
			if(this.y > window.innerHeight-tabOffsetY-rectSize/2){
				this.y = tabOffsetY-rectSize/2;
			}

			if(this.dist >= this.targetDist){
				this.x = this.targetX;
				this.y = this.targetY;
				this.gridX = this.targetGridX;
				this.gridY = this.targetGridY;
				this.state = false;
				this.dist = 0;
			}
		}
	}

}
