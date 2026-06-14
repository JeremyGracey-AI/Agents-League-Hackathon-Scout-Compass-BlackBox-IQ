// Unit tests for the IQ grounding layer — focus on the Work IQ Gateway path
// and the env-gated enablement. No network: global.fetch is stubbed.
import { test } from "node:test";
import assert from "node:assert/strict";
import { registerGroundingTools, groundingSummary } from "../dist/ground.js";

const IQ_PREFIXES = ["FOUNDRY_IQ_", "FABRIC_IQ_", "WORK_IQ_"];
function clearIqEnv() {
  for (const k of Object.keys(process.env)) {
    if (IQ_PREFIXES.some((p) => k.startsWith(p))) delete process.env[k];
  }
}
// Minimal stand-in for McpServer: captures each tool's handler by name.
function fakeServer() {
  const tools = {};
  return { tools, registerTool(name, _def, handler) { tools[name] = handler; } };
}
async function callTool(handler, args) {
  const r = await handler(args);
  return JSON.parse(r.content[0].text);
}

test("no IQ env → registers nothing; summary is 'off'", () => {
  clearIqEnv();
  const s = fakeServer();
  assert.deepEqual(registerGroundingTools(s), []);
  assert.equal(groundingSummary(), "IQ grounding: off");
});

test("Work IQ gateway needs BOTH gateway URL and user token", () => {
  clearIqEnv();
  process.env.WORK_IQ_GATEWAY = "https://workiq.example";
  assert.ok(!groundingSummary().includes("work-iq"), "gateway alone must not enable");
  process.env.WORK_IQ_USER_TOKEN = "tok";
  assert.ok(groundingSummary().includes("work-iq"), "gateway + token enables");
});

test("ground_work_iq gateway path: conversation + chat → parsed source:work-iq reply", async () => {
  clearIqEnv();
  process.env.WORK_IQ_GATEWAY = "https://workiq.example";
  process.env.WORK_IQ_USER_TOKEN = "tok";
  process.env.WORK_IQ_TIMEZONE = "America/New_York";
  const orig = global.fetch;
  const calls = [];
  global.fetch = async (url, opts) => {
    const u = String(url);
    calls.push({ u, method: opts?.method, body: opts?.body });
    if (u.endsWith("/rest/beta/conversations")) {
      return { ok: true, status: 200, statusText: "OK", json: async () => ({ id: "conv-1" }) };
    }
    if (u.includes("/chat")) {
      return { ok: true, status: 200, statusText: "OK", json: async () => ({ messages: [{ text: "Net-60 needs sign-off; Vandelay flagged.", attributions: [{ id: 1 }] }] }) };
    }
    throw new Error("unexpected url " + u);
  };
  try {
    const s = fakeServer();
    const names = registerGroundingTools(s);
    assert.ok(names.includes("ground_work_iq"));
    const out = await callTool(s.tools.ground_work_iq, { query: "net-60 vendor terms?" });
    assert.equal(out.source, "work-iq");
    assert.equal(out.available, true);
    assert.match(out.results[0].excerpt, /Net-60 needs sign-off/);
    assert.match(out.instruction, /\[work:/, "instruction must steer [work:] citations");
    // verify it actually hit the conversations endpoint then chat with locationHint
    assert.ok(calls.some((c) => c.u.endsWith("/conversations")));
    const chat = calls.find((c) => c.u.includes("/chat"));
    assert.match(chat.body, /America\/New_York/, "chat body carries locationHint.timeZone");
  } finally {
    global.fetch = orig;
  }
});

test("ground_work_iq gateway failure → available:false with error (graceful)", async () => {
  clearIqEnv();
  process.env.WORK_IQ_GATEWAY = "https://workiq.example";
  process.env.WORK_IQ_USER_TOKEN = "expired";
  const orig = global.fetch;
  global.fetch = async () => ({ ok: false, status: 401, statusText: "Unauthorized", json: async () => ({}) });
  try {
    const s = fakeServer();
    registerGroundingTools(s);
    const out = await callTool(s.tools.ground_work_iq, { query: "x" });
    assert.equal(out.available, false);
    assert.match(out.error, /401/);
  } finally {
    global.fetch = orig;
  }
});
