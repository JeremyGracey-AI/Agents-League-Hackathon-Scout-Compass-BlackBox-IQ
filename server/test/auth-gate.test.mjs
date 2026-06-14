// Integration test for the MCP endpoint auth gate (GGR_KEY).
// Spawns the built server on a test port with a temp vault, then checks that
// /mcp rejects anonymous/wrong keys (401) and accepts the right one, while
// /healthz stays open.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(here, "..");
const repoRoot = path.join(serverDir, "..");
const PORT = 3717;
const KEY = "test-ggr-key-abc123";
const BASE = `http://localhost:${PORT}`;
let child;
let vaultDir;

const mcpBody = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} });
const headers = (auth) => ({
  "Content-Type": "application/json",
  Accept: "application/json, text/event-stream",
  ...(auth ? { Authorization: auth } : {}),
});

before(async () => {
  vaultDir = fs.mkdtempSync(path.join(os.tmpdir(), "ggr-vault-"));
  execSync(`node ${path.join(repoRoot, "demo", "seed-vault.mjs")} ${vaultDir}`, { stdio: "ignore" });
  child = spawn("node", [path.join(serverDir, "dist", "index.js")], {
    env: { ...process.env, MODE: "http", PORT: String(PORT), GGR_KEY: KEY, VAULT_PATH: vaultDir },
    stdio: "ignore",
  });
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`${BASE}/healthz`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error("server did not start in time");
});

after(() => {
  child?.kill("SIGTERM");
  if (vaultDir) fs.rmSync(vaultDir, { recursive: true, force: true });
});

test("/healthz is open (no auth)", async () => {
  const r = await fetch(`${BASE}/healthz`);
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.ok, true);
});

test("/mcp without Authorization → 401", async () => {
  const r = await fetch(`${BASE}/mcp`, { method: "POST", headers: headers(), body: mcpBody });
  assert.equal(r.status, 401);
});

test("/mcp with wrong key → 401", async () => {
  const r = await fetch(`${BASE}/mcp`, { method: "POST", headers: headers("Bearer nope"), body: mcpBody });
  assert.equal(r.status, 401);
});

test("/mcp with correct key → 200 and tools list", async () => {
  const r = await fetch(`${BASE}/mcp`, { method: "POST", headers: headers(`Bearer ${KEY}`), body: mcpBody });
  assert.equal(r.status, 200);
  const body = await r.text(); // streamable HTTP returns SSE
  assert.match(body, /recall_knowledge/, "authenticated tools/list includes the governed tools");
});
