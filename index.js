// IMPORT
// import InputHandler from 'src/input.js';


let canvas;
let ctx;
// WIDTH
let w
// HEIGHT
let h
// GET CANVAS
canvas = document.getElementById('screen');
ctx = canvas.getContext('2d');
// WIDTH
w = canvas.width
// HEIGHT
h = canvas.height

// UTILITY
function last(array) {
    return array[array.length - 1];
}

// INPUT HANDLER
class InputHandler {
	constructor(hero, game) {
		document.addEventListener('keydown', (event) => {

			// RESTART
			if(game.gameScreen._gameOver && game.gameScreen._gameOverAnimation > 20){
					game.gameScreen._restart = true;
			}

			switch(event.keyCode) {
				// SPACE BAR - JUMP
				case 32:
				hero.jump()
				hero._jump = true;
					
				
				
				break;

				// LEFT ARROW - MOVE LEFT
				case 37:
				hero.moveLeft()
				hero._forward = false;
				break;
				// RIGHT ARROW - MOVE RIGHT
				case 39:
				hero.moveRight()
				hero._forward = true;
				
				break;
			}
		})
		document.addEventListener('keyup', (event) => {
			// alert(event.keyCode)

			switch(event.keyCode) {
				// SPACE BAR - JUMP
				case 32:
				hero._jump = false;
				
				break;

				// LEFT ARROW - MOVE LEFT
				case 37:

				hero.stopLeft();

				if (hero._moveRight){
					hero.moveRight()
				}
				
				break;
				// RIGHT ARROW - MOVE RIGHT
				case 39:

				hero.stopRight();

				if (hero._moveLeft){
					hero.moveLeft()
				}
				break;
			}
		})
	}
}

// BLOCK
class Block {
	constructor(sx,w,h,up,across,gap,game){

		this.w = 0.025*w;
		this.h = 0.025*w;
		this.speed = 0;
		this.gap = (up-1)*(gap+1) - (up)
		this.explode = false;
		this.position = {
			x: sx,
			y: Math.floor(h - (this.h*up + this.gap))
		}
		this.lastPosition = {
			x: this.position.x,
			y: this.position.y
		}
		
		this.f = 0;
		this.animationLoop = 100;

	}

	draw(camera){
		
		this.stroke = 0.75
		ctx.fillStyle = 'rgba(255, 234, 167,1.0)'
		ctx.fillRect(this.position.x - camera, this.position.y, this.w, this.h)
		ctx.fillStyle = 'rgba(178, 190, 195,1.0)'
		ctx.fillRect(this.position.x + this.w*this.stroke/2 - camera, this.position.y + this.w*this.stroke/2, this.w*(1-this.stroke), this.h*(1-this.stroke))

	}

	update(deltaTime){
		
		
		if(!deltaTime){
			return;
		}
		// SAVE LAST FRAME
		this.lastPosition.x = this.position.x
		this.lastPosition.y = this.position.y
		
	}
}

// FIRE BLOCK 
class Fire extends Block {

	// GLOWING RED WITH SKULL
	draw(camera){
		this.f ++
		if (this.f > this.animationLoop) {
			this.f = 0
		}
	
		this.stroke = 0.75
		let o = (100/this.f)/100 + 0.5
		
		if(!this.explode){
			ctx.fillStyle = 'rgba(225, 112, 85,' + o + ')'
			ctx.fillRect(this.position.x - camera, this.position.y, this.w, this.h)

			ctx.fillStyle = 'rgba(214, 48, 49,' + o + ')'
			ctx.fillRect(this.position.x + this.w*this.stroke/2 - camera, this.position.y + this.w*this.stroke/2, this.w*(1-this.stroke), this.h*(1-this.stroke))

		}
		// EXPLOSION HAPPENED
		else{
			ctx.fillStyle = 'rgba(225, 112, 85, 1)'
			ctx.fillRect(this.position.x  - camera , this.position.y , this.w,this.w)
		}
		
	}

}



