# TDT4237 — Programvaresikkerhet og datapersonvern

Redaksjonell emnenettsted for TDT4237 ved NTNU, Vår 2026.

## Struktur

```
index.html          # Forside med fullsidesøk og kapitteroversikt
kap1/               # Introduksjon og sikkerhetsprinsipper
kap2/               # OWASP Top 10
kap3/               # Kryptografi
kap4/               # Autentisering og autorisasjon
kap5/               # Threat modeling
kap6/               # Risikohåndtering og SDL
kap7/               # LLM og programvaresikkerhet
kap8/               # Mikrotjenester og supply chain
kap9/               # Personvern og databeskyttelse
kap10/              # Statisk analyse og AI-sikkerhet
api/chat.js         # Serverless chat-funksjon (Vercel)
public/chunks.json  # Bok-embeddings for RAG (genereres av tools/)
tools/build_chunks.py  # Engangs-skript for å chuke og embedde pensumboka
style.css           # Felles stilark
quiz.js             # Quiz-reveal
nav-search.js       # Kapittelsøk (nav-bar)
chat-widget.js      # Flytende chat-knapp
```

## Kom i gang lokalt

```bash
# Enkel lokal server (krever ingen bygg-steg)
python -m http.server 8000
# Åpne http://localhost:8000
```

Chat-widgeten krever en kjørende `/api/chat`-funksjon (Vercel dev eller lokal Node).
