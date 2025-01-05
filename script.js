// createing 2d context for canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// getting html elements for showing players' bullets quantity
const player1Bullets = document.getElementById("player1Bullets");
const player2Bullets = document.getElementById("player2Bullets");


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
        }
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
        }
    },
};

// this code is chatGPT's, becaues I did not know how to make canvas responsive
function resizeCanvas() {
    // Set the canvas width and height to match the CSS dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Optionally, redraw content or maintain aspect ratio
    draw();
}

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
        return bullet.x < canvas.width;
    })
    data.player2.bullets = data.player2.bullets.filter((bullet) => {
        return bullet.x > 0;
    })
}

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
// hos stex guzem ymbes enemm me dzevim xoski ? : spes or avelord if mif hanem u mekic nkare inch guyn petq e

    if (data.player1.bulletData.count === 0) {
        player1Bullets.style.color = "red";
    }
    if (data.player2.bulletData.count === 0) {
        player2Bullets.style.color = "red";
    }
}


// Listening for keys to decide what to do
document.addEventListener("keydown", (evt) => {
    switch (evt.code) {
        // moving object
        case "ArrowUp":
            data.player2.yDelta = -2;
            break;
        case "ArrowDown":
            data.player2.yDelta = 2;
            break;
        case "Enter": // adding bullet to the array
            if (data.player2.bulletData.count > 0) {
                data.player2.bullets.push({
                    x: data.player2.x,
                    y: data.player2.y + data.player2.height / 2.2,
                });
                data.player2.bulletData.count--;
            }
            break;

        case "KeyW":
            data.player1.yDelta = -2;
            break;
        case "KeyS":
            data.player1.yDelta = 2;
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
    // stop moving the object if a key is not pressed
    data.player1.yDelta = 0;
    data.player2.yDelta = 0;
});


// I don't understand this very well
function loop() {
    requestAnimationFrame(loop); // calling this function before rendering EVERY time

    update();
    draw();
}


loop();