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

let groundImage = new Image();
groundImage.src = "assets/images/ground/ground.png";

let oneL = new Image();
oneL.src = "assets/images/ground/oneL.png";

let oneR = new Image();
oneR.src = "assets/images/ground/oneR.png";

let twoL = new Image();
twoL.src = "assets/images/ground/twoL.png";

let threeR = new Image();
threeR.src = "assets/images/ground/threeR.png";

let fourL = new Image();
fourL.src = "assets/images/ground/fourL.png";

let fiveR = new Image();
fiveR.src = "assets/images/ground/fiveR.png";

let sixL = new Image();
sixL.src = "assets/images/ground/sixL.png";

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

let jumpSound = new Audio();
jumpSound.src = "assets/audio/jump.wav";

let groundHit = new Audio();
groundHit.src = "assets/audio/hit_ground.wav";

let loose = new Audio();
loose.src = "assets/audio/loose.wav";

let winAudio = new Audio();
winAudio.src = "assets/audio/win.wav";



//--- data variables  ---//
let canvas, ctx;
let canvasWidth, canvasHeight, windowWidth, windowHeight;
const canvasRatio = 650 / 700; //  background image width / height
const platformMaxLevel = 6;
const platformTopMarginRatio = 0.1127
const ladderWidthRatio = 0.048;
const groundHeightRatio = 0.052;
const enemyImageAspectRatio = 0.6;
const playerImageAspectRatio = 1.2;
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
let doorLeft = 0;
let doorRight = 0;
let doorBottom = 0;
let nearestGround = null;
const pixelAdjustment = 0;
const showStroke = 0;
const normalGravity = 1;
const playerJumpSpeed = 8;