// BLOCK GRID
class BlockGrid {
	constructor(game){
		// REFERENCE INFORMATION
		this.gap = 2; // pixels
		this.blockdata = new Block(game.w,w,h,1,this.gap)
		this.blocks = []
		this.totalBlocks = 0
		this.col = 0
		this.distance = this.blockdata.w + this.gap
		this.totalCol = 10000
		this.spawnPoint = 0 - this.blockdata.w/2
	}
	initialize(){
		
		for (let a = 0; a < this.totalCol; a++) {
			// SPAWN BLOCKS
				
				

				// ADD A COLUMN
				this.col ++



				// PROBABILITY OF STACK SIZE
				this.probOfBlockStack = [
					[1,0],
					[2,0],
					[3,0],
					[4,0],
					[5,0],
					[6,0],
					[7,0],
					[8,0],
					[9,0],
					[10,0]
				]
				// PROBABILITY OF A FIRE BLOCK
				this.probOfFireBlock = 0;

				// DIFFICULTY ADJUSTMENT
				if(a < 35){
					this.probOfBlockStack[0][1] = 0.2
					this.probOfBlockStack[1][1] = 0.2
				}
				else if(a >= 35 && a <= 100){
					console.log('a')
					this.probOfBlockStack[0][1] = 0.4
					this.probOfBlockStack[1][1] = 0.4
					this.probOfBlockStack[2][1] = 0.4
					this.probOfBlockStack[3][1] = 0.2
					this.probOfFireBlock = 0.02; 
				}
				else if(a >= 100 && a <= 150){
					this.probOfBlockStack[0][1] = 0.6
					this.probOfBlockStack[1][1] = 0.6
					this.probOfBlockStack[2][1] = 0.6
					this.probOfBlockStack[3][1] = 0.4
					this.probOfBlockStack[4][1] = 0.1

					this.probOfFireBlock = 0.04;
				}
				else if(a >= 150 && a <= 250){
					this.probOfBlockStack[0][1] = 0.8
					this.probOfBlockStack[1][1] = 0.8
					this.probOfBlockStack[2][1] = 0.8
					this.probOfBlockStack[3][1] = 0.6
					this.probOfBlockStack[4][1] = 0.4
					this.probOfBlockStack[5][1] = 0.2

					this.probOfFireBlock = 0.08;
				}
				else if (a >= 250 && a <= 350){
					this.probOfBlockStack[0][1] = 0.9
					this.probOfBlockStack[1][1] = 0.9
					this.probOfBlockStack[2][1] = 0.9
					this.probOfBlockStack[3][1] = 0.8
					this.probOfBlockStack[4][1] = 0.6
					this.probOfBlockStack[5][1] = 0.6
					this.probOfBlockStack[6][1] = 0.2
					this.probOfBlockStack[7][1] = 0.1
					

					this.probOfFireBlock = 0.15;
				}
				else if (a >= 350 && a <= 500){
					this.probOfBlockStack[0][1] = 0.9
					this.probOfBlockStack[1][1] = 0.9
					this.probOfBlockStack[2][1] = 0.9
					this.probOfBlockStack[3][1] = 0.8
					this.probOfBlockStack[4][1] = 0.8
					this.probOfBlockStack[5][1] = 0.8
					this.probOfBlockStack[6][1] = 0.6
					this.probOfBlockStack[7][1] = 0.4
					this.probOfBlockStack[8][1] = 0.4
					this.probOfBlockStack[9][1] = 0.2
				
					this.probOfFireBlock = 0.25;
				}
				else{
					this.probOfBlockStack[0][1] = 0.9
					this.probOfBlockStack[1][1] = 0.9
					this.probOfBlockStack[2][1] = 0.9
					this.probOfBlockStack[3][1] = 0.8
					this.probOfBlockStack[4][1] = 0.8
					this.probOfBlockStack[5][1] = 0.8
					this.probOfBlockStack[6][1] = 0.6
					this.probOfBlockStack[7][1] = 0.6
					this.probOfBlockStack[8][1] = 0.6
					this.probOfBlockStack[9][1] = 0.6
					this.probOfFireBlock = 0.4;
				}



				// STACK LOOP
				for(let i = 0; i < this.probOfBlockStack.length; i++){
					if(Math.random() < this.probOfBlockStack[i][1]){
						this.newBlock = new Block(this.spawnPoint,w,h,([i][0] + 1),1,this.gap)
						this.blocks.push([this.newBlock,this.col,this.spawnPoint,'normal'])
						this.totalBlocks ++
					}
					else{
						this.newFireBlock = new Fire(this.spawnPoint,w,h,([i][0] + 1),1,this.gap)
						
						if(Math.random() < this.probOfFireBlock){
							this.blocks.push([this.newFireBlock,this.col,this.spawnPoint,'fire'])
						}
						this.totalBlocks ++
						break;
					}
				}

				// MOVE POSITION
				this.spawnPoint += this.distance
			
		}
		console.log(this.totalBlocks)
	}

