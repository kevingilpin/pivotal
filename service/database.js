const mongoose = require('mongoose');
const MONGO = require('../config/credentials').mongo;

mongoose.connect(MONGO.development.connectionString);

const db = mongoose.connection;
db.on("error", error => console.log("Database Error:", error));
db.once("open", () => console.log("Mongoose connection successful."));