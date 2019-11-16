const http = require("http");
const WSServer = require('websocket').server;
const fs = require("fs");

let TimeStart = new Date();
let players = {
    positions1: [1, 0, 2, 0],
    positions2: [21, 0, 22, 0],
    player1: '',
    player2: '',
    move1: 0,
    move2: 0,
    expos: [Math.floor(Math.random() * 384), Math.floor(Math.random() * 216)],
    BallIsEaten: false,
    PlayerWin: 0,
    Laser: {
        IsFiring: false,
        Horizontal: true,
        c: 10,
        len: 3
    }
};

function TickGame() {
    players.BallIsEaten = false;
    for(let i = 0; i < players.positions2.length; i++) {
        if(players.positions1[players.positions1.length - 2] === players.positions2[i] & players.positions1[players.positions1.length - 1] === players.positions2[i + 1]) {
            if(players.positions1.length > players.positions2.length) {
                players.PlayerWin = 1;
            }
        }
    }

    for(let i = 0; i < players.positions1.length; i++) {
        if(players.positions2[players.positions2.length - 2] === players.positions1[i] & players.positions2[players.positions2.length - 1] === players.positions1[i + 1]) {
            if(players.positions1.length < players.positions2.length) {
                players.PlayerWin = 2;
            }
        }
    }

    if(players.Laser.IsFiring) {
        if(players.Laser.Horizontal) {
            if(players.positions1[players.positions1.length - 1] === players.Laser.c) {
                players.PlayerWin = 2;
            }

            if(players.positions2[players.positions1.length - 1] === players.Laser.c) {
                players.PlayerWin = 1;
            }
        } else {
            if(players.positions1[players.positions1.length - 2] === players.Laser.c) {
                players.PlayerWin = 2;
            }

            if(players.positions2[players.positions1.length - 2] === players.Laser.c) {
                players.PlayerWin = 1;
            }
        }
    }

    for(let i = 0; i < players.positions1.length - 2; i += 2) {
        players.positions1[i] = players.positions1[i + 2];
        players.positions1[i + 1] = players.positions1[i + 3];
    }

    for(let i = 0; i < players.positions1.length; i += 2) {
        if(players.expos[0] === players.positions1[i] & players.expos[1] === players.positions1[i + 1]) {
            players.BallIsEaten = true;
            for(let i = 0; i < players.positions1.length - 2; i += 2) {
                players.positions1[i] = players.positions1[i + 2];
                players.positions1[i + 1] = players.positions1[i + 3];
            }
            players.positions1[players.positions1.length] = players.expos[0];
            players.positions1[players.positions1.length] = players.expos[1];
            players.expos = [Math.floor(Math.random() * 384), Math.floor(Math.random() * 216)];
            while(players.expos[0] === players.positions1[i] & players.expos[1] === players.positions1[i + 1]) {
                players.expos = [Math.floor(Math.random() * 384), Math.floor(Math.random() * 216)]
            }

            break;
        }
    }

    switch(players.move1) {
        case 0: {
            players.positions1[players.positions1.length - 2]++;
            players.positions1[players.positions1.length - 2] %= 384;
            break;
        };
        case 1: {
            players.positions1[players.positions1.length - 2]--;
            if(players.positions1[players.positions1.length - 2] < 0) {
                players.positions1[players.positions1.length - 2] = 383;
            }
            players.positions1[players.positions1.length - 2] %= 384;
            break;
        };
        case 2: {
            players.positions1[players.positions1.length - 1]++;
            players.positions1[players.positions1.length - 1] %= 216;
            break;
        };
        case 3: {
            players.positions1[players.positions1.length - 1]--;
            if(players.positions1[players.positions1.length - 1] < 0) {
                players.positions1[players.positions1.length - 1] = 215;
            }
            players.positions1[players.positions1.length - 1] %= 216;
            break;
        };
    }

    for(let i = 0; i < players.positions2.length - 2; i += 2) {
        players.positions2[i] = players.positions2[i + 2];
        players.positions2[i + 1] = players.positions2[i + 3];
    }

    for(let i = 0; i < players.positions2.length; i += 2) {
        if(players.expos[0] === players.positions2[i] & players.expos[1] === players.positions2[i + 1]) {
            players.BallIsEaten = true;
            for(let i = 0; i < players.positions2.length - 2; i += 2) {
                players.positions2[i] = players.positions2[i + 2];
                players.positions2[i + 1] = players.positions2[i + 3];
            }
            players.positions2[players.positions2.length] = players.expos[0];
            players.positions2[players.positions2.length] = players.expos[1];
            players.expos = [Math.floor(Math.random() * 384), Math.floor(Math.random() * 216)];
            while(players.expos[0] === players.positions2[i] & players.expos[1] === players.positions2[i + 1]) {
                players.expos = [Math.floor(Math.random() * 384), Math.floor(Math.random() * 216)]
            }

            break;
        }
    }

    switch(players.move2) {
        case 0: {
            players.positions2[players.positions2.length - 2]++;
            players.positions2[players.positions2.length - 2] %= 384;
            break;
        };
        case 1: {
            players.positions2[players.positions2.length - 2]--;
            if(players.positions2[players.positions2.length - 2] < 0) {
                players.positions2[players.positions2.length - 2] = 383;
            }
            players.positions2[players.positions2.length - 2] %= 384;
            break;
        };
        case 2: {
            players.positions2[players.positions2.length - 1]++;
            players.positions2[players.positions2.length - 1] %= 216;
            break;
        };
        case 3: {
            players.positions2[players.positions2.length - 1]--;
            if(players.positions2[players.positions2.length - 1] < 0) {
                players.positions2[players.positions2.length - 1] = 215;
            }
            players.positions2[players.positions2.length - 1] %= 216;
            break;
        };
    }
}

