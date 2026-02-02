import express from "express";
import "dotenv/config";

const app = express();
const Port = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import compression from "compression";

import passport from "passport";
import "./strategies/localStrategy.mjs";
import "./strategies/discordStrategy.mjs";
import "./strategies/githubStrategy.mjs";

import { RedisStore } from "connect-redis";
import { redis } from "./db/redis.mjs";

import helmet from "helmet";

// MiddleWares
// app.set("trust proxy", 1);
// app.use(helmet());
// app.use(compression());
app.use(express.json());
app.use(cookieParser(SECRET));
app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 5, // 5 minutes
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use("/api", routers);

app.get("/", (req, res) => {
  res.send("Yalla API is Running...");
});

// Listner
app.listen(Port, () => {
  console.log("Running in Port: ", Port);
});
