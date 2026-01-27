import { createUser, findUserByUsername } from "../utils/helpers.mjs";
import passport from "passport";

// Controllers
export const signUpController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { user: existingUser } = await findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const { data: user, error } = await createUser(username, password);
    if (error) {
      return res.status(404).send({ message: "Error creating user", error });
    }

    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const logIncontroller = (req, res) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    });
  })(req, res);
};
