//--- config  ---//
window.addEventListener('load', () => {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');
    initiateWindow();
});

window.addEventListener('resize', initiateWindow);

//--- images  ---//

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
const enemyImageAspectRatio = 0.583;
const playerImageAspectRatio = 1;
const jumpSpeed = 0.5;
let maxJumpHeight = 0;
let animationId = 0;
let score = 0;
let enemyWidth = 0;
let enemyHeight = 0;
let playerWidth = 0;
let playerHeight = 0;
let enemies = [];
let ladders = [];
let failed = false;
let win = false;
let player;
let playerLeft;
let playerRight;
let playerTop;
let playerBottom;
let doorLeft = 0;
let doorRight = 0;
let doorBottom = 0;

//classes
class Enemy {
    constructor(x, y, maxLeft, maxRight) {
        this.x = x;
        this.y = y;
        this.speed = randomSpeed(2, 5);
        this.moving = true;
        this.direction = randomSpeed(1, 3) == 1 ? 1 : -1;
        this.maxLeft = maxLeft;
        this.maxRight = maxRight;
        this.responsiveWidth = enemyWidth;
        this.responsiveHeight = enemyHeight;
        this.width = 48;
        this.height = 48;
        this.frameX = 0;
        this.frameY = 0;
        this.velocity_y = 5;
    }

    move() {
        if (this.moving && !isEnd()) {
            this.x += this.speed * this.direction;
            if (this.x >= (this.maxRight - enemyWidth) || this.x <= this.maxLeft) {
                this.direction *= -1;
            }
        }
        drawEnemy(this);
        this.handleFrame();
        this.checkPlayerHit();
    }

    handleFrame() {
        if (this.frameX < 3 && this.moving) this.frameX++;
        else this.frameX = 0;
    }

    checkPlayerHit() {
        if (!player) return false;
        if (hitX(this) && hitY(this)) {
            failed = true;
            this.moving = false;
        }
    }
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
        this.jumped = 0;
    }

    handleFrame() {
        if (this.frameX < 5 && this.moving) this.frameX++;
        else this.frameX = 0;
    }

    //player moves
    moveUp() {
        if(!isPlayerOnLadder('bottom')) return false;
        this.y -= this.speed;
        this.frameY = 4;
        this.moving = true;
        setPlayerValues(this);
        // Red rectangle

        
    }

    moveLeft() {
        this.x -= this.speed;
        this.frameY = 3;
        this.moving = true;
        setPlayerValues(this);
    }

    moveRight() {
        this.x += this.speed;
        this.frameY = 2;
        this.moving = true;
        setPlayerValues(this);
    }

    moveDown() {
        if(!isPlayerOnLadder('top')) return false;
        this.y += this.speed;
        this.frameY = 4;
        this.moving = true;
        setPlayerValues(this);
    }

    jump() {
        this.jumping = true;
        this.frameY = 2;
        this.moving = true;
    }

    animate(){
        // if(this.jumping){
        //     if(this.jumped < maxJumpHeight){
        //         this.y -= jumpSpeed;
        //     }
        //     else{
        //         this.y += jumpSpeed;
        //     }
        //     this.jumped++;
        //     if(this.jumped <= 0) this.jumping = false;
        // }
        drawPlayer();
    }
}

function hitX(enemy) {
    let tolerance = -getDistanceByCanvasWidth(0.045);
    let enemyRight = enemy.x + enemy.responsiveWidth;
    let enemyLeft = enemy.x;
    return  checkCoordinatesMerge(playerLeft,playerRight,enemyLeft,enemyRight,tolerance);
}

