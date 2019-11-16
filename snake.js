var snake = document.getElementById("snake").getContext("2d");
document.getElementById("snake").width = window.screen.width;
document.getElementById("snake").height = window.screen.height;
const dw = window.screen.width / 384;
const dh = window.screen.height / 216;
window.WebSocket = window.WebSocket || window.MozWebSocket;

let positions = [0, 0, 1, 0];
let positions2 = [0, 0, 20, 0];
let expos = [0, 0];
let moving = 0;
let connection = new WebSocket('ws://192.168.0.21:80');
let Sound;
let Loose;
let Fire;
let Falling;
let BTSound;
let Win = 0;
let Laser = {
    IsFiring: false,
    Horizontal: true,
    c: 100,
    len: 1
}

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

fetch('http://192.168.0.21:80/fire')
    .then(response => response.text())
    .then(data => {
        Fire = 'data:audio/wav;base64,' + data;
    });

fetch('http://192.168.0.21:80/falling')
    .then(response => response.text())
    .then(data => {
        Falling = 'data:audio/wav;base64,' + data;
    });

fetch('http://192.168.0.21:80/bts')
    .then(response => response.text())
    .then(data => {
        BTSound = 'data:audio/wav;base64,' + data;
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
    if(Win !== 3) {
        positions = res.positions1;
        positions2 = res.positions2;
        Laser = res.Laser;
        expos = res.expos;
    }
}

function Down(win, speed = 1, pos = 0) {
    if(win === 1) {
        positions2[pos * 2 + 1] += speed;
    } else {
        positions[pos * 2 + 1] += speed;
    }
    if(positions[pos * 2 + 1] > 216 | positions2[pos * 2 + 1] > 216) {
        new Audio(Falling).play();
        pos++;
        speed = 0.8;
    }

    if(pos < (positions.length > positions2.length ? positions2.length / 2 : positions.length / 2)) {
        requestAnimationFrame(() => Down(win, speed + 0.2, pos));
    } else {
        setTimeout(() => new Audio(BTSound).play(), 2000);
    }
}

function DrawGame() {
    snake.fillStyle = "#00000040";
    snake.fillRect(0, 0, window.screen.width, window.screen.height);

    snake.fillStyle = "#ffffff";
    snake.fillRect(expos[0] * dw, expos[1] * dh, dw, dh);

    if(positions.length > positions2.length) {
        snake.fillStyle = "#ff5555";
    } else {
        snake.fillStyle = "#ffaaaa";
    }
    for(let i = 0; i < positions.length; i += 2) {
        snake.fillRect(positions[i] * dw, positions[i + 1] * dh, dw, dh);
    }

    if(positions.length < positions2.length) {
        snake.fillStyle = "#5555ff";
    } else {
        snake.fillStyle = "#aaaaff";
    }
    for(let i = 0; i < positions2.length; i += 2) {
        snake.fillRect(positions2[i] * dw, positions2[i + 1] * dh, dw, dh);
    }

    if(Win !== 0 & Win !== 3) {
        let win = Win;
        setTimeout(() => Down(win), 4000);
        
        Win = 3;
    }
    
    if(Laser.IsFiring) {
        snake.fillStyle = "#ffffff";
        new Audio(Fire).play();
        if(Laser.Horizontal) {
            snake.fillRect(0, Laser.c * dh, window.screen.width, Laser.len * dh);
        } else {
            snake.fillRect(Laser.c * dw, 0, Laser.len * dw, window.screen.height);
        }
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