

//0 = title screen
var l1;
//outcomeScreen instance
var OS;
//instructions
var instScreen;
var needsHelp;

//title screen instance
var ts;

var playerParty;
var congressPeople;

var reset;

//congressPeople properties
var isDem, isRep;
var wasSwayed;
var timer;
var zealotry;
var clicks;

var titleCard;

function preload(){
	titleCard = loadImage("assets/titleLetters/titleCard.png");
}

function setup(){
	createCanvas(750, 750);
	level = 0;
	playerParty = null;

	needsHelp = false;

	newGame = false;

	reset = false;

	//instantiating all of our screen objects
	OS = new outcomeScreen();
	l1 = new gameScreen();
	instScreen = new helpScreen();
	ts = new titleScreen();

	//we can go ahead and pre-load this particular screen object
	//because it'll be the first thing the player sees. 
	ts.load();
}

/********************************
DRAW
********************************/
function draw(){

	background(80, 60, 80);


	//Title screen
	if(level == 0){
		ts.display();
		if(needsHelp){
			instScreen.display();
		}
	}

	//level one game screen
	if(level == 1){
		//load and display in this order to only spawnCongress ONE TIME EXACTLY
		//... this is obviously dumb, load and display should be switched so that
		//load() doesn't run every time...
		l1.load();
		if(l1.playing){
			l1.display();
		}
	}

	//outcome screen
	if(level == -1){
		OS.display(checkWinner());
	}
}

//outcome screen object
function outcomeScreen(){
	this.display = function(outcome){
		textAlign(CENTER);
		if(outcome == 1){
			textSize(50);
			text("You win!\nCongratulations on passing\n your first bill!", width/3, height/2);
		} else if(outcome == 3){
			textSize(50);
			text("Tie... bummer...", width/2, height/2);
		} else if(outcome == 2){
			textSize(50);
			text("You lost...\nbut Democracy prevails!", width/2, height/2);
		}
		textSize(20);
		text("Press any key to play again", width/2, height*2/3);
		//Sends the player back to level one
		if(reset){
			ts.load();
			level = 0;
		}
	}
}


function keyReleased(){
	if(level == -1){
		reset = true;
	}
}


function checkWinner(){
	if(playerParty == "dem"){
		if(getHeadCount("dems")>getHeadCount("reps")){
			outcome = 1;
		} else if(getHeadCount("dems") == getHeadCount("reps")){
			outcome = 3;
		} else {
			outcome = 2;
		}
	} else if(playerParty == "rep"){
		if(getHeadCount("reps")>getHeadCount("dems")){
			outcome = 1;
		} else if(getHeadCount("dems") == getHeadCount("reps")){
			outcome = 3;
		} else {
			outcome = 2;
		}
	}

	return outcome;
}


//status of the current vote, takes variables determined in getHeadCount()
function printCounts(dems, reps){
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text("Dems: " + dems, width/8, 60);
  text("Reps: " + reps, width*7/8, 60);
}

//A function that counts the number of congressPeople with the property isDem or isRep,
function getHeadCount(party){
  var dems = 0;
  var reps = 0;
  var number = 0;
  if(party == "dems"){
    for(var i = 0; i<congressPeople.length;i++){
      if(congressPeople[i].isDem){
        dems++;
      }
    }
    number = dems;
  }
  if(party == "reps"){
    for(var i = 0; i<congressPeople.length;i++){
      if(congressPeople[i].isRep){
        reps++;
      }
    }
    number = reps;
  }
  return number;
}

function congressRules(){
	//real estate management
	//"Congress people are LITERALLY bouncing off the walls!"
	for(var i = 0; i<congressPeople.length;i++){
	    var c = congressPeople[i];
	    //15 is 1/2 the width/height of my congress people
	    if(c.position.x>width-15 || c.position.x<15){
	    	c.velocity.x= c.velocity.x*-1;
	    }
	    if(c.position.y>height-15 || c.position.y<115){
	    	c.velocity.y = c.velocity.y*-1;
	    }
	//click to change party affiliation
	//Gotta click more times for the more zealous
	    c.onMousePressed = function(){
	    	this.clicks++;
	    	if(this.clicks>=this.zealotry){
		    	this.wasSwayed = true;
		     	if(this.isDem){
		    		this.isRep = true;
		        	this.isDem = false;
		    	} else if(this.isRep){
		        	this.isDem = true;
		        	this.isRep = false;
		    	}
		    	this.clicks = 0;
		    }
	    }
	    //Everyone wears their party's colors
		//intensity is determined by their zealotry property.
		//Would be nice to have their color shift from one
		//color to another with more clicks. 
	    if(c.isDem){
	      	c.shapeColor = color(0, 0, (c.zealotry*20)+150);
	    } else if (c.isRep){
	    	c.shapeColor = color((c.zealotry*20)+150,0, 0);
	    }

	//opinions change very quickly around here.
	//Color change to purple here warns the player that they are losing ground 
	    if(c.wasSwayed){
	    	c.timer++;
	    	if(c.timer>300){
	    		c.shapeColor = color(255,0,255);
	    	}
	    	if(c.timer>500){
	    		c.wasSwayed = false;
	    		c.timer = 0;
	    		if(c.isDem){
	    			c.isRep = true;
	        		c.isDem = false;
	    		} else if(c.isRep){
	        		c.isDem = true;
	        		c.isRep = false;
	    		}
	    	}
    	}
	}
}

