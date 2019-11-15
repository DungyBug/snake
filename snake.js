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
connection.onmessage = function(message) {
    let res = JSON.parse(message.data);
    positions = res.positions1;
    positions2 = res.positions2;
    expos = res.expos;
}

function DrawGame() {
    snake.fillStyle = "#000000";
    snake.fillRect(0, 0, window.outerWidth, window.outerHeight);

    snake.fillStyle = "#ffffff";
    snake.fillRect(expos[0] * dw, expos[1] * dh, dw, dh);

    snake.fillStyle = "#ffffff";
    for(let i = 0; i < positions.length; i += 2) {
        snake.fillRect(positions[i] * dw, positions[i + 1] * dh, dw, dh);
    }
    for(let i = 0; i < positions2.length; i += 2) {
        snake.fillRect(positions2[i] * dw, positions2[i + 1] * dh, dw, dh);
    }
}

// function TickGame() {
//     for(let j = 0; j < positions.length - 2; j += 2) {
//         if(positions[positions.length - 2] === positions[j] & positions[positions.length - 1] === positions[j + 1]) {
//             GameOver = true;
//         }
//     }
//     for(let i = 0; i < positions.length - 2; i += 2) {
//         positions[i] = positions[i + 2];
//         positions[i + 1] = positions[i + 3];
//     }

//     for(let i = 0; i < positions.length; i += 2) {
//         if(expos[0] === positions[i] & expos[1] === positions[i + 1]) {
//             for(let i = 0; i < positions.length - 2; i += 2) {
//                 positions[i] = positions[i + 2];
//                 positions[i + 1] = positions[i + 3];
//             }
//             positions[positions.length] = expos[0];
//             positions[positions.length] = expos[1];
//             expos = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 108)];
//             while(expos[0] === positions[i] & expos[1] === positions[i + 1]) {
//                 expos = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 108)]
//             }

//             break;
//         }
//     }

//     switch(moving) {
//         case 0: {
//             positions[positions.length - 2]++;
//             positions[positions.length - 2] %= 192;
//             break;
//         };
//         case 1: {
//             positions[positions.length - 2]--;
//             if(positions[positions.length - 2] < 0) {
//                 positions[positions.length - 2] = 191;
//             }
//             positions[positions.length - 2] %= 192;
//             break;
//         };
//         case 2: {
//             positions[positions.length - 1]++;
//             positions[positions.length - 1] %= 108;
//             break;
//         };
//         case 3: {
//             positions[positions.length - 1]--;
//             if(positions[positions.length - 1] < 0) {
//                 positions[positions.length - 1] = 107;
//             }
//             positions[positions.length - 1] %= 108;
//             break;
//         };
//     }
// }


document.addEventListener("keypress", function(e) {
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
    fetch("http://192.168.0.21:80/data", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({move: moving}), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
});

setTimeout(() => requestAnimationFrame(function Exec() {
    // fetch('http://192.168.0.21:80/obb')
    //     .then(response => response.json())
    //     .then(data => {
    //         resp = data;
    //         expos = data.expos;
    //         positions = data.positions1;
    //         positions2 = data.positions2;
    //     })
    DrawGame();
    connection.send(0);
    requestAnimationFrame(Exec);
}), 100);