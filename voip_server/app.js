const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const cors = require('cors');

const uuid = require('node-uuid');
let connectedUsers = [];
const WebSocket = require("ws");
const wss = new WebSocket.Server({port:8080});
wss.on('connection', (ws) => {
    ws.id = uuid.v4();
    connectedUsers.push(ws);
    console.log('con open-' + connectedUsers.length);

    ws.on('message', (res) => {
        connectedUsers.forEach( item => {
            if (item.readyState !== WebSocket.OPEN) {
                console.log('con closed-' + connectedUsers.length);
                return connectedUsers = connectedUsers.filter(wsoc => wsoc.id !== item.id);
            }
            if(item.id !== ws.id) {
                item.send(res);
            }
        });
    });
    ws.on('close', _ => {
        connectedUsers = connectedUsers.filter(item => item.id !== ws.id);
        console.log('con closed-' + connectedUsers.length);
    });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({origins: '*'}));
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