	draw(camera){
		// DRAW THE BLOCKS
		for(let i = game.hero.blockStart; i<game.hero.blockEnd;i ++){
			this.blocks[i][0].draw(camera)

		}
	
	}
	drawOne(){
	

		this.blockElements = this.blocks.length
		// LAST BLOCK CREATED
		this.lastBlock = this.blocks[this.blockElements - 1]
		

		// SPAWN
		if(this.blockElements == 0){
				
			if(Math.random()<1){
			this.blocks.push(new Block(game.w,w,h,1,1,this.gap))
			}
		}
		// DRAW THE BLOCKS
		for(let i = 0; i<this.blocks.length;i ++){
			this.blocks[i].draw()
		}

	}
	update(deltaTime){
		

	}
}


// HERO CLASS
class Hero {
	constructor(game){
		this.color = '#0984e3'
		this.c = 0.025
		this.w = this.c*game.w;
		this.h = this.c*game.w*2;

		this.show_W = this.w;
		this.show_H = this.h;

		this.speed = {
			x: 0,
			y: 0
		}
		this.maxSpeed = {
			x: 75,
			y: 300
		}

		// POSITION
		this.position = {
			x: game.w/2 - this.w/2,
			y: game.h/2 - this.h/2,
		}
		// POSITION FROM PREVIOUS FRAME
		this.lastPosition = {
			x: this.position.x,
			y: this.position.y
		}
		this.showPosition = {
			x: this.position.x,
			y: this.position.y
		}

		// COLLIDE
		this.collision = false;
		this.onBlock = false;

		// BLOCK GRID RANGE FOR COLLISIONS (INITIAL PARAMETERS)
		this.blockStart = 0;
		this.blockEnd = 200;
		this.blockCollision = 100;
		this.deathBlock = 0

		// HOLDS DATA FOR LAST X FRAMES
		this.frameData = 15
		this.currentFrame = 0;
		this.frameArray = [[this.position.x,this.position.y,this.w,this.h,this.currentFrame]]
		this.blur = false;

		// JUMP
		this.heroJump = false;
		this.heroDoubleJump = false;
		this.jumpAnimation = 0
		this.jumpEnabled = false;


		// GRAVITY
		this.gravity = 2;
		this.time = 0;
		

		// CONTROLS
		this._jump = false;
		this._moveRight = false;
		this._moveLeft = false;
		this._forward = false;

		// ALIVE OR DEAD
		this.dead = false;
	}
	draw(camera){
		this.opacity = 0
		if(this.blur){
			for(let i = this.frameArray.length; i>0; i--){
			ctx.fillStyle = 'rgba(9, 132, 227,' + this.opacity + ')'
			ctx.fillRect(this.frameArray[i-1][0] - camera,this.frameArray[i-1][1],this.frameArray[i-1][2],this.frameArray[i-1][3])
			this.opacity = (i**2/(10000))
			}
		}
		ctx.fillStyle = this.color
		ctx.fillRect(this.showPosition.x - camera, this.showPosition.y, this.show_W, this.show_H)
	}
	moveLeft(){
		this._moveLeft = true;
		this.speed.x = -1 * this.maxSpeed.x;
	}
	moveRight(){
		this._moveRight = true;  
        this.speed.x = this.maxSpeed.x;
	}
	jump(){
		
	}
	stopLeft(){
		this._moveLeft = false;
		this.speed.x = 0;
	}
	stopRight(){
		this._moveRight = false;
		this.speed.x = 0;
	}
	// UPDATE
	update(deltaTime){

		// JUMP
		if(this._jump && this.speed.y == 0){
			this.jumpEnabled = true;
			this.speed.y = -this.maxSpeed.y
		}
		

		
		// GRAVITY
		this.time ++
		this.speed.y += this.gravity * this.time

		// UPDATE POSITION FIRST

		// 0 DELTA TIME	
		if(!deltaTime){
			return;
		}

		this.speedOfBlock = 0;

		if(this.onBlock){
			this.speedOfBlock = -this.blocks[0][0].speed
			this.onBlock = false;
		}


		// SAVE POSITION FOR COLLISION DETECTION
    	this.lastPosition.x = this.position.x
    	this.lastPosition.y = this.position.y

		// UPDATE NEW POSITION
		this.position.x += ((this.speed.x+this.speedOfBlock)/deltaTime)
		this.position.X += ((this.speed.x+this.speedOfBlock)/deltaTime)
		this.position.y += (this.speed.y/deltaTime)

		this.speedOfBlock = 0

		// SET COLLISION TO FALSE

	    // RELATIVE POSITION
		
		this.fall = false;

		////////////////////////////
		//                        //
		//  COLLISION PARAMETERS  //
		//                        //
		////////////////////////////

		this.blocks = game.blockGrid.blocks
		// console.log(this.blocks)

		this.tempYPosition = [] // [y.position, side collision true/false]
		// this.positionData = {
		// 	x:,
		// 	y:
		// }
		this.tempData = []
		
		this.sideCollision = 0

		this.topCollision = []

		// BLOCKS LOOP
		for(let i = this.blockStart; i<this.blockEnd; i ++){

			// THIS FRAME X-AXIS
			this.leftSideOfBlock = this.blocks[i][0].position.x-this.blocks[i][0].w
			this.rightSideOfBlock = this.blocks[i][0].position.x

			this.leftSideOfHero = this.position.x - this.w
			this.rightSideOfHero = this.position.x
			
			// LAST FRAME X-AXIS
			this.lastRightSideOfBlock = this.blocks[i][0].lastPosition.x
			this.lastLeftSideOfBlock = this.blocks[i][0].lastPosition.x - this.blocks[i][0].w

			this.lastLeftSideOfHero = this.lastPosition.x - this.w
			this.lastRightSideOfHero = this.lastPosition.x

			// THIS FRAME Y-AXIS
			this.bottomOfBlock = this.blocks[i][0].position.y + this.blocks[i][0].w
			this.topOfBlock = this.blocks[i][0].position.y

			this.bottomOfHero =  this.position.y + this.h
			this.topOfHero = this.position.y

			// LAST FRAME Y-AXIS
			this.lastBottomOfBlock = this.blocks[i][0].lastPosition.y + this.blocks[i][0].w
			this.lastTopOfBlock = this.blocks[i][0].lastPosition.y

			this.lastBottomOfHero = this.lastPosition.y + this.h
			this.lastTopOfHero = this.lastPosition.y	

			// FIRST CHECK FOR A COLLISION ON THE X AXIS
			this.collision = false;

			// FIRST X-AXIS COLLISION CONDITION - CHECK CURRENT FRAME
			if (this.rightSideOfHero >= this.leftSideOfBlock && this.leftSideOfHero <= this.rightSideOfBlock) {
				this.collision = true;
				this.blockCollision = i
			}
			// SECOND X-AXIS COLLISION CONDITION - DOUBLE CHECK COLLISION WITH LAST FRAME DATA
			// IN HIGH SPEED WHERE THE FRAMES MAY SKIP THE FIRST COLLISION CONDITION

			// INSERT CODE HERE

			
	    	///////////////////////
			//                   //
			//  COLLISION LOGIC  //
			//                   //
			///////////////////////

			if(this.collision){
				

				// CHECK BLOCK SIDE COLLISIONS FIRST
				if(this.lastBottomOfHero > this.lastTopOfBlock && this.bottomOfHero > this.topOfBlock){
					// console.log('SIDE COLLISION DETECTED')

					// LEFT SIDE OF HERO COLLISION
					if(this.lastLeftSideOfHero >= this.lastRightSideOfBlock && this.leftSideOfHero <= this.rightSideOfBlock){
						this.position.x = this.rightSideOfBlock + this.w + .001 // ROUNDING ISSUE
					}

					// RIGHT SIDE OF HERO COLLISION
					if(this.lastRightSideOfHero <= this.lastLeftSideOfBlock && this.rightSideOfHero >= this.leftSideOfBlock){
						this.position.x = this.leftSideOfBlock
					}
					
					// SIDE COLLISION COLUMN
					this.sideCollision = this.blocks[i][1]

					if(this.blocks[i][3] == 'fire'){
						this.blocks[i][0].explode = true;
						this.dead = true;
						this.deathBlock = this.blocks[i][0];
					}

					// this.speed.x = 0;

				}
				// CHECK TOP OF BLOCK COLLISION
				else if(this.lastBottomOfHero <= this.lastTopOfBlock && this.bottomOfHero >= this.topOfBlock){
					// console.log('TOP COLLISION DETECTED')
					// this.tempData.push([this.topOfBlock,this.leftSideOfBlock])

					// TOP COLLISION COLUMN
					this.topCollision.push([this.blocks[i][1],this.topOfBlock])
					// console.log(this.topCollision)

					if(this.blocks[i][3] == 'fire'){
						this.blocks[i][0].explode = true;
						this.dead = true;
						this.deathBlock = this.blocks[i][0]
					}


				}
				else{
					// console.log('NOT DEFINED COLLISION DETECTED')
				}
			}
		}

		// RESET COLLISION RANGE PARAMETERS
		this.blockStart = this.blockCollision - 100
		if(this.blockStart <= 0){
			this.blockStart = 0
		}
		this.blockEnd = this.blockCollision + 100

		// SET Y POSITION

		let yValues = []
		let smallestYValue = h*2

		for(let i = 0; i < this.topCollision.length; i++){
				if(this.sideCollision.length == 0 || this.topCollision[i][0] != this.sideCollision){
					yValues.push(this.topCollision[i][1] - this.h)
					this.time = 0;
					this.speed.y = 0;
					this.onBlock = true;
				}
		}
		if(yValues.length > 0){
			for(let i=0; i < yValues.length; i ++){
				if(yValues[i] < smallestYValue){
					smallestYValue = yValues[i]
				}
			}
			this.position.y = smallestYValue
		}

		
		

    	//////////////////
		//////////////////
		//  BOUNDARIES  //
		//////////////////
		//////////////////

		
		// END JUMP FUNCTION AFTER HITTING FLOOR
		if(this.position.y > game.h - this.h){
			this.position.y = game.h - this.h
			this.speed.y = 0;
			this.time = 0;
		}
		// KEEP IN CANVAS
		if(this.position.x < 0){
			this.position.x = 0;
		}
		// if(this.position.x >= game.w - game.w/2 - this.w){
		// 	this.position.x = game.w - game.w/2;
		// }



		// FRAME DATA BLUR
		let l = this.frameArray.length
		if(!this.frameArray[l] == 0){
			this.frameArray.push([this.position.x, this.position.y, this.w, this.h, this.currentFrame])
		}
		if(this.position.x != (this.frameArray[l - 1][0])){
			this.frameArray.push([this.position.x, this.position.y, this.w, this.h, this.currentFrame])
		}
		if(this.frameArray.length > 30){
			this.frameArray.splice(0,1)
		}
		for(let i = 0; i < l-1; i++){
			if(this.frameArray[i][4] + 30 < this.currentFrame){
				this.frameArray.splice(i,1)
			}
		}
		this.currentFrame ++
		
		// console.log(this.lastPosition)
		// console.log(this.position)

		// if(this.position.x>this.lastPosition.x){
		// 	console.log('true')
		// }
		// else{
		// 	console.log('false')
		
		// console.log('This time: ' + this.time)
		// console.log('Jump key selected: ' + this._jump)
		// console.log('Jump in progress: ' + this.heroJump)

		this.showPosition.x = this.position.x
		this.showPosition.y = this.position.y

		// JUMP ANIMATION
		if(this.jumpEnabled){
			this.jumpFrames = 100/this.gravity/2
			this.jumpAnimation ++

			if(this.speed.y == 0){
				this.jumpAnimation = 0
			}

			// BOUNCE VARIABLES
			let t = this.jumpAnimation/this.jumpFrames
			let pi = Math.PI
			let amp = 0.75
			let freq = 1
			let decay = 4
			// BOUNCE EXPRESSION
			let result = amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t)

			this.show_W = this.w - (this.w*result)

			let wDifference = this.w - this.show_W 
			this.showPosition.x = this.position.x + wDifference/2
			// this.position.x = this.position.X + (this.position.X*result)


			if(this.jumpAnimation == this.jumpFrames){
				this.jumpEnabled = false;
				this.jumpAnimation = 0;
			}
		}
	}
}

