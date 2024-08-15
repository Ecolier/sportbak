var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');

    connection.sendUTF(JSON.stringify({'action': 'session/start', 'params': {"period": 4, "time": 60, "warmup": 60, "pauseTime": 10, "ambiance": true }}))

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

});

client.connect('ws://localhost:8081');
