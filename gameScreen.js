
/*********************************
LEVEL OBJECTS
*********************************/
function gameScreen(){
	this.playing = false;
	//how many congress people we're dealing with
	this.number = 100;
	this.levelOver = false;
	//the in game time, against which we will compare the countdown
	this.time = 0;
	this.inc = 1;
	//how much of the level remains
	this.countdown = 0;
	//how long the level will be
	this.levelTime = 30;

	//the sole purpose of this function is to load a new set of sprites
	//exactly one time. As soon as we get to display we'll set "playing"
	//to true so we won't come back here. Otherwise we load a whole new
	//set of sprites every frame.
	this.load = function(){
		if(this.playing == false){
			spawnCongress(this.number);
		}
		this.playing = true;
		this.inc = 1;
	};
	this.display = function(){

		this.banner();
		congressRules();
		drawSprites(congressPeople);
		this.timer();

		if(this.levelOver){
			//get rid of all the congressPeople sprites 
			//we used on the first go 'round
			for(var i = 0; i<congressPeople.length;i++){
				congressPeople[i].remove();
			}
			this.levelOver = false;
			this.countdown = 0;
			this.time = 0;
			this.inc = 0;
			playerParty = null;
		}
	};

	this.timer = function(){
		this.time++;
		if(this.time%50 == 0){
			this.countdown+=this.inc;
			//nesting it this way should mean we are checking for a winner on the first
			//possible frame after countdown goes from 29 to 30
			if(this.countdown == this.levelTime){
				checkWinner();
				//reset these two variables so the object knows when
				//to start and stop at the right time
				this.levelOver = true;
				this.playing = false;
				//send player to the outcomeScreen
				level = -1;
			}
		}

		var timeLeft = this.levelTime-this.countdown;
		if(this.countdown>(this.levelTime-10) && this.countdown<this.levelTime){
			textSize(50);
			text(timeLeft, width/2, height/2);
		}
	};	

	this.banner = function(){
		noStroke();
		fill(255,100);
		rect(0, 0, width, 100); 
		textAlign(CENTER);
		if(playerParty == "dem"){
			fill(50, 30, 220);
			rect(0, 0, width/4, 100);
			fill(0);
			text("Player 1", width/8, 30);
		} else if(playerParty == "rep"){
			fill(220, 30, 50);
			rect(width*3/4, 0, width/4, 100);
			fill(0);
			text("Player 1", width*7/8, 30);	
		}

		if(level == 1){
			textSize(20);
			text("Welcome to the Senate!", width/2, 40);
			textSize(15);
			text("Get a simple majority to pass your bill", width/2, 80);
		}
		printCounts(getHeadCount("dems"), getHeadCount("reps"));
	}
}
