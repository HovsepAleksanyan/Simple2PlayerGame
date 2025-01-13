// createing 2d context for canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// getting html elements for showing players' bullets quantity
const player1Bullets = document.getElementById("player1Bullets");
const player2Bullets = document.getElementById("player2Bullets");

// getting html elements for showing players' hits
const player1Hits = document.getElementById("player1Hits");
const player2Hits = document.getElementById("player2Hits");


// 2 playernern el kkaravarvin u krakelu knpken sxmeluc 2 playernern el kkrake
// aysinqn 2-i bulletneri array i mej kavelnan bulletnery iranc cordinatnerov u knkkarvin
// u sahmanic durs galuc heto kjnjvin 
// Naev ka bulletneri qanak vorn or kereva u prcneluc heto karmirov kgrvi 0 

// data about game
const data = {
    player1: {
        x: 10,
        y: 10,
        xDelta: 0,
        yDelta: 0,
        width: 30,
        height: 30,
        fillStyle: "steelblue",
        bullets: [],
        bulletData: {
            width: 5,
            height: 5,
            speed: 5,

            count: 10,
            color: "blue"
        },
        hits: 0,
        topBorderTouch: false,
        bottomBorderTouch: false
    },
    player2: {
        x: 260,
        y: 110,
        xDelta: 0,
        yDelta: 0,
        width: 30,
        height: 30,
        fillStyle: "seagreen",
        bullets: [],
        bulletData: {
            width: 6,
            height: 4,
            speed: 5,

            count: 10,
            color: "green"
        },
        hits: 0,
        topBorderTouch: false,
        bottomBorderTouch: false
    },
};

