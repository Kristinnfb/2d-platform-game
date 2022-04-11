//--- config  ---//
window.addEventListener('load', () => {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');
    initiateWindow();
});

window.addEventListener('resize', initiateWindow);

//--- images  ---//
// let scoreElement = document.createElement('span');

let backgroundImage = new Image();
backgroundImage.src = "./assets/background2.png";

let platformImage = new Image();
platformImage.src = "assets/level-two-left.png";

let ladderImage = new Image();
ladderImage.src = "assets/stairs.png";

let doorImage = new Image();
doorImage.src = "assets/door.png";

let scoreBoardImage = new Image();
scoreBoardImage.src = "assets/score-board.png";

let playerImage = new Image();
playerImage.src = "assets/characters.png";

let enemyImage = new Image();
enemyImage.src = "assets/Enemy.png";

let skyTwo = new Image();
skyTwo.src = "assets/sky-2.png";
let skyOne = new Image();
skyOne.src = "assets/sky-1.png";



//--- data variables  ---//
let canvas, ctx;
let canvasWidth, canvasHeight, windowWidth, windowHeight;
const canvasRatio = 650 / 700; //  background image width / height
const platformMaxLevel = 6;
const platformTopMarginRatio = 0.1127
const ladderWidthRatio = 0.048;
const groundHeightRatio = 0.052;
let animationId = 0;
let score = 0;
let enemyWidth = 0;
let enemyHeight = 0;
let playerWidth = 0;
let playerHeight = 0;
let enemies = [];
let failed = false;
let win = false;
let player;

//classes
class Enemy {
    constructor(x, y, maxLeft, maxRight) {
        this.x = x;
        this.y = y;
        this.speed = randomSpeed(2, 5);
        this.moving = true;
        this.direction = randomSpeed(1,3) == 1 ? 1 : -1;
        this.maxLeft = maxLeft;
        this.maxRight = maxRight;
        this.responsiveWidth = enemyWidth;
        this.responsiveHeight = enemyHeight;
    }

    move() {
        if (this.moving && !isEnd()) {
            this.x += this.speed * this.direction;
            if (this.x >= (this.maxRight - enemyWidth) || this.x <= this.maxLeft) {
                this.direction *= -1;
            }
        }
        drawEnemy(this.x, this.y);
    }

    checkPlayerHit() {
        if (!player) return false;
        if(hitX(this.x,this.responsiveWidth) && hitY(this.y,this.responsiveHeight)){
            failed = true;
        }
    }
}

function hitX(x,width){
    return false;
    return (x <= player.x + player.responsiveWidth || x + width >= player.x);
}

function hitY(y,height){
    return true;
    return (y <= player.y + player.responsiveHeight || y + height >= player.y);
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 6;
        this.direction = 1;
        this.responsiveWidth = playerWidth;
        this.responsiveHeight = playerHeight;
        this.width = 48;
        this.height = 48;
        this.frameX = 0;
        this.frameY = 0;
        this.velocity_x = 0;
        this.velocity_y = 1;
        this.moving = false;
        this.jumping = false;
    }

    jump() {

    }

    move() {

    }
}


const platforms = [
    {
        //one left
        x: 0,
        level: 1,
        width: 0.14
    },
    {
        //one right
        x: 0.30,
        level: 1,
        width: 0.697
    },
    {
        // two left
        x: 0,
        level: 2,
        width: 0.63
    },
    {
        // three right
        x: 0.75,
        level: 3,
        width: 0.145
    },
    {
        // four left
        x: 0,
        level: 4,
        width: 0.34
    },
    {
        // five left
        x: 0.5,
        level: 5,
        width: 0.34
    },
    {
        // top
        x: 0,
        level: 6,
        width: 1
    },
];

const ladders = [
    {
        x: 0.05,
        form: 1,
        to: 2
    },
    {
        x: 0.79 + ladderWidthRatio,
        form: 3,
        to: 5
    },
    {
        x: 0.6,
        form: 5,
        to: 6
    }
];

