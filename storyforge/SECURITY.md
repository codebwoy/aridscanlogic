# StoryForge security

## Secrets

| Variable | Where | Never |
|----------|--------|--------|
| `STORYFORGE_SESSION_SECRET` | `storyforge/.env` | Client / `VITE_*` |
| `STORYFORGE_API_SECRET` | server | Client bundle |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | server | Client |
| Image provider keys (`REPLICATE_API_TOKEN`, `FAL_KEY`) | server | Client |
| `VITE_STORYFORGE_URL` | ScanLogic client | Must be URL only |

## Desktop enforcement

1. Client refuses to mount the studio below 1024px.
2. `POST /v1/session/desktop` rejects narrow `viewportWidth`.
3. All project/job/credit routes require a valid desktop session Bearer token.
4. Live `X-StoryForge-Viewport` re-check can deny mid-session shrink (best-effort; combined with signed `vw` at issue time).

Viewport claims can be spoofed by a determined client — treat this as a product gate + abuse friction, not a DRM substitute. Pair with rate limits and daily credit caps.

## Network

- API defaults to `127.0.0.1` bind.
- CORS allowlist via `STORYFORGE_WEB_ORIGIN`.
- Security headers: `nosniff`, `DENY` frame, `no-referrer`, locked permissions policy.
- Rate limits on session issue and general API.

## Credits & billing

- Ledger is append-only (`sf_credit_ledger` / memory equivalent).
- Charge at job start; refund on failure / safety reject.
- Stripe webhook stub must verify signatures before crediting (not live until `STRIPE_WEBHOOK_SECRET` wired).

## Content & compliance

- Do not automate Amazon account uploads.
- Surface AI rights uncertainty + KDP AI disclosure reminders in UI.
- No training on user assets without explicit opt-in (future).
- Child-safety classifiers and IP guardrails are Phase 2 product work — keep generation providers behind server filters before public launch.

## Launchpad / Photo to Cartoon

- `photo_to_cartoon` requires a recorded guardian consent (`acknowledged_guardian` + `acknowledged_no_model_training`).
- Job API **rejects** `photoBase64` / `photoDataUrl` — never accept raw child-photo payloads on the job endpoint.
- Mock/provider path records `rawPhotoStored: false`; prefer client-side transient handles + server-side deletion after character approval when a real upload path is added.
- Market data fields are manual entry only — no Amazon scraping.
- KDP claim strings (royalty %, “confidential” disclosure, 10-minute estimate) are editable `ConfigValue`s with ⚠ verification notes — do not present as verified legal facts.

## Reporting

Follow the parent repo `SECURITY.md` reporting process.
