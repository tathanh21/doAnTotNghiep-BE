import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
var cors = require("cors");
require("dotenv").config();
let app = express();

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT;

app.listen(port, () => {
  console.log("back end nodejs is running the port:" + port);
});
