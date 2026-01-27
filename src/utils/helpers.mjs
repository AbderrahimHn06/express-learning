import { supabase } from "../db/supabase.mjs";

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return brcypt.hashSync(password, salt);
};

export const createUser = async (username, password) => {
  const hashedPassword = hashPassword(password);
  const { data, error } = await supabase
    .from("users")
    .insert({
      username,
      password: hashedPassword,
    })
    .select("id, username, role")
    .single();

  return { data, error };
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
