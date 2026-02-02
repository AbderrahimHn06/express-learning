import passport from "passport";
import { Strategy } from "passport-discord";
import "dotenv/config";
import {
  findUserByUsername,
  createUser,
  findUserById,
} from "../utils/helpers.mjs";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL;

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const { user, error } = await findUserById(id);
  if (error) {
    return done(error, null);
  }
  done(null, user);
});

export default passport.use(
  new Strategy(
    {
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      callbackURL: DISCORD_CALLBACK_URL,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { user, error: findingError } = await findUserByUsername(
        profile.username,
      );
      if (findingError) {
        return done(findingError, null);
      }
      if (user) {
        return done(null, user);
      }
      const { user: newUser, error: creatingError } = await createUser({
        username: profile.username,
        provider: "discord",
        provider_id: profile.id,
        role: "customer",
      });

      if (creatingError) {
        return done(creatingError, null);
      }
      console.log("done with new user: ", newUser);
      return done(null, newUser);
    },
  ),
);
