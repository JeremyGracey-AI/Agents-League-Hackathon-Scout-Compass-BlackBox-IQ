"""Flask web UI for GM Louis (Compass-BlackBox IQ).

Run:
    cd compass-rose
    pip install flask pyyaml jinja2
    python web/app.py
    # open http://127.0.0.1:5000

Endpoints:
    GET  /              -> form
    GET  /api/personas  -> list personas
    POST /generate      -> render skill(s) and return preview JSON
    POST /download      -> render skill(s) and return a zip
"""
from __future__ import annotations

import io
import os
import sys
import zipfile
from pathlib import Path

import yaml
from flask import Flask, Response, jsonify, render_template, request, send_file

# Make CLI module importable.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "cli"))


def _load_env_file(path: Path) -> None:
    """Minimal .env loader (no dependency) so local dev can set Supabase config."""
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())


_load_env_file(Path(__file__).resolve().parent / ".env")

# Frontend config (safe to expose). When unset, the app runs without accounts —
# the persona library + sign-in simply stay hidden. The publishable key is RLS-gated.
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

from compass import (  # noqa: E402
    PERSONAS_DIR,
    WORKFLOWS,
    load_persona,
    persona_from_data,
    render_skill,
    validate_skill_md,
)
import automations  # noqa: E402

app = Flask(__name__, template_folder="templates", static_folder="static")

# Presentation metadata for the skills picker + catalog (web only; the generator
# in cli/ stays the source of truth for how each archetype renders). Any archetype
# not listed here still works — index() falls back to label-only, category "Other".
WORKFLOW_META = {
    "briefing": {
        "blurb": "One-page exec brief — KPI table, who's in the room, talking points.",
        "triggers": ["brief me on", "prep me for", "give me a pre-read on"],
        "recurring": False, "category": "Prep & brief",
    },
    "meeting-prep": {
        "blurb": "Run-of-show for a specific meeting — agenda, attendees, decisions to land.",
        "triggers": ["prep me for my meeting with", "build an agenda for", "run of show for"],
        "recurring": False, "category": "Prep & brief",
    },
    "one-on-one": {
        "blurb": "1:1 prep card — since last time, follow-ups both ways, one growth note.",
        "triggers": ["prep for my 1:1 with", "follow-ups from my last 1:1 with"],
        "recurring": True, "category": "Prep & brief",
    },
    "comms": {
        "blurb": "Audience-mode draft with three subject lines and risk flags.",
        "triggers": ["draft", "reply to", "send a note to"],
        "recurring": False, "category": "Communicate",
    },
    "triage": {
        "blurb": "Daily/weekly digest — top-of-mind, compliance flags, KPI exceptions, delegations.",
        "triggers": ["morning digest", "what needs me today", "triage my inbox"],
        "recurring": True, "category": "Operate",
    },
    "decisions-log": {
        "blurb": "Durable decision record — the call, options, owner, follow-ups, review date.",
        "triggers": ["log this decision", "record what we decided", "what did we decide about"],
        "recurring": False, "category": "Operate",
    },
    "strategy": {
        "blurb": "Two-to-four page memo — recommendation, options table, sequencing, open questions.",
        "triggers": ["analyze", "build the case for", "strategic view on"],
        "recurring": False, "category": "Decide & review",
    },
    "review-prep": {
        "blurb": "MBR/QBR pack — KPI scorecard, narrative, wins, risks with recovery owners.",
        "triggers": ["prep my QBR", "build my monthly business review", "pull my KPI scorecard"],
        "recurring": True, "category": "Decide & review",
    },
}

# One-click presets: a named bundle of archetypes for a common executive mode.
WORKFLOW_PRESETS = [
    {"id": "daily", "label": "Daily driver",
     "description": "Everyday cockpit: triage, briefings, and 1:1 prep.",
     "workflows": ["triage", "briefing", "one-on-one"]},
    {"id": "meetings", "label": "Meetings & decisions",
     "description": "Walk in ready, walk out with the decision logged.",
     "workflows": ["meeting-prep", "one-on-one", "decisions-log"]},
    {"id": "review", "label": "Leadership review",
     "description": "Business reviews and the strategy + decisions behind them.",
     "workflows": ["review-prep", "strategy", "decisions-log"]},
    {"id": "all", "label": "The works",
     "description": "All eight archetypes.",
     "workflows": list(WORKFLOWS.keys())},
]


