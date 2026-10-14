// Ramsukrut Games for Good 2026 intake: companies, players, volunteers.
// Writes one row per company or person and cannot read anything back out.
// A repeat on the same mobile (players, volunteers) or company name (companies)
// updates the row we already hold. Blank fields never wipe an earlier answer.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const auth = { Authorization: `Bearer ${SRK}`, apikey: SRK };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Max-Age": "86400",
};
const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function clean(v: FormDataEntryValue | null, max = 300): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

const SPEC: Record<string, { table: string; fields: Record<string, number>; required: string[]; key: "mobile" | "org" }> = {
  company: {
    table: "rkf_gfg_companies",
    fields: { organization: 200, group_company: 20, contact_name: 120, title: 120, email: 160, mobile: 20, days: 200, supporters: 40, interests: 300, notes: 1200 },
    required: ["organization", "contact_name", "email", "mobile", "days"],
    key: "org",
  },
  player: {
    table: "rkf_gfg_players",
    fields: { name: 120, mobile: 20, email: 160, company: 200, gender: 30, days: 200, badminton_level: 60, cricket_role: 60, pickleball: 20, tshirt: 10, notes: 1200 },
    required: ["name", "mobile", "company", "days"],
    key: "mobile",
  },
  volunteer: {
    table: "rkf_gfg_volunteers",
    fields: { name: 120, mobile: 20, email: 160, organization: 200, days: 200, roles: 400, tshirt: 10, notes: 1200 },
    required: ["name", "mobile", "days"],
    key: "mobile",
  },
};

function merge(existing: Record<string, unknown>, incoming: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(incoming)) {
    if (v === "" || v === null || v === undefined) continue;
    if (String(existing[k] ?? "") === String(v)) continue;
    patch[k] = v;
  }
  return patch;
}

async function findLive(table: string, query: string) {
  const r = await fetch(`${URL_}/rest/v1/${table}?${query}&removed_at=is.null&select=*&limit=1`, { headers: auth });
  if (!r.ok) return null;
  const rows = await r.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function patchRow(table: string, id: string, patch: Record<string, unknown>) {
  if (!Object.keys(patch).length) return;
  patch.updated_at = new Date().toISOString();
  const r = await fetch(`${URL_}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error(`update_failed:${r.status}:${await r.text()}`);
}

async function insertRow(table: string, row: Record<string, unknown>) {
  const r = await fetch(`${URL_}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insert_failed:${r.status}:${await r.text()}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });

  let fd: FormData;
  try { fd = await req.formData(); } catch { return reply(400, { ok: false, error: "bad_form" }); }

  // Honeypot. Real people never see this field.
  if (clean(fd.get("website"))) return reply(200, { ok: true });

  const kind = clean(fd.get("kind"), 20);
  const spec = SPEC[kind];
  if (!spec) return reply(400, { ok: false, error: "bad_kind" });

  const row: Record<string, unknown> = {};
  for (const [k, max] of Object.entries(spec.fields)) row[k] = clean(fd.get(k), max);
  row.source = clean(fd.get("source"), 120) || "website";

  for (const k of spec.required) if (!row[k]) return reply(400, { ok: false, error: `${k}_required` });
  const digits = String(row.mobile || "").replace(/\D/g, "");
  if (row.mobile && digits.length < 10) return reply(400, { ok: false, error: "bad_mobile" });
  row.mobile = String(row.mobile).replace(/[^\d+]/g, "");
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email))) return reply(400, { ok: false, error: "bad_email" });

  const query = spec.key === "mobile"
    ? `mobile10=eq.${digits.slice(-10)}`
    : `org_key=eq.${encodeURIComponent(String(row.organization).toLowerCase().replace(/[^a-z0-9]+/g, ""))}`;

  try {
    const seen = await findLive(spec.table, query);
    if (seen) {
      await patchRow(spec.table, String(seen.id), merge(seen, row));
      return reply(200, { ok: true, updated: true });
    }
    try {
      await insertRow(spec.table, row);
    } catch (e) {
      if (!String((e as Error).message).includes("23505")) throw e;
      const now = await findLive(spec.table, query);
      if (!now) throw e;
      await patchRow(spec.table, String(now.id), merge(now, row));
      return reply(200, { ok: true, updated: true });
    }
    return reply(200, { ok: true });
  } catch (e) {
    console.error("gfg_submit_error", kind, String((e as Error).message));
    return reply(500, { ok: false, error: "server_error" });
  }
});
