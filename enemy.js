// class Enemy {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//         this.width = 48;
//         this.height = 48;
//         this.frameX = 0;
//         this.frameY = 0;
//         this.speed = randomSpeed(1,5);
//         this.velocity_y = 5;
//         this.gravity = 1;
//         this.moving = true;
//         this.direction = 1;
//         this.responsiveWidth = enemyWidth;
//         this.responsiveHeight = enemyHeight;
//     }

//     move(){
//         this.x += this.speed * this.direction;
//         if(this.x > (canvasWidth - enemyWidth ) || this.x <= 0 ){
//             this.direction *= -1;
//         }
//         drawEnemy(this.x,this.y);
//     }
// }

// module.exports = Enemy;