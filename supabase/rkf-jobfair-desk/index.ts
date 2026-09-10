// Read and tidy side of the Job Fair intake. Serves the private volunteer desk.
//
// Guarded by a passcode that lives only here on the server. The page never
// contains it. A wrong or missing code returns 401 and reveals nothing.
//
// Removal here is deliberately not a delete. A volunteer at a busy desk taps
// the wrong row eventually, so "remove" only stamps removed_at. The row stays
// in the table, still shows under Removed, and one tap puts it back. Nothing a
// candidate typed can be destroyed from a browser.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const PASSCODE = "rkf2926";

const TABLES = {
  candidates: {
    table: "rkf_jobfair_candidates",
    cols:
      "id,created_at,name,mobile,email,department,qualification,experience,village,taluka,district,city,resume_url,resume_name,lang,removed_at,removed_note",
    limit: 3000,
  },
  corporates: {
    table: "rkf_jobfair_corporates",
    cols:
      "id,created_at,organization,contact_name,title,email,mobile,positions,compensation,departments,jd_url,jd_name,notes,lang,removed_at,removed_note",
    limit: 800,
  },
} as const;

type Which = keyof typeof TABLES;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info, x-desk-code",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const code = req.headers.get("x-desk-code") || "";
  if (code !== PASSCODE) return json({ ok: false, error: "bad_code" }, 401);

  // Older desk builds post no body at all, so an unreadable body means "list".
  let body: Record<string, unknown> = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    body = {};
  }

  const action = String(body.action || "list");
  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  if (action === "remove" || action === "restore") {
    const which = String(body.which || "") as Which;
    const spec = TABLES[which];
    const id = String(body.id || "");
    if (!spec || !id) return json({ ok: false, error: "bad_request" }, 400);

    if (action === "remove") {
      const note = String(body.note || "").slice(0, 200);

      // The hourly Sheet mirror picks up rows that have never been synced. A
      // junk row removed before its turn would still land in the sheet, so it
      // is stamped as synced here and the stamp is remembered, letting restore
      // put it back in the queue.
      const { data: before, error: readErr } = await db
        .from(spec.table)
        .select("synced_at")
        .eq("id", id)
        .maybeSingle();
      if (readErr) {
        console.error("desk remove read failed", which, id, readErr.message);
        return json({ ok: false, error: "write_failed" }, 500);
      }
      if (!before) return json({ ok: false, error: "not_found" }, 404);

      const now = new Date().toISOString();
      const patch: Record<string, unknown> = { removed_at: now, removed_note: note || null };
      if (!before.synced_at) {
        patch.synced_at = now;
        patch.sync_forced_at = now;
      }

      const { error } = await db.from(spec.table).update(patch).eq("id", id);
      if (error) {
        console.error("desk remove failed", which, id, error.message);
        return json({ ok: false, error: "write_failed" }, 500);
      }
      console.log("desk removed", which, id, note);
      return json({ ok: true, action, id });
    }

    const { data: before, error: readErr } = await db
      .from(spec.table)
      .select("sync_forced_at,synced_at")
      .eq("id", id)
      .maybeSingle();
    if (readErr) {
      console.error("desk restore read failed", which, id, readErr.message);
      return json({ ok: false, error: "write_failed" }, 500);
    }
    if (!before) return json({ ok: false, error: "not_found" }, 404);

    const patch: Record<string, unknown> = { removed_at: null, removed_note: null };
    if (before.sync_forced_at && before.sync_forced_at === before.synced_at) {
      patch.synced_at = null;
      patch.sync_forced_at = null;
    }

    const { error } = await db.from(spec.table).update(patch).eq("id", id);
    if (error) {
      console.error("desk restore failed", which, id, error.message);
      return json({ ok: false, error: "write_failed" }, 500);
    }
    console.log("desk restored", which, id);
    return json({ ok: true, action, id });
  }

  if (action !== "list") return json({ ok: false, error: "unknown_action" }, 400);

  const read = (which: Which) =>
    db
      .from(TABLES[which].table)
      .select(TABLES[which].cols)
      .order("created_at", { ascending: false })
      .limit(TABLES[which].limit);

  const [cand, corp] = await Promise.all([read("candidates"), read("corporates")]);

  if (cand.error || corp.error) {
    console.error("desk read failed", cand.error?.message, corp.error?.message);
    return json({ ok: false, error: "read_failed" }, 500);
  }

  const live = (rows: Record<string, unknown>[]) => rows.filter((r) => !r.removed_at);
  const gone = (rows: Record<string, unknown>[]) => rows.filter((r) => r.removed_at);

  const candRows = (cand.data ?? []) as Record<string, unknown>[];
  const corpRows = (corp.data ?? []) as Record<string, unknown>[];

  return json({
    ok: true,
    at: new Date().toISOString(),
    candidates: live(candRows),
    corporates: live(corpRows),
    removed_candidates: gone(candRows),
    removed_corporates: gone(corpRows),
  });
});
