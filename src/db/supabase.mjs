import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = "https://glziskjjdkghvtfghepf.supabase.co";
const supabaseKey = "sb_publishable_21iY5V2un1PFiIBbhi3wpQ_i2pC3Qmv";

export const supabase = createClient(supabaseUrl, supabaseKey);
