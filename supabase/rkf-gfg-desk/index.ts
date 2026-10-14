// Read and tidy side of Games for Good. Serves the private desk at /#/gfg-desk.
// Guarded by a passcode that lives only here on the server.
// Remove only stamps removed_at, so every row can be restored.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const PASSCODE = "gfg1205";

const TABLES = {
  companies: "rkf_gfg_companies",
  players: "rkf_gfg_players",
  volunteers: "rkf_gfg_volunteers",
} as const;
type Which = keyof typeof TABLES;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-desk-code",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if ((req.headers.get("x-desk-code") || "") !== PASSCODE) return json({ ok: false, error: "bad_code" }, 401);

  let body: Record<string, unknown> = {};
  try { const t = await req.text(); if (t) body = JSON.parse(t); } catch { body = {}; }
  const action = String(body.action || "list");
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  if (action === "remove" || action === "restore") {
    const table = TABLES[String(body.which || "") as Which];
    const id = String(body.id || "");
    if (!table || !id) return json({ ok: false, error: "bad_request" }, 400);
    const patch = action === "remove"
      ? { removed_at: new Date().toISOString(), removed_note: String(body.note || "").slice(0, 200) }
      : { removed_at: null, removed_note: "" };
    const { error } = await db.from(table).update(patch).eq("id", id);
    if (error) {
      // Restoring a row whose mobile or company now has a newer live row would break the one-live-row rule.
      return json({ ok: false, error: error.code === "23505" ? "duplicate_live_row" : "update_failed" }, 409);
    }
    return json({ ok: true });
  }

  const data: Record<string, unknown[]> = {};
  for (const [k, table] of Object.entries(TABLES)) {
    const all: unknown[] = [];
    for (let from = 0; ; from += 1000) {
      const { data: rows, error } = await db.from(table).select("*").order("created_at", { ascending: false }).range(from, from + 999);
      if (error) return json({ ok: false, error: "read_failed" }, 500);
      all.push(...(rows || []));
      if (!rows || rows.length < 1000) break;
    }
    data[k] = all;
  }
  return json({ ok: true, data });
});
