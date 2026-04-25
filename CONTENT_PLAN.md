# CONTENT_PLAN — TDT4237 Programvaresikkerhet og datapersonvern

Dette dokumentet er gaten beskrevet i byggeplanen § 4. **Les gjennom og gi godkjenning før det skrives én HTML-fil.**

---

## Kilder

| Type | Filer |
|------|-------|
| Slides | `PPts/1.2026 course introduction.pdf`, `PPts/1.2026 Security principles.pdf`, `PPts/2.2026 OWASP part 1.pdf`, `PPts/3.2026 OWASP part 2.pdf`, `PPts/4.2026 Crypto intro.pdf`, `PPts/5.2026 authorization and authentication.pdf`, `PPts/6.2026 Threat modeling.pdf`, `PPts/7.2026 Risk Management during development.pdf`, `PPts/8.2026 Security Development Activities and Lifecycles.pdf`, `PPts/9.2026 Security Development Activities and Lifecycles.pdf`, `PPts/9.2026 LLM and Software Security.pdf`, `PPts/10.2026 Microservice security version 1.pdf`, `PPts/10.2026 software supply chain security version 1.pdf`, `PPts/11.2026 NTNU Guest Lecture Data Protection TDT4237 Spring 2026.pdf`, `PPts/12.2026 Guest Lecture AI and security.pdf`, `PPts/12.2026 TDT4237_Guest_Lecture_SAST-2026.pdf`, `PPts/13.2026 TDT4237 2026 course summary.pdf` |
| Bok | `Security Engineering.pdf` (Ross Anderson, 3. utg.) |

---

## Kapittelgruppering

10 kapitler. Kursoppsummeringen (slide 13) brukes som kilde for quiz-spørsmål, ikke eget kapittel.

| Kap | Tittel | Slides |
|-----|--------|--------|
| 1 | Introduksjon og sikkerhetsprinsipper | `1a` + `1b` |
| 2 | OWASP Top 10 | `2` + `3` |
| 3 | Kryptografi | `4` |
| 4 | Autentisering og autorisasjon | `5` |
| 5 | Threat modeling | `6` |
| 6 | Risikohåndtering og SDL | `7` + `8` + `9b` |
| 7 | LLM og programvaresikkerhet | `9a` |
| 8 | Mikrotjenester og supply chain | `10a` + `10b` |
| 9 | Personvern og databeskyttelse | `11` |
| 10 | Statisk analyse og AI-sikkerhet | `12a` + `12b` |

---

## Per-kapittel plan

### Kapittel 1 — Introduksjon og sikkerhetsprinsipper

**Hub-lede:** Hva sikkerhetsingeniørfaget egentlig er — og hvorfor «det er sikkert nok» aldri har vært en god setning å si høyt.

**Delsider (2):**

#### `cia-triaden.html`
Seksjoner (5):
1. CIA-triaden — konfidensialitet, integritet, tilgjengelighet som trio, ikke tre separate mål
2. Defense in depth — lag-på-lag som systemprinsipp, ikke som garanti
3. Least privilege — det minste nødvendige som startpunkt, ikke ettertanke
4. Fail-safe defaults — hva som skjer når ingenting er konfigurert
5. Security vs. safety — to fag med overlappende verktøykasse og kolliderende prioriteringer

Figurer: SVG av de tre CIA-sirklene med spenningspiler; lag-modell for defense in depth.

#### `trusselbilde.html`
Seksjoner (4):
1. Trusselaktører — script kiddies, organisert kriminalitet, nasjonalstater, insider threats
2. Angrepsoverflate — hva som telles og hva som reduserer den
3. Angrepsvektorer — nettverkslaget vs. applikasjonslaget vs. menneskene
4. Risikolandskapet i 2026 — ransomware, supply chain-angrep, AI-assisterte angrep som kontekst

Figurer: SVG-matrise med aktør × motivasjon.

