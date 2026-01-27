import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";

// Helpers
import { findUserByUsername, findUserById } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { user, error } = await findUserById(id);

    if (error) {
      return done(error);
    }

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new Strategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        const { user, error } = await findUserByUsername(username);
        if (error || !user || !bcrypt.compareSync(password, user.password)) {
          return done(error, null, { message: "Bad Credentials" });
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);
