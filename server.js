const http = require("http");
const WSServer = require('websocket').server;
const fs = require("fs");
let players = {
    positions1: [1, 0, 2, 0],
    positions2: [21, 0, 22, 0],
    player1: '',
    player2: '',
    move1: 0,
    move2: 0,
    expos: [Math.floor(Math.random() * 384), Math.floor(Math.random() * 216)]
};

function TickGame() {
    for(let i = 0; i < players.positions1.length - 2; i += 2) {
        players.positions1[i] = players.positions1[i + 2];
        players.positions1[i + 1] = players.positions1[i + 3];
    }

    for(let i = 0; i < players.positions1.length; i += 2) {
        if(players.expos[0] === players.positions1[i] & players.expos[1] === players.positions1[i + 1]) {
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
        case "/data": {
            let body = "";
            req.on("data", function(data) {
                body += data;
            });
            req.on("end", function() {
                body = JSON.parse(body);
                if(players.player1 === '') {
                    players.player1 = req.connection.remoteAddress;
                }
                if(players.player2 === '' & players.player1 !== req.connection.remoteAddress) {
                    players.player2 = req.connection.remoteAddress;
                }

                if(req.connection.remoteAddress === players.player1) {
                    players.move1 = body.move;
                }
                if(req.connection.remoteAddress === players.player2) {
                    players.move2 = body.move;
                }
                res.end("ok");
            });
            break;
        };
        // case "/obb": {
        //     res.writeHead(200, {"Content-Type": "text/plain"});
        //     res.end(JSON.stringify(players));
        //     break;
        // };
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
        connection.sendUTF(JSON.stringify(players));
        // process WebSocket message
    });
  
    connection.on('close', function(connection) {
      // close user connection
    });
});

setTimeout(function Exec() {
    TickGame();
    setTimeout(() => Exec(), 40);
});