**Quiz (15 spørsmål):**
- Lett (6): Definer CIA. Hva betyr «least privilege»? Hva er forskjellen mellom en trussel og en sårbarhet? Hva betyr «fail-safe default»? Gi et eksempel på defense in depth. Hva er en angrepsoverflate?
- Middels (6): Forklar hvordan konfidensialitet og tilgjengelighet kan stå i konflikt. Hvorfor er «security by obscurity» utilstrekkelig alene? Hva er forskjellen på en trusselaktør og en angriper? Beskriv ett scenario der safety og security prioriterer ulikt. Hva er en insider threat og hvorfor er den vanskelig å forsvare mot?
- Vanskelig (3): Et system logger alle brukerhendelser for etterforskning — hvilken CIA-egenskap styrker det, og hvilken svekker det? Et selskap deaktiverer SSH-tilgang til prod for å redusere angrepsoverflaten, men operatørene klager på driftsevne. Diskuter avveiingen. Forklar hvordan «fail-open» vs. «fail-closed» påvirker safety vs. security ulikt.

---

### Kapittel 2 — OWASP Top 10

**Hub-lede:** Ti kategorier av sårbarhetsfeil som dukker opp igjen og igjen — ikke fordi de er kompliserte, men fordi de er enkle å glemme.

**Delsider (4):**

#### `injection.html`
Seksjoner (5):
1. Hva injection er — kelneren som tar imot bestillingen uten å stille spørsmål (analogi)
2. SQL injection — sårbart eksempel, parameterisert fix, ORM-fallgruver
3. Command injection — `os.system`, `subprocess`, shell=True-fellen
4. NoSQL- og LDAP-varianter — MongoDB `$where`, LDAP-filter-manipulasjon
5. Forsvar i dybde — input-validering, parameterisering, ORM med omhu, least privilege for DB-brukeren

Figurer: SVG av SQL-parse-treet der payload endrer strukturen.

#### `xss-csrf.html`
Seksjoner (5):
1. Stored XSS — skriptet som bor i databasen og venter
2. Reflected XSS — URL-en som bærer nyttelasten
3. DOM-basert XSS — JavaScript som skriver til DOM uten sanitering
4. CSRF — nettleseren som ikke skiller mellom intensjon og forespørsel
5. Forsvar — Content-Security-Policy, `HttpOnly`/`SameSite`, CSRF-tokens, Trusted Types

Figurer: SVG-flyt for reflected XSS; SVG for CSRF-forespørselskjede.

#### `authn-autorisasjonsfeil.html`
Seksjoner (5):
1. Broken authentication — svake passord, manglende rate-limiting, session-fixation
2. Broken access control — IDOR, path traversal, manglende sjekk på serversiden
3. Security logging failures — hva som mangler og hva som avslører for mye
4. Insecure design — sårbarhet som designvalg, ikke implementeringsfeil
5. Forsvar — MFA, server-side access checks, strukturert logging

Figurer: SVG av IDOR-forespørsel der `user_id` endres manuelt.

#### `konfig-krypto-ssrf.html`
Seksjoner (5):
1. Security misconfiguration — default credentials, feilkonfigurert S3-bøtte, verbose feilmeldinger
2. Kryptografiske feil — MD5 til passord, ECB-modus, hard-kodede nøkler
3. Vulnerable and outdated components — Log4Shell som case
4. SSRF — server-side request forgery, cloud metadata-endepunkt som mål
5. Forsvar — herding, dependency-scanning, nettverksegmentering

Figurer: SVG av SSRF-flyt mot 169.254.169.254.

**Quiz (20 spørsmål):**
- Lett (7): Hva betyr SQL injection? Hva er XSS? Hva er CSRF? Hva er IDOR? Hva er SSRF? Hva er «stored» vs. «reflected» XSS? Hva gjør `HttpOnly`-flagget på en cookie?
- Middels (8): Skriv en parameterisert SQL-spørring i Python. Hva er `SameSite=Strict` og hva beskytter det mot? Forklar hvorfor ECB-modus er usikker. Hva er Log4Shell-sårbarheten? Beskriv et IDOR-scenario. Hvorfor er verbose feilmeldinger et sikkerhetsproblem? Hva er en CSRF-token? Hva skjer hvis du validerer input kun på klientsiden?
- Vanskelig (5): En webtjeneste bruker `render_template_string(user_input)` i Flask — hva er angrepsvektoren og hva er riktig fix? Forklar forskjellen mellom stored og DOM-basert XSS og hvorfor CSP hjelper ulikt for begge. Et API eksponerer `/api/invoice/{id}` — beskriv access-control-sjekken som må til. SSRF mot en cloud-instans — hvilke data kan en angriper hente, og hva reduserer risikoen? Forklar hvorfor `SameSite=Lax` ikke er tilstrekkelig alene som CSRF-forsvar.

