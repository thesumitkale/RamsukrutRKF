// Games for Good team sheet intake. One row per person per company, keyed on employee ID.
// mode "player": one person enters their own details and events.
// mode "captain": a cricket captain enters themselves plus their players.
// A repeat on the same company + employee ID updates the row we hold. Blank fields never
// wipe an earlier answer, so a captain's entry and a player's own entry merge cleanly.
// Writes only; it cannot read anything back out.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const auth = { Authorization: `Bearer ${SRK}`, apikey: SRK };
const TABLE = "rkf_gfg_roster";
const MAX_PLAYERS = 12;
const SIZES = new Set(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]);
const GENDERS = new Set(["Woman", "Man"]);
const CRICKET = new Set(["", "Company team", "Women\u2019s match"]);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Max-Age": "86400",
};
const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const clean = (v: unknown, max = 200) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
const num = (v: unknown) => { const d = clean(v, 4).replace(/\D/g, ""); return d.length && d.length <= 2 ? d : ""; };

function person(src: Record<string, unknown>, company: string) {
  return {
    company,
    name: clean(src.name, 120),
    employee_id: clean(src.employee_id, 60),
    mobile: clean(src.mobile, 20).replace(/[^\d+]/g, ""),
    gender: GENDERS.has(clean(src.gender, 10)) ? clean(src.gender, 10) : "",
    tshirt: SIZES.has(clean(src.tshirt, 6)) ? clean(src.tshirt, 6) : "",
    shirt_number: num(src.shirt_number),
  };
}

function merge(existing: Record<string, unknown>, incoming: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(incoming)) {
    if (v === "" || v === null || v === undefined) continue;
    if (String(existing[k] ?? "") === String(v)) continue;
    // A captain stays captain if they also fill the player form.
    if (k === "cricket_role" && existing[k] === "Captain") continue;
    patch[k] = v;
  }
  return patch;
}

async function upsert(row: Record<string, unknown>) {
  const ck = key(String(row.company)), ek = key(String(row.employee_id));
  const q = `company_key=eq.${encodeURIComponent(ck)}&emp_key=eq.${encodeURIComponent(ek)}&removed_at=is.null&select=*&limit=1`;
  const find = async () => {
    const r = await fetch(`${URL_}/rest/v1/${TABLE}?${q}`, { headers: auth });
    if (!r.ok) throw new Error(`read_failed:${r.status}`);
    const rows = await r.json();
    return rows.length ? rows[0] : null;
  };
  const patch = async (seen: Record<string, unknown>) => {
    const p = merge(seen, row);
    if (!Object.keys(p).length) return;
    p.updated_at = new Date().toISOString();
    const r = await fetch(`${URL_}/rest/v1/${TABLE}?id=eq.${seen.id}`, {
      method: "PATCH", headers: { ...auth, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(p),
    });
    if (!r.ok) throw new Error(`update_failed:${r.status}`);
  };
  const seen = await find();
  if (seen) { await patch(seen); return "updated"; }
  const r = await fetch(`${URL_}/rest/v1/${TABLE}`, {
    method: "POST", headers: { ...auth, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row),
  });
  if (r.ok) return "added";
  const t = await r.text();
  if (!t.includes("23505")) throw new Error(`insert_failed:${r.status}:${t}`);
  const now = await find();
  if (!now) throw new Error("insert_conflict");
  await patch(now);
  return "updated";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return reply(400, { ok: false, error: "bad_json" }); }
  if (clean(b.website)) return reply(200, { ok: true });

  const mode = clean(b.mode, 10);
  const company = clean(b.company, 200);
  const source = clean(b.source, 120) || "team-sheet";
  if (!company) return reply(400, { ok: false, error: "company_required" });

  try {
    if (mode === "player") {
      const p = person(b, company);
      if (!p.name || !p.employee_id || !p.mobile || !p.gender || !p.tshirt || !p.shirt_number) return reply(400, { ok: false, error: "missing_fields" });
      const mixed = clean(b.mixed_doubles, 4) === "Yes";
      const womens = clean(b.womens_doubles, 4) === "Yes" && p.gender === "Woman";
      let cricket = clean(b.cricket, 30);
      if (!CRICKET.has(cricket)) cricket = "";
      if (cricket === "Women\u2019s match" && p.gender !== "Woman") cricket = "";
      if (cricket === "Company team" && clean(b.cricket_women_too, 4) === "Yes" && p.gender === "Woman") cricket = "Company team + Women\u2019s match";
      if (!mixed && !womens && !cricket) return reply(400, { ok: false, error: "no_event" });
      const row = {
        ...p, source, entered_by: "Self",
        mixed_doubles: mixed ? "Yes" : "", mixed_partner: mixed ? clean(b.mixed_partner, 120) : "", mixed_partner_emp: mixed ? clean(b.mixed_partner_emp, 60) : "",
        womens_doubles: womens ? "Yes" : "", womens_partner: womens ? clean(b.womens_partner, 120) : "", womens_partner_emp: womens ? clean(b.womens_partner_emp, 60) : "",
        cricket, captain_name: cricket ? clean(b.captain_name, 120) : "", cricket_role: cricket ? "Player" : "",
        notes: clean(b.notes, 600),
      };
      const r = await upsert(row);
      return reply(200, { ok: true, result: r });
    }

    if (mode === "captain") {
      const cap = person(b, company);
      let cricket = clean(b.cricket, 30);
      if (!CRICKET.has(cricket) || !cricket) return reply(400, { ok: false, error: "team_type_required" });
      if (!cap.name || !cap.employee_id || !cap.mobile || !cap.tshirt || !cap.shirt_number) return reply(400, { ok: false, error: "captain_fields" });
      const team = clean(b.team_name, 120) || `${company} (${cap.name})`;
      const players = Array.isArray(b.players) ? (b.players as Record<string, unknown>[]).slice(0, MAX_PLAYERS) : [];
      if (!players.length) return reply(400, { ok: false, error: "no_players" });
      const rows = players.map((x) => person(x, company));
      for (const r of rows) if (!r.name || !r.employee_id || !r.tshirt || !r.shirt_number) return reply(400, { ok: false, error: "player_fields" });
      const nums = [cap.shirt_number, ...rows.map((r) => r.shirt_number)];
      if (new Set(nums).size !== nums.length) return reply(400, { ok: false, error: "duplicate_number" });
      const ids = [cap.employee_id, ...rows.map((r) => r.employee_id)].map(key);
      if (new Set(ids).size !== ids.length) return reply(400, { ok: false, error: "duplicate_employee_id" });

      const base = { cricket, cricket_team: team, captain_name: cap.name, source };
      const results: string[] = [];
      results.push(await upsert({ ...cap, ...base, cricket_role: "Captain", entered_by: "Self (captain)", notes: clean(b.notes, 600) }));
      for (const r of rows) results.push(await upsert({ ...r, ...base, cricket_role: "Player", entered_by: `Captain: ${cap.name}` }));
      return reply(200, { ok: true, added: results.filter((x) => x === "added").length, updated: results.filter((x) => x === "updated").length });
    }
    return reply(400, { ok: false, error: "bad_mode" });
  } catch (e) {
    console.error("gfg_roster_error", mode, String((e as Error).message));
    return reply(500, { ok: false, error: "server_error" });
  }
});
