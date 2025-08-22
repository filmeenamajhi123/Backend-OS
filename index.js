require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors"); 
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
})
database.once('connected', () => {
    console.log('Database connected');
})

const app = express();
app.use(cors());
app.use(express.json());
const routes = require('./routes/routes');
app.use('/api', routes);

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
