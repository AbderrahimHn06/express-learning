import passport from "passport";
import { Strategy } from "passport-github2";
import "dotenv/config";

import {
  findUserByUsername,
  createUser,
  findUserById,
} from "../utils/helpers.mjs";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

passport.serializeUser((user, done) => {
  if (!user) {
    return done(new Error("No user to serialize"), null);
  }
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { user, error } = await findUserById(id);
  if (error) {
    return done(error, null);
  }
  if (!user) {
    return done(new Error("User not found during deserialization"), null);
  }
  done(null, user);
});

export default passport.use(
  new Strategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { user } = await findUserByUsername(profile.username);
      if (user) {
        return done(null, user);
      }

      const newUser = {
        username: profile.username,
        provider: "github",
        provider_id: profile.id,
        role: "customer",
      };
      console.log(profile);
      const { user: createdUser, error } = await createUser(newUser);
      if (error) {
        return done(error, null);
      }
      if (!createdUser) {
        return done(new Error("User creation failed"), null);
      }
      return done(null, createdUser);
    },
  ),
);
