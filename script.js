let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let boardWidth = 360;
let boardHeight = 500;

let doodlerWidth = 40;
let doodlerHeight = 50;
let doodlerRightImg = new Image();
doodlerRightImg.src = './img/doodler-right.png';
let doodlerLeftImg = new Image();
doodlerLeftImg.src = './img/doodler-left.png';
let platformImg = new Image();
platformImg.src = './img/platform.png';

let gravity = 0.5;
let platformCount = 6;
let platforms = [];
let score = 0;
let gameOver = false;

let doodler = {
    x: boardWidth / 2 - doodlerWidth / 2,
    y: boardHeight - doodlerHeight - 100,
    xVelocity: 0,
    yVelocity: 0,
    width: doodlerWidth,
    height: doodlerHeight,
    img: doodlerRightImg,
    draw: function() {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    },

    move: function() {
        // Apply gravity
        this.yVelocity += gravity;
        this.y += this.yVelocity;
        this.x += this.xVelocity;

        // Prevent the Doodler from moving off the canvas
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > boardWidth) this.x = boardWidth - this.width;

        // Collision with platforms
        platforms.forEach((platform, index) => {
            if (
                this.y + this.height >= platform.y &&
                this.y + this.height <= platform.y + platform.height &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width &&
                this.yVelocity > 0 // Only bounce when falling down
            ) {
                if (index === 0) {
                    // First platform (normal jump)
                    this.yVelocity = -10;
                } else {
                    // Other platforms (higher jump)
                    this.yVelocity = -15;
                }
                score += 10; // Increase score when bouncing on a platform
            }
        });

        // Move platforms downward when Doodler climbs up
        if (this.y < boardHeight / 2) {
            platforms.forEach(platform => {
                platform.y += 3;
            });
            this.y += 3;
        }

        // Check for Game Over
        if (this.y > boardHeight) {
            gameOver = true;
        }
    }
};

// Generate platforms
function generatePlatforms() {
    for (let i = 0; i < platformCount; i++) {
        let x = Math.random() * (boardWidth - 180);
        let y = i * (boardHeight / platformCount);
        platforms.push({ x: x, y: y, width: 100, height: 20, img: platformImg });
    }
}

// Add a new platform above the canvas
function addNewPlatform() {
    let x = Math.random() * (boardWidth - 100);
    let y = -20; // Place it above the canvas
    platforms.push({ x: x, y: y, width: 100, height: 20, img: platformImg });
}

// Remove platforms that are off the bottom of the canvas
function removeOffscreenPlatforms() {
    platforms = platforms.filter(platform => platform.y < boardHeight);
}

// Display the score
function displayScore() {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Display Game Over text
function displayGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", boardWidth / 2, boardHeight / 2);
    ctx.font = "16px Arial";
    ctx.fillText("Press Enter to Restart", boardWidth / 2, boardHeight / 2 + 30);
}

// Restart the game
function restartGame() {
    doodler.x = boardWidth / 2 - doodlerWidth / 2;
    doodler.y = boardHeight - doodlerHeight - 100;
    doodler.xVelocity = 0;
    doodler.yVelocity = 0;
    score = 0;
    platforms = [];
    generatePlatforms();
    gameOver = false;
}

window.onload = () => {
    canvas.width = boardWidth;
    canvas.height = boardHeight;

    generatePlatforms();

    requestAnimationFrame(update);
    document.addEventListener('keydown', moveDoodler);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && gameOver) {
            restartGame();
        }
    });
};

function update() {
    ctx.clearRect(0, 0, boardWidth, boardHeight);

    if (!gameOver) {
        // Draw all platforms
        platforms.forEach(platform => {
            ctx.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
        });

        doodler.move();
        doodler.draw();

        // Add new platforms and remove offscreen ones
        if (platforms[platforms.length - 1].y > 100) {
            addNewPlatform();
        }
        removeOffscreenPlatforms();

        displayScore();
    } else {
        displayGameOver();
    }

    requestAnimationFrame(update);
}

function moveDoodler(e) {
    if (e.key === 'ArrowLeft') {
        doodler.xVelocity = -3;
        doodler.img = doodlerLeftImg;
    } else if (e.key === 'ArrowRight') {
        doodler.xVelocity = 3;
        doodler.img = doodlerRightImg;
    }
}
function moveforLeft(e){
        doodler.xVelocity = -3;
        doodler.img = doodlerLeftImg;
}
function moveforRight(){
    doodler.xVelocity = 3;
    doodler.img = doodlerRightImg;
}