import { Router } from "express";
import { supabase } from "../db/supabase.mjs";
const router = Router();

router.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;

  const { error } = await supabase
    .from("users")
    .insert({ username, password, role });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json({ message: "User created successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();
  if (error || !data) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.status(200).json({ message: "Login successful", user: data });
});
export default router;