function hitY(enemy) {
    let tolerance = -getDistanceByCanvasWidth(0.025);
    let enemyBottom = enemy.y + enemy.responsiveHeight;
    let enemyTop = enemy.y;
    return checkCoordinatesMerge(playerTop,playerBottom,enemyTop,enemyBottom,tolerance);
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

const laddersPositions = [
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
    {
        x: 0.05,
        level: 4,
        min: 0,
        max: 0.34
    },
    {
        x: 0.52,
        level: 5,
        min: 0.5,
        max: 0.34 + 0.5
    },
    {
        x: 0.4,
        level: 6,
        min: 0,
        max: 1
    }
];

const keys = [];
let platform = {
    x: platforms.x,
    y: platforms.y,
    width: platforms.width,
    height: platforms.height
};



// initiate
function initiateWindow() {
    setVariables();
    setDimensions();
    setCanvas();
    setPlayerResponsive();
    setEnemyResponsive();
    drawBackground();
    initiateLadders();
    drawPlatform();
    initiatePlayer();
    initiateEnemies();
    startAnimating(15);
    // renderAnimation();
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

function setVariables() {
    failed = false;
    win = false;
    enemies = [];
    maxJumpHeight = 1000;
}

function randomSpeed(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function setScore(){
    ctx.font = "25px Arial";
    ctx.fillText(score,getDistanceByCanvasWidth(0.928),28);
}


function setPlayerResponsive() {
    let width = canvasWidth * 0.07;
    let height = width * playerImageAspectRatio;
    playerWidth = width;
    playerHeight = height;
}

function setEnemyResponsive() {
    let width = canvasWidth * 0.12;
    let height = width * enemyImageAspectRatio;
    enemyWidth = width;
    enemyHeight = height;
}

function initiatePlayer() {
    player = new Player(getDistanceByCanvasWidth(0.05), canvasHeight - playerHeight - getGroundHeightByRatio());
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
        ctx.drawImage(
            ladderImage,
            item.x,
            item.y,
            item.width,
            item.height
        );
        // ctx.beginPath();
        // ctx.lineWidth = "1";
        // ctx.strokeStyle = "green";
        // ctx.rect(item.x, item.y, item.width, item.height);
        // ctx.stroke();
    });

    
}

function initiateEnemies() {
    enemies = [];
    enemyPositions.forEach((item, index) => {
        let enemyObject = new Enemy(getEnemyX(item.x), getEnemyY(item.level), getDistanceByCanvasWidth(item.min), getDistanceByCanvasWidth(item.max));
        enemies.push(enemyObject);
    });
}

function initiateLadders() {
    ladders = [];
    laddersPositions.forEach((item, index) => {
        let x = getLadderX(item.x);
        let y = getLadderY(item.form);
        let width = getLadderWidth();
        let height = getLadderHeight(item.form, item.to);
        let ladder = {
            x:x,
            y:y,
            width:width,
            height:height
        }
        ladders.push(ladder);
    });
    laddersPositions.forEach((item, index) => {
        let enemyObject = new Enemy(getEnemyX(item.x), getEnemyY(item.level), getDistanceByCanvasWidth(item.min), getDistanceByCanvasWidth(item.max));
        enemies.push(enemyObject);
    });
}

function moveEnemies() {
    enemies.forEach((item, index) => {
        item.move();
    });
}

function drawEnemy(enemy) {
    ctx.drawImage(
        enemyImage,
        enemy.width * enemy.frameX,
        enemy.height * enemy.frameY,
        enemy.width,
        enemy.height,
        enemy.x,
        enemy.y,
        enemy.responsiveWidth,
        enemy.responsiveHeight
    );

    // ctx.beginPath();
    //     ctx.lineWidth = "1";
    //     ctx.strokeStyle = "blue";
    //     ctx.rect(enemy.x, enemy.y, enemy.responsiveWidth , enemy.responsiveHeight);
    //     ctx.stroke();
}

function drawDoor() {
    let ratio = doorImage.height / doorImage.width;
    let width = canvasWidth * 0.0763;
    let height = width * ratio;
    let x = canvasWidth * 0.05;
    let y = getYByLevel(platformMaxLevel) - height;
    doorLeft = x;
    doorBottom = y + height;
    doorRight = x + width;
    ctx.drawImage(
        doorImage,
        x,
        y,
        width,
        height
    );

    ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "yellow";
        ctx.rect(doorLeft, y, width , height);
        ctx.stroke();
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

    ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(playerLeft, playerTop, playerWidth, playerHeight);
        ctx.stroke();
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
    return getYByLevel(level) - enemyHeight;
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

function setPlayerValues(player){
    playerRight = player.x + player.responsiveWidth;
    playerLeft = player.x ;
    playerBottom = player.y + player.responsiveHeight;
    playerTop = player.y ;
}

function isPlayerOnLadder(side){
    let status = false;
    ladders.forEach((ladder,index) => {
        let onLadderX = checkCoordinatesInside(playerLeft,playerRight,ladder.x,ladder.x + ladder.width);
        if(onLadderX){
            let onLadderY;
            if(side == 'bottom'){
                onLadderY = checkPlayerOnLadderBottom(ladder,getDistanceByCanvasWidth(0.003));
            }
            else if(side == 'top'){
                onLadderY = checkPlayerOnLadderTop(ladder,getDistanceByCanvasWidth(0.003));
            }

            if(onLadderY){
                status = true;
            }
        }
    });
    return status;
}

function checkPlayerOnLadderBottom(ladder,tolerance = 0){
    let ladderTop = ladder.y + ladder.height;
   return playerBottom - ladder.y <= tolerance && playerBottom - ladderTop > getDistanceByCanvasWidth(0.0076);
}

function checkPlayerOnLadderTop(ladder,tolerance = 0){
    let ladderTop = ladder.y + ladder.height;
   return playerBottom - ladder.y <= 0 && playerBottom - ladderTop > 0;
}

function checkCoordinatesMerge(firstLeft,firstRight,secondLeft,secondRight,tolerance = 0){
    let secondHitFromRight = (firstLeft - secondRight <= tolerance && firstLeft >= secondLeft);
    let secondHitFromLeft = (secondLeft - firstRight <= tolerance && secondLeft >= firstLeft);
    return secondHitFromLeft || secondHitFromRight;
}


function checkCoordinatesInside(bigLeft,bigRight,smallLeft,smallRight,tol = 0){
    let tolerance = -getDistanceByCanvasWidth(tol);
    console.log(bigLeft <= smallLeft);
    console.log(bigLeft , smallLeft );
    console.log( bigRight >= smallRight);
    console.log(bigRight , smallRight);
    return (bigLeft <= smallLeft  && bigRight >= smallRight);
    // return (bigLeft - smallLeft <= tolerance && smallRight - bigRight  >= tolerance);
}





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
    // if (player.x >= 220 && player.x <= 400) {
    //     player.y += gravity
    // }

    if (keys[38]) {
        // && player.x >= ladders.x && 
        // player.x <= (ladders.x + ladders.width) && 
        // player.y === ladders.y)        
        player.moveUp();
    }
    if (keys[37] && player.x > 0) {
        player.moveLeft();
    }
    if (keys[40] && player.y >= 0) {
        player.moveDown();
    }
    if (keys[39] && player.x < canvas.width - player.width) {
        player.moveRight();
    }
    if (keys[32] ) {
        player.jump();
    }

    player.handleFrame();
}


// function touchGround() {
//     if (player.x > platform.x + platform.width) return false;
//     if (player.x + player.width < platform.x) return false;
//     if (player.y > platform.y + platform.height) return false;
//     if (player.y + player.height < platform.y) return false;
//     return true;
// }

let fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}


function animate() {

    animationId = requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    let ended = isEnd();
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground();
        drawPlatform();
        player.animate();
        moveEnemies();
        movePlayer();
        setScore();
    }

    if (ended) {
        // stop animation when player wins or loose
        window.cancelAnimationFrame(animationId);
        return showFail();
    }

}


// function renderAnimation() {
//     if (isEnd()) {
//         window.cancelAnimationFrame(animationId);
//         return false;
//     }
//     if (animationId % 5 == 0) {
//         animate();
//     }
//     animationId = window.requestAnimationFrame(renderAnimation);
// }



function isEnd() {
    if (failed) {
        return true;
    }
    if(isWin()){
        alert('Your the Winner');
        score++;
        return true;
    }
    return false;
}

function isWin(){
    return checkCoordinatesInside(doorLeft - (doorLeft*1.1),doorRight + (doorLeft*1.1),playerLeft,playerRight) && playerBottom <= doorBottom;
}

function showWinAlert() {
    initiateWindow();
}

function showFail() {
    // initiateWindow();
    return false;
}