// CAMERA
class Camera {
	constructor(game){
		this.move = 0
		this.cameraPOV = game.w/2
	}
	draw(){

		this.heroPosition = game.hero.position.x
		this.move = this.heroPosition - this.cameraPOV

		// DRAW HERO
		game.hero.draw(this.move)
		// DRAW BLOCKS
		game.blockGrid.draw(this.move)


	}
}

// GAME SCREEN
class GameScreen {
	constructor(game){
		
		this.score = 0
		this._gameOver = false;
		this._gameOverAnimation = 0
		this._restart = false;
	}
	scoreDisplay(){
		this.time = game.f
		this.distance = game.hero.position.x
		if(!this._gameOver){
		ctx.font = '15px Roboto';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('Score : ' + Math.floor(this.score), w/8, h/8);
		
			this.score = game.hero.position.x/20 - this.time/50
		}
		
		// Math.floor(this.score)
	}
	start(){
		ctx.font = '30px Roboto';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('Click To Start', w/2, h/2);

	}
	gameOver(){
			this._gameOver = true;
			this._gameOverAnimation ++
			ctx.font = '50px Roboto';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('oops...', w/2,h*0.25);
			ctx.font = '30px Roboto';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			ctx.fillText('FINAL SCORE:  ' + Math.floor(this.score), w/2, h*0.5);
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			ctx.font = '10px Roboto';
			ctx.fillText('PRESS ANY KEY TO RESTART', w/2, h*0.666);
		
	}
}

