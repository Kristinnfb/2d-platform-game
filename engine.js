//--- config  ---//
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

function setCanvas(){
    canvas.width = 650;
    canvas.height = 700;
}

window.addEventListener('resize', setCanvas());

//--- data  ---//
const keys = [];
let platforms = [];
let enemies = [];
let ladders = [];
let gravity = 10;

let platform = {
    x: platforms.x,
    y: platforms.y,
    width: platforms.width,
    height: platforms.height
};

let player = {
    jumping: false,
    width: 48,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: 9,
    velocity_x: 0,
    velocity_y: 1,
    x: 10,
    y: 620,
    moving: false
};

let enemy = {
    x: 200,
    y: 300,
    width: 48,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: 9,
    velocity_y: 5,
    gravity: 1,
    moving: true
};




//--- images  ---//
let playerSprite = new Image();
let enemySprite = new Image();

let btmLvlLeft = new Image();
let btmLvlRight = new Image();
let lvlTwoLeft = new Image();
let lvlTwoRight = new Image();
let lvlThree = new Image();
let lvlFour = new Image();
let lvlFive = new Image();
let lvlSix = new Image();
let topLvl = new Image();
let skyTwo = new Image();
let skyOne = new Image();
let scoreBoard = new Image();
let door = new Image();
let ladder = new Image();

function loadPlayer(){
    playerSprite.src = "assets/characters.png"; 
}
loadPlayer();

function loadEnemy(){
    enemySprite.src = "assets/Enemy.png"; 
}
loadEnemy();

// Hér setjum við inn alla fleka og stiga sem búa til leikborðið.
function loadPlatform(){
    btmLvlLeft.src = "assets/bottom-level-left.png";
    btmLvlRight.src = "assets/bottom-level-right.png";
    lvlTwoLeft.src = "assets/level-two-left.png";
    lvlTwoRight.src = "assets/level-two-right-floor.png";
    lvlThree.src = "assets/level-three.png";
    lvlFour.src = "assets/level-four.png";
    lvlFive.src = "assets/level-five.png";
    lvlSix.src = "assets/level-six.png";
    topLvl.src = "assets/top-level-floor.png";
    skyTwo.src = "assets/sky-2.png";
    skyOne.src = "assets/sky-1.png";
    scoreBoard.src = "assets/score-board.png";
    door.src = "assets/door.png";
    ladder.src = "assets/stairs.png";
}
loadPlatform();
 

function drawPlayer(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);

}

function drawEnemy(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function drawPlatform(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

// function drawLadder(img, sX, sY, sW, sH, dX, dY, dW, dH) {
//     ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
// }

window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    player.moving = true;
    player.jumping = true;
});
window.addEventListener("keyup", function(e) {
    delete keys[e.keyCode];
    player.moving = false;
    player.jumping = false;
});

function moveEnemy() {
    // enemies.x -= enemies.speed;
    //     enemies.frameY = 0;

    //     console.log('left');
    // }
    // if (enemy.y < canvas.height - enemy.height) {
    //     enemy.y += enemy.speed;
    //     enemy.frameY = 0;
    //     enemy.moving = true;
    //     console.log('down');
    // }
    if (enemy.x < canvas.width - enemy.width) {
        enemy.x += enemy.speed;
        enemy.frameY = 0;
        
        console.log('right');
    }};

function movePlayer() {
    if (player.x >= 220 && player.x <= 400){
        player.y += gravity
    }

    if (keys[38] ) {
        // && player.x >= ladders.x && 
        // player.x <= (ladders.x + ladders.width) && 
        // player.y === ladders.y)        
        player.y -= player.speed;
        player.frameY = 4;
        player.moving = true;
        console.log('up');
    }
    if (keys[37] && player.x > 0) {
        player.x -= player.speed;
        player.frameY = 3;
        player.moving = true;
        console.log('left');
    }
    if (keys[40] && player.y <= 0 ) {
        player.y += player.speed;
        player.frameY = 4;
        player.moving = true;
        console.log('down');
    }
    if (keys[39] && player.x < canvas.width - player.width) {
        player.x += player.speed;
        player.frameY = 2;
        player.moving = true;
        console.log('right');
    }
    if (keys[32] && player.jumping == false) {
        player.y -= gravity
        player.frameY = 2;
        player.moving = true;
        player.jumping = true;
        console.log('jump')
    }
}
function handlePlayerFrame() {
    if (player.frameX < 5 && player.moving) player.frameX++;
    else player.frameX = 0;
}

