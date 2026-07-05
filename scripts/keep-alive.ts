import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_SECRET_KEY in environment.");
  process.exit(1);
}

const TABLE_NAME = "keep-alive";
const MAX_ROWS = 10;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { error: insertError } = await admin
    .from(TABLE_NAME)
    .insert({ name: crypto.randomBytes(8).toString("hex") });

  if (insertError) {
    console.error("Insert failed:", insertError.message);
    process.exit(1);
  }
  console.log("Inserted keep-alive row.");

  const { count, error: countError } = await admin
    .from(TABLE_NAME)
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("Count failed:", countError.message);
    process.exit(1);
  }
  console.log(`Current row count: ${count}`);

  if (count !== null && count > MAX_ROWS) {
    const { data: oldest, error: selectError } = await admin
      .from(TABLE_NAME)
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (selectError) {
      console.error("Select oldest row failed:", selectError.message);
      process.exit(1);
    }

    const { error: deleteError } = await admin
      .from(TABLE_NAME)
      .delete()
      .eq("id", oldest.id);

    if (deleteError) {
      console.error("Delete failed:", deleteError.message);
      process.exit(1);
    }
    console.log(`Deleted oldest row (id=${oldest.id}).`);
  } else {
    console.log(`Row count within limit (${MAX_ROWS}). No deletion needed.`);
  }
}

main();
