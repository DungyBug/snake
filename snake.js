var snake = document.getElementById("snake").getContext("2d");

let positions = [0, 0, 1, 0];
let expos = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 108)];
let moving = 0;
let LastTime = new Date();
let GameOver = false;

function DrawGame() {
    snake.fillStyle = "#000000";
    snake.fillRect(0, 0, 192, 108);

    snake.fillStyle = "#ffffff";
    snake.fillRect(expos[0], expos[1], 1, 1);

    snake.fillStyle = "#ffffff";
    for(let i = 0; i < positions.length; i += 2) {
        snake.fillRect(Math.round(positions[i]), Math.round(positions[i + 1]), 1, 1);
    }
}

function TickGame() {
    for(let j = 0; j < positions.length - 2; j += 2) {
        if(positions[positions.length - 2] === positions[j] & positions[positions.length - 1] === positions[j + 1]) {
            alert("Game Over");
            GameOver = true;
        }
    }
    for(let i = 0; i < positions.length - 2; i += 2) {
        positions[i] = positions[i + 2];
        positions[i + 1] = positions[i + 3];
    }

    for(let i = 0; i < positions.length; i += 2) {
        if(expos[0] === positions[i] & expos[1] === positions[i + 1]) {
            for(let i = 0; i < positions.length - 2; i += 2) {
                positions[i] = positions[i + 2];
                positions[i + 1] = positions[i + 3];
            }
            positions[positions.length] = expos[0];
            positions[positions.length] = expos[1];
            expos = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 108)];
            while(expos[0] === positions[i] & expos[1] === positions[i + 1]) {
                expos = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 108)]
            }

            break;
        }
    }

    switch(moving) {
        case 0: {
            positions[positions.length - 2]++;
            positions[positions.length - 2] %= 192;
            break;
        };
        case 1: {
            positions[positions.length - 2]--;
            if(positions[positions.length - 2] < 0) {
                positions[positions.length - 2] = 191;
            }
            positions[positions.length - 2] %= 192;
            break;
        };
        case 2: {
            positions[positions.length - 1]++;
            positions[positions.length - 1] %= 108;
            break;
        };
        case 3: {
            positions[positions.length - 1]--;
            if(positions[positions.length - 1] < 0) {
                positions[positions.length - 1] = 107;
            }
            positions[positions.length - 1] %= 108;
            break;
        };
    }
}


document.addEventListener("keypress", function(e) {
    switch(e.key) {
        case 'a': {
            moving = 1;
            break;
        };
        case 's': {
            moving = 2;
            break;
        };
        case 'w': {
            moving = 3;
            break;
        };
        case 'd': {
            moving = 0;
            break;
        };
    }
})
requestAnimationFrame(function Exec() {
    if(new Date() - LastTime > 40 & GameOver === false) {
        TickGame();
        DrawGame();
        LastTime = new Date();
    }
    requestAnimationFrame(Exec);
})