// GAME CLASS
class Game {
  constructor(w,h){
    this.w = w
    this.h = h
    this.f = 0
    this.camera = new Camera(this);
    this.blockGrid = new BlockGrid(this);
    this.hero = new Hero(this);
    this.gameScreen = new GameScreen(this);

    new InputHandler(this.hero, this);
  }
  start(){

  	this.blockGrid.initialize()
  	this.f ++
  	// this.block = new Block;
  	// this.hero = new Hero(this);

  	
  }
  update(deltaTime){
 	// this.blockGrid.update(deltaTime)
  	this.hero.update(deltaTime)
  	this.f ++

  	if(this.hero.dead == true){
  		this.gameScreen.gameOver()
  	}

  }
  draw(){
  	// this.gameScreen.start()
  	// this.blockGrid.draw()
  	this.gameScreen.scoreDisplay()
  	// this.gameScreen.gameOver()
  	// this.blockGrid.draw()
  	// this.hero.draw()
  	this.camera.draw()
  }
}

//////////////////////////
 //////////////////////////
/////// GAME LOOP ////////
 //////////////////////////
//////////////////////////


let reset = true;


let game = new Game(w,h)
let lastTime = 0

// INFINITE GAME LOOP
function gameLoop(timestamp){
	// GET TIME
	let deltaTime = timestamp - lastTime;
	lastTime = timestamp;
	// CLEAR CANVAS
	ctx.clearRect(0,0,w,h);
	// DRAW BACKGROUND COLOR
	ctx.fillStyle = '#b2bec3'
	ctx.fillRect(0,0,w,h)
	// START GAME
	if(game.f == 0){
		game.start()
	}
	// UPDATE ELEMENTS
	if(!game.gameScreen._gameOver) {
		game.update(deltaTime)
	}
	// DRAW ELEMENTS
	game.draw()
	if(game.gameScreen._gameOver) {
		// GAME OVER ANIMATION
		let o = 0 + game.gameScreen._gameOverAnimation/500
		if(o > 0.5){
			o = 0.5
		}
		ctx.fillStyle = 'rgba(0,0,0,' + o +')'
		ctx.fillRect(0,0,w,h)
		// GAME OVER MENU
		game.gameScreen.gameOver()

	}

	

	// RESTART
	if(!game.gameScreen._gameOver || !game.gameScreen._restart){
		// CALL LOOP AGAIN
		requestAnimationFrame(gameLoop)
	}
	else{
		console.log('b')
		game = new Game(w,h)
		requestAnimationFrame(gameLoop)
	}
	
}

// START LOOP
requestAnimationFrame(gameLoop)
