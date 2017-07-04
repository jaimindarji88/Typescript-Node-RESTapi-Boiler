import * as express from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as errorHandler from "errorhandler";
import * as session from "express-session";
import * as mongo from "connect-mongo";
import * as dotenv from "dotenv";
import * as compression from "compression";
import * as lusca from "lusca";
import expressValidator = require("express-validator");

dotenv.config({ path: ".env.example" });
mongoose.connect("mongodb://localhost:27017")
mongoose.connection.on("error", () => {
    console.log("error caused when connection to server", this.server);
    process.exit();
});

const MongoStore = mongo(session) 
const app = express()

app.set("port", 3000);
app.use(compression());
app.use(logger("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

