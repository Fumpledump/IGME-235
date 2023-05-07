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
	ROCK: 		5,
	FLOOR_GRASS:6,
	FLOOR_TREE:7,
	FLOOR_BOULDER:8,
	FLOOR_CLIFF:9,
	FLOOR_TREE_DEAD:10,
	DUNGEON_ENTRANCE:11,
	DUNGEON_TOP:12,
	GRASS_CLIFF:13,
	GRASS_TREE:14,
	GRASS_BOULDER:15,
	GRASS_FLOWERS_RED:16,
	GRASS_FLOWERS_YELLOW:17,
	GROUND_CLIFF:18,
	GROUND_GRASS:19,
	GROUND_BOULDER:20,
	GROUND_DOOR:21,
	GROUND_WAVE:22,
	GROUND_SHIELD:23,
	ROCK_CLIFF:24,
	ROCK_TREE:25,
	ROCK_GRASS:26,
	ROCK_WAVE:27,
	GRASS_GRASS:28,
	DUNGEON_ROCKS:29,
	DUNGEON_STAIRS:30,
	DUNGEON_LUMP:31,
	DUNGEON_HAMMER:32,
	DUNGEON_BLOOD:33,
	WALL_GLOW:34,
	WALL_BOOKS:35,
	WALL_DOOR:36,
	WALL_TIMER:37,
	WALL_EYE:38,
	WALL_LOCKED:39,
	WALL_MOUSE:40,
	GROUND_TREE:41,
	WIRE_1:42,
	WIRE_2:43,
	WIRE_3:44,
	WIRE_4:45,
	WIRE_5:46,
	WIRE_6:47,
	WIRE_7:48,
	WIRE_8:49,
	WIRE_9:50,
	WIRE_10:51,
	WIRE_11:52,
	WIRE_12:53,
	WIRE_13:54,
	WIRE_14:55,
	WIRE_15:56,
	WIRE_16:57,
	WIRE_17:58,
	WIRE_18:59,
	WIRE_19:60,
	WIRE_20:61,
	WIRE_21:62,
	WIRE_22:63,
	WIRE_23:64,
	WIRE_24:65,
	WIRE_25:66,
	WIRE_26:67,
	WIRE_27:68,
	WIRE_28:69,
	WIRE_29:70,
	DUNGEON_STAIRS_FLIPPED:71,
	DEBUG:	1000
});

