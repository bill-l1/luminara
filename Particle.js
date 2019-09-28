function Particle(X, Y, Wave, Speed){
	
	this.gridX = X;
	this.gridY = Y;

	this.x = tabOffsetX+X*rectSize;
	this.y = tabOffsetY+Y*rectSize; 

	this.imgSize = rectSize;

	this.t = 0;
	this.age = 10;

	this.speed = Speed;
	this.wave = Wave;

	this.draw = function(){
		push();

			if(this.wave == 'sine'){
				fill(255, 0, 0, 125*(this.age-this.t)/this.age);
				noStroke();
				translate(this.x+rectSize/2, this.y+rectSize/2);
				ellipse(0, 0, this.imgSize, this.imgSize);
			}

			if(this.wave == 'triangle'){
				fill(0, 255, 0, 100*(this.age-this.t)/this.age);
				noStroke();
				translate(this.x, this.y);
				triangle(rectSize/2, rectSize-this.imgSize/1.2, rectSize-this.imgSize/1.2, this.imgSize/1.2, this.imgSize/1.2, this.imgSize/1.2) 
			}

			if(this.wave == null){
				fill(150, 150, 255, 150*(this.age-this.t)/this.age);
				noStroke();
				translate(mouseX, mouseY);
				ellipse(0, 0, this.imgSize/2, this.imgSize/2);
			}

		pop();
		
		this.update();
	}

	this.update = function(){
		this.t++;
		if(this.t == this.age){
			this.kill();
		}
		this.imgSize += this.speed;
	}

	this.kill = function(){
		particles.shift();
	}

}