//classes
class Enemy {
    constructor(x, y, maxLeft, maxRight) {
        this.x = x;
        this.y = y;
        this.speed = randomSpeed(2, 3);
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
            else{
                if(animationId % 20 == 0){
                    this.direction = randomSpeed(1, 3) == 1 ? 1 : -1;
                }
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

function drawPlayer() {
    ctx.drawImage(
        playerImage,
        player.frameWidth * player.frameX + 10,
        player.frameHeight * player.frameY + 7.5,
        player.width - 20,
        player.height -13,
        player.x,
        player.y,
        player.responsiveWidth,
        player.responsiveHeight
    );

    if (showStroke) {
        drawSquare(player.x, player.y, playerWidth, playerHeight, 'red');
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 8;
        this.climbingSpeed = 4;
        this.direction = 1;
        this.responsiveWidth = playerWidth;
        this.responsiveHeight = playerHeight;
        this.frameWidth = 48;
        this.frameHeight = 48;
        this.width = 48;
        this.height = 48;
        this.frameX = 0;
        this.frameY = 0;
        this.velocity_x = 0;
        this.velocity_y = 1;
        this.moving = false;
        this.jumping = false;
        this.jumped = 0;
        this.maxJumpHeight = 0;
        this.jumpingSpeed = playerJumpSpeed;
        this.gravity = 1;
    }

    handleFrame() {
        if (this.frameX < 5 && this.moving) this.frameX++;
        else this.frameX = 0;
    }

    //player moves
    moveUp() {
        let ladder = checkPlayerLadder('near');
        if (!ladder) return false;
        if (ladder.y + ladder.height > this.y + this.responsiveHeight - this.climbingSpeed) {
            this.y = ladder.y + ladder.height - this.responsiveHeight;
        }
        else {
            this.y -= this.climbingSpeed;
        }
        this.frameY = 4;
        this.moving = true;
    }

    moveDown() {
        let ladder = checkPlayerLadder('near');
        if (!ladder) return false;
        if (ladder.y < this.y + this.responsiveHeight + this.climbingSpeed) {
            this.y = ladder.y - this.responsiveHeight;
        }
        else {
            this.y += this.climbingSpeed;
        }
        this.frameY = 4;
        this.moving = true;
    }

    moveLeft() {
        let ladder = checkPlayerLadder('on');
        if (ladder) return false;
        this.x -= this.speed;
        this.frameY = 3;
        this.moving = true;
    }

    moveRight() {
        let ladder = checkPlayerLadder('on');
        if (ladder) return false;
        this.x += this.speed;
        this.frameY = 2;
        this.moving = true;
    }


    jump() {
        if (checkPlayerLadder('near')) return false;
        if (!isPlayerOnGround(nearestGround)) return false;
        playJumpSound();
        this.jumping = true;
        this.frameY = 2;
        this.moving = true;
    }

    animate() {
        if (this.jumping) {
            let hitGround = playerHeadHitOnPlatform(this.y - this.jumped);
            if (hitGround) {
                playGroundHit();
                this.jumped = this.maxJumpHeight;
            }

            if (this.jumped < this.maxJumpHeight) {

                if (this.jumped + this.jumpingSpeed > this.maxJumpHeight) {
                    this.jumped = this.maxJumpHeight;
                }
                else {
                    this.jumped += this.jumpingSpeed;
                }
                this.y -= this.jumped;
                // let jumpedPercentage = (Math.min(this.jumped / this.maxJumpHeight * 100,100));
                // this.jumpingSpeed -= this.jumpingSpeed * jumpedPercentage / 100 ;
            }
            else {
                this.jumping = false;
            }
        }
        else if (this.jumped > 0) {
            this.jumped = 0;
            this.jumpingSpeed = playerJumpSpeed;
        }
        drawPlayer();
    }
}

function hitX(enemy) {
    let tolerance = -getDistanceByCanvasWidth(0.045 * pixelAdjustment);
    let enemyRight = enemy.x + enemy.responsiveWidth;
    let enemyLeft = enemy.x;
    return checkCoordinatesMerge(player.x, player.x + player.responsiveWidth, enemyLeft, enemyRight, tolerance);
}

function hitY(enemy) {
    let tolerance = -getDistanceByCanvasWidth(0.025 * pixelAdjustment);
    let enemyBottom = enemy.y + enemy.responsiveHeight;
    let enemyTop = enemy.y;
    let playerBottom = player.y + player.responsiveHeight;
    return checkCoordinatesMerge(player.y, playerBottom, enemyTop, enemyBottom, tolerance);
}

let platForms = [];
const platformsPositions = [
    {
        //one left
        x: 0,
        level: 1,
        width: 0.19,
        image:oneL
    },
    {
        //one right
        x: 0.30,
        level: 1,
        width: 0.697,
        image:oneR
    },
    {
        // two left
        x: 0,
        level: 2,
        width: 0.63,
        image:twoL
    },
    {
        // three right
        x: 0.75,
        level: 3,
        width: 0.145,
        image:threeR
    },
    {
        // four left
        x: 0,
        level: 4,
        width: 0.34,
        image:fourL
    },
    {
        // five right
        x: 0.3,
        level: 5,
        width: 0.54,
        image:fiveR
    },
    {
        // top
        x: 0,
        level: 6,
        width: 1,
        image:sixL
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
        min: 0.3,
        max: 0.3 + 0.5
    },
    {
        x: 0.4,
        level: 6,
        min: 0,
        max: 1
    }
];

let keys = [];
// let platform = {
//     x: platforms.x,
//     y: platforms.y,
//     width: platforms.width,
//     height: platforms.height
// };



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
    keys = [];
}

function randomSpeed(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function setScore() {
    ctx.font = "25px Arial";
    ctx.fillText(score, getDistanceByCanvasWidth(0.928), 28);
}


function setPlayerResponsive() {
    let width = canvasWidth * 0.06;
    let height = width * playerImageAspectRatio;
    playerWidth = width;
    playerHeight = height;
}

function setEnemyResponsive() {
    let width = canvasWidth * 0.06;
    let height = width * enemyImageAspectRatio;
    enemyWidth = width;
    enemyHeight = height;
}

function initiatePlayer() {
    player = new Player(getDistanceByCanvasWidth(0.1), canvasHeight - playerHeight - getGroundHeightByRatio() - 10);
    player.maxJumpHeight = player.responsiveHeight / 1.1;
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
    platformsPositions.forEach((item, index) => {
        let x = getXByRatio(item.x);
        let y = getYByLevel(item.level);
        let width = getWidthByRatio(item.width);
        let height = getGroundHeightByRatio();

        platForms.push({
            x: x,
            y: y,
            width: width,
            height: height
        });

        ctx.drawImage(
            item.image,
            x,
            y,
            width,
            height
        );

        if (showStroke) {
            drawSquare(x, y, width, height, 'black');
        }
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
        if (showStroke) {
            drawSquare(item.x, item.y, item.width, item.height, 'green');
        }
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
            x: x,
            y: y,
            width: width,
            height: height
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
        enemy.height * enemy.frameY + 18,
        enemy.width,
        enemy.height - 20,
        enemy.x,
        enemy.y,
        enemy.responsiveWidth,
        enemy.responsiveHeight
    );
    if (showStroke) {
        drawSquare(enemy.x, enemy.y, enemy.responsiveWidth, enemy.responsiveHeight, 'blue');
    }
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

    if (showStroke) {
        drawSquare(doorLeft, y, width, height, 'yellow');
    }
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



function drawSquare(upperLeftX, upperLeftY, rightBottomX, rightBottomY, color, thick = 1) {
    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
    ctx.rect(upperLeftX, upperLeftY, rightBottomX, rightBottomY);
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

function playJumpSound(){
    jumpSound.play();
}

function playGroundHit(){
    groundHit.play();
}

function playLoose(){
    loose.play();
}

function playWin(){
    winAudio.play();
}

function checkPlayerLadder(side) {
    let currentLadder = false;
    ladders.forEach((ladder, index) => {
        let onLadderX = checkCoordinatesInside(player.x, player.x + player.responsiveWidth, ladder.x, ladder.x + ladder.width);
        if (onLadderX) {
            let onLadderY;
            if (side == 'near') {
                onLadderY = checkPlayerNearLadder(ladder);
            }
            else if (side == 'on') {
                onLadderY = checkPlayerOnLadder(ladder);
            }

            if (onLadderY) {
                currentLadder = ladder;
            }
        }
    });
    return currentLadder;
}


function checkPlayerNearLadder(ladder) {
    let ladderTop = ladder.y + ladder.height;
    return player.y + player.responsiveHeight <= ladder.y && player.y + player.responsiveHeight >= ladderTop;
}

function checkPlayerOnLadder(ladder) {
    let ladderTop = ladder.y + ladder.height;
    let playerBottom = player.y + player.responsiveHeight;
    return playerBottom < ladder.y && playerBottom > ladderTop;
}

function checkCoordinatesMerge(firstLeft, firstRight, secondLeft, secondRight, tolerance = 0) {
    let secondHitFromRight = (firstLeft - secondRight <= tolerance && firstLeft >= secondLeft);
    let secondHitFromLeft = (secondLeft - firstRight <= tolerance && secondLeft >= firstLeft);
    return secondHitFromLeft || secondHitFromRight;
}


function checkCoordinatesInside(bigLeft, bigRight, smallLeft, smallRight) {
    return (bigLeft <= smallLeft && bigRight >= smallRight);
}

function checkCoordinatesTouch(bigLeft, bigRight, smallLeft, smallRight) {
    let between = bigLeft <= smallLeft && bigRight >= smallRight;
    let onLeftEdge = smallLeft <= bigLeft && smallRight >= bigLeft;
    let onRightEdge = smallLeft <= bigRight && bigRight <= smallRight;
    return between || onLeftEdge || onRightEdge;
}





window.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    player.moving = true;
});

window.addEventListener("keyup", function (e) {
    delete keys[e.keyCode];
    player.moving = false;
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
    if (keys[32]) {
        if (!player.jumping && player.jumped == 0 && isPlayerOnGround(nearestGround))
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

function applyGravity() {
    applyGravityOnPlayer();
}

function applyGravityOnPlayer() {
    if (!player) return false;
    if (checkPlayerLadder('near')) return false;
    setNearestGround();
    if (!nearestGround) {
        player.y += player.gravity;
        player.gravity++;
    }
    else if (nearestGround.y > player.y + player.responsiveHeight) {
        if (player.y + player.responsiveHeight + player.gravity > nearestGround.y) {
            player.y = nearestGround.y - player.responsiveHeight;
        }
        else {
            player.y += player.gravity;
            player.gravity++;
        }
    }
    else {
        player.gravity = normalGravity;
    }
}



function setNearestGround() {
    nearestGround = null;
    platForms.forEach((ground, index) => {
        if (isGroundUnderPlayer(ground)) {
            if (isPlayerOnGroundX(ground)) {
                nearestGround = ground;
            }
        }
    });
}

function isGroundUnderPlayer(ground) {
    let groundTop = ground.y;
    let playerBottom = player.y + player.responsiveHeight;
    return groundTop >= playerBottom;
}

function isPlayerOnGroundX(ground) {
    return checkCoordinatesTouch(ground.x, ground.x + ground.width, player.x, player.x + player.responsiveWidth);
}

function isPlayerOnGround(ground) {
    if(!ground) return false;
    return (player.y + player.responsiveHeight == ground.y && isPlayerOnGroundX(ground));
}

function playerHeadHitOnPlatform(newPlayerY) {
    let hitGround = false;
    platForms.forEach((ground, index) => {
        if (checkHeadHitOnPlatform(ground, newPlayerY)) {
            hitGround = ground;
        }
    });
    return hitGround;
}

function checkHeadHitOnPlatform(ground, newPlayerY) {
    if (newPlayerY < ground.y) return false;
    let onY = newPlayerY <= ground.y + ground.height;
    let onX = checkCoordinatesTouch(ground.x, ground.x + ground.width, player.x, player.x + player.responsiveWidth);
    return onX && onY;
}

function checkGroundY(ground) {
    return player.y + player.responsiveHeight == ground;
}

function checkGroundX(ground) {
    return checkCoordinatesInside(ground.x, ground.x + ground.width, player.x, player.x + player.responsiveWidth);
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
        applyGravity();

        if (nearestGround && showStroke) {
            drawSquare(nearestGround.x, nearestGround.y, nearestGround.width, nearestGround.height, 'blue', 2);
        }
    }

    if (ended) {
        // stop animation when player wins or loose
        window.cancelAnimationFrame(animationId);
        if(ended == 'failed'){
            return showFail();
        }
        if(ended == 'win'){
            showWin();
        }
    }

}



function isEnd() {
    if (failed) {
        return 'failed';
    }
    if (player.y + player.responsiveHeight >= canvasHeight) {
        failed = true;
        return 'failed';
    }
    if (isWin()) {        
        score += 1;
        return 'win';
    }
    return false;
}

function isWin() {
    return checkCoordinatesInside(doorLeft - (doorLeft * 1.1), doorRight + (doorLeft * 1.1), player.x, player.x + player.responsiveWidth) && player.y + player.responsiveHeight <= doorBottom;
}

function showWin() {
    playWin();
    setTimeout(() => {
        initiateWindow();
    }, 3000);
}

function showFail() {
    playLoose();
    setTimeout(() => {
        location.reload();
    }, 2000);
    return false;
}