---

### Kapittel 3 — Kryptografi

**Hub-lede:** Kryptografi er ikke magi — det er matematikk med veldig presise forutsetninger, og sikkerheten bryter sammen nøyaktig der forutsetningene ikke holder.

**Delsider (3):**

#### `symmetrisk-krypto.html`
Seksjoner (5):
1. Blokkchiffer og AES — nøkkellengder, runder, hvorfor AES-128 fremdeles er ok
2. Driftsmodus — ECB (og hvorfor det er galt), CBC, CTR, GCM
3. Strømchiffer — ChaCha20 og Poly1305
4. Nøkkelhåndtering — rotasjon, lagring, HSM-er
5. Vanlige feil — gjenbruk av IV/nonce, padding oracle

Figurer: SVG av ECB-pingvinen (identisk blokk → identisk chiffer); SVG av GCM-konstruksjonen.

#### `asymmetrisk-krypto.html`
Seksjoner (5):
1. RSA — faktorisering som enveisfunksjon, nøkkelparmeknikken
2. Elliptisk kurve-kryptografi — ECDH, ECDSA, kortere nøkler
3. TLS 1.3 — handshake-sekvens, forward secrecy, 0-RTT og risikoen
4. PKI og sertifikater — CA-kjeden, Certificate Transparency
5. Post-kvantum-kryptografi — CRYSTALS-Kyber, CRYSTALS-Dilithium som NIST-standard

Figurer: SVG av TLS 1.3-handshake; SVG av CA-kjede.

#### `hashing-mac.html`
Seksjoner (4):
1. Kryptografiske hashfunksjoner — SHA-256, SHA-3, kollisjonsmotstand
2. HMAC — autentisert integritet, lengde-utvidelsesangrep og hvorfor HMAC unngår det
3. Passordhashing — bcrypt, scrypt, Argon2; hvorfor MD5/SHA-1 er feil verktøy
4. Salting — hva det gjør mot rainbow tables og dictionary attacks

Figurer: SVG av Argon2 med salt; sammenligning av MD5 vs. bcrypt tid.

**Quiz (18 spørsmål):**
- Lett (6): Hva er AES? Hva er en kryptografisk hashfunksjon? Hva gjør `SameSite`? Hva er TLS? Hva er salting? Hva er forskjellen på symmetrisk og asymmetrisk kryptografi?
- Middels (8): Hvorfor er ECB-modus usikker? Hva er forward secrecy? Forklar hva HMAC er og hva det beskytter mot. Hvorfor er bcrypt bedre enn SHA-256 til passord-hashing? Hva er et padding oracle-angrep? Hva er Certificate Transparency? Forklar 0-RTT i TLS 1.3 og den tilhørende risikoen. Hva er forskjellen på kryptering og signering?
- Vanskelig (4): En tjeneste bruker `AES-CBC` med en fast IV lagret i kildekoden. Hva er angrepsvektoren? Et system lagrer `sha256(passord)` uten salt — forklar nøyaktig hvilke to angrep dette åpner for. Forklar hvorfor RSA-2048 er sårbar for kvantedatamaskiner mens AES-128 i praksis ikke er det. Hva er et lengde-utvidelsesangrep, og hvorfor er `HMAC(key, msg)` immun mot det?

---

### Kapittel 4 — Autentisering og autorisasjon

**Hub-lede:** Autentisering er «hvem er du?». Autorisasjon er «hva får du lov til?». De to forvirres hele tiden — og det er der de fleste access-feilene bor.

**Delsider (3):**

