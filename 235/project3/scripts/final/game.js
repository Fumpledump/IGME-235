"use strict";

// I. VARIABLES
const cellWidth = 32; 
const cellSpacing = 0;
const container = document.querySelector("#explorerGrid");
let cells = []; // the HTML elements - our "view"

// faking an enumeration here
const keyboard = Object.freeze({
	SHIFT: 		16,
	SPACE: 		32,
	LEFT: 		37, 
	UP: 		38, 
	RIGHT: 		39, 
	DOWN: 		40
});

// this is an enumeration for gameworld levels
const worldTile = Object.freeze({
	FLOOR: 		0,
	WALL: 		1,
	GRASS: 		2,
	WATER: 		3,
	GROUND: 	4,
	ROCK: 		5
});

// the "grunt" sound that plays when the player attempts to move into a wall or water square
let effectAudio = undefined;

// level data is over in gamedata.js
let currentLevelNumber = 1;
let currentGameWorld = undefined;   // a 2D array - the grid:  walls, floors, water, etc...
let currentGameObjects = undefined; // a 1D array - stuff that's on top of the grid and can move: monsters, treasure, keys, etc...

// the player - uses ES6 object literal syntax
const player = Object.seal({
	x:-1,
	y:-1,
	element: undefined,
	moveRight(){this.x++;},
	moveDown(){this.y++;},
	moveLeft(){this.x--;},
	moveUp(){this.y--;},
});


// II. INIT code
window.onload = ()=>{
	currentGameWorld = gameworld["room" + currentLevelNumber];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows,numCols);
	drawGrid(currentGameWorld);
	loadLevel(currentLevelNumber);
	drawGameObjects(currentGameObjects);
	effectAudio = document.querySelector("#effectAudio");
	effectAudio.volume = 0.2;
	setupEvents();
}

function nextLevel()
{
	clearGrid();
	clearLevel();
	currentGameWorld = gameworld["room" + currentLevelNumber];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows,numCols);
	drawGrid(currentGameWorld);
	loadLevel(currentLevelNumber);
	drawGameObjects(currentGameObjects);
}


// III. FUNCTIONS
// the elements on the screen that won't change - our "view"
function createGridElements(numRows,numCols){
	const span = document.createElement('span');
	span.className = 'cell';
	for (let row=0;row<numRows;row++){
	cells.push([]);
		for (let col=0;col<numCols;col++){
			let cell = span.cloneNode();
			cell.style.left = `${col * (cellWidth+cellSpacing)}px`;
			cell.style.top = `${row * (cellWidth+cellSpacing)}px`;
			container.appendChild(cell);
			cells[row][col] = cell;
		}
	}
}

// the elements on the screen that can move and change - also part of the "view"
function loadLevel(levelNum = 1){
	currentGameObjects = []; // clear out the old array
	const node =  document.createElement("span");
	node.className = "gameObject";

	// now initialize our player
	let spawn = gameworld["spawn" + levelNum];
	player.x = spawn[0];
	player.y = spawn[1];
	player.element = node.cloneNode(true);
	player.element.classList.add("player");
	container.appendChild(player.element);
	
	
	/* let's instantiate our game objects */
	// pull the current level data
	const levelObjects = allGameObjects["level" + levelNum];
	
	// loop through this level's objects ... 

	console.log(levelObjects);
	if(levelObjects != null)
	{
		for (let obj of levelObjects){
			const clone = Object.assign({}, obj); 		// clone the object
			clone.element = node.cloneNode(true); 		// clone the element
			clone.element.classList.add(obj.className); // add the className so we see the right image
			currentGameObjects.push(clone);				// add to currentGameObjects array  (so it gets moved onto the map)
			container.appendChild(clone.element);		// add to DOM tree (so we can see it!)
		}
	}

}

function clearGrid() {
	const numRows = cells.length;
	for (let row = 0; row < numRows; row++) 
	{
	  const numCols = cells[row].length;
	  for (let col = 0; col < numCols; col++) 
	  {
		const cell = cells[row][col];
		cell.parentNode.removeChild(cell);
	  }
	}
	cells = [];
}

  function clearLevel() {
    // Remove all game objects from the container
    container.querySelectorAll('.gameObject').forEach(obj => obj.remove());

    // Reset the current game objects array
    currentGameObjects = [];
}