const enemyPositions = [
    {
        x: 0.1,
        level: 2,
        min: 0,
        max: 0.63
    },
    // {
    //     x: 0.05,
    //     level: 4,
    //     min: 0,
    //     max: 0.34
    // },
    // {
    //     x: 0.52,
    //     level: 5,
    //     min: 0.5,
    //     max: 0.34 + 0.5
    // },
    // {
    //     x: 0.4,
    //     level: 6,
    //     min: 0,
    //     max: 1
    // }
];

const keys = [];
let gravity = 10;
let platform = {
    x: platforms.x,
    y: platforms.y,
    width: platforms.width,
    height: platforms.height
};




let enemy = {
    x: 200,
    y: 300,
    width: 48,
    height: 48,
    frameX: 0,
    frameY: 0,
    speed: 1,
    velocity_y: 5,
    gravity: 1,
    moving: true,
    responsiveWidth: 48,
    responsiveHeight: 48,
};



// initiate
function initiateWindow() {
    setVariables();
    setDimensions();
    setCanvas();
    setPlayerResponsive();
    setEnemyResponsive();
    drawBackground();
    drawPlatform();
    initiatePlayer();
    initiateEnemies();
    renderAnimation();
}

function setDimensions() {
    //set window dimensions
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    //set canvas dimensions
    canvasWidth = windowWidth * 0.48;
    canvasHeight = canvasWidth * canvasRatio;
}

function setCanvas() {
    if (!canvas) return false;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

function setVariables(){
    failed = false;
    win = false;
    enemies = [];
}

function randomSpeed(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function setPlayerResponsive() {
    let ratio = playerImage.height / playerImage.width;
    let width = canvasWidth * 0.12;
    let height = width * ratio;
    playerWidth = width;
    playerHeight = height;
}

function setEnemyResponsive() {
    let ratio = enemyImage.height / enemyImage.width;
    let width = canvasWidth * 0.07;
    let height = width * ratio * 3;
    enemyWidth = width;
    enemyHeight = height;
}

function initiatePlayer() {
    player = new Player(10, canvasHeight - playerHeight - getGroundHeightByRatio());
}

function drawBackground() {
    ctx.drawImage(
        backgroundImage,
        0,
        0,
        canvasWidth,
        canvasHeight
    );
}

function drawPlatform() {
    drawGrounds();
    drawLadders();
    drawDoor();
    drawScoreBoard();
}

function drawGrounds() {
    platforms.forEach((item, index) => {
        let x = getXByRatio(item.x);
        let y = getYByLevel(item.level);
        let width = getWidthByRatio(item.width);
        let height = getGroundHeightByRatio();
        ctx.drawImage(
            platformImage,
            x,
            y,
            width,
            height
        );
    });
}

function drawLadders() {
    ladders.forEach((item, index) => {
        let x = getLadderX(item.x);
        let y = getLadderY(item.form);
        let width = getLadderWidth();
        let height = getLadderHeight(item.form, item.to);
        ctx.drawImage(
            ladderImage,
            x,
            y,
            width,
            height
        );
    });
}

function initiateEnemies() {
    enemies = [];
    enemyPositions.forEach((item, index) => {
        let enemyObject = new Enemy(getEnemyX(item.x), getEnemyY(item.level), getDistanceByCanvasWidth(item.min), getDistanceByCanvasWidth(item.max));
        enemies.push(enemyObject);
    });
}

function moveEnemies() {
    enemies.forEach((item, index) => {
        item.move();
        item.checkPlayerHit();
    });
}

function drawEnemy(x, y) {
    ctx.drawImage(
        enemyImage,
        enemy.width * enemy.frameX,
        enemy.height * enemy.frameY,
        enemy.width,
        enemy.height,
        x,
        y,
        enemy.responsiveWidth,
        enemy.responsiveHeight
    );
}

function drawDoor() {
    let ratio = doorImage.height / doorImage.width;
    let width = canvasWidth * 0.0763;
    let height = width * ratio;
    ctx.drawImage(
        doorImage,
        canvasWidth * 0.05,
        getYByLevel(platformMaxLevel) - height,
        width,
        height
    );
}

function drawScoreBoard() {
    let ratio = scoreBoardImage.height / scoreBoardImage.width;
    let width = canvasWidth * 0.0763;
    let height = width * ratio;

    ctx.drawImage(
        scoreBoardImage,
        canvasWidth * 0.9,
        0,
        width,
        height
    );
}

function drawPlayer() {
    ctx.drawImage(
        playerImage,
        player.width * player.frameX,
        player.height * player.frameY,
        player.width,
        player.height,
        player.x,
        player.y,
        player.responsiveWidth,
        player.responsiveHeight
    );
}


// responsive values
function getYByLevel(level) {
    return canvasHeight - (canvasHeight / platformMaxLevel * level) + (canvasHeight * platformTopMarginRatio);
}

function getDistanceByCanvasWidth(value) {
    return canvasWidth * value;
}

function getXByRatio(x) {
    return getDistanceByCanvasWidth(x);
}

function getWidthByRatio(width) {
    return getDistanceByCanvasWidth(width);
}

function getGroundHeightByRatio() {
    return canvasHeight * groundHeightRatio;
}

function getLadderX(x) {
    return getDistanceByCanvasWidth(x);
}

function getEnemyX(x) {
    return getDistanceByCanvasWidth(x);
}

function getEnemyY(level) {
    return getYByLevel(level) - enemyHeight - 10;
}

function getLadderY(from) {
    return getYByLevel(from);
}

function getLadderWidth() {
    return canvasWidth * ladderWidthRatio;
}

function getLadderHeight(from, to) {
    return getYByLevel(to) - getYByLevel(from);
}


//player moves
function moveUp() {
    player.y -= player.speed;
    player.frameY = 4;
    player.moving = true;
    console.log('up');
}

function moveLeft() {
    player.x -= player.speed;
    player.frameY = 3;
    player.moving = true;
    console.log('left');
}

function moveRight() {
    player.x += player.speed;
    player.frameY = 2;
    player.moving = true;
    console.log('right');
}

function moveDown() {
    player.y += player.speed;
    player.frameY = 4;
    player.moving = true;
    console.log('down');
}

function jump() {
    player.y -= gravity
    player.frameY = 2;
    player.moving = true;
    player.jumping = true;
    console.log('jump')
}


// function drawLadder(img, sX, sY, sW, sH, dX, dY, dW, dH) {
//     ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
// }

window.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    player.moving = true;
    player.jumping = true;
});
window.addEventListener("keyup", function (e) {
    delete keys[e.keyCode];
    player.moving = false;
    player.jumping = false;
});