#### `autentisering.html`
Seksjoner (5):
1. Passord — entropimodellen, NIST SP 800-63B, det som faktisk funker
2. MFA — TOTP, FIDO2/WebAuthn, push-basert MFA og SIM-swapping
3. OAuth 2.0 — flytene (authorization code, client credentials), scopes
4. OIDC — ID-token, UserInfo-endepunkt, SSO
5. Vanlige autentiseringsfeil — credential stuffing, password spraying, manglende rate-limiting

Figurer: SVG av OAuth 2.0 authorization code-flyt.

#### `jwt.html`
Seksjoner (4):
1. JWT-struktur — header.payload.signature, base64url, claims
2. Algoritme-forvirring — `alg: none`-angrepet, RS256 vs. HS256-forvirring
3. Claim-validering — `exp`, `aud`, `iss` og hva som skjer hvis de ikke sjekkes
4. Sikker JWT-bruk — kortlevd token, refresh tokens, token revocation

Figurer: SVG av JWT-struktur og verifikasjonsflyt.

#### `tilgangskontroll.html`
Seksjoner (4):
1. RBAC — roller, rettigheter, rolle-eksplosjon
2. ABAC og policy-motorer — OPA, Cedar, kontekst-avhengig tilgang
3. Zero trust — «never trust, always verify», mikrosegmentering
4. Least privilege i praksis — tjeneste-kontoer, korte sesjonsnøkler, JIT-tilgang

Figurer: SVG av zero trust-arkitektur.

**Quiz (18 spørsmål):**
- Lett (6): Hva er autentisering? Hva er autorisasjon? Hva er MFA? Hva er RBAC? Hva er JWT? Hva er OAuth 2.0?
- Middels (7): Hva er `alg: none`-angrepet i JWT? Forklar OAuth 2.0 authorization code-flyten. Hva er forskjellen på RBAC og ABAC? Hva er FIDO2/WebAuthn? Hva er credential stuffing? Hva er zero trust? Forklar OIDC og hvordan det bygger på OAuth 2.0.
- Vanskelig (5): En tjeneste bruker `HS256` for JWT og sender den offentlige nøkkelen til klienten — beskriv angrepet. I et microservice-oppsett med mTLS: hvilken sikkerhetsgaranti mister du hvis du stoler blindt på JWT-er uten å verifisere nettverksidentiteten? Et system bruker RBAC men rollen «admin» har 200 rettigheter — hva er problemet og hva er løsningen? Beskriv et SIM-swapping-angrep mot SMS-basert MFA. Hva er JIT (Just-In-Time) access og hvilke angrepsvektorer reduserer det?

---

### Kapittel 5 — Threat modeling

**Hub-lede:** Threat modeling er øvelsen der du vandrer rundt i ditt eget system med innbruddstyvens øyne — strukturert, dokumentert, og helst gjort *før* du skriver koden.

**Delsider (2):**

#### `metodikk.html`
Seksjoner (5):
1. Hva threat modeling er — og hva det ikke er (ikke en pentest, ikke et engangsprosjekt)
2. Data Flow Diagrams (DFD) — prosesser, dataflyter, datalagre, trust boundaries
3. PASTA-rammeverket — syv steg fra forretningsmål til angrepsanalyse
4. Når og hvem — threat modeling i sprintplanlegging, arkitekturgjennomgang, RFC
5. Output — trusselregisteret, mitigasjonskart, akseptert risiko

Figurer: SVG av et enkelt DFD for en nettjeneste med trust boundaries.

#### `stride.html`
Seksjoner (5):
1. STRIDE — Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
2. STRIDE per element — hvordan hvert DFD-element mappes til relevante STRIDE-kategorier
3. DREAD-scoring — Damage, Reproducibility, Exploitability, Affected users, Discoverability
4. Mitigasjoner per STRIDE-kategori — autentisering, integritetskontroll, logging, kryptering, rate-limiting, least privilege
5. Praktisk eksempel — threat modeling av et JWT-basert API ende-til-ende

Figurer: SVG-tabell over STRIDE × DFD-element; SVG av mitigasjonsmatrise.