def _persona_summary(path: Path) -> dict:
    p = load_persona(path)
    return {
        "file": path.name,
        "id": p.id,
        "display_name": p.display_name,
        "title": p.title,
        "org": p.org,
    }


@app.route("/")
def index():
    personas = [_persona_summary(p) for p in sorted(PERSONAS_DIR.glob("*.yaml"))]
    workflows = []
    for k, v in WORKFLOWS.items():
        meta = WORKFLOW_META.get(k, {})
        workflows.append({
            "id": k,
            "label": v["title_suffix"],
            "blurb": meta.get("blurb", ""),
            "triggers": meta.get("triggers", []),
            "recurring": meta.get("recurring", False),
            "category": meta.get("category", "Other"),
        })
    return render_template(
        "index.html",
        personas=personas,
        workflows=workflows,
        presets=WORKFLOW_PRESETS,
        supabase_url=SUPABASE_URL,
        supabase_key=SUPABASE_ANON_KEY,
    )


@app.route("/api/personas")
def api_personas():
    return jsonify([_persona_summary(p) for p in sorted(PERSONAS_DIR.glob("*.yaml"))])


@app.route("/api/validate", methods=["POST"])
def api_validate():
    """Validate a SKILL.md body — used by the installed-skills manager for status."""
    data = request.get_json(force=True)
    content = data.get("content", "") or ""
    slug = data.get("slug") or None
    report = validate_skill_md(content, expected_slug=slug)
    return jsonify({"valid": report.ok, "errors": report.errors, "warnings": report.warnings})


def _render_batch(persona_file: str, workflows: list[str], prefix: str | None) -> list[dict]:
    persona_path = PERSONAS_DIR / persona_file
    persona = load_persona(persona_path)
    slug_prefix = (prefix or persona.first_name).lower().strip().replace(" ", "-")
    out = []
    for wf in workflows:
        if wf not in WORKFLOWS:
            continue
        slug = f"{slug_prefix}-{WORKFLOWS[wf]['default_slug_suffix']}"
        content = render_skill(workflow=wf, persona=persona, slug=slug)
        report = validate_skill_md(
            content, expected_slug=slug, exec_name=persona.first_name
        )
        out.append(
            {
                "workflow": wf,
                "slug": slug,
                "filename": f"{slug}/SKILL.md",
                "content": content,
                "valid": report.ok,
                "errors": report.errors,
                "warnings": report.warnings,
            }
        )
    return out


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(force=True)
    persona_file = data.get("persona")
    workflows = data.get("workflows", [])
    prefix = data.get("prefix")
    if not persona_file or not workflows:
        return jsonify({"error": "persona and workflows are required"}), 400
    try:
        results = _render_batch(persona_file, workflows, prefix)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    return jsonify({"results": results})


@app.route("/download", methods=["POST"])
def download():
    data = request.get_json(force=True)
    persona_file = data.get("persona")
    workflows = data.get("workflows", [])
    prefix = data.get("prefix")
    if not persona_file or not workflows:
        return jsonify({"error": "persona and workflows are required"}), 400

    results = _render_batch(persona_file, workflows, prefix)
    persona = load_persona(PERSONAS_DIR / persona_file)
    autos = automations.build_automations(persona, workflows, prefix=prefix)

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for r in results:
            zf.writestr(r["filename"], r["content"])
        for a in autos:
            zf.writestr(
                f"automations/{automations.slugify(a.name)}.automation.yaml",
                automations.render_automation_yaml(a),
            )
        if autos:
            zf.writestr("automations/manifest.json", automations.render_manifest(autos))
            zf.writestr("automations/SETUP.md", automations.render_setup_md(autos))
        zf.writestr(
            "README.txt",
            "Drop the skill folders into ~/.copilot/skills/ on the machine running "
            "Microsoft Scout. Each subfolder contains a SKILL.md that Scout discovers "
            "automatically on the next conversation.\n\n"
            "The automations/ folder holds Scout automation definitions. See "
            "automations/SETUP.md to add them (import, or paste into Automations > New "
            "automation).\n",
        )
    buf.seek(0)
    zip_name = f"{(prefix or 'exec').lower()}-scout-skills.zip"
    return send_file(
        buf,
        mimetype="application/zip",
        as_attachment=True,
        download_name=zip_name,
    )


