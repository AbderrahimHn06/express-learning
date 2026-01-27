import { supabase } from "../db/supabase.mjs";
import { findUserByUsername, hashPassword } from "../utils/helpers.mjs";
import passport from "passport";

// Controllers
export const signUpController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { data: existingUser, error: findError } =
      await findUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        username,
        password: hashedPassword,
        role: "customer",
      })
      .select("id, username, role")
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({
        message: "Error creating user",
        details: insertError.message,
      });
    }

    return res.status(201).json(user);
  } catch (err) {
    console.error("Signup controller crash:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logIncontroller = (req, res) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Bad Credentials" });
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