// the "grunt" sound that plays when the player attempts to move into a wall or water square
let effectAudio = undefined;
let themeSong = undefined;


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
	themeSong = document.querySelector("#themeSong");
	themeSong.volume = 0.2;
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

				case worldTile.FLOOR_GRASS:
					element.classList.add("floor_grass");
				break;

				
				case worldTile.FLOOR_TREE:
					element.classList.add("floor_tree");
				break;

				case worldTile.FLOOR_BOULDER:
					element.classList.add("floor_boulder");
				break;

				case worldTile.FLOOR_CLIFF:
					element.classList.add("floor_cliff");
				break;

				case worldTile.FLOOR_TREE_DEAD:
					element.classList.add("floor_dead_tree");
				break;

				
				case worldTile.DUNGEON_ENTRANCE:
					element.classList.add("dungeon_entrance");
				break;

				
				case worldTile.DUNGEON_TOP:
					element.classList.add("dungen_top");
				break;

				case worldTile.GRASS_CLIFF:
					element.classList.add("grass_cliff");
				break;
				case worldTile.GRASS_TREE:
					element.classList.add("grass_tree");
				break;
				case worldTile.GRASS_BOULDER:
					element.classList.add("grass_boulder");
				break;
				case worldTile.GRASS_FLOWERS_RED:
					element.classList.add("grass_flowers_red");
				break;
				case worldTile.GRASS_FLOWERS_YELLOW:
					element.classList.add("grass_flowers_yellow");
				break;
				case worldTile.GROUND_CLIFF:
					element.classList.add("ground_cliff");
				break;
				case worldTile.GROUND_GRASS:
					element.classList.add("ground_grass");
				break;
				case worldTile.GROUND_BOULDER:
					element.classList.add("ground_boulder");
				break;
				case worldTile.GROUND_DOOR:
					element.classList.add("ground_door");
				break;
				case worldTile.GROUND_WAVE:
					element.classList.add("ground_wave");
				break;
				case worldTile.GROUND_SHIELD:
					element.classList.add("ground_shield");
				break;
				case worldTile.ROCK_CLIFF:
					element.classList.add("rock_cliff");
				break;
				case worldTile.ROCK_TREE:
					element.classList.add("rock_tree");
				break;
				case worldTile.ROCK_GRASS:
					element.classList.add("rock_grass");
				break;
				case worldTile.ROCK_WAVE:
					element.classList.add("rock_wave");
				break;
				case worldTile.GRASS_GRASS:
					element.classList.add("grass_grass");
				break;
				case worldTile.DUNGEON_ROCKS:
					element.classList.add("dungeon_rocks");
				break;
				case worldTile.DUNGEON_STAIRS:
					element.classList.add("dungeon_stairs");
				break;
				case worldTile.DUNGEON_LUMP:
					element.classList.add("dungeon_lump");
				break;
				case worldTile.DUNGEON_HAMMER:
					element.classList.add("dungeon_hammer");
				break;
				case worldTile.DUNGEON_BLOOD:
					element.classList.add("dungeon_blood");
				break;
				case worldTile.WALL_GLOW:
					element.classList.add("wall_glow");
				break;
				case worldTile.WALL_BOOKS:
					element.classList.add("wall_books");
				break;
				case worldTile.WALL_DOOR:
					element.classList.add("wall_door");
				break;
				case worldTile.WALL_TIMER:
					element.classList.add("wall_timer");
				break;
				case worldTile.WALL_EYE:
					element.classList.add("wall_eye");
				break;
				case worldTile.WALL_LOCKED:
					element.classList.add("wall_locked");
				break;
				case worldTile.WALL_MOUSE:
					element.classList.add("wall_mouse");
				break;
				case worldTile.GROUND_TREE:
					element.classList.add("ground_tree");
				break;
				case worldTile.WIRE_1:
					element.classList.add("wire_1");
				break;
				case worldTile.WIRE_2:
					element.classList.add("wire_2");
				break;
				case worldTile.WIRE_3:
					element.classList.add("wire_3");
				break;
				case worldTile.WIRE_4:
					element.classList.add("wire_4");
				break;
				case worldTile.WIRE_5:
					element.classList.add("wire_5");
				break;
				case worldTile.WIRE_6:
					element.classList.add("wire_6");
				break;
				case worldTile.WIRE_7:
					element.classList.add("wire_7");
				break;
				case worldTile.WIRE_8:
					element.classList.add("wire_8");
				break;
				case worldTile.WIRE_9:
					element.classList.add("wire_9");
				break;
				case worldTile.WIRE_10:
					element.classList.add("wire_10");
				break;
				case worldTile.WIRE_11:
					element.classList.add("wire_11");
				break;
				case worldTile.WIRE_12:
					element.classList.add("wire_12");
				break;
				case worldTile.WIRE_13:
					element.classList.add("wire_13");
				break;
				case worldTile.WIRE_14:
					element.classList.add("wire_14");
				break;
				case worldTile.WIRE_15:
					element.classList.add("wire_15");
				break;
				case worldTile.WIRE_16:
					element.classList.add("wire_16");
				break;
				case worldTile.WIRE_17:
					element.classList.add("wire_17");
				break;
				case worldTile.WIRE_18:
					element.classList.add("wire_18");
				break;
				case worldTile.WIRE_19:
					element.classList.add("wire_19");
				break;
				case worldTile.WIRE_20:
					element.classList.add("wire_20");
				break;
				case worldTile.WIRE_21:
					element.classList.add("wire_21");
				break;
				case worldTile.WIRE_22:
					element.classList.add("wire_22");
				break;
				case worldTile.WIRE_23:
					element.classList.add("wire_23");
				break;
				case worldTile.WIRE_24:
					element.classList.add("wire_24");
				break;
				case worldTile.WIRE_25:
					element.classList.add("wire_25");
				break;
				case worldTile.WIRE_26:
					element.classList.add("wire_26");
				break;
				case worldTile.WIRE_27:
					element.classList.add("wire_27");
				break;
				case worldTile.WIRE_28:
					element.classList.add("wire_28");
				break;
				case worldTile.WIRE_29:
					element.classList.add("wire_29");
				break;
				case worldTile.DUNGEON_STAIRS_FLIPPED:
					element.classList.add("dungeon_stairs_flipped");
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

		if(nextTile == worldTile.DUNGEON_ENTRANCE)
		{
			enterDungeon();
		}else if(nextTile == worldTile.DUNGEON_STAIRS || nextTile == worldTile.DUNGEON_STAIRS_FLIPPED)
		{
			exitDungeon();
		}else if (nextTile != worldTile.GRASS && 
			nextTile != worldTile.GROUND && 
			nextTile != worldTile.ROCK && 
			nextTile != worldTile.WALL_GLOW && 
			nextTile != worldTile.WALL
			){
			checkLoader(nextX,nextY);
			return true;
		}else{
			effectAudio.play();
			//checkLoader(nextX,nextY);
			return false;
		}
	}

	function checkLoader(nextX,nextY){
		let loader = gameworld["levelLoader" + currentLevelNumber];

		const rowWidth = currentGameWorld[0].length - 1; // get the length of the first row
		const columnHeight = currentGameWorld.length - 1; // get the number of rows in the array

		if(nextY == 0) // Up
		{
			if(loader[0] != 0)
			{
				currentLevelNumber += loader[0];
				nextLevel();
			}
		}
		if(nextY == columnHeight) // Down
		{
			if(loader[1] != 0)
			{
				currentLevelNumber += loader[1];
				nextLevel();
			}
		}
		if(nextX == 0) // Left
		{
			if(loader[2] != 0)
			{
				currentLevelNumber += loader[2];
				nextLevel();
			}
		}
		if(nextX == rowWidth) // Right
		{
			if(loader[3] != 0)
			{
				currentLevelNumber += loader[3];
				nextLevel();
			}
		}
	}
	function enterDungeon()
	{
		// Play Song
		themeSong.loop = true;
		themeSong.play();

		// Load Level
		currentLevelNumber++;
		nextLevel();
		
	}
	function exitDungeon()
	{
		// Stop Theme Song
		themeSong.pause();
		themeSong.currentTime = 0;


		// Load Level
		currentLevelNumber--;
		nextLevel();
	}
}



// IV. EVENTS
function setupEvents(){
	window.onmouseup = (e) => {
		e.preventDefault();
		gridClicked(e);
	};
	
	window.onkeydown = (e)=>{

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
}