# --------------------------------------------------------------------------- #
# v1 app API: build from an inline (form) persona or a saved one. The browser
# does the install/manage via the File System Access API; the server only renders.
# --------------------------------------------------------------------------- #
def _persona_from_payload(data: dict):
    """Build a Persona from an inline form dict (`persona_data`) or a saved file (`persona`)."""
    inline = data.get("persona_data")
    if inline:
        return persona_from_data(inline, source="form")
    persona_file = data.get("persona")
    if persona_file:
        return load_persona(PERSONAS_DIR / persona_file)
    raise ValueError("Provide persona fields or choose a saved persona.")


def _skill_results(persona, workflows: list[str], prefix: str | None) -> list[dict]:
    slug_prefix = (prefix or persona.first_name).lower().strip().replace(" ", "-")
    results = []
    for wf in workflows:
        if wf not in WORKFLOWS:
            continue
        slug = f"{slug_prefix}-{WORKFLOWS[wf]['default_slug_suffix']}"
        content = render_skill(workflow=wf, persona=persona, slug=slug)
        report = validate_skill_md(content, expected_slug=slug, exec_name=persona.first_name)
        results.append(
            {
                "workflow": wf,
                "slug": slug,
                "path": f"{slug}/SKILL.md",
                "content": content,
                "valid": report.ok,
                "errors": report.errors,
                "warnings": report.warnings,
            }
        )
    return results


def _automation_files(persona, workflows: list[str], prefix: str | None) -> list[dict]:
    autos = automations.build_automations(persona, workflows, prefix=prefix)
    files = [
        {
            "filename": f"{automations.slugify(a.name)}.automation.yaml",
            "content": automations.render_automation_yaml(a),
        }
        for a in autos
    ]
    if autos:
        files.append({"filename": "manifest.json", "content": automations.render_manifest(autos)})
        files.append({"filename": "SETUP.md", "content": automations.render_setup_md(autos)})
    return files


@app.route("/api/generate", methods=["POST"])
def api_generate():
    data = request.get_json(force=True)
    workflows = data.get("workflows", [])
    prefix = data.get("prefix")
    if not workflows:
        return jsonify({"error": "Select at least one workflow."}), 400
    try:
        persona = _persona_from_payload(data)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(
        {
            "skills": _skill_results(persona, workflows, prefix),
            "automations": _automation_files(persona, workflows, prefix),
        }
    )


@app.route("/api/download", methods=["POST"])
def api_download():
    data = request.get_json(force=True)
    workflows = data.get("workflows", [])
    prefix = data.get("prefix")
    if not workflows:
        return jsonify({"error": "Select at least one workflow."}), 400
    try:
        persona = _persona_from_payload(data)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    skills = _skill_results(persona, workflows, prefix)
    autos = _automation_files(persona, workflows, prefix)
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for s in skills:
            zf.writestr(s["path"], s["content"])
        for f in autos:
            zf.writestr(f"automations/{f['filename']}", f["content"])
        zf.writestr(
            "README.txt",
            "Drop the skill folders into ~/.copilot/skills/ on the machine running "
            "Microsoft Scout. See automations/SETUP.md to add the automations.\n",
        )
    buf.seek(0)
    name = (prefix or persona.first_name or "exec").lower().strip().replace(" ", "-")
    return send_file(
        buf, mimetype="application/zip", as_attachment=True,
        download_name=f"{name}-scout-skills.zip",
    )


