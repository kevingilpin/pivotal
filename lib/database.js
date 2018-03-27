const mongoose = require('mongoose');
const MONGO_URI = require('./config/credentials.js');

mongoose.connect(MONGO_URI);

const db = mongoose.connection;
db.on("error", error => console.log("Database Error:", error));
db.once("open", () => console.log("Mongoose connection successful."));