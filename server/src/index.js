const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const http = require('http');
const { setupWebsocket } = require('./websocket');
const uri = 'mongodb+srv://admin:omnistack@clusteromnistack.oi5tg.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri);

const app = express();
const server = http.Server(app);

setupWebsocket(server);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3030, ()=>{
    console.log("**This Application is Running!**");
});