import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videosRouter from "./routers/videosRouter";
import {localsMiddleware} from "./middlewares";
import apiRouter from "./routers/apiRouter";


const PORT = 4000;

const app = express();

const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({extended: true}));

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    })
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/videos", videosRouter);
app.use("/api", apiRouter);



const handleListening = () => 
    console.log(`✅Server listenting on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);