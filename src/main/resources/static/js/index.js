var gamePieces = [];
var gameCanvas;
var projectiles = [];

let boatMap = new Map();

function startGame() {
    myGameArea.start();
}
function createBoat(boatName, address) {
    var piece = new component(30, 78, "src/bato.png",
        getRandomInt(gameCanvas.width - 30),
        getRandomInt(gameCanvas.height - 78),
        "image", boatName);
    gamePieces.push(piece);
    boatMap.set(address, piece);
}

var myGameArea = {
    start : function() {
        gameCanvas = document.createElement("canvas");
        gameCanvas.width = window.innerWidth - 100;
        gameCanvas.height = window.innerHeight - 100;
        this.context = gameCanvas.getContext("2d");
        document.body.insertBefore(gameCanvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type, name) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.name = name;
    this.angle = 0;

    this.rotate = function(angle) {
        this.angle += angle;
    }

    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        if (type === "image") {
            ctx.drawImage(this.image,
                this.width / -2,
                this.height / -2,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        }

        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.name, 0, -this.height / 2 - 10);

        ctx.restore();
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.checkBoundaries();
    }

    this.checkBoundaries = function() {
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > gameCanvas.width) this.x = gameCanvas.width - this.width;
        if (this.y + this.height > gameCanvas.height) this.y = gameCanvas.height - this.height;
    }
}

function Projectile(x, y, angle, speed, shipId, damage) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.width = 5;
    this.height = 5;
    this.shipId = shipId;
    this.damage = damage;

    this.update = function() {
        this.x += Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    this.draw = function(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function updateGameArea() {
    myGameArea.clear();
    for (var i = 0; i < gamePieces.length; i++) {
        gamePieces[i].newPos();
        gamePieces[i].update();
    }

    for (var i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update();
        projectiles[i].draw(myGameArea.context);

        let collisionDetected = false;
        for (var j = 0; j < gamePieces.length; j++) {
            if (checkCollision(projectiles[i], gamePieces[j])) {
                console.log("Collision détectée avec un projectile et " + gamePieces[j].name);


                collisionDetected = true;
                break;
            }
        }

        if (collisionDetected ||
            projectiles[i].x < -50 || projectiles[i].x > gameCanvas.width + 50 ||
            projectiles[i].y < -50 || projectiles[i].y > gameCanvas.height + 50) {
            projectiles.splice(i, 1);
        }
    }
}

function moveForward(address) {
    let boat = boatMap.get(address);
    if (boat) {
        let speed = 0.5;
        boat.speedX = Math.sin(boat.angle) * speed;
        boat.speedY = -Math.cos(boat.angle) * speed;
    } else {
        console.log("Boat not found for address: " + address);
    }
}

function moveBackward(address) {
    let boat = boatMap.get(address);
    if (boat) {
        let speed = -0.25;
        boat.speedX = Math.sin(boat.angle) * speed;
        boat.speedY = -Math.cos(boat.angle) * speed;
    } else {
        console.log("Boat not found for address: " + address);
    }
}

function clearMove(address) {
    let boat = boatMap.get(address);
    if (boat) {
        boat.speedX = 0;
        boat.speedY = 0;
    } else {
        console.log("Boat not found for address: " + address);
    }
}

function rotateClockwise(address) {
    let boat = boatMap.get(address);
    if (boat) {
        boat.rotate(Math.PI / 9);
    } else {
        console.log("Boat not found for address: " + address);
    }
}

function rotateCounterClockwise(address) {
    let boat = boatMap.get(address);
    if (boat) {
        boat.rotate(-Math.PI / 9);

    } else {
        console.log("Boat not found for address: " + address);
    }
}

function shoot(address) {
    let boat = boatMap.get(address);
    if (boat) {
        let projectileSpeed = 5;
        let distanceAhead = 40;
        let projectileX = boat.x + boat.width / 2 + Math.sin(boat.angle) * distanceAhead;
        let projectileY = boat.y + boat.height / 2 - Math.cos(boat.angle) * distanceAhead;

        let projectile = new Projectile(
            projectileX,
            projectileY,
            boat.angle,
            projectileSpeed,
            address,
            10
        );
        projectiles.push(projectile);
    } else {
        console.log("Boat not found for address: " + address);
    }
}

function checkCollision(projectile, boat) {
    if (projectile.shipId === boat.name) {
        return false;
    }
    let translatedX = projectile.x - (boat.x + boat.width / 2);
    let translatedY = projectile.y - (boat.y + boat.height / 2);

    let rotatedX = translatedX * Math.cos(-boat.angle) - translatedY * Math.sin(-boat.angle);
    let rotatedY = translatedX * Math.sin(-boat.angle) + translatedY * Math.cos(-boat.angle);

    return Math.abs(rotatedX) < boat.width / 2 && Math.abs(rotatedY) < boat.height / 2;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function refresh(){
    apiReceive()
        .then(text => {
            if (text != null && text !== "") {
                let command = text.split(";");

                let address = command[0];
                let action = command[1];

                if (boatMap.has(address)){
                    if (action === "MoveForward") {
                        moveForward(address);
                    } else if (action === "MoveBackward") {
                        moveBackward(address);
                    } else if (action === "RotateClockwise") {
                        rotateClockwise(address);
                    } else if (action === "RotateCounterClockwise") {
                        rotateCounterClockwise(address);
                    } else if (action === "ClearMove") {
                        clearMove(address);
                    } else if (action === "Shoot") {
                        shoot(address);
                    }
                } else {
                    if (action === "CreateBoat") {
                        let boatName = command[2];
                        createBoat(boatName, address);
                    }
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function apiReceive() {
    return fetch('/api/update')
        .then(response => {
            if (!response.ok) {
                throw new Error("" + response.status);
            }
            return response.text();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}


function apiSend(message){
    fetch('/api/update', {
        method: 'POST',
        body: message,
    })
}

setInterval(refresh, 1000);