let HTTPServer = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    
    switch(req.url) {
        case "/": {
            fs.readFile("index.html", (err, data) => {
                if(err) {
                    console.log(err);
                }

                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(data);
            });
            break;
        };
        case "/snake.js": {
            fs.readFile("snake.js", (err, data) => {
                if(err) {
                    console.log(err);
                }

                res.writeHead(200, {"Content-Type": "text/javascript"});
                res.end(data);
            });
            break;
        };
        case "/sound": {
            fs.readFile("sound0.wav", (err, data) => {
                if(err) {
                    console.log(err);
                }

                res.writeHead(200, {"Content-Type": "audio/wav"});
                res.end(Buffer.from(data).toString("base64"));
            });
            break;
        };
        case "/loose": {
            fs.readFile("loose.wav", (err, data) => {
                if(err) {
                    console.log(err);
                }

                res.writeHead(200, {"Content-Type": "audio/wav"});
                res.end(Buffer.from(data).toString("base64"));
            });
            break;
        };
        case "/fire": {
            fs.readFile("Fire.wav", (err, data) => {
                if(err) {
                    console.log(err);
                }

                res.writeHead(200, {"Content-Type": "audio/wav"});
                res.end(Buffer.from(data).toString("base64"));
            });
            break;
        };
        case "/falling": {
            fs.readFile("falling.wav", (err, data) => {
                if(err) {
                    console.log(err);
                }

                res.writeHead(200, {"Content-Type": "audio/wav"});
                res.end(Buffer.from(data).toString("base64"));
            });
            break;
        };
        case "/bts": {
            fs.readFile("battletoadssound.wav", (err, data) => {
                if(err) {
                    console.log(err);
                }

                res.writeHead(200, {"Content-Type": "audio/wav"});
                res.end(Buffer.from(data).toString("base64"));
            });
            break;
        };
    }
}).listen(80, () => console.log("Server is started! Have fun!"));

WS = new WSServer({
    httpServer: HTTPServer
});


WS.on('request', function(request) {
    let connection = request.accept(null, request.origin);
    connection.sendUTF(JSON.stringify(players));
  
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if(message.utf8Data === '5') {
            connection.sendUTF(JSON.stringify(players));
            players.Laser.IsFiring = false;
        } else {
            if(players.player1 === '') {
                players.player1 = connection.remoteAddresses[0];
            }
            if(players.player2 === '' & players.player1 !== connection.remoteAddresses[0]) {
                players.player2 = connection.remoteAddresses[0];
            }

            if(connection.remoteAddresses[0] === players.player1) {
                players.move1 = (message.utf8Data + '').charCodeAt() - 48;
            }
            if(connection.remoteAddresses[0] === players.player2) {
                players.move2 = (message.utf8Data + '').charCodeAt() - 48;
            }
        }
        // process WebSocket message
    });
  
    connection.on('close', function(connection) {
      // close user connection
    });
});

setTimeout(function St() {
    players.Laser.c = Math.floor(Math.random() * 384);
    players.Laser.Horizontal = Math.floor(Math.random() * 20) > 10 ? true : false;
    players.Laser.IsFiring = true;
    setTimeout(St, 6000 - (new Date() - TimeStart) / 1000);
}, 6000 - (new Date() - TimeStart) / 1000);

setTimeout(function Exec() {
    if(players.PlayerWin === 0) {
        TickGame();
        setTimeout(() => Exec(), 60 - (new Date() - TimeStart) / 10000);
    }
});