function handleEnemyFrame() {
    if (enemy.frameX < 3 && enemy.moving) enemy.frameX++;
    else enemy.frameX = 0;
}

function touchGround(){
    if (player.x > platform.x + platform.width) return false;
    if (player.x + player.width < platform.x) return false;
    if (player.y > platform.y + platform.height) return false;
    if (player.y + player.height < platform.y) return false;
        return true;
}
console.log('snerting');
// if (player.touchGround(platform)) 
// player.velocity_y = 0;


let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // player.y += gravity

        platforms[
            ctx.drawImage(btmLvlLeft, 0, 670, 256, 32),
            ctx.drawImage(btmLvlRight, 394, 670, 256, 32),
            ctx.drawImage(lvlTwoLeft, 0, 542, 96, 32),
            ctx.drawImage(lvlTwoRight, 202, 542, 448, 32),
            ctx.drawImage(lvlThree, 0, 422, 480, 32),
            ctx.drawImage(lvlFour, 522, 358, 64, 32),
            ctx.drawImage(lvlFive, 0, 294, 224, 32),
            ctx.drawImage(lvlSix, 332, 230, 224, 32),
            ctx.drawImage(topLvl, 0, 100, 650, 32),
            ctx.drawImage(skyTwo, 300, 340, 90, 32),
            ctx.drawImage(skyOne, 100, 200, 90, 32),
            ctx.drawImage(scoreBoard, 550, 20, 64, 32),
            ctx.drawImage(door, 10, 50, 45, 50)
        ]
        
        ladders [
            ctx.drawImage(ladder, 586, 542, 32, 128),
            ctx.drawImage(ladder, 459, 102, 32, 128),
            ctx.drawImage(ladder, 32, 422, 32, 128),
            ctx.drawImage(ladder, 554, 230, 32, 128)
        ]
            
            drawPlayer(playerSprite, 
                        player.width * player.frameX, 
                        player.height * player.frameY, 
                        player.width, player.height, 
                        player.x, player.y, player.width, player.height);
        enemies [    
            drawEnemy(enemySprite, 
                        enemy.width * enemy.frameX, 
                        enemy.height * enemy.frameY, 
                        enemy.width, enemy.height, 
                        400, 50, enemy.width, enemy.height),
            drawEnemy(enemySprite, 
                        enemy.width * enemy.frameX, 
                        enemy.height * enemy.frameY, 
                        enemy.width, enemy.height, 
                        490, 180, enemy.width, enemy.height),
            drawEnemy(enemySprite, 
                        enemy.width * enemy.frameX, 
                        enemy.height * enemy.frameY, 
                        enemy.width, enemy.height, 
                        60, 245, enemy.width, enemy.height),
            drawEnemy(enemySprite, 
                        enemy.width * enemy.frameX, 
                        enemy.height * enemy.frameY, 
                        enemy.width, enemy.height, 
                        300, 373, enemy.width, enemy.height),
            drawEnemy(enemySprite, 
                        enemy.width * enemy.frameX, 
                        enemy.height * enemy.frameY, 
                        enemy.width, enemy.height, 
                        190, 620, enemy.width, enemy.height),
            drawEnemy(enemySprite, 
                        enemy.width * enemy.frameX, 
                        enemy.height * enemy.frameY, 
                        enemy.width, enemy.height, 
                        500, 620, enemy.width, enemy.height)
        ]
            moveEnemy();
            movePlayer();
            handlePlayerFrame();
            handleEnemyFrame();
            // touchGround();
        }
    }
startAnimating(15); 