# --------------------------------------------------------------------------- #
# Persona export: download what the builder produced (or a saved persona) as a
# ready-to-commit personas/<id>.yaml. Stateless — validates and serializes, but
# stores nothing, so a browser-built executive can be seeded into the repo.
# --------------------------------------------------------------------------- #
def _prune_empty(value):
    """Drop empty strings / lists / dicts so the exported YAML stays tidy.

    Run only after persona validation, which guarantees the required fields are
    present and non-empty — so they are never pruned.
    """
    if isinstance(value, dict):
        cleaned = {}
        for key, item in value.items():
            pruned = _prune_empty(item)
            if pruned not in ("", [], {}, None):
                cleaned[key] = pruned
        return cleaned
    if isinstance(value, list):
        kept = (_prune_empty(item) for item in value)
        return [item for item in kept if item not in ("", [], {}, None)]
    return value


def _persona_yaml_text(raw: dict) -> str:
    """Serialize a (validated) persona mapping to commit-ready YAML with a header."""
    key_order = (
        "id", "display_name", "title", "org", "charter", "scope", "priorities",
        "voice_and_style", "decision_filters", "people", "delegates", "cadence",
        "escalation_rules", "automations", "provenance",
    )
    ordered = {k: raw[k] for k in key_order if k in raw}
    ordered.update({k: v for k, v in raw.items() if k not in ordered})  # keep any extras
    body = yaml.safe_dump(_prune_empty(ordered), sort_keys=False, allow_unicode=True)
    return (
        f"# Persona: {raw.get('display_name', 'Untitled')}\n"
        "# Generated by GM Louis (Compass Rose). Edit freely, save under personas/,\n"
        "# then run: python cli/compass.py --persona personas/<this-file>.yaml\n"
        f"{body}"
    )


