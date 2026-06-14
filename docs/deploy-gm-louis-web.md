# Deploy the GM Louis web app to Azure

The persona-builder web app (`compass-rose/`) on Azure Container Apps — a public
URL for non-technical leads to build & install skills (no YAML). Containerized
via `compass-rose/Dockerfile`, which reuses the proven `api/index.py` WSGI entry.

> The browser uses the **File System Access API** to write `SKILL.md` straight
> into the user's chosen Scout skills folder — the server never touches local
> files. Chromium browsers get one-click install; Safari/Firefox get a `.zip`.
>
> Supabase config in `api/index.py` is **public by design** (anon/publishable
> key, RLS-gated) — fine to ship. Override with real env in production if desired.

Run these yourself (Azure mutations are gated to you). Prereqs same as the GGR
server (`az extension add --name containerapp`; register `Microsoft.App` +
`Microsoft.OperationalInsights`).

## 1. Build the image (reuse the GGR registry)

```bash
cd ~/GitHub/Agents-League-Hackathon-Compass-BlackBox-IQ
az acr build -r scoutcompassacr -t gm-louis-web:latest -f compass-rose/Dockerfile compass-rose
```
(If `scoutcompassacr` doesn't exist yet, create it per `docs/deploy-container-apps.md` step 1.)

## 2. Deploy to Container Apps

```bash
az containerapp create -g rg-jg-3018 -n gm-louis-web \
  --environment scout-compass-env \
  --image scoutcompassacr.azurecr.io/gm-louis-web:latest \
  --registry-server scoutcompassacr.azurecr.io \
  --target-port 8000 --ingress external \
  --min-replicas 1 --max-replicas 2

FQDN=$(az containerapp show -g rg-jg-3018 -n gm-louis-web \
  --query properties.configuration.ingress.fqdn -o tsv)
echo "GM Louis web: https://$FQDN"
curl -s -o /dev/null -w "%{http_code}\n" "https://$FQDN/"   # → 200
```

(`gm-louis-web` can scale 1–2 — it's stateless, unlike the GGR server which must
stay single-replica because of its per-container vault.)

## 3. Wire it in

- Put the URL in `README.md` and the submission.
- Optionally a custom domain (e.g. a subdomain of jeremygracey.ai) via
  `az containerapp hostname add`.

## Teardown (after submission)

```bash
az containerapp delete -g rg-jg-3018 -n gm-louis-web --yes
```

## Later: Vercel (parked)

The app is also Vercel-ready (`compass-rose/vercel.json` + `api/index.py`):
`vercel --cwd compass-rose`. Use it if you want a zero-infra public URL instead
of Azure — but Azure is the chosen path for the ecosystem story.
