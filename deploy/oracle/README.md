# Oracle Cloud Always Free — hybrid studios

**Active production path** for AuthorForge + StoryForge. Fly.io configs remain in the repo for a later switch-back (Pay-as-You-Go).

```
ScanLogic (Vercel) ──VITE_AUTHORFORGE_URL──► AuthorForge (Oracle + Caddy)
                   ──VITE_STORYFORGE_URL───► StoryForge (Oracle + Caddy)
```

Same Dockerfiles as Fly. Persistent Docker volumes at `/data` (books/projects survive reboots).

Full hybrid overview + Fly standby: [authorforge/docs/HYBRID_DEPLOY.md](../../authorforge/docs/HYBRID_DEPLOY.md).

---

## 1. OCI VM (Always Free)

1. Create an Always Free compute instance (Ubuntu 22.04/24.04 recommended; Ampere A1 if capacity allows).
2. Attach a public IP.
3. **Security List / NSG:** allow ingress **TCP 22, 80, 443** from `0.0.0.0/0` (or lock SSH to your IP).
4. Point DNS:
   - `AUTHORFORGE_HOST` → A/AAAA → public IP  
   - `STORYFORGE_HOST` → A/AAAA → public IP  

---

## 2. Bootstrap Docker on the VM

```bash
# Clone or sync this repo onto the VM, then:
chmod +x deploy/oracle/scripts/bootstrap-vm.sh
./deploy/oracle/scripts/bootstrap-vm.sh
# log out/in so docker group applies
```

---

## 3. Configure and start

```bash
cd deploy/oracle
cp .env.example .env
# Edit .env: hosts, ACME_EMAIL, SESSION secrets, ANTHROPIC_API_KEY, WEB_ORIGIN
docker compose up -d --build
```

Smoke:

```bash
curl -sS "https://$AUTHORFORGE_HOST/health"
curl -sS "https://$STORYFORGE_HOST/health"
# expect { "ok": true, "hybrid": true, ... }
```

Studios: `https://<AUTHORFORGE_HOST>/?view=studio` and `https://<STORYFORGE_HOST>/?view=studio`.

---

## 4. Wire ScanLogic (Vercel) — makes Oracle active

Vercel → Project → Settings → Environment Variables → **Production**:

| Variable | Value |
|----------|--------|
| `VITE_AUTHORFORGE_URL` | `https://<AUTHORFORGE_HOST>` |
| `VITE_STORYFORGE_URL` | `https://<STORYFORGE_HOST>` |

Redeploy ScanLogic so the client bundle picks up the URLs.

---

## 5. Ops

| Action | Command |
|--------|---------|
| Logs | `docker compose logs -f` |
| Redeploy after git pull | `docker compose up -d --build` |
| Stop | `docker compose down` (volumes keep data) |
| Wipe studio state | `docker compose down -v` (destructive) |

---

## 6. Switch back to Fly later

1. Keep this stack or `docker compose down` on OCI.
2. Deploy with existing `authorforge/fly.toml` / `storyforge/fly.toml` (see HYBRID_DEPLOY § Fly standby).
3. Point Vercel `VITE_*` back to `https://scanlogic-authorforge.fly.dev` and `https://scanlogic-storyforge.fly.dev`.
4. Redeploy ScanLogic.

Do **not** delete `fly.toml` or Fly secrets when using Oracle.