@app.route("/api/persona-yaml", methods=["POST"])
def api_persona_yaml():
    """Export the current persona as a downloadable personas/<id>.yaml file.

    A built (inline ``persona_data``) persona is validated, then emitted as YAML
    that ``load_persona`` can read back. A saved persona is returned verbatim so
    its curation and comments are preserved.
    """
    data = request.get_json(force=True)
    inline = data.get("persona_data")
    if inline:
        try:
            persona = persona_from_data(inline, source="form")
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400
        filename = f"{automations.slugify(persona.id)}.yaml"
        return Response(
            _persona_yaml_text(inline),
            mimetype="application/x-yaml",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    persona_file = data.get("persona")
    if not persona_file:
        return jsonify({"error": "Provide persona fields or choose a saved persona."}), 400
    # Saved persona: return the curated file as-is, guarded against path traversal.
    path = (PERSONAS_DIR / persona_file).resolve()
    if path.parent != PERSONAS_DIR.resolve() or path.suffix != ".yaml" or not path.exists():
        return jsonify({"error": "Unknown saved persona."}), 400
    return Response(
        path.read_text(encoding="utf-8"),
        mimetype="application/x-yaml",
        headers={"Content-Disposition": f'attachment; filename="{path.name}"'},
    )


# ---- Tab 2: GM Louis — live F.A.M. reasoning + grounding trace ----
# Calls the real BlackBox IQ (GGR) MCP server and surfaces the orthogonal seam:
# Vault (governed memory) + Foundry IQ (Facts) + Work IQ (Activity) + Fabric IQ (Meaning).
import json as _json
import urllib.request as _urlreq

MCP_URL = os.environ.get("MCP_URL", "http://127.0.0.1:3000/mcp")
GGR_KEY = os.environ.get("GGR_KEY", "")


def _mcp_call(tool, arguments, timeout=55):
    """One MCP tools/call against the GGR server; parses the streamable-HTTP (SSE) reply."""
    payload = {"jsonrpc": "2.0", "id": 1, "method": "tools/call",
               "params": {"name": tool, "arguments": arguments}}
    headers = {"Content-Type": "application/json",
               "Accept": "application/json, text/event-stream"}
    if GGR_KEY:
        headers["Authorization"] = f"Bearer {GGR_KEY}"
    req = _urlreq.Request(MCP_URL, data=_json.dumps(payload).encode(), method="POST", headers=headers)
    with _urlreq.urlopen(req, timeout=timeout) as r:
        raw = r.read().decode("utf-8", "replace")
    for line in raw.splitlines():
        if line.startswith("data:"):
            try:
                msg = _json.loads(line[5:].strip())
            except Exception:
                continue
            if isinstance(msg, dict) and "result" in msg:
                try:
                    return _json.loads(msg["result"]["content"][0]["text"])
                except Exception:
                    return msg["result"]
    return None


def _hosted_showcase() -> bool:
    """True on a hosted deploy (Vercel) with no reachable MCP server — the trace/vault
    views are live features, so render an intentional card instead of a failed fetch."""
    on_vercel = bool(os.environ.get("VERCEL"))
    mcp = MCP_URL or ""
    mcp_local = "127.0.0.1" in mcp or "localhost" in mcp
    return on_vercel and mcp_local


@app.route("/trace")
def trace_page():
    return render_template("trace.html", showcase=_hosted_showcase())


@app.route("/api/trace", methods=["POST"])
def api_trace():
    query = ((request.get_json(silent=True) or {}).get("query") or "").strip()
    if not query:
        return jsonify({"error": "Enter a task or question."}), 400
    out = {"query": query}
    for key, tool in (("vault", "recall_knowledge"),
                      ("foundry", "ground_foundry_iq"),
                      ("work", "ground_work_iq")):
        try:
            out[key] = _mcp_call(tool, {"query": query})
        except Exception as e:  # noqa: BLE001
            out[key] = {"error": str(e)}
    # Fabric IQ (Meaning): ontology authored, not wired live — stay honest.
    out["fabric"] = {"roadmap": True,
                     "note": "Fabric IQ ontology authored (foundry/knowledge-sources/fabric-iq); live wiring is the documented next step."}
    return jsonify(out)


# ---- Tab 3: BlackBox IQ — vault & audit (governed memory) ----
VAULT_PATH = os.environ.get("VAULT_PATH", os.path.expanduser("~/GitHub/scout-compass/vault"))


def _read_decisions(limit=12):
    """Parse decision-record frontmatter straight off the vault on disk (the blackbox)."""
    rows = []
    try:
        for f in sorted(Path(VAULT_PATH, "decisions").glob("*.md")):
            txt = f.read_text(encoding="utf-8")
            if not txt.startswith("---"):
                continue
            meta = yaml.safe_load(txt.split("---", 2)[1]) or {}
            rows.append({"id": meta.get("id"), "agent": meta.get("agent"), "task": meta.get("task"),
                         "outcome": meta.get("outcome"), "confidence": meta.get("confidence"),
                         "citations": meta.get("citations") or []})
    except Exception:  # noqa: BLE001
        pass
    return rows[::-1][:limit]  # newest first


@app.route("/vault")
def vault_page():
    return render_template("vault.html", showcase=_hosted_showcase())


@app.route("/api/vault")
def api_vault():
    # Decisions via the MCP server so the vault tab works when the web app and the
    # MCP server are separate Azure containers; fall back to reading the local vault
    # on disk for single-host / local-dev setups.
    dec = _mcp_call("list_decisions", {}) or {}
    decisions = dec.get("decisions") if isinstance(dec, dict) else None
    if not decisions:
        decisions = _read_decisions()
    audit = _mcp_call("memory_log", {}) or {}
    props = _mcp_call("list_proposals", {}) or {}
    return jsonify({
        "decisions": decisions,
        "audit": (audit.get("log") if isinstance(audit, dict) else None) or [],
        "proposals": (props.get("proposals") if isinstance(props, dict) else None) or [],
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
