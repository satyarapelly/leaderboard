import { createClient } from "@/lib/supabase/server";

type Row = {
  location_id: string;
  mandal: string;
  contacts: number;
  activities_done: number;
  programs_running: number;
  beneficiaries_reached: number;
  coverage_score: number;
};

export default async function Dashboard() {
  let rows: Row[] = [];
  let error: string | null = null;

  try {
    const supabase = createClient();
    const { data, error: e } = await supabase
      .from("mandal_coverage")
      .select("*")
      .order("coverage_score", { ascending: false });
    if (e) error = e.message;
    else rows = (data as Row[]) ?? [];
  } catch (err: any) {
    error = err?.message ?? "Supabase not configured yet — see SETUP.md";
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--navy)" }}>
        Mission 2028 — Command Center
      </h1>
      <p style={{ color: "#666", marginTop: 4 }}>
        Mandal coverage leaderboard. Toggle to state scope and full modules to come (see README).
      </p>

      <h2 style={{ marginTop: 28, fontSize: 18, color: "var(--navy)" }}>
        Mandal coverage leaderboard
      </h2>

      {error && (
        <div style={{ marginTop: 12, padding: 12, background: "#fff4e5", borderRadius: 8 }}>
          Could not load data: {error}. Run the migration + seed and set <code>.env.local</code> (see SETUP.md).
        </div>
      )}

      <ol style={{ marginTop: 12, listStyle: "none", padding: 0 }}>
        {rows.map((r, i) => {
          const max = rows[0]?.coverage_score || 1;
          const pct = Math.max(4, Math.round((r.coverage_score / max) * 100));
          return (
            <li key={r.location_id} style={{ margin: "8px 0", padding: 12, background: "#fff", borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{i + 1}. {r.mandal}</strong>
                <span style={{ color: "var(--gold)", fontWeight: 700 }}>{Math.round(r.coverage_score)}</span>
              </div>
              <div style={{ height: 6, background: "#eee", borderRadius: 4, marginTop: 8 }}>
                <div style={{ width: pct + "%", height: 6, background: "var(--navy)", borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 12, color: "#777", marginTop: 6 }}>
                {r.contacts} contacts · {r.activities_done} activities · {r.programs_running} programs · {r.beneficiaries_reached} reached
              </div>
            </li>
          );
        })}
        {rows.length === 0 && !error && (
          <li style={{ color: "#777" }}>No data yet — add contacts, activities and programs to populate the leaderboard.</li>
        )}
      </ol>
    </div>
  );
}
