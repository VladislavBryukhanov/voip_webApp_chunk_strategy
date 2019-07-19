const uuid = require('node-uuid');
const WebSocket = require("ws");
let connectedUsers = [];

const initVoip = () => {
    const wss = new WebSocket.Server({ port: 31315 });

    wss.on('connection', (client) => {
        client.id = uuid.v4();
        connectedUsers.push(client);
        console.log('con open-' + connectedUsers.length);

        client.on('message', (data) => {
            connectedUsers.forEach( item => {
                if (item.readyState !== WebSocket.OPEN) {
                    console.log('con closed-' + connectedUsers.length);
                    return connectedUsers = connectedUsers.filter(user => user.id !== item.id);
                }

                if(item.id !== client.id) {
                    item.send(data);
                }
            });
        });

        client.on('close', _ => {
            connectedUsers = connectedUsers.filter(item => item.id !== client.id);
            console.log('con closed-' + connectedUsers.length);
        });
    });
};

module.exports = initVoip;