**Quiz (15 spørsmål):**
- Lett (5): Hva betyr S i STRIDE? Hva er et DFD? Hva er en trust boundary? Hva er DREAD? Hva er formålet med threat modeling?
- Middels (6): Forklar Repudiation-trusselen og hvilken kontroll som adresserer den. Hva er forskjellen mellom STRIDE og PASTA? Gi et eksempel på Elevation of Privilege i et webapplikasjonssystem. Hva er DREAD-scoring og hva er dens svakhet? Tegn et DFD for et enkelt login-system med tre elementer. Hvorfor er threat modeling mer verdifullt gjort tidlig enn sent?
- Vanskelig (4): Et API-gateway videreformidler alle requests til backend-tjenester uten re-autentisering — identifiser STRIDE-kategoriene som er relevante og foreslå mitigasjoner for hver. Forklar hvorfor Repudiation er vanskelig å adressere i et distribuert system uten sentralisert logging. En tjeneste bruker UUIDs som ressurs-IDer for å hindre IDOR — er dette en tilstrekkelig kontroll? Argumenter. I PASTA-steg 5 (vulnerability analysis): hva er forskjellen på en trusselmodell-sårbarhet og en SAST-funnert sårbarhet?

---

### Kapittel 6 — Risikohåndtering og SDL

**Hub-lede:** Risiko kan ikke elimineres — den kan bare forstås, kvantifiseres og behandles med åpne øyne.

**Delsider (3):**

#### `risikohåndtering.html`
Seksjoner (5):
1. Risikobegrepet — sannsynlighet × konsekvens, iboende vs. gjenværende risiko
2. CVSS-scoring — Base Score, Temporal Score, Environmental Score, og hva scoren *ikke* sier
3. Risikobehandling — akseptere, redusere, overføre, unngå
4. Tredjepartsrisiko — åpen kildekode, skyavhengigheter, underleverandører
5. Risikoregisteret — format, eierskap, revisjonssyklus

Figurer: SVG av risikomatrise (sannsynlighet × konsekvens).

#### `sdl.html`
Seksjoner (5):
1. Microsoft SDL — de syv fasene fra opplæring til hendelsesrespons
2. OWASP SAMM — Software Assurance Maturity Model, fem forretningsfunksjoner
3. DevSecOps — «shift left», security som pipeline-steg, ikke etterkontroll
4. Sikkerhetskrav — misuse cases, abuse stories, security user stories
5. Tredjeparts komponenter — SCA, SBOM, license compliance

Figurer: SVG av DevSecOps-pipeline med security-gates.

#### `sikkerhetstesting.html`
Seksjoner (4):
1. SAST — statisk analyse, AST-basert scanning, falske positiver som problem
2. DAST — dynamisk testing, OWASP ZAP, crawler-basert angrepsflate
3. IAST — instrumentert testing, kombinasjonen av runtime-innsikt og statisk analyse
4. Fuzz testing — AFL, libFuzzer, coverage-guided fuzzing, strukturert fuzzing

Figurer: SVG-pipeline der SAST/DAST/IAST plasseres i utviklingsløpet.

**Quiz (20 spørsmål):**
- Lett (7): Hva er CVSS? Hva er SAST? Hva er DAST? Hva er Microsoft SDL? Hva er DevSecOps? Hva er et risikoregister? Hva er en SBOM?
- Middels (8): Hva er forskjellen på iboende og gjenværende risiko? Beskriv de fire risikobehandlingsstrategiene. Hva er «shift left»? Hva er forskjellen på SAST og DAST? Hva er OWASP SAMM? Forklar hva en falsk positiv er i SAST-sammenheng. Hva er fuzz testing? Hva er en misuse case?
- Vanskelig (5): Et prosjekt har CVSS 9.8 på en sårbarhet i en transitivt avhengig pakke. Beskriv beslutningsprosessen fra score til handling. Forklar hvorfor DAST ikke kan finne logiske autorisasjonsfeil. Et team innfører SAST i CI/CD-pipelinen, men 80 % av funnene er falske positiver og teamet begynner å ignorere varsler — hva er det egentlige problemet og hva er løsningen? Hva er «dependency confusion»-angrepet og hvilken SDL-kontroll forhindrer det? Forklar forskjellen mellom SBOM og SCA og i hvilke situasjoner man trenger begge.

