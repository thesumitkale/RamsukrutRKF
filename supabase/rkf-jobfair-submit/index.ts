// Ramsukrut Job Fair 2026 intake.
// Accepts one form submission, stores the file privately, writes one row.
// It cannot read anything back out.
//
// One person is one row. People resubmit constantly: they fix a spelling, they
// come back with a resume they did not have on the first try, a helper at a
// college fills the form again on their behalf. Earlier every one of those made
// a new row, so the headline count was wrong by a quarter. Now a repeat on the
// same mobile updates the row we already hold and never creates a second one.
// A partial unique index on the live rows enforces the same thing underneath,
// so even a race between two taps cannot get two rows in.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const SRK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "rkf-jobfair";
const TEN_YEARS = 315360000;
const MAX_BYTES = 5 * 1024 * 1024;
const OK_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const auth = { Authorization: `Bearer ${SRK}`, apikey: SRK };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Max-Age": "86400",
};

function reply(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function clean(v: FormDataEntryValue | null, max = 600): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

function safeName(n: string): string {
  const base = n.replace(/[^\w.\- ]+/g, "_").replace(/\s+/g, "_");
  return base.slice(-120) || "file";
}

async function storeFile(kind: string, file: File): Promise<[string, string]> {
  if (file.size > MAX_BYTES) throw new Error("file_too_large");
  const type = file.type || "application/octet-stream";
  if (!OK_MIME.includes(type)) throw new Error("file_type_not_allowed");

  const path = `${kind}/${crypto.randomUUID()}/${safeName(file.name)}`;
  const up = await fetch(`${URL_}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": type, "x-upsert": "false" },
    body: new Uint8Array(await file.arrayBuffer()),
  });
  if (!up.ok) throw new Error(`upload_failed:${up.status}:${await up.text()}`);

  const sign = await fetch(`${URL_}/storage/v1/object/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ expiresIn: TEN_YEARS }),
  });
  if (!sign.ok) return ["", file.name];
  const { signedURL } = await sign.json();
  return [`${URL_}/storage/v1${signedURL}`, file.name];
}

// Only overwrite with something. A resubmitted form that leaves a field blank
// must not wipe an answer the person already gave us.
function merge(
  existing: Record<string, unknown>,
  incoming: Record<string, unknown>,
): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(incoming)) {
    if (v === "" || v === null || v === undefined) continue;
    if (String(existing[k] ?? "") === String(v)) continue;
    patch[k] = v;
  }
  return patch;
}

async function findLive(table: string, query: string) {
  const r = await fetch(`${URL_}/rest/v1/${table}?${query}&removed_at=is.null&limit=1`, {
    headers: { ...auth },
  });
  if (!r.ok) return null;
  const rows = await r.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function updateRow(table: string, id: string, patch: Record<string, unknown>) {
  if (!Object.keys(patch).length) return;
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return reply(405, { ok: false, error: "method_not_allowed" });

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return reply(400, { ok: false, error: "bad_form" });
  }

  // Honeypot. Real people never see this field.
  if (clean(fd.get("website"))) return reply(200, { ok: true });

  const kind = clean(fd.get("kind"), 20);
  const lang = clean(fd.get("lang"), 10) || "en";
  const file = fd.get("file");
  const hasFile = file instanceof File && file.size > 0;

  try {
    if (kind === "candidate") {
      const name = clean(fd.get("name"), 120);
      const mobile = clean(fd.get("mobile"), 20).replace(/[^\d+]/g, "");
      if (!name || mobile.replace(/\D/g, "").length < 10) {
        return reply(400, { ok: false, error: "name_and_mobile_required" });
      }
      let resume_url = "", resume_name = "";
      if (hasFile) [resume_url, resume_name] = await storeFile("resumes", file as File);
      const village = clean(fd.get("village"), 120);
      const taluka = clean(fd.get("taluka"), 120);
      const district = clean(fd.get("district"), 120);
      const row: Record<string, unknown> = {
        name,
        mobile,
        email: clean(fd.get("email"), 160),
        department: clean(fd.get("department"), 200),
        qualification: clean(fd.get("qualification"), 200),
        experience: clean(fd.get("experience"), 100),
        village,
        taluka,
        district,
        // city is retained so the older rows and any hand shared link keep working.
        city: clean(fd.get("city"), 120),
        lang,
        source: clean(fd.get("source"), 120) || "website",
      };
      // The resume only moves if they actually attached one this time.
      if (resume_url) {
        row.resume_url = resume_url;
        row.resume_name = resume_name;
      }

      const digits = mobile.replace(/\D/g, "").slice(-10);
      const seen = await findLive("rkf_jobfair_candidates", `mobile10=eq.${digits}&select=*`);
      if (seen) {
        await updateRow("rkf_jobfair_candidates", String(seen.id), merge(seen, row));
        return reply(200, { ok: true, updated: true });
      }

      if (!resume_url) { row.resume_url = ""; row.resume_name = ""; }
      try {
        await insertRow("rkf_jobfair_candidates", row);
      } catch (e) {
        // Two taps in the same instant. The index caught the second one, so
        // treat it as the update it always meant to be.
        if (!String((e as Error).message).includes("23505")) throw e;
        const now = await findLive("rkf_jobfair_candidates", `mobile10=eq.${digits}&select=*`);
        if (!now) throw e;
        await updateRow("rkf_jobfair_candidates", String(now.id), merge(now, row));
        return reply(200, { ok: true, updated: true });
      }
      return reply(200, { ok: true });
    }

    if (kind === "corporate") {
      const organization = clean(fd.get("organization"), 200);
      const contact_name = clean(fd.get("contact_name"), 120);
      if (!organization || !contact_name) {
        return reply(400, { ok: false, error: "organization_and_contact_required" });
      }
      let jd_url = "", jd_name = "";
      if (hasFile) [jd_url, jd_name] = await storeFile("jds", file as File);
      const mobile = clean(fd.get("mobile"), 20);
      const email = clean(fd.get("email"), 160);
      const row: Record<string, unknown> = {
        organization,
        contact_name,
        title: clean(fd.get("title"), 120),
        email,
        mobile,
        positions: clean(fd.get("positions"), 100),
        compensation: clean(fd.get("compensation"), 100),
        departments: clean(fd.get("departments"), 400),
        notes: clean(fd.get("notes"), 2000),
        lang,
        source: clean(fd.get("source"), 120) || "website",
      };
      if (jd_url) { row.jd_url = jd_url; row.jd_name = jd_name; }

      // No index here. Employers spell their own name three ways and two real
      // desks can share a head office switchboard, so this matches on the
      // things that are actually the same desk and leaves the rest alone.
      const norm = (v: unknown) =>
        String(v ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ")
          .replace(/\b(pvt|private|ltd|limited|llp|inc|co|company|india)\b/g, " ")
          .replace(/\s+/g, " ").trim();
      const tail = (v: unknown) => String(v ?? "").replace(/\D/g, "").slice(-10);

      const all = await fetch(
        `${URL_}/rest/v1/rkf_jobfair_corporates?removed_at=is.null&select=*`,
        { headers: { ...auth } },
      );
      const liveRows = all.ok ? await all.json() : [];
      const wantOrg = norm(organization);
      const wantTail = tail(mobile);
      const seen = Array.isArray(liveRows)
        ? liveRows.find((c: Record<string, unknown>) =>
          (wantOrg && norm(c.organization) === wantOrg) ||
          (wantTail.length === 10 && tail(c.mobile) === wantTail) ||
          (!!email && String(c.email ?? "").toLowerCase() === email.toLowerCase())
        )
        : null;

      if (seen) {
        await updateRow("rkf_jobfair_corporates", String(seen.id), merge(seen, row));
        return reply(200, { ok: true, updated: true });
      }

      if (!jd_url) { row.jd_url = ""; row.jd_name = ""; }
      await insertRow("rkf_jobfair_corporates", row);
      return reply(200, { ok: true });
    }

    return reply(400, { ok: false, error: "unknown_kind" });
  } catch (e) {
    return reply(400, { ok: false, error: String((e as Error).message || e) });
  }
});
