import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
    "https://bzdsgawfbgtfygrpvdfs.supabase.co";

const SUPABASE_KEY =
    "YOUR_PUBLISHABLE_KEY_HERE";

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
