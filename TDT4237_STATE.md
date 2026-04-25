# TDT4237 — framdriftssporing

Dette dokumentet holder orden på arbeidet med å lage en byggeplan for emnesiden til **TDT4237 Programvaresikkerhet og datapersonvern**, tilpasset fra `NEW_COURSE_PLAN.md`.

## Kilde og mål

- **Kilde:** [NEW_COURSE_PLAN.md](NEW_COURSE_PLAN.md) — redaksjonell emneside-plan (på engelsk).
- **Mål:** [TDT4237_COURSE_PLAN.md](TDT4237_COURSE_PLAN.md) — samme struktur, oversatt til norsk bokmål, med eksempler og kapitteltitler tilpasset TDT4237.
- **Språk:** norsk bokmål. Etablerte fagbegrep (SQL injection, OWASP, XSS, cross-site request forgery, SAST, LLM, embeddings, threat modeling osv.) beholdes på engelsk.

## Emnemateriale vi bygger over

- `PPts/` — 17 forelesnings-PDF-er (fra `1.2026 course introduction.pdf` til `13.2026 TDT4237 2026 course summary.pdf`), inkludert gjesteforelesninger om Data Protection, AI + security og SAST.
- `Security Engineering.pdf` — pensumbok (~9 MB), brukt som bakgrunnskorpus for RAG-assistenten i siden.

## Stegoversikt

| # | Steg | Status |
| - | ---- | ------ |
| 1 | Opprett `TDT4237_STATE.md` (denne fila) | i gang |
| 2 | Skriv `TDT4237_COURSE_PLAN.md` § 1–4 (inndata, scope, stemme, innholdsplanlegging) | ferdig |
| 3 | Tilføy § 5–7 (filstruktur, byggerekkefølge, HTML-skjeletter) | ferdig |
| 4 | Tilføy § 8–10 (design-tokens, `style.css`, `quiz.js`) | ferdig |
| 5 | Tilføy § 11–13 (`nav-search.js`, `lang-switch.js`, chat-widget) | ferdig |
| 6 | Tilføy § 14–16 (`api/chat.js`, bok-korpus, deploy-config) | ferdig |
| 7 | Tilføy § 17–18 (suksesskriterier, ikke-mål) + sluttgjennomgang | ferdig |

## Neste fase — bygging av selve nettstedet

| # | Steg | Status |
| - | ---- | ------ |
| 8 | Lag `CONTENT_PLAN.md` (gate før koding) | ferdig |
| 9 | Vent på bruker-godkjenning av `CONTENT_PLAN.md` | venter på godkjenning |
| 10 | Bygg stillas: `style.css`, `quiz.js`, `nav-search.js`, `vercel.json`, `package.json`, `index.html` | ferdig |
| 11 | Bygg kap1 ende-til-ende: hub + 2 delsider + quiz | ferdig |
| 12 | Bygg kap2–kap10: hub + delsider + quiz per kapittel | ferdig |
| 13 | Koble chat-widget: `api/chat.js`, `tools/build_chunks.py` | ferdig |
| 14 | Sluttgjennomgang: brutte ankere, PAGES-array, README | ferdig |

## Sluttgjennomgang

- 36 HTML-filer totalt: `index.html` + 10 kapittelhubber + 25 delsider.
- `nav-search.js` PAGES-array og `index.html` søkeindeks: alle 35 sider inkludert, `risikohåndtering.html` (ø) verifisert.
- `api/chat.js`: TDT4237-spesifikk systemprompt, norsk bokmål + fagbegrep på engelsk.
- `tools/build_chunks.py`: CHAPTER_LABELS-mapping klar for Security Engineering (Anderson).
- `README.md`: oppdatert med lokal server-instruksjon, embedding-steg og deploy-guide.

## Gjenstående manuelt arbeid

| Steg | Hva |
|------|-----|
| Generer `public/chunks.json` | Kjør `python tools/build_chunks.py "Security Engineering.pdf"` med `OPENROUTER_API_KEY` satt |
| Deploy | Push til GitHub, importer i Vercel, sett `OPENROUTER_API_KEY` |
| SVG-figurer | Alle figurer er tegnet som placeholder-SVG-er — fyll inn faktisk innhold basert på slides |
| Quiz-innhold | Kap2–kap10 har fullstendige quizer; kap1 har 15 spørsmål — vurder å utvide |

## Sluttgjennomgang

- `TDT4237_COURSE_PLAN.md`: 1523 linjer, 18 nummererte seksjoner, 14 balanserte kodeblokker (HTML × 3, CSS × 1, JS × 5, Python × 1, JSON × 4).
- Alle stedholdere (`COURSE_CODE`, `COURSE_TITLE`, eksempelkapittel-titler) erstattet med TDT4237-spesifikt innhold der de møter brukeren; generiske `kapN`/`Kapittel N` beholdt der skjelettet er ment som mal.
- Fagbegrep beholdt på engelsk: SQL injection, XSS, CSRF, OWASP Top 10, STRIDE, JWT, mTLS, SAST, DAST, threat modeling, supply chain attack, prompt injection, zero trust, RAG, embeddings, NDJSON, SSE.
- UI-strenger og prosa på norsk bokmål.

## Regler for oversettelsen

- Prosa, overskrifter, instruksjonstekst og UI-strenger → norsk bokmål.
- Kodeblokker (HTML, CSS, JS, Python) beholdes verbatim der det gir mening, med norske UI-strenger der originalen har engelske.
- Fagbegrep på engelsk: `SQL injection`, `XSS`, `CSRF`, `OWASP`, `SAST`, `DAST`, `threat modeling`, `STRIDE`, `LLM`, `prompt injection`, `supply chain attack`, `zero trust`, `mTLS`, `JWT`, `OAuth`, `OIDC`, `TLS`, `hashing`, `salting`, `embeddings`, `RAG`, `microservices`, `NDJSON`, `SSE` osv.
- Norske varianter der de er etablerte: *kapittel*, *seksjon*, *delside*, *forside*, *sidesøk*, *stil*, *papir* (ikke *paper*), *rust* (farge-token — beholdes som identifikator).
- `lang="no"` i HTML beholdes. Stedholdere som `COURSE_CODE` → `TDT4237`, `COURSE_TITLE` → `Programvaresikkerhet og datapersonvern`.

## Planlagt kapittelgruppering (foreslått, justeres i `CONTENT_PLAN.md`)

Basert på slide-prefiks i `PPts/`:

1. Introduksjon og sikkerhetsprinsipper
2. OWASP del 1
3. OWASP del 2
4. Kryptografi
5. Autentisering og autorisasjon
6. Threat modeling
7. Risikohåndtering i utvikling
8. Secure Development Lifecycle (SDL)
9. LLM og programvaresikkerhet
10. Mikrotjenester og supply chain-sikkerhet
11. Datapersonvern (gjesteforelesning)
12. Statisk sikkerhetsanalyse (SAST) + AI og sikkerhet (gjesteforelesninger)
13. Oppsummering

Dette er en arbeidshypotese — den endelige splitten forhandles fram i `CONTENT_PLAN.md`-gaten (§ 4 i planen).