// this code is chatGPT's, becaues I did not know how to make canvas responsive
function resizeCanvas() {
    // Set the canvas width and height to match the CSS dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/* All data changes/uppdates are here. This function works only with data, not for drawing */
function update() {
    /*
        We are adding delta to y, so every time rendering the y coordinate changes or not
        Depending on what value has delta our object can move faster/slower or stop if delta is 0
    */
    data.player1.y += data.player1.yDelta;
    data.player2.y += data.player2.yDelta;

    /*
        We are adding bullet speed (delta) to every bullet's x coordinate
        and it moves continuosly, because bullet speed is always > 0
        We are doing this for both players/objects
    */
    data.player1.bullets.forEach((bullet) => {
        bullet.x += data.player1.bulletData.speed;
    });
    data.player2.bullets.forEach((bullet) => {
        bullet.x -= data.player2.bulletData.speed;
    })

    /*
        Here we are deleting each bullet that has come out from cavnas border
    */
    data.player1.bullets = data.player1.bullets.filter((bullet) => {
        return bullet.x <= canvas.width;
    })
    data.player2.bullets = data.player2.bullets.filter((bullet) => {
        return bullet.x >= 0;
    })

    /*
        if a player's bullet hits the other player
    */
    data.player1.bullets = data.player1.bullets.filter((bullet) => { // checking that the bullet is inside the object //player 1
        if (
            bullet.x >= data.player2.x &&
            bullet.x + data.player1.bulletData.width <= data.player2.x + data.player2.width &&
            bullet.y >= data.player2.y &&
            bullet.y + data.player1.bulletData.height <= data.player2.y + data.player2.height
        ) {
            data.player1.hits++;
            return false;
        };
        return true;
    });
    data.player2.bullets = data.player2.bullets.filter((bullet) => {
        if (
            bullet.x < data.player1.x + data.player1.width &&
            bullet.x > data.player1.x &&
            bullet.y >= data.player1.y &&
            bullet.y <= data.player1.y + data.player1.height
        ) {
            data.player2.hits++;
            return false;
        };
        return true;
    });

    /*
        If the player touches a border
    */
    touchBorder(data.player1);
    touchBorder(data.player2);

    // checking if players are on 0 bullets
    if (
        data.player1.bulletData.count === 0 &&
        data.player2.bulletData.count === 0 &&
        data.player1.bullets.length === 0 &&
        data.player2.bullets.length === 0
    ) {
        checkWinner();
    } else if (data.player1.hits === 10) {
        endGame(data.player1);
    } else if (data.player2.hits === 10) {
        endGame(data.player2);
    }
}

/* Drawing the game */
function draw() {
    /*
        In this code the canvas is getting 'cleaned'
        if we don't do this the object will not move, it will leave a line behind it
        like with brush doing it on a paper or a real canvas
    */
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Drawing players
    context.fillStyle = data.player1.fillStyle;
    context.fillRect(data.player1.x, data.player1.y, data.player1.width, data.player1.height);

    context.fillStyle = data.player2.fillStyle;
    context.fillRect(data.player2.x, data.player2.y, data.player2.width, data.player2.height);


    /*
        Drawing bullets. They'll move beacues 60 times per second is called this function 
        and every time with different coordinates, becuase we 
        add speed value to x  every time before rendering
    */
    data.player1.bullets.forEach((bullet) => {
        context.strokeStyle = data.player1.bulletData.color;
        context.strokeRect(
            bullet.x, bullet.y,
            data.player1.bulletData.width,
            data.player1.bulletData.height);
    });
    player1Bullets.innerHTML = data.player1.bulletData.count;

    data.player2.bullets.forEach((bullet) => {
        context.strokeStyle = data.player2.bulletData.color
        context.strokeRect(
            bullet.x,
            bullet.y,
            data.player2.bulletData.width,
            data.player2.bulletData.height
        );
    })
    player2Bullets.innerHTML = data.player2.bulletData.count;

    // if user is out of bullets the number of bullets is red
    if (data.player1.bulletData.count === 0) {
        player1Bullets.style.color = "red";
    }
    if (data.player2.bulletData.count === 0) {
        player2Bullets.style.color = "red";
    }

    // drawing players' hits
    player1Hits.innerHTML = "Player 1: " + data.player1.hits;
    player2Hits.innerHTML = "Player 2: " + data.player2.hits;
}

// Listening for keys to decide what to do
document.addEventListener("keydown", (evt) => {
    switch (evt.code) {
        // moving object
        case "ArrowUp":
            if (!data.player2.topBorderTouch) {
                data.player2.yDelta = -2;
            }
            data.player2.bottomBorderTouch = false;
            break;
        case "ArrowDown":
            if (!data.player2.bottomBorderTouch) {
                data.player2.yDelta = 2;
            }
            data.player2.topBorderTouch = false;
            break;
        case "Enter": // adding bullet to the array
            if (data.player2.bulletData.count > 0) {
                data.player2.bullets.push({
                    x: data.player2.x,
                    y: data.player2.y + data.player2.height / 2.2,
                })
                data.player2.bulletData.count--;
            }
            break;

        case "KeyW":
            if (!data.player1.topBorderTouch) { // will let to move only if is not touching top border
                data.player1.yDelta = -2;
            }
            data.player1.bottomBorderTouch = false; // if goes up after tocuhing bottom border we set te touch to false so we can go down again
            break;
        case "KeyS":
            if (!data.player1.bottomBorderTouch) { // if touches the bottom border will not move
                data.player1.yDelta = 2;
            }
            data.player1.topBorderTouch = false; // after touching top it oes down and the touch status for top is false
            break;
        case "Space":
            if (data.player1.bulletData.count > 0) {
                data.player1.bullets.push({
                    x: data.player1.x + data.player1.width,
                    y: data.player1.y + data.player1.height / 2.2,
                })
                data.player1.bulletData.count--;
            }
            break;

        default:
            break;
    };
});

document.addEventListener("keyup", (evt) => {
    /*
        Here we check which key is up to stop only the current player move
        In the version before when any key was up, two players stopped

        And yeah, this is chatGPT's code. But I would come to
    */
    switch (evt.code) {
        case "KeyW":
        case "KeyS":
            data.player1.yDelta = 0;
            break;
        case "ArrowUp":
        case "ArrowDown":
            data.player2.yDelta = 0;
            break;
        default:
            break;
    }
});

function touchBorder(player) {
    if (player.y <= 0) {
        player.topBorderTouch = true;
        player.yDelta = 0;
    } else if (player.y + player.height >= canvas.height) {
        player.yDelta = 0;
        player.bottomBorderTouch = true;
    }
}

/* The logic for checking the winner converted in the function */
function checkWinner() {
    if (data.player1.hits === data.player2.hits) {
        endGame("no one")

    } else if (data.player1.hits > data.player2.hits) {
        endGame(data.player1);

    } else if (data.player1.hits < data.player2.hits) {
        endGame(data.player2);

    };
}

function endGame(winner) {
    console.log(winner);

}

// I don't understand this very well
function loop() {
    requestAnimationFrame(loop); // calling this function before rendering EVERY time

    update();
    draw();
}


loop();