---

### Kapittel 7 — LLM og programvaresikkerhet

**Hub-lede:** Store språkmodeller endrer hva angripere kan gjøre — og hva forsvarere kan gjøre. Begge deler er sanne på en gang.

**Delsider (2):**

#### `llm-angrep.html`
Seksjoner (4):
1. Prompt injection — direkte (brukerinput overstyrer systemprompten) og indirekte (ekstern data som bærer instruksjoner)
2. Jailbreak — mønster-overloading, rollelek, «DAN»-teknikker
3. Datatyveri via LLM — modell-inversion, training data extraction, system-prompt-lekkasje
4. LLM-assistert hacking — automatisert sårbarhetsspanning, phishing-generering

Figurer: SVG av indirekte prompt injection-flyt (bruker → LLM-agent → ekstern kilde → ondsinnet payload → LLM-handling).

#### `llm-forsvar.html`
Seksjoner (4):
1. Input-validering og output-filtrering — hva det kan og ikke kan fange
2. Sandboxing av LLM-agenter — begrens verktøytilgang, human-in-the-loop
3. Prompt-hardening — systempromptstrategi, least-privilege for verktøykall
4. LLM i sikkerhetskritiske systemer — når LLM-output ikke bør styre kode direkte

Figurer: SVG av LLM-agent med og uten sandboxing.

**Quiz (15 spørsmål):**
- Lett (5): Hva er prompt injection? Hva er et jailbreak? Hva er en LLM? Hva betyr «indirekte prompt injection»? Hva er en LLM-agent?
- Middels (6): Beskriv et konkret eksempel på indirekte prompt injection. Hva er forskjellen mellom direkte og indirekte prompt injection? Forklar «training data extraction». Hva er «human-in-the-loop» og hvorfor er det relevant for LLM-sikkerhet? Hva menes med «least privilege for verktøykall»? Hvilke angrepsvektorer gjelder spesielt for RAG-baserte systemer?
- Vanskelig (4): En LLM-agent kan sende e-poster og lese innkommende e-poster. Beskriv et angrepsscenario og to mitigasjoner. Forklar hvorfor output-filtrering ikke er tilstrekkelig som eneste forsvar mot prompt injection. En applikasjon bruker en LLM til å generere SQL-spørringer fra brukerinnput — hvilke sikkerhetsrisikoer finnes og hva er riktig arkitektur? Hva er «model inversion» og under hvilke forutsetninger er det praktisk gjennomførbart?

---

### Kapittel 8 — Mikrotjenester og supply chain

**Hub-lede:** Moderne systemer er ikke én applikasjon — de er titalls tjenester, hundrevis av pakker og et tillitsnettverk som strekker seg langt utenfor din egen kode.

**Delsider (2):**

#### `mikrotjenester.html`
Seksjoner (5):
1. Angrepsoverflaten i et microservice-oppsett — mange nettverksgrensesnitt, lateral movement
2. mTLS — gjensidig autentisering, service mesh (Istio/Linkerd), sertifikatrotasjon
3. Secrets management — Vault, AWS Secrets Manager, environment variable-fellen
4. Container security — image scanning, non-root containers, read-only filesystem, seccomp
5. Zero trust i microservices — identitetsbasert tilgangsstyring, nettverkspolicyer

Figurer: SVG av service mesh med mTLS-tuneller.

#### `supply-chain.html`
Seksjoner (5):
1. Hva supply chain-angrep er — SolarWinds, XZ Utils som case
2. Dependency confusion og typosquatting — mekanismen og en konkret PoC
3. SBOM — formater (SPDX, CycloneDX), hvem som krever det
4. Sigstore og kodesignering — Cosign, Fulcio, Rekor, sign-what-you-run
5. Forsvar i dybde — pin dependencies, verify signatures, private registry, audit logs

Figurer: SVG av dependency confusion-angrepet (privat pakke overstyrt av offentlig).

