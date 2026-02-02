import { supabase } from "../db/supabase.mjs";
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const createUser = async (userData) => {
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      username: userData.username,
      provider: userData.provider || null,
      provider_id: userData.providerId || null,
      role: userData.role || "customer",
      password: userData.password
        ? await hashPassword(userData.password)
        : null,
    })
    .select()
    .single();
  return { user, error };
};

export const findUserByUsername = async (username) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  return { user, error };
};

export const findUserById = async (id) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  return { user, error };
};