function drawGrid(array){
	const numCols = array[0].length;
	const numRows = array.length;
	for (let row=0;row<numRows;row++){
		for (let col=0;col<numCols;col++){
			const tile = array[row][col];
			const element = cells[row][col];

			// ** can you figure our how to get rid of this switch? Maybe another enumeration, of the tile CSS classes? **
			switch(tile) {
    			case worldTile.FLOOR:
        		element.classList.add("floor")
        		break;
        		
        		case worldTile.WALL:
        		element.classList.add("wall");
        		break;
        		
        		case worldTile.GRASS:
        		element.classList.add("grass");
        		break;
        		
        		case worldTile.WATER:
        		element.classList.add("water");
        		break;
        		
        		case worldTile.GROUND:
        		element.classList.add("ground");
        		break;

				case worldTile.ROCK:
				element.classList.add("rock");
				break;
			}
		}
	}
}


function drawGameObjects(array){
	// player
	player.element.style.left = `${player.x * (cellWidth + cellSpacing)}px`;
	player.element.style.top = `${player.y * (cellWidth + cellSpacing)}px`;
	
	// game object
	for (let gameObject of array){
		gameObject.element.style.left = `${gameObject.x * (cellWidth + cellSpacing)}px`;
		gameObject.element.style.top = `${gameObject.y * (cellWidth + cellSpacing)}px`;
	}
	
}


function movePlayer(e){
	let nextX;
	let nextY;
	switch(e.keyCode){
		case keyboard.RIGHT:
		nextX = player.x + 1;
		nextY = player.y;
		if(checkIsLegalMove(nextX,nextY)) player.moveRight();
		break;
		
		case keyboard.DOWN:
		nextX = player.x;
		nextY = player.y + 1;
		if(checkIsLegalMove(nextX,nextY)) player.moveDown();
		break;
		
		case keyboard.LEFT:
		nextX = player.x - 1;
		nextY = player.y;
		if(checkIsLegalMove(nextX,nextY)) player.moveLeft();
		break;
		
		case keyboard.UP:
		nextX = player.x;
		nextY = player.y - 1;
		if(checkIsLegalMove(nextX,nextY)) player.moveUp();
		break;
	}
	
	function checkIsLegalMove(nextX,nextY){
		let nextTile = currentGameWorld[nextY][nextX];

		if (nextTile != worldTile.WALL && nextTile != worldTile.WATER){
			checkLoader(nextX,nextY);
			return true;
		}else{
			effectAudio.play();
			checkLoader(nextX,nextY);
			return false;
		}
	}

	function checkLoader(nextX,nextY){
		let loader = gameworld["levelLoader" + currentLevelNumber];

		const rowWidth = currentGameWorld[0].length - 1; // get the length of the first row
		const columnHeight = currentGameWorld.length - 1; // get the number of rows in the array


		console.log(`Row width: ${rowWidth}`);
		console.log(`Column height: ${columnHeight}`);
		console.log(`XY: ${nextX},${nextY}`);

		if(nextY == 0) // Up
		{
			if(loader[0] != 0)
			{
				currentLevelNumber += loader[0];
				console.log("Loading Level: " + currentLevelNumber);
				nextLevel();
			}
		}
		if(nextY == columnHeight) // Down
		{
			if(loader[1] != 0)
			{
				currentLevelNumber += loader[1];
				console.log("Loading Level: " + currentLevelNumber);
				nextLevel();
			}
		}
		if(nextX == 0) // Left
		{
			if(loader[2] != 0)
			{
				currentLevelNumber += loader[2];
				console.log("Loading Level: " + currentLevelNumber);
				nextLevel();
			}
		}
		if(nextX == rowWidth) // Right
		{
			if(loader[3] != 0)
			{
				currentLevelNumber += loader[3];
				console.log("Loading Level: " + currentLevelNumber);
				nextLevel();
			}
		}
	}
}



// IV. EVENTS
function setupEvents(){
	window.onmouseup = (e) => {
		e.preventDefault();
		gridClicked(e);
	};
	
	window.onkeydown = (e)=>{
		//console.log("keydown=" + e.keyCode);

		// checking for other keys - ex. 'p' and 'P' for pausing
		var char = String.fromCharCode(e.keyCode);
		if (char == "p" || char == "P"){
		
		}
		movePlayer(e);
		drawGameObjects(currentGameObjects);
	};
}

function gridClicked(e){
	let rect = container.getBoundingClientRect();
	let mouseX = e.clientX - rect.x;
	let mouseY = e.clientY - rect.y;
	let columnWidth = cellWidth+cellSpacing;
	let col = Math.floor(mouseX/columnWidth);
	let row = Math.floor(mouseY/columnWidth);
	console.log(`${col},${row}`);
}