**Quiz (18 spørsmål):**
- Lett (5): Hva er mTLS? Hva er et supply chain-angrep? Hva er en SBOM? Hva er dependency confusion? Hva er Sigstore?
- Middels (8): Hva er forskjellen på mTLS og TLS? Forklar dependency confusion-angrepet. Hva er XZ Utils-angrepet? Hva gjør Cosign? Hva er en service mesh? Hva er secrets management og hvorfor er env-variabler utilstrekkelige? Hva er typosquatting i pakkeregisterkontekst? Hva er container image scanning?
- Vanskelig (5): I et microservice-oppsett med mTLS — beskriv hva som skjer ved sertifikatutløp og hva konsekvensen er uten automatisk rotasjon. Forklar XZ Utils-angrepet trinn for trinn og hvilken SDL-kontroll kunne ha oppdaget det tidlig. Et team pinner alle npm-avhengigheter til eksakte versjoner — er dette tilstrekkelig for supply chain-sikkerhet? Hva er «phantom dependency»-problemet i monorepos? Forklar hva Sigstore/Rekor-transparency log gjør og hvilken tillit det skaper.

---

### Kapittel 9 — Personvern og databeskyttelse

**Hub-lede:** Personvern er ikke et juridisk skjema som fylles ut — det er et sett designvalg som tas tidlig, og som er kostbare å reversere.

**Delsider (2):**

#### `gdpr.html`
Seksjoner (5):
1. GDPR-prinsipper — lovlighet, formålsbegrensning, dataminimering, nøyaktighet, lagringsgrense, integritet/konfidensialitet, ansvarlighet
2. Behandlingsgrunnlag — samtykke, kontrakt, rettslig forpliktelse, berettiget interesse
3. Databehandleravtaler (DPA) — hva de dekker, hva som skjer ved brudd
4. DPIA — Data Protection Impact Assessment, når det kreves, hva det inneholder
5. Rettigheter — innsyn, retting, sletting, portabilitet, protest

Figurer: SVG-oversikt over de syv GDPR-prinsippene.

#### `privacy-engineering.html`
Seksjoner (4):
1. Privacy by design — syv prinsipper (Cavoukian), hvordan de omsettes til arkitekturvalg
2. Dataminimering i praksis — hva samle, hva ikke samle, pseudonymisering vs. anonymisering
3. Pseudonymisering og anonymisering — k-anonymitet, differential privacy, hva som faktisk anonymiserer
4. Logging og personvern — hva som kan logges, retensjonstid, log-masking

Figurer: SVG som viser spektrum fra identifiserbar til anonym data.

**Quiz (15 spørsmål):**
- Lett (5): Hva er GDPR? Hva er en personopplysning? Hva er dataminimering? Hva er en DPIA? Hva er pseudonymisering?
- Middels (6): Forklar de syv GDPR-prinsippene. Hva er forskjellen mellom en behandlingsansvarlig og en databehandler? Hva er «privacy by design»? Hva er k-anonymitet? Når kreves en DPIA? Hva er forskjellen mellom pseudonymisering og anonymisering?
- Vanskelig (4): Et system logger IP-adresser og brukeragenter for «driftshensyn» — er dette en personopplysningsbehandling, og hva krever GDPR i så fall? Forklar hvorfor aggregert data kan re-identifiseres og gi et konkret eksempel. En mobilapp samler inn lokasjonsdata «for å forbedre tjenesten» — vurder behandlingsgrunnlag og dataminimeringskrav. Hva er differential privacy og i hvilke tilfeller er det et bedre valg enn k-anonymitet?

---

### Kapittel 10 — Statisk analyse og AI-sikkerhet

**Hub-lede:** Automatiserte verktøy finner det systematiske — det som gjentas, det som avviker fra mønstre. Det menneskelige blikket finner resten.

**Delsider (2):**

#### `sast.html`
Seksjoner (5):
1. Hva SAST er — AST-basert analyse, taint tracking, dataflytanalyse
2. Verktøy — SonarQube, CodeQL, Semgrep; styrker og svakheter
3. Integrering i CI/CD — blocking vs. advisory mode, pull request-kommentarer
4. Falske positiver og negativer — triage-prosessen, suppression vs. fixing
5. SAST vs. code review — hva verktøyet finner at menneskene overser, og omvendt

