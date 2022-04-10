//--- config  ---//
window.addEventListener('load', () => {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');
    initiateWindow();
});

window.addEventListener('resize', initiateWindow);



//--- data variables  ---//
let canvas, ctx;
let canvasWidth, canvasHeight, windowWidth, windowHeight;
const canvasRatio = 650 / 700; //  background image width / height
const platformMaxLevel = 5;
const platformTopMarginRatio = 0.16
let platforms = [
    {
        //btm left
        x:0,
        level:1,
        // y:542,
        width:96,
        height:32
    },
    {
        //btm right
        x:0.30,
        // x:202,
        level:1,
        // y:542,
        width:448,
        height:32
    },
    {
        // one left
        x:0,
        level:2,
        // y:422,
        width:480,
        height:32
    },
    {
        // two right
        x:1.18,
        level:2,
        // y:358,
        width:64,
        height:32
    },
    {
        // three left
        x:0,
        level:3,
        // y:294,
        width:224,
        height:32
    },
    {
        // four left
        x:1.97,
        level:4,
        // y:230,
        width:224,
        height:32
    },
    {
        // top
        x:0,
        level:5,
        // y:100,
        width:650,
        height:32
    },
];

const keys = [];
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

// initiate
function initiateWindow() {
    setDimensions();
    setCanvas();
    drawBackground();
    drawPlatform();
}

function setDimensions() {
    //set window dimensions
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    //set canvas dimensions
    canvasWidth = windowWidth * 0.48;
    canvasHeight = canvasWidth * canvasRatio;

    console.log(canvasWidth);
    console.log(canvasHeight);
}

function setCanvas() {
    if (!canvas) return false;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}




//--- images  ---//
let backgroundImage = new Image();
backgroundImage.src = "./assets/background2.png";

let platformImage = new Image();
platformImage.src = "assets/level-two-left.png";

let playerSprite = new Image();
playerSprite.src = "assets/characters.png";

let enemySprite = new Image();
enemySprite.src = "assets/Enemy.png";

let skyTwo = new Image();
skyTwo.src = "assets/sky-2.png";
let skyOne = new Image();
skyOne.src = "assets/sky-1.png";
let scoreBoard = new Image();
scoreBoard.src = "assets/score-board.png";
let door = new Image();
door.src = "assets/door.png";
let ladder = new Image();
ladder.src = "assets/stairs.png"; 


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
    platforms.forEach((item,index) =>{
        let x = getXByRatio(item.x);
        let y = getYByLevel(item.level);
        ctx.drawImage(
            platformImage,
            x,
            y,
            item.width,
            item.height
        );
    });
    
}

function getYByLevel(level){
    return canvasHeight - (canvasHeight / platformMaxLevel * level) + (canvasHeight * platformTopMarginRatio);
}

function getXByRatio(x){
    return canvasWidth * x ;
}


// Hér setjum við inn alla fleka og stiga sem búa til leikborðið.


function drawPlayer(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);

}

function drawEnemy(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
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
    }
};

function movePlayer() {
    if (player.x >= 220 && player.x <= 400) {
        player.y += gravity
    }

    if (keys[38]) {
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
    if (keys[40] && player.y <= 0) {
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

function touchGround() {
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
    fpsInterval = 1000 / fps;
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
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground();
        drawPlatform();

        // player.y += gravity

        

        ladders[
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
        enemies[
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