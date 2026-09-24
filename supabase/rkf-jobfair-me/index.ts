// Public "my options" endpoint for candidates.
//
// A candidate who has already registered types the mobile number they
// registered with and gets back their own row plus every company they can sit
// for on the day. No passcode, because the people this is for cannot be given
// one, and no login, because a rural candidate on a borrowed phone will not
// create an account.
//
// The mobile number is the key, so this is deliberately narrow:
//
//   * Only the candidate's own first name, department, qualification,
//     experience and town come back. Never the email, never the resume link,
//     never anybody else's row.
//   * Company fields returned are the same ones already printed on the public
//     job fair page. Nothing a company typed in private comes back.
//   * A write re-resolves the candidate from the mobile on the server. The
//     browser never gets to name which candidate a sign up belongs to, so
//     knowing a candidate id is not enough to sign anybody up.
//   * A number that is not registered gets a plain "not found". No hint about
//     which numbers exist beyond the one asked for.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MAX_PICKS = 5;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

// Same last ten digits rule the intake and the unique index use, so a number
// typed with a country code or spaces still finds the right person.
const last10 = (s: unknown) => String(s ?? "").replace(/\D/g, "").slice(-10);

const CAND_COLS =
  "id,name,department,qualification,experience,village,taluka,district,city,resume_url";

const CORP_COLS = "id,organization,positions,departments";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let body: Record<string, unknown> = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const action = String(body.action || "lookup");
  const mobile = last10(body.mobile);
  if (mobile.length !== 10) return json({ ok: false, error: "bad_mobile" }, 400);

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // One live row per mobile is guaranteed by the partial unique index, so this
  // either finds the person or there is nobody to find.
  const { data: cand, error: candErr } = await db
    .from("rkf_jobfair_candidates")
    .select(CAND_COLS)
    .eq("mobile10", mobile)
    .is("removed_at", null)
    .maybeSingle();

  if (candErr) {
    console.error("me lookup failed", candErr.message);
    return json({ ok: false, error: "read_failed" }, 500);
  }
  if (!cand) return json({ ok: true, found: false });

  if (action === "sit") {
    const corporate_id = String(body.corporate_id || "");
    if (!corporate_id) return json({ ok: false, error: "bad_request" }, 400);

    // A candidate may only sign up for a company that is actually coming.
    const { data: corp, error: corpErr } = await db
      .from("rkf_jobfair_corporates")
      .select("id")
      .eq("id", corporate_id)
      .is("removed_at", null)
      .maybeSingle();
    if (corpErr) {
      console.error("me sit corp read failed", corpErr.message);
      return json({ ok: false, error: "write_failed" }, 500);
    }
    if (!corp) return json({ ok: false, error: "unknown_company" }, 404);

    const on = body.on !== false;

    // Five companies at most. One person cannot queue at more desks than that
    // in a single day, and every extra slot is a seat another candidate needed.
    if (on) {
      const { data: live, error: liveErr } = await db
        .from("rkf_jobfair_interviews")
        .select("corporate_id")
        .eq("candidate_id", cand.id)
        .is("removed_at", null);
      if (liveErr) {
        console.error("me sit count failed", liveErr.message);
        return json({ ok: false, error: "write_failed" }, 500);
      }
      // A pick for a company that has since pulled out does not use up a slot.
      const { data: liveCorps } = await db
        .from("rkf_jobfair_corporates")
        .select("id")
        .is("removed_at", null);
      const coming = new Set((liveCorps || []).map((r) => r.id));
      const ids = (live || []).map((r) => r.corporate_id).filter((id) => coming.has(id));
      if (!ids.includes(corporate_id) && ids.length >= MAX_PICKS) {
        return json({ ok: false, error: "limit", max: MAX_PICKS }, 409);
      }
    }

    const fit = Number.isFinite(Number(body.fit)) ? Math.round(Number(body.fit)) : null;
    const bandName = body.band ? String(body.band).slice(0, 24) : null;
    const now = new Date().toISOString();

    const { error } = await db
      .from("rkf_jobfair_interviews")
      .upsert(
        {
          candidate_id: cand.id,
          corporate_id,
          fit,
          band: bandName,
          updated_at: now,
          removed_at: on ? null : now,
        },
        { onConflict: "candidate_id,corporate_id" },
      );

    if (error) {
      console.error("me sit failed", cand.id, corporate_id, error.message);
      return json({ ok: false, error: "write_failed" }, 500);
    }
    console.log("me sit", on ? "on" : "off", cand.id, corporate_id, fit);
  } else if (action !== "lookup") {
    return json({ ok: false, error: "unknown_action" }, 400);
  }

  const [corpRes, sitRes] = await Promise.all([
    db.from("rkf_jobfair_corporates").select(CORP_COLS).is("removed_at", null),
    db
      .from("rkf_jobfair_interviews")
      .select("corporate_id")
      .eq("candidate_id", cand.id)
      .is("removed_at", null),
  ]);

  if (corpRes.error) {
    console.error("me corp read failed", corpRes.error.message);
    return json({ ok: false, error: "read_failed" }, 500);
  }
  if (sitRes.error) console.error("me sits read failed", sitRes.error.message);

  // resume_url itself is never sent back. Whether a resume exists is, because
  // the score uses it and the candidate is told to bring one if it is missing.
  const { resume_url, ...safe } = cand as Record<string, unknown>;

  return json({
    ok: true,
    found: true,
    candidate: { ...safe, has_resume: Boolean(resume_url) },
    corporates: corpRes.data ?? [],
    // Only picks for companies still coming, so the tally matches the cards.
    chosen: (sitRes.data ?? [])
      .map((r: { corporate_id: string }) => r.corporate_id)
      .filter((id: string) => (corpRes.data ?? []).some((c: { id: string }) => c.id === id)),
  });
});
