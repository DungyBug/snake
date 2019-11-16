var snake = document.getElementById("snake").getContext("2d");
document.getElementById("snake").width = window.outerWidth;
document.getElementById("snake").height = window.outerHeight;
const dw = window.outerWidth / 384;
const dh = window.outerHeight / 216;
window.WebSocket = window.WebSocket || window.MozWebSocket;

let positions = [0, 0, 1, 0];
let positions2 = [0, 0, 20, 0];
let expos = [0, 0];
let moving = 0;
let connection = new WebSocket('ws://192.168.0.21:80');
let Sound;
let Loose;
let Win = 0;

fetch('http://192.168.0.21:80/sound')
    .then(response => response.text())
    .then(data => {
        Sound = 'data:audio/wav;base64,' + data;
    });
    
fetch('http://192.168.0.21:80/loose')
    .then(response => response.text())
    .then(data => {
        Loose = 'data:audio/wav;base64,' + data;
    });

connection.onmessage = function(message) {
    let res = JSON.parse(message.data);
    if(res.BallIsEaten === true) {
        new Audio(Sound).play();
    }
    if(res.PlayerWin !== 0 & Win === 0 & Win !== 3) {
        new Audio(Loose).play();
        Win = res.PlayerWin;
    }
    positions = res.positions1;
    positions2 = res.positions2;
    expos = res.expos;
}

function DrawGame() {
    snake.fillStyle = "#00000040";
    snake.fillRect(0, 0, window.outerWidth, window.outerHeight);

    snake.fillStyle = "#ffffff";
    snake.fillRect(expos[0] * dw, expos[1] * dh, dw, dh);

    snake.fillStyle = "#ffaaaa";
    for(let i = 0; i < positions.length; i += 2) {
        snake.fillRect(positions[i] * dw, positions[i + 1] * dh, dw, dh);
    }
    snake.fillStyle = "#aaaaff";
    for(let i = 0; i < positions2.length; i += 2) {
        snake.fillRect(positions2[i] * dw, positions2[i + 1] * dh, dw, dh);
    }

    if(Win !== 0 & Win !== 3) {
        alert("Player " + Win + " Wins!");
        Win = 3;
    }
}


document.addEventListener("keypress", function(e) {
    let LastMoving = moving;
    switch(e.key) {
        case 'a': {
            moving = moving === 0 ? 0 : 1;
            break;
        };
        case 's': {
            moving = moving === 3 ? 3 : 2;
            break;
        };
        case 'w': {
            moving = moving === 2 ? 2 : 3;
            break;
        };
        case 'd': {
            moving = moving === 1 ? 1 : 0;
            break;
        };
    }
    if(LastMoving !== moving) {
        connection.send(moving);
    }
});

setTimeout(() => requestAnimationFrame(function Exec() {
    DrawGame();
    connection.send(5);
    requestAnimationFrame(Exec);
}), 100);