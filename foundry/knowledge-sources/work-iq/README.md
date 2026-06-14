# Work IQ — synthetic organizational context (DEMO DATA)

> **Synthetic, fictional data for the Compass-BlackBox IQ demo.** These files
> stand in for the organizational intelligence Microsoft **Work IQ** surfaces from
> M365 — emails, meetings, chats, documents, org structure — for a single
> executive. **None of it is real.** The persona (**Morgan Reyes**, a General
> Manager) and every name, message, meeting, and decision here are invented. No
> real individual, team, or company is depicted; any resemblance is coincidental.
> Contoso Ltd. is a fictional placeholder enterprise.

## Why this exists

A faithful Work IQ integration needs a live Microsoft 365 tenant we don't have
(and shouldn't pipe real org data into a public demo). So we simulate it: these
files are ingested as a knowledge source (`work-iq-ks`) and queried through the
read-only `ground_work_iq` tool — results tagged `source:work-iq` with `[work:]`
citations.

## Orthogonality (load-bearing)

This is **grounding, not memory**, and it is **org context, not institutional
policy**. It is kept strictly separate from:
- the **governed vault** (skills/knowledge/decisions the human owns), and
- **Foundry IQ** institutional facts (vendor master, payment policy, handbook).

Deliberately contains **no** payment terms, vendor-triage procedure, or
invoice-escalation routing — so Work IQ grounding can never alter the governed
trap-email behavior. It answers a different question: *"what's happening in this
leader's world right now?"*

## Files

- `morgan-reyes-profile.md` — the persona: role, charter, team.
- `recent-comms.md` — recent emails and chat threads.
- `meetings-and-decisions.md` — recent meetings, decisions, and action items.
