import express from "express";

const app = express();
const Port = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/localStrategy.mjs";

import dotenv from "dotenv";

// MiddleWares
dotenv.config();
app.use(express.json());
app.use(cookieParser("SECRET"));
app.use(
  session({
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 5,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routers);

// Listner
app.listen(Port, () => {
  console.log("Running in Port: ", Port);
});
