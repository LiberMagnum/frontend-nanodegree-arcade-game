var score = 0;
var enemySpeed = 200;
var lifeBoolean = false;
var allLivesSpent = false;
var heartCollected = false;

//random number generator, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

//takes a list of images and probabilities (in integers, the sum of the list must equal 100), 
//and returns a random image. The probability that the function returns any given image is the same as the
//probability corresponding to it in the probabilityList
var weightedRandom = function(list, probabilityList) {
    var randomInt = getRandomInt(0, 101);
    var counter = 0;
    for (var n = 0; n < list.length; n++) {
        counter += probabilityList[n];
        if (randomInt <= counter) {
            return n;
        }
    }
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.possibleY = [60, 140, 220];
    this.x = -50;
    this.y = this.possibleY[getRandomInt(0, 3)]; //getRandomInt(20, 250);
    this.speed = getRandomInt(200, enemySpeed);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (allLivesSpent === false) {
        this.x += this.speed * dt;
    }
    if (this.x > 530) {
        this.x = -50;
        this.y = this.possibleY[getRandomInt(0, 3)];
        this.speed = getRandomInt(200, enemySpeed);
    }
    //code to handle collisions
    if (player.playerX < this.x + 70 && player.playerX + 70 > this.x &&
        player.playerY < this.y + 50 && player.playerY + 50 > this.y) {

        player.playerX = 200;
        player.playerY = 380;

        score -= 100;

        if (allLivesSpent === false) {
            hearts.heartNum -= 1;
        }
        if (hearts.heartNum <= 0 && allLivesSpent === false) {
            hearts.heartNum += 3;
            lifeBoolean = true;
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var player = function() {
    this.possibleImages = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    this.charCounter = 0;
    this.playerX = 200;
    this.playerY = 380;
    this.ySpeed = 0;
    this.xSpeed = 0;
    this.sprite = this.possibleImages[this.charCounter];
    this.charCode = 0;
};

player.prototype.update = function(code) {
    //update location when the user hits an arrow key
    if (code != null && code != 32 && allLivesSpent === false) {
        this.playerX += this.xSpeed;
        this.playerY += this.ySpeed;
    }

    //reset if the player reaches the top of the canvas
    if (this.playerY <= -20) {
        this.playerX = 200;
        this.playerY = 380;
        score += 100;
    }

    //changes the player image when a life is spent
    if (lifeBoolean === true && allLivesSpent === false) {
        if (this.charCounter < this.possibleImages.length) {
            this.charCounter += 1;
            this.sprite = this.possibleImages[this.charCounter];
            lifeBoolean = false;
        }
        if (this.charCounter >= this.possibleImages.length) {
            this.sprite = this.possibleImages[0];
            this.charCounter = 0;
            allLivesSpent = true;
        }
    }
};

player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.playerX, this.playerY);
};

player.prototype.handleInput = function(keyCode) {
    //changes the speed depending on which button is pressed as long as
    //moving the player does not bring it outside the bounds of the canvas
    //left arrow key
    if (keyCode === 37) {
        if (this.playerX - 100 <= -100) {
            this.xSpeed = 0;
            this.ySpeed = 0;
        } else {
            this.xSpeed = -100;
            this.ySpeed = 0;
        }
    }
    //up arrow key
    else if (keyCode === 38) {
        if (this.playerY - 80 <= -80) {
            this.xSpeed = 0;
            this.ySpeed = 0;
        } else {
            this.xSpeed = 0;
            this.ySpeed = -80;
        }
    }
    //right arrow key
    else if (keyCode === 39) {
        if (this.playerX + 100 >= 500) {
            this.xSpeed = 0;
            this.ySpeed = 0;
        } else {
            this.xSpeed = 100;
            this.ySpeed = 0;
        }
    }
    //down arrow key
    else if (keyCode === 40) {
        if (this.playerY + 80 >= 460) {
            this.xSpeed = 0;
            this.ySpeed = 0;
        } else {
            this.xSpeed = 0;
            this.ySpeed = 80;
        }
    }
};

//hearts represent lives, losing three hearts changes the character, losing all characters ends the game
var hearts = function() {
    this.heartX = [0, 100, 200];
    this.heartY = [3, 3, 3];
    this.heartNum = this.heartX.length;
    this.sprite = 'images/Heart.png';
};

hearts.prototype.render = function() {
    for (var j = 0; j < this.heartNum; j++) {
        ctx.drawImage(Resources.get(this.sprite), this.heartX[j], this.heartY[j]);
    }
};

hearts.prototype.update = function() {
    if (heartCollected === true && this.heartNum < 3) {
        this.heartNum += 1;
        heartCollected = false;
    }
};

//gems appear on random tiles, collecting gems increases your score
var gems = function() {
    //possible x and y locations for gems
    this.gemPossibleX = [0, 100, 200, 300, 400];
    this.gemPossibleY = [50, 140, 220];
    //sets a random gem location
    this.gemX = this.gemPossibleX[getRandomInt(0, this.gemPossibleX.length)];
    this.gemY = this.gemPossibleY[getRandomInt(0, this.gemPossibleY.length)];
    this.gemImages = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png', 'images/Heart.png', 'images/Star.png'];
    //initial list of probabilities, each number corresponds to the image at its same index in this.gemImages
    this.probabilityList = [10, 30, 60];
    //how many points are gained when a blue gem (highest value) is collected
    this.gemWorth = 100;
    //controls which gems can appear on the screen at any given point
    this.gemImagesLength = 2;
    this.randomGenerator = weightedRandom(this.gemImages.slice(0, this.gemImages.length - this.gemImagesLength), this.probabilityList);
    //chooses a random image to display
    this.sprite = this.gemImages[this.randomGenerator]; //this.gemImages[getRandomInt(0, this.gemImages.length-this.gemImagesLength)];
};

gems.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.gemX, this.gemY);
};

gems.prototype.update = function() {
    //change the gem's position and/or image if the player collects it
    if (player.playerX >= this.gemX && player.playerX <= this.gemX + 70 && player.playerY >= this.gemY && player.playerY <= this.gemY + 50) {

        //increases score depending on what color gem is collected
        if (this.sprite === 'images/Gem Blue.png') {
            score += this.gemWorth;
        } else if (this.sprite === 'images/Gem Green.png') {
            score += this.gemWorth / 2;
        } else if (this.sprite === 'images/Gem Orange.png') {
            score += this.gemWorth / 5;
        } else if (this.sprite === 'images/Heart.png' && hearts.heartNum < 3) {
            //in the hearts function, if this boolean is true then a life is added
            heartCollected = true;
        } else if (this.sprite === 'images/Star.png') {
            score += this.gemWorth;
            //enemy speed decreases when stars are collected
            enemySpeed -= 100;
        }
        //adds in hearts after the first character dies
        if (this.gemImagesLength === 2 && hearts.heartNum < 3) {
            this.gemImagesLength = 1;
            this.probabilityList[this.probabilityList.length - 1] = 50;
            this.probabilityList.push(10);
        }
        //adds in stars if the highest enemy speed is over 700
        if (enemySpeed >= 500 && this.gemImagesLength === 1) {
            this.gemImagesLength = 0;
            this.probabilityList[this.probabilityList.length - 1] = 5;
            this.probabilityList.push(5);
        }
        //takes away stars if enemy speed is too low
        if (enemySpeed <= 200 && this.gemImagesLength === 0) {
            this.gemImagesLength = 1;
        }

        //resets the gem to a new random location and chooses a random image for it
        this.gemX = this.gemPossibleX[getRandomInt(0, this.gemPossibleX.length)];
        this.gemY = this.gemPossibleY[getRandomInt(0, this.gemPossibleY.length)];
        this.randomGenerator = weightedRandom(this.gemImages.slice(0, this.gemImages.length - this.gemImagesLength), this.probabilityList);
        this.sprite = this.gemImages[this.randomGenerator];

        //enemy speed increases each time a gem is collected
        enemySpeed += 5;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allGems = [new gems(), new gems(), new gems()];
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new player();
var hearts = new hearts();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = [37, 38, 39, 40, 32];
    for (var i = 0; i < allowedKeys.length; i++) {
        if (allowedKeys[i] === e.keyCode) {
            player.handleInput(e.keyCode);
            player.update(e.keyCode);
        }
    }
});