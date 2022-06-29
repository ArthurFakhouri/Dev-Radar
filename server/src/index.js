const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const uri = 'mongodb+srv://admin:omnistack@clusteromnistack.oi5tg.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri);

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3030, ()=>{
    console.log("**This Application is Running!**");
});