import express from "express";

const app = express();
const Port = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

import passport from "passport";
import "./strategies/localStrategy.mjs";

import { RedisStore } from "connect-redis";
import { redis } from "./db/redis.mjs";

import "dotenv/config";

import { supabase } from "./db/supabase.mjs";

// MiddleWares
app.use(express.json());
app.use(cookieParser("SECRET"));
app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 5, // 5 minutes
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routers);

app.get("/", async (req, res) => {
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("username", "Abderrahim")
    .single();

  if (findError) {
    console.error("Find user error:", findError);
    return res.status(500).json({ message: "Database error" });
  }
  res.status(200).json(existingUser);
});

// Listner
app.listen(Port, () => {
  console.log("Running in Port: ", Port);
});