function movePlayer() {
    if (player.x >= 220 && player.x <= 400) {
        player.y += gravity
    }

    if (keys[38]) {
        // && player.x >= ladders.x && 
        // player.x <= (ladders.x + ladders.width) && 
        // player.y === ladders.y)        
        moveUp();
    }
    if (keys[37] && player.x > 0) {
        moveLeft();
    }
    if (keys[40] && player.y <= 0) {
        moveDown();
    }
    if (keys[39] && player.x < canvas.width - player.width) {
        moveRight();
    }
    if (keys[32] && player.jumping == false) {
        jump();
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

function touchGround() {
    if (player.x > platform.x + platform.width) return false;
    if (player.x + player.width < platform.x) return false;
    if (player.y > platform.y + platform.height) return false;
    if (player.y + player.height < platform.y) return false;
    return true;
}

function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackground();
    drawPlatform();
    drawPlayer();
    moveEnemies();
    movePlayer();
    handlePlayerFrame();
    handleEnemyFrame();
    let result = isEnd();
    if (result) {
        // stop animation when player wins or loose
        window.cancelAnimationFrame(animationId);
        return showFail();
    }
}

function renderAnimation(){
    if(isEnd()) return false;
    if(animationId % 5 == 0){
        animate();
    }
    animationId = window.requestAnimationFrame(renderAnimation);
}



function isEnd() {
    if (failed) {
        return true;
    }
    return false;
}

function showWinAlert() {
    initiateWindow();
    console.log('win');
}

function showFail() {
    initiateWindow();
    console.log('Failed');
    return false;
}