//Here we create our congress people one by one, 
//giving each of them their own particular characteristics
function spawnCongress(num){
  congressPeople = new Group();
  numCPeople = num;
  for(var i = 0; i<numCPeople; i++){
    var newCPerson = createSprite(random(15, width-15), random(160, height-15), 30, 30);
    newCPerson.wasSwayed = false;
    newCPerson.timer = 0;
    newCPerson.zealotry = int(random(1,5));
    newCPerson.clicks = 0;

    if(i<=45){
      newCPerson.isDem = true;
      newCPerson.isRep = false;
    } else {
      newCPerson.isRep = true;
      newCPerson.isDem = false;
    }
      
    newCPerson.velocity.x = random(-1,1);
    newCPerson.velocity.y = random(-1,1);
    newCPerson.positionSwitch = false;

    congressPeople.add(newCPerson);
  }
}

/***********************************
TITLE SCREEN OBJECT
***********************************/
function titleScreen(){
	this.buttons = new Group();
	this.loading = false;
	var numButtons;
	var close = false;
	var partyAlert = false;

	this.load = function(){
		
		repButton = createSprite(2*width/3, height/2, 125, 75);
		repButton.shapeColor = color(200, 0, 0);
		demButton = createSprite(width/3, height/2, 125, 75);
		demButton.shapeColor = color(0,0,200);
		helpButton = createSprite(width*5/6, height*5/6, 100, 60);
		helpButton.shapeColor = color(255);
		startButton = createSprite(width/2, height*2/3, 125, 75);
		startButton.shapeColor = color(255);



		this.buttons.add(startButton);
		this.buttons.add(demButton);
		this.buttons.add(repButton);
		this.buttons.add(helpButton);
		numButtons = this.buttons.length;
	}

  	this.pAlert = function(){
		textAlign(CENTER);
		fill(255);
		textSize(12);
		text("Please pick a party\nto begin", width*2.1/3, height*2.6/4);
  	}

  	this.display = function(){
  		image(titleCard, 30, 80, 675, 120);
  		textAlign(CENTER);
  		textSize(30);
  		text("the game", width/2, 240);
		this.checkStatus();
		if(close == true){
	
		}
		drawSprites(this.buttons);
		//Button text
		textAlign(CENTER);
		fill(0);
		textSize(30);
		text("START", width/2, height*2/3+10);
		textSize(15);
		text("Help", width*5/6, height*5/6);
	
		//set "reset" back to false so that on a second playthough
		//it will still bring us back to the main screen.
		//This also helps with only calling ts.load() to reinstantiate the
		//buttons exactly once at line 107
		reset = false;
  	}

  	//every frame we want to check if any of the buttons has been pressed
  	this.checkStatus = function(){

  		repButton.onMousePressed = function(){
	    	playerParty = "rep";
	  	}

	  	demButton.onMousePressed = function(){
	    	playerParty = "dem";
	  	}

		//Buttons change color when you push'em so you know whose side you're on
	  	if(playerParty == "dem"){
	  		partyAlert = false;
	  		demButton.shapeColor = color(100, 100, 255);
	  		repButton.shapeColor = color(200, 0, 0);
	  	} else if(playerParty == "rep"){
	  		partyAlert = false;
	  		demButton.shapeColor = color(0, 0,200);
	  		repButton.shapeColor = color(255, 100, 100);
	  	} else if(playerParty == null){
	  		repButton.shapeColor = color(200, 0, 0);
	  		demButton.shapeColor = color(0,0,200);
	  	}

	  	//tells player to pick party
	  	if(partyAlert){
	  		this.pAlert();
	  	}


	  	//needsHelp sends player to the help screen
	  	helpButton.onMousePressed = function(){
	  		needsHelp = true;
	  	}

	  	//Functions to give the start button some responsiveness
	  	startButton.onMouseOver = function(){
	  		//"onMouseOver" is only called once, so
	  		//if you tried to call pAlert(); here it will
	  		//only run one time... hence the janky variable
	  		partyAlert = true;
	  		startButton.shapeColor = color(200);
	  	}
	  	startButton.onMouseOut = function(){
	  		startButton.shapeColor = color(255);
	  	}

	  	startButton.onMousePressed = function(){
	  		if(playerParty == "dem" || playerParty == "rep"){
		    	level = 1;
		    	//You should be able to do these all at once with a for loop,
		    	//which works to remove the congress people, but for some reason
		    	//this is WAY easier here
		    	repButton.remove();
		    	demButton.remove();
		    	startButton.remove();
		    	helpButton.remove();
			}
	    }   
  	}
}


/*******************************
HELP SCREEN OBJECT
Activates if needsHelp = true, which is determined in the titleScreen object (ts)
*******************************/
function helpScreen(){
	this.backButton = createSprite(width/6, height*5/6, 100, 60);
	this.backButton.shapeColor = color(255);

	this.display = function(){
		fill(130, 60, 130);
		rect(0,0,width, height);
		textSize(30);
		fill(0);
		text("Convince the other congress people to\n vote with you and pass bills!", width/2, height/3);
		textSize(15);
		text("Choose your party, then click on members of the opposition\nto change their minds. Brighter colored Congresspeople\nare more zealous... they'll take a few more clicks.\nAnd keep an eye on those you convince... they will tend to \ngo back to their old ways if you forget about them.\n\n You won't know exactly when the vote will be called\n until just before it happens, so stay ready!", width/2, height/2);
		text("Follow the instructions at the top of each level\n to complete each measure. Good luck!", width/2, height*3/4)
		this.backButton.onMousePressed = function(){
  			needsHelp = false;
		}
		drawSprite(this.backButton);
		fill(0);
		text("Back", width/6, height*5/6);
	}
}