Figurer: SVG av taint tracking fra brukerinput til sårbar sink.

#### `ai-sikkerhet.html`
Seksjoner (4):
1. Adversarial machine learning — evasion, poisoning, model stealing
2. AI i sikkerhetsvurderinger — AI-assistert kodegjennomgang, sårbarhetssøk, IR
3. Risiko ved AI-generert kode — feilaktige kodemønstre, hallusinerte API-kall
4. Regulering og ansvar — EU AI Act, høyrisikoklassifisering, ansvarstilskrivning

Figurer: SVG av adversarial example-konsept (input perturbation).

**Quiz (15 spørsmål):**
- Lett (5): Hva er SAST? Hva er taint tracking? Hva er en falsk positiv? Hva er adversarial ML? Hva gjør CodeQL?
- Middels (6): Hva er forskjellen mellom SAST og DAST? Forklar taint tracking med et eksempel. Hva er «model stealing»? Hva er «evasion attack»? Hva er risikoen ved AI-generert kode i sikkerhetskritiske systemer? Hva er EU AI Act og hvilke kategorier definerer det?
- Vanskelig (4): Et team innfører CodeQL i CI, men varsler havner i en backlog ingen ser på — beskriv organisatorisk og teknisk løsning. Forklar et evasion attack mot en ML-basert malware-detektor og beskriv ett forsvarstiltak. En SAST-scanner rapporterer SQL injection-risiko i en metode som aldri kalles fra ekstern innput — hva er den riktige handlingen og hvorfor? Hva er «data poisoning» i et RAG-system og hvilken kontroll reduserer risikoen?

---

## Figur-inventar (planlagte SVG-er per kapittel)

| Kap | Figur | Beskrivelse |
|-----|-------|-------------|
| 1 | CIA-sirkler | Tre overlappende sirkler med spenningspiler |
| 1 | Aktørmatrise | Aktør × motivasjon-grid |
| 2 | SQL parse-tre | Sårbar vs. parameterisert spørring |
| 2 | XSS-flyt | Reflected XSS fra URL til DOM |
| 2 | IDOR-flyt | Request med endret user_id |
| 2 | SSRF-flyt | Server → 169.254.169.254 |
| 3 | ECB-pingvinen | Identisk klartekst-blokk → identisk chiffer-blokk |
| 3 | TLS 1.3-handshake | Flytdiagram med nøkkelutveksling |
| 4 | OAuth 2.0-flyt | Authorization code grant |
| 4 | JWT-struktur | Header.payload.signature dekonstruert |
| 5 | DFD-eksempel | Enkel nettjeneste med trust boundaries |
| 5 | STRIDE-matrise | Kategori × mitigasjon |
| 6 | Risikomatrise | Sannsynlighet × konsekvens |
| 6 | DevSecOps-pipeline | CI/CD med security-gates markert |
| 7 | Indirect prompt injection | Bruker → agent → ekstern kilde → ondsinnet handling |
| 8 | Service mesh | mTLS-tuneller mellom tjenester |
| 8 | Dependency confusion | Privat pakke overstyrt av offentlig |
| 9 | GDPR-prinsipper | Sirkeldiagram med syv prinsipper |
| 10 | Taint tracking | Input-til-sink-flyt |

---

## Merknader

- **Kap 7 (LLM)** er bevisst kort (2 delsider) — feltet er i rask endring og delsidene bør holdes oppdateringsbare uten å rive opp resten av nettstedet.
- **Kap 10 (SAST + AI-sikkerhet)** slår sammen to gjesteforelesninger. Hvis innholdet er for ulikt, kan de splittes til egne kapitler (kap 10 og kap 11) uten å endre URL-strukturen for de øvrige.
- **Kursoppsummering (slide 13)** brukes som kilde for ekstra quiz-spørsmål på tvers av kapitler, ikke som eget kapittel.
- Alle delsider holder seg innenfor 2–4 seksjoner × 150–250 linjer HTML ≈ 15–25 min lesing.
