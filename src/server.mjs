import express from "express";

const app = express();
const Port = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

// MiddleWares
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
app.use("/api", routers);

app.get("/", (req, res) => {
  req.session.user_id = "12345";
  req.session.role = "manager";
  res.status(200).send({
    sessionId: req.sessionID,
    session: req.session,
  });
});

// Listner
app.listen(Port, () => {
  console.log("Running in Port: ", Port);
});
