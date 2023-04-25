// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

// pre-load the images (this code works with PIXI v6)
app.loader.
    add([
        "images/spaceship.png",
        "images/explosions.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// pre-load the images (this code works with PIXI v7)
// let assets;
// loadImages();
// async function loadImages(){
// // https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide#-replaces-loader-with-assets
// // https://pixijs.io/guides/basics/assets.html
// PIXI.Assets.addBundle('sprites', {
//   spaceship: 'images/spaceship.png',
//   explosions: 'images/explosions.png',
//   move: 'images/move.png'
// });
//
// assets = await PIXI.Assets.loadBundle('sprites');
// setup();
// }

// aliases
let stage;

// game variables
let startScene;
let gameScene,ship,scoreLabel,finalScoreLabel,lifeLabel,shootSound,hitSound,fireballSound;
let gameOverScene;

let circles = [];
let bullets = [];
let aliens = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

function setup() {
	stage = app.stage;
	// #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

	// #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

	// #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

    // #5 - Create ship
    ship = new Ship();
    gameScene.addChild(ship);

    // #6 - Load Sounds
    shootSound = new Howl({
        src: ['sounds/shoot.wav']
    });

    hitSound = new Howl({
        src: ['sounds/hit.mp3']
    });

    fireballSound = new Howl({
        src: ['sounds/fireball.mp3']
    });

    // #7 - Load sprite sheet
    explosionTextures = loadSpriteSheet();

    // #8 - Start update loop
    app.ticker.add(gameLoop);

    // #9 - Start listening for click events on the canvas
    app.view.onclick = fireBullet;

	// Now our `startScene` is visible
	// Clicking the button calls startGame()
}


function createLabelsAndButtons()
{
    let buttonStyle = new PIXI.TextStyle
    ({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Futura"

    });

    // 1 - set up `startScene`
    // 1A
    let startLabel1 = new PIXI.Text("Circle Blast!");
    startLabel1.style = new PIXI.TextStyle
    ({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = 50;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    // 1b
    let startLabel2 = new PIXI.Text("R U worthy..?");
    startLabel2.style = new PIXI.TextStyle
    ({
        fill: 0xFFFFFF,
        fontSize: 32,
        fontFamily: "Futura",
        fontStyle: "italic",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    // 1c
    let startButton = new PIXI.Text("Enter, ... if you dare!");
    startButton.style = buttonStyle;
    startButton.x = 80;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame); // startGame is a function ref
    startButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow functions with no brackets
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto lol :]
    startScene.addChild(startButton);

    // 2 - set up `gamescene`
    let textStyle = new PIXI.TextStyle
    ({
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    // 2A
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    // 2B
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    // 3 - set up `gameOverScene`
    // 3A - make game over text
    let gameOverText = new PIXI.Text("Game Over!\n        :-O");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    // Make Final Score Label
    finalScoreLabel = new PIXI.Text();
    finalScoreLabel.style = textStyle;
    finalScoreLabel.x = 100;
    finalScoreLabel.y = sceneHeight / 2 + 10;
    gameOverScene.addChild(finalScoreLabel);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 150;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup",startGame); // startGame is a function reference
    playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(playAgainButton);
}

function startGame()
{
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    // .. more to come
    levelNum = 1;
    score = 0;
    life = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    ship.x = 300;
    ship.y = 550;
    loadLevel();
}

function increaseScoreBy(value)
{
    score += value;
    scoreLabel.text = `Score ${score}`;
}

function decreaseLifeBy(value)
{
    life -= value;
    life = parseInt(life);
    lifeLabel.text = `Life      ${life}%`;
}

function createCircles(numCircles)
{
    for(let i=0; i < numCircles; i++)
    {
        let c = new Circle(10, 0xFFFF00);
        c.x = Math.random() * (sceneWidth - 50) + 25;
        c.y = Math.random() * (sceneHeight - 400) + 25;
        circles.push(c);
        gameScene.addChild(c); 
    }
}

function loadLevel()
{
	createCircles(levelNum * 5);

	paused = false;
}

function end()
{
    
    paused = true;
    // clear out level
    circles.forEach(c=>gameScene.removeChild(c)); // concise arrow function
    circles = [];

    bullets.forEach(b=>gameScene.removeChild(b)); // ditto :]
    bullets = [];

    explosions.forEach(e=>gameScene.removeChild(e)); // ditto :]
    explosions = [];

    gameOverScene.visible = true;
    gameScene.visible = false;

    // Set Final Score
    finalScoreLabel.text = `Final Score: ${score}`;
}

function fireBullet(e)
{
    if (paused) return;

    if(score < 5)
    {
        let b = new Bullet(0xFFFFFF, ship.x, ship.y);
        bullets.push(b);
        gameScene.addChild(b);
    }else // Triple Shot
    {
        for (let i = -1; i < 2; i++) {

            let b = new Bullet(0xFFFFFF, ship.x + (i * 10), ship.y);
            bullets.push(b);
            gameScene.addChild(b);
        }
    }

    shootSound.play();
}

function tripleBullet(e)
{
    if (paused) return;



    shootSound.play();
}

function loadSpriteSheet()
{
    let spriteSheet = PIXI.BaseTexture.from("images/explosions.png");
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];
    for (let i = 0; i < numFrames; i++)
    {
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 64, width, height));
        textures.push(frame);
    }
    return textures;
}

function createExplosion(x, y, frameWidth, frameHeight)
{
    let w2 = frameWidth / 2;
    let h2 = frameHeight / 2;
    let expl = new PIXI.AnimatedSprite(explosionTextures);
    expl.x = x - w2;
    expl.y = y - h2; // ditto :]
    expl.animationSpeed = 1 / 7;
    expl.loop = false;
    expl.onComplete = e => gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}

function gameLoop()
{
	if (paused) return; // keep this commented out for now
	
    // #1 - Calculate "delta time"
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;
	
    // #2 - Move Ship
    let mousePosition = app.renderer.plugins.interaction.mouse.global;
    //ship.position = mousePosition;

    let amt = 6 * dt; // at 60 FPS would move about 10% of distance per update
    
    // lerp (linerar interpolate) the x & y values with lerp()
    let newX = lerp(ship.x, mousePosition.x, amt);
    let newY = lerp(ship.y, mousePosition.y, amt);

    // keep the ship on the screen with clamp()
    let w2 = ship.width/2;
    let h2 = ship.height/2;
    ship.x = clamp(newX,0+w2, sceneWidth-w2);
    ship.y = clamp(newY,0+h2, sceneHeight-h2);

	
	// #3 - Move Circles
    for (let c of circles)
    {
        c.move(dt);
        if (c.x <= c.radius || c.x >= sceneWidth - c.radius)
        {
            c.reflectX();
            c.move(dt);
        }

        if(c.y <= c.radius || c.y >= sceneHeight - c.radius)
        {
            c.reflectY();
            c.move(dt);
        }
    }
	
    // #4 - Move Bullets
	for (let b of bullets){
		b.move(dt);
	}
	
	// #5 - Check for Collisions
	for (let c of circles)
    {
        for (let b of bullets)
        {
        // #5A - circles & bullets
        if (rectsIntersect(c,b))
        {
            fireballSound.play();
            createExplosion(c.x, c.y, 64, 64); // Soon
            gameScene.removeChild(c);
            c.isAlive = false;
            gameScene.removeChild(b);
            b.isAlive = false;
            increaseScoreBy(1);
        }
        
            if(b.y < -10) b.isAlive = false;
        }
    
        // #5B - circles & ship
        if(c.isAlive && rectsIntersect(c,ship))
        {
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(20);
        }
    }
	
	// #6 - Now do some clean up
    bullets = bullets.filter(b=>b.isAlive);

    circles = circles.filter(c=>c.isAlive);
    
    explosions = explosions.filter(e=>e.playing);
	
    // #7 - Is game over?
    if (life <= 0)
    {
        end();
        return; // return here so we skip #8 below
    }
	
    // #8 - Load next level
    if (circles.length == 0){
        levelNum ++;
        loadLevel();
    }
}