# Mal for genererte øvingseksamener — TDT4237

Slik lager vi nye øvingseksamener til **TDT4237 Programvaresikkerhet og datapersonvern**. Hvert sett lagres som en **HTML-fil** her i [eksamen/genererte/](.) (`eksamen_01.html`, `eksamen_02.html`, …) slik at studenten kan klikke seg gjennom oppgaver, vise modellsvar på åpne spørsmål, og få umiddelbar grønn/rød tilbakemelding på flervalgsoppgaver.

---

## 1. Rammer for årets eksamen

- **Format:** Blanding av **åpne spørsmål** og **lukkede flervalgsspørsmål (MC)**, omtrent som ekte eksamen i [Inspera](https://inspera.com).
  - **~3/4 åpne** (kortsvar/forklaring/listeoppgaver — "forklar", "list minst fire", "hvilke risikoer", "kommentér denne kodebiten").
  - **~1/4 lukkede** (MC med 4 alternativer — én riktig).
- **Ingen case study i 2026.** Tidligere år hadde et 30-poengs case studie som første oppgave; det er fjernet i år. Gjenbruk derfor *ikke* case-oppgaver fra 2020–2025-settene som mal.
- **Interaktivitet:**
  - Åpne spørsmål viser et **modellsvar** i en `<details>`-blokk. Etter at studenten har folder den ut og sammenlignet sitt eget svar, klikker hen en **self-grade-knapp** (Full pott / Nesten alt / Halvveis / Lite / Ingenting — 100/75/50/25/0 % av oppgavens poeng). exam.js teller dette inn i poeng-trackeren.
  - MC-spørsmål: klikk på alternativ låser oppgaven, fargelegger riktig grønt / feil rødt, og åpner forklaringen automatisk.
  - Begge deler styres av [exam.js](exam.js) + [exam.css](exam.css) så lenge HTML-strukturen i §2 følges.
- **Poeng:** Hvert spørsmål har et eget poengtall (typisk 1–5). Settet skal summere til **100 poeng totalt**, samme fordeling som ekte eksamen.
- **Lengde per sett:** **22–28 oppgaver** (ca. 16–22 åpne + 6–8 lukkede). Reelle eksamener ligger på 25 ± 3.
- **Vanskelighetsgrad:** Et øvingssett skal *utfordre* en student som har lest pensum. Unngå at hvert spørsmål bare er "definér X". Bland inn anvendelse: gi en kodebit, et angrepscenario, en arkitekturskisse, et GDPR-spørsmål med kontekst — og krev at studenten *resonnerer*. Se [TDT4237 Spring 2025 exam questions.pdf](TDT4237%20Spring%202025%20exam%20questions.pdf) og [TDT4237 2024 exam questions without sensor guide.pdf](TDT4237%202024%20exam%20questions%20without%20sensor%20guide.pdf) for tonen.
- **Tidsramme (anbefalt):** 4 timer for et komplett sett, som ekte eksamen.

> **Viktig om gamle eksamener:** PDF-filene i oppgavebanken er referanser for *stil og vanskelighetsgrad*, ikke fasit. Bruk dem til å forstå hvilke spørsmålstyper som dukker opp, men **ikke replikér oppgaver direkte**. Variér scenario, kodebit, kontekst — og pass spesielt på at hvert nytt sett ikke bare gjentar de samme klassikerne ("forklar XSS reflected vs stored", "fire prinsipper for social engineering", "fem GDPR-prinsipper"). Disse er sentrale, men ett sett trenger ikke teste alle de "obligatoriske" kjernespørsmålene — velg *andre* vinklinger.

> **Variasjon på tvers av sett:** Før du lager et nytt sett, scroll gjennom eksisterende `eksamen_NN.html` og noter hvilke spørsmål som dominerer. Det er greit at *noen* kjernekonsepter går igjen (de er kjernepensum), men ikke greit at hvert nytt sett er en omformulering av forrige. Test også *underrepresentert* stoff: privacy-by-design teknikker, mikrotjeneste-spesifikke trusler, supply chain-trinn, SAST-begrensninger, prompt injection-typer.

> **"Idé-bank, ikke mal":** Listene under §3 (per pensumkapittel) er forslag til *temaer som har vært sentrale*, ikke en oppskrift. Velg 1–3 temaer per kapittel per sett, og varier valget mellom sett.

---

## 2. Filstruktur for en eksamensfil

Hver fil er en frittstående HTML-side. Skall:

```html
<!doctype html>
<html lang="nb">
<head>
  <meta charset="utf-8">
  <title>Øvingseksamen 01 — TDT4237</title>
  <link rel="stylesheet" href="exam.css">
</head>
<body>
  <header class="exam-head">
    <h1>Øvingseksamen 01 — TDT4237 Programvaresikkerhet og datapersonvern</h1>
    <p>Tidsramme: 4 timer · Hjelpemidler: Ingen · Total: 100 poeng</p>
    <p>Blanding av åpne spørsmål (~75 %) og flervalgsspørsmål (~25 %).</p>
  </header>

  <section class="exam-part">
    <h2>Oppgaver</h2>

    <!-- ÉN .exam-q per oppgave (se maler under) -->

  </section>

  <script src="exam.js"></script>
</body>
</html>
```

Oppgavene trenger ikke deles i to seksjoner — alt går i én strøm, slik som ekte Inspera-eksamen. Bruk poenglappen i headeren og selve oppgavenummeret for å holde orden.

### 2.1 Mal for åpent spørsmål (`.exam-q.exam-q--open`)

```html
<article class="exam-q exam-q--open">
  <header class="exam-q__head">
    <span class="exam-q__num">Spørsmål 3</span>
    <span class="exam-q__points">4 poeng</span>
    <span class="exam-q__topic">Kap. 2 — OWASP / XSS</span>
  </header>
  <div class="exam-q__body">
    <p class="q-text">Hva står XSS for? (1 p) Hva slags angrep er det? (1 p) Forklar forskjellen på <em>reflected</em> og <em>stored</em> XSS. (2 p)</p>
    <details class="fasit-details">
      <summary>Vis modellsvar</summary>
      <div class="fasit-body">
        <p><strong>Cross-Site Scripting</strong> — angrep der angriper injiserer klientside-skript (oftest JavaScript) som kjøres i offerets nettleser i konteksten av en betrodd side. Skriptet kan stjele cookies/session-tokens, manipulere DOM, eller utføre handlinger på vegne av brukeren.</p>
        <ul>
          <li><strong>Reflected:</strong> skriptet er en del av forespørselen (typisk i en URL-parameter) og "reflekteres" tilbake i responsen uten å lagres. Krever at offeret klikker en preparert lenke.</li>
          <li><strong>Stored:</strong> skriptet lagres på serveren (kommentarfelt, brukerprofil, forumtråd) og leveres til alle som besøker siden. Skalerer langt bedre for angriper.</li>
        </ul>
        <p>(Bonus: DOM-based XSS — payload trigges av klientside-JS som skriver usanert input til DOM-en, uten at serveren ser angrepet.)</p>
        <p class="ref">Pensum: <a href="../../kap2/injection.html">Kap. 2 — Injection / OWASP A03</a></p>
      </div>
    </details>
  </div>
</article>
```

For åpne spørsmål er det studenten selv som vurderer eget svar mot modellsvaret. Skriv derfor modellsvaret som om det skulle gi full pott — kompakt, men dekkende. Hvis spørsmålet har deloppgaver (a/b/c eller "minst fire"), strukturer modellsvaret med samme inndeling.

`exam.js` injiserer automatisk self-grade-knapper i `.fasit-body` ved init (Full pott / Nesten alt / Halvveis / Lite / Ingenting). Du trenger ikke å skrive disse i HTML-en.

### 2.2 Mal for lukket spørsmål (MC) (`.exam-q.exam-q--mc`)

```html
<article class="exam-q exam-q--mc">
  <header class="exam-q__head">
    <span class="exam-q__num">Spørsmål 18</span>
    <span class="exam-q__points">1 poeng</span>
    <span class="exam-q__topic">Kap. 4 — Session fixation</span>
  </header>
  <div class="exam-q__body">
    <p class="q-text">Hvilket tiltak er mest effektivt mot session fixation-angrep?</p>
    <ul class="exam-q__opts">
      <li><span class="opt-label">A</span> Regenerere session-token etter vellykket innlogging</li>
      <li><span class="opt-label">B</span> Strengere passordkrav</li>
      <li><span class="opt-label">C</span> HTTPS på all kommunikasjon</li>
      <li><span class="opt-label">D</span> Tofaktorautentisering</li>
    </ul>
    <details class="fasit-details">
      <summary>Vis fasit</summary>
      <div class="fasit-body">
        <span class="fasit-correct">Riktig svar: A</span>
        <p>Session fixation utnytter at angriper "planter" en kjent session-ID hos offeret (f.eks. via en lenke med <code>?sessionid=...</code>) og venter på at offeret logger inn. Hvis serveren beholder samme session-ID etter login, kan angriperen bruke den planted ID-en til å overta sesjonen. <strong>Regenerering av token ved login</strong> bryter angrepet — den plantede ID-en blir ugyldig idet brukeren autentiserer seg.</p>
        <p>B (passordkrav) hjelper mot bruteforce, ikke fixation. C (HTTPS) beskytter mot avlytting, men ikke mot at brukeren får servert en preparert ID. D (MFA) hever bar for innlogging, men hindrer ikke at den autentiserte sesjonen er knyttet til en angrep-kontrollert ID.</p>
        <p class="ref">Pensum: <a href="../../kap4/autentisering.html">Kap. 4 — Autentisering</a></p>
      </div>
    </details>
  </div>
</article>
```

### 2.3 Hvordan oppførselen styres

`exam.js` ser etter `.exam-q--mc`, gjør hver `<li>` i `.exam-q__opts` klikkbar, og leser riktig svar fra `.fasit-correct` (mønster `Riktig svar: X`). Ved klikk:

1. Riktig alternativ får klassen `is-correct` (grønn).
2. Hvis valgt ikke var riktig, får det klikkede `is-wrong` (rødt).
3. Oppgaven låses.
4. `<details class="fasit-details">` åpnes automatisk.

For `.exam-q--open` lar JS-en `<details>` være — studenten åpner og lukker den selv, og bruker self-grade-knappene nederst i `.fasit-body` til å registrere poeng.

### 2.4 Code-quiz-spørsmål

En vanlig variant (særlig i 2024- og 2025-eksamenene) er en kodebit etterfulgt av "hvilke linjer har sårbarheten?". Disse er enten MC eller åpne:

- **MC-variant:** 4 alternativer som er linje-intervaller (`7–8`, `81–82`, `53–58`, `24`). Vanligst i ekte eksamen.
- **Åpen variant:** "list linjenumrene og forklar sårbarheten" — krever mer av studenten.

Kodebiten skrives i `<pre><code>...</code></pre>` med linjenummer. Bruk reelle, kjente sårbare snutter (Django settings.py, lxml XMLParser med `resolve_entities=True`, MD5-basert session-token, manglende input-sanitering). Sekundærkilder: Secure Code Warrior, OWASP cheat sheets.

### 2.5 Krav til hver oppgave

- **Tematisk tittel** i `.exam-q__topic` med kapittelnummer (f.eks. "Kap. 3 — Symmetrisk krypto", "Kap. 6 — Threat modeling / STRIDE", "Kap. 9 — GDPR").
- **Pensum-lenke** i `<p class="ref">` til riktig HTML-side under [kap1/](../../kap1/) – [kap10/](../../kap10/).
- **Modellsvar (åpne) / forklaring (MC) er hovedsaken** — det er den teksten studenten ser når de sjekker svaret sitt. Skriv den som *læringstekst*, ikke bare fasit.
- For MC: forklar **hvorfor de andre er feil**, ikke bare hvorfor det riktige er riktig.
- For åpne med "minst N eksempler" / "list fire prinsipper": modellsvaret skal vise *flere* gyldige eksempler enn minimumskravet, så studenten ser hva som teller.

### 2.6 Innholdskrav spesielt for MC-alternativer

(Gjelder kun MC. Åpne spørsmål har ikke distraktorer.)

- **Lengde** — det riktige svaret skal ikke systematisk være lengst. Tell tegn; om riktig er klart lengre, korte ned eller forleng distraktorer med samme detaljnivå. Over hele settet bør riktig svar være lengst / mellomlangt / kortest *omtrent like ofte*.
- **Posisjon (A/B/C/D)** — fordel riktig svar jevnt; ikke "C-tendens".
- **Ingen tell-tale words.** *Alltid, aldri, kun, eneste* gjør et alternativ lett å eliminere; *typisk, vanligvis, ofte* gjør det mistenkelig "trygt". Unngå eller bruk symmetrisk.
- **Samme form og detaljnivå** på A–D. Hvis ett er en hel setning, skal alle være det. Hvis ett bruker fagterm (f.eks. *parametrisert spørring*), skal alle gjøre det.
- **Distraktorene skal være plausible** — basert på vanlige misforståelser (f.eks. "TLS hindrer SQL-injection" som distraktor til en injection-forsvar-oppgave), ikke åpenbart feilformaterte alternativer.
- **Innbyrdes uavhengige** — ikke "A og B, men ikke C". Unngå to nesten-identiske distraktorer.
- **Begrens "Ingen av de andre"-svaret** til maks ~1 av 10 oppgaver.

> **Sjekk før publisering:** Les hver MC-oppgave kun ved å se på alternativene (skjul spørsmålet). Klarer du å peke ut riktig svar bare ut fra hvordan de er formulert? Hvis ja — skriv om.

---

## 3. Pensumdekning per kapittel

Et fullstendig sett dekker alle 10 kapitler med minst én oppgave. Med 22–28 oppgaver totalt har vi rom for **2–3 oppgaver per kapittel** på de tyngste, **1 oppgave** på de letteste. Velg vinkling per sett — listen under er *ikke* en sjekkliste du må krysse av punkt for punkt, men en idé-bank.

### 3.1 Kap. 1 — Sikkerhetsprinsipper (1–2 oppgaver)
- **CIA-triaden** — definer C/I/A, gi eksempel på angrep mot hver. Eller: hvilken pilar brytes når X skjer?
- **Kjerneprinsipper** — defense in depth, least privilege, fail-safe defaults, separation of duties, complete mediation, open design / Kerckhoffs, economy of mechanism, psychological acceptability.
- **Threat landscape / aktører** — script kiddies, organisert kriminalitet, statsaktører, insiders — motivasjon og kapasitet.
- *Eksempel-spørsmål:* "Forklar prinsippet *defense in depth* og gi et konkret eksempel fra en webapplikasjon." (3 p, åpen)

### 3.2 Kap. 2 — OWASP Top 10 / appsikkerhet (3–4 oppgaver — kjernepensum)
- **Injection** (SQL, NoSQL, LDAP, OS command, XML/XXE) — kelner-analogien, parametriserte spørringer, prepared statements, ORM-faller.
- **XSS** — reflected vs stored vs DOM-based; forsvar (output encoding, CSP, HttpOnly cookies).
- **Authentication failures** — credential stuffing, brute force, broken session management.
- **Sensitive data exposure** — krypto-feil, manglende TLS, hardkodede nøkler.
- **SSRF** — server gjør forespørsler på vegne av angriper; cloud metadata-angrep (169.254.169.254).
- **Misconfiguration** — DEBUG=True, default credentials, åpne S3-buckets, manglende security headers.
- **Logging & monitoring failures** (A09) — hva må logges, hva må *ikke* logges, hva må alarmeres.
- **CSRF** — same-site cookies, CSRF-tokens, hvorfor GET ikke skal endre state.
- *Eksempel-spørsmål:* Code-quiz over en Django `settings.py` med `DEBUG = True`, manglende `SECURE_*`-settings, eller `MD5PasswordHasher` — "hvilke linjer har sårbarhet?".

### 3.3 Kap. 3 — Kryptografi (2–3 oppgaver)
- **Symmetrisk** — AES, modi (ECB/CBC/CTR/GCM), nøkkellengder, IV/nonce-bruk. Hvorfor er ECB usikkert?
- **Asymmetrisk** — RSA, ECC; nøkkelutveksling vs signering; hvorfor er asymmetrisk tregere?
- **Hashing & MAC** — SHA-256 vs MD5/SHA-1, kollisjonsmotstand, HMAC. Passord-hashing (bcrypt/scrypt/Argon2) — hvorfor ikke ren SHA-256? Salt vs pepper.
- **OTP (one-time pad)** — krypterings-/dekrypteringsalgoritmen, hvorfor er nøkkelgjenbruk katastrofalt, hvorfor garanterer ikke OTP integritet.
- **PKI, sertifikater, TLS handshake** — hva er en CA, hva er en chain of trust.
- *Eksempel-spørsmål:* "Forklar hvorfor det er usikkert å bruke samme OTP-nøkkel til å kryptere to meldinger." (2 p, åpen)

### 3.4 Kap. 4 — Autentisering og autorisasjon (2–3 oppgaver)
- **Autentisering** — tre faktorer (noe du *vet*, *har*, *er*); ett eksempel hver.
- **Passordlagring** — bcrypt-runder, salt, hva som lekker ved DB-dump.
- **Session management** — token-prediksjon, fixation, hijacking, secure/HttpOnly/SameSite-cookies.
- **JWT** — header.payload.signature; vanlige feil (alg=none, RS256 vs HS256-confusion, ingen exp).
- **OAuth 2.0 / OIDC** — authorization code flow, hvorfor PKCE for offentlige klienter.
- **Autorisasjon** — RBAC vs ABAC, broken access control (IDOR — Insecure Direct Object Reference).
- **MFA** — hvilke angrep stoppes (credential stuffing, phishing av passord), hvilke ikke (session hijacking etter MFA).
- *Eksempel-spørsmål:* MC om session fixation, eller code-quiz over en `_get_new_session_key` med MD5(user.id) — som ekte 2025-eksamen.

### 3.5 Kap. 5 — Threat modeling (1–2 oppgaver)
- **STRIDE** — hva står hver bokstav for, gi eksempel-trussel per kategori.
- **DREAD** / risk scoring — Damage, Reproducibility, Exploitability, Affected users, Discoverability.
- **Metodikk** — fire trinn (decompose, identify threats, document, rate).
- **Data flow diagrams (DFD)** og trust boundaries — hvor på diagrammet oppstår trusler typisk?
- *Eksempel-spørsmål:* "Gitt arkitekturen [enkel skisse], identifiser én STRIDE-trussel per kategori og foreslå mottiltak." (5 p, åpen)

### 3.6 Kap. 6 — Risikohåndtering, SDL, sikkerhetstesting (2–3 oppgaver)
- **Risikohåndtering** — kvalitativ vs kvantitativ; ALE = SLE × ARO; risk treatment (mitigate / transfer / accept / avoid).
- **CVSS** — base/temporal/environmental; hva betyr 0–10-skalaen, hva er den ikke (sannsynlighet for utnyttelse).
- **Zero-day** — definisjon; forskjell fra n-day; hvorfor er det vanskelig å forsvare seg.
- **SDL / SSDLC** — Microsoft SDL faser; security touchpoints i agile (McGraw); shift-left.
- **SAST / DAST / IAST** — hva hver finner, hva hver bommer på; begrensninger ved automatiske skannere (false positives, manglende kontekst, kan ikke vurdere business logic).
- **Pentesting** — hvorfor automatiske verktøy ikke erstatter manuell testing; web debugging proxies (Burp Suite, OWASP ZAP).
- *Eksempel-spørsmål:* "List tre begrensninger ved automatiske sårbarhetsskannere." (3 p, åpen)

### 3.7 Kap. 7 — LLM og programvaresikkerhet (2–3 oppgaver)
- **AI for utvikling** — risikoer ved kode-genererende LLM-er (Copilot/Cursor): hallusinerte API-er, gjenbruk av usikre mønstre, lekkasje av proprietær kode til leverandøren.
- **Prompt injection** — direkte vs indirekte (via dokument/RAG-kilde); hvorfor er det vanskelig å fikse.
- **Jailbreak** vs prompt injection — forskjellen.
- **OWASP Top 10 for LLM** (LLM01–LLM10).
- **Data poisoning** og PoisonGPT-angrepet — fem trinn (modify model weights, edit specific facts, upload to repo, get model integrated, exploit).
- **Sosial engineering med AI** — deepfakes, automatisert phishing.
- *Eksempel-spørsmål:* "List minst tre sikkerhets- og personvernrisikoer ved å bruke LLM til kodegenerering." (3 p, åpen)

### 3.8 Kap. 8 — Mikrotjenester og supply chain (2–3 oppgaver)
- **Mikrotjeneste-sikkerhet** — polyglot architecture (ulike språk/rammeverk per tjeneste) og hva det gjør med konsistent sikkerhetspolicy.
- **Service-to-service-autentisering** — mTLS vs JWT; hva man mister med kun JWT.
- **API gateway, zero trust, BeyondCorp**.
- **Supply chain-angrep** — fire trinn (compromise upstream → inject malicious code → distribute → exploit downstream). Eksempler: SolarWinds, event-stream, ua-parser-js, xz-backdoor.
- **Dependency confusion**, **typosquatting**, **kontoovertakelse av maintainer**.
- **SBOM** (Software Bill of Materials), **SLSA-rammeverket**, signerte artefakter (sigstore/cosign).
- *Eksempel-spørsmål:* "Forklar de fire trinnene i et software supply chain-angrep." (4 p, åpen)

### 3.9 Kap. 9 — GDPR og databeskyttelse (2–3 oppgaver)
- **Personvernsprinsipper** — lovlighet/rettferdighet/transparens, formålsbegrensning, dataminimering, riktighet, lagringsbegrensning, integritet/konfidensialitet, ansvarlighet.
- **Rettslige grunnlag** — samtykke, avtale, rettslig forpliktelse, vitale interesser, allmennhetens interesse, berettiget interesse.
- **Roller** — *controller* (behandlingsansvarlig) vs *processor* (databehandler); plikter per rolle.
- **Registrertes rettigheter** — innsyn, retting, sletting ("right to be forgotten"), portabilitet, innsigelse, automatisert beslutningstaking.
- **DPIA** (Data Protection Impact Assessment) — når kreves den.
- **Bruddvarsling** — 72 timer til Datatilsynet; når til registrerte.
- **Hvordan demonstrere etterlevelse** (controller accountability): policies, DPIA, registre, opplæring, kontrakter med databehandlere, brudd-rutiner.
- *Eksempel-spørsmål:* "List minst fire personvernsprinsipper fra GDPR." (4 p, åpen) — klassisk.

### 3.10 Kap. 10 — AI for forsvar, SAST (1–2 oppgaver)
- **AI brukt til forsvar** — anomalideteksjon, malware-klassifisering, phishing-detektorer; begrensninger (adversarial examples, falske positiver, forklarbarhet).
- **Malicious abuse of AI vs malicious use of AI** — forskjellen (misbruk av et legitimt AI-system vs bruk av AI som verktøy for å angripe).
- **SAST i praksis** — hvordan virker statisk analyse; false positives / false negatives; integrasjon i CI/CD; verktøy (Semgrep, CodeQL, SonarQube, Bandit).
- **Static vs dynamic vs interactive analysis** — komplementære, ikke konkurrerende.
- *Eksempel-spørsmål:* "Hva er forskjellen på *malicious abuse of AI* og *malicious use of AI*? Gi ett eksempel på hver." (4 p, åpen)

---

## 4. Hvordan omforme tidligere åpne spørsmål til MC (når du vil)

Noen klassikere kan brukes både som åpent og som MC. Ved konvertering:

| Åpen versjon | MC-versjon |
|---|---|
| "Forklar hvorfor X er sårbart" | Vis kodebit, spør "hvilken linje har sårbarheten?" med 4 linjeintervaller. |
| "Hvilket av disse er en CSRF-mitigering" | Vis 4 sikringstiltak; alle ser plausible ut, kun ett løser CSRF spesifikt. |
| "Hva er forskjellen på X og Y" | Vis 4 påstander om forskjellen, kun én er presis. |
| "List N eksempler på Z" | Vanskelig som MC — la den heller bli åpen. |
| "Forklar et trinn i angrep X" | Vis 4 alternative trinnsekvenser, kun én stemmer. |

Hold spørsmålet konkret og distraktorene plausible (typiske misforståelser, ikke tøv).

---

## 5. Sjekkliste før et nytt sett anses ferdig

- [ ] Filen er en HTML-side med `<link rel="stylesheet" href="exam.css">` og `<script src="exam.js"></script>`.
- [ ] Hver oppgave er en `<article class="exam-q exam-q--open">` eller `<article class="exam-q exam-q--mc">` etter §2.1/§2.2.
- [ ] MC-oppgaver har `.fasit-correct` med `Riktig svar: X`, og `<details>` med forklaring som dekker både riktig og feil alternativer.
- [ ] Åpne oppgaver har `<details>` med kompakt modellsvar som dekker hele spørsmålet (alle deloppgaver hvis flere).
- [ ] Testet i nettleser: MC-klikk låser/fargelegger/åpner forklaring; åpne `<details>` lar seg folde ut.
- [ ] **Antall oppgaver: 22–28 totalt.** Cirka **3/4 åpne, 1/4 MC**.
- [ ] **Poengsum = 100.** Verifisert ved å summere.
- [ ] Alle 10 pensumkapitler er representert med minst én oppgave.
- [ ] Minst én code-quiz (i Django-stil eller tilsvarende ekte rammeverk).
- [ ] **Variasjon mot eksisterende sett:** scrollet gjennom tidligere `eksamen_NN.html`, og minst 1/3 av oppgavene i dette settet tester en *vinkling* eller *spørsmålstype* som ikke er brukt i de siste sett.
- [ ] **Vanskelighetsgrad:** ikke alle spørsmål er "definér X". Minst halvparten krever anvendelse, sammenligning, eller koderesonering.
- [ ] **Ingen case study** (årets eksamen har ikke det).
- [ ] Ingen oppgave er en direkte kopi av en PDF-eksamen i denne mappa. Kontekst, kode, scenario varieres.
- [ ] Hver oppgave har pensum-lenke i `.ref` til riktig HTML-side i `kapN/`.
- [ ] **Lengdesjekk MC:** riktig svar er ikke systematisk lengst. Fordelt jevnt.
- [ ] **Posisjonssjekk MC:** riktig A/B/C/D fordelt jevnt.
- [ ] **Form-test MC:** prøv å gjette riktig svar uten å lese spørsmålet. Hvis du klarer det fra alternativenes form alene, skriv om.

---

## 6. Navngiving og oppfølging

- Filnavn: `eksamen_NN.html` (NN = 01, 02, …). Tema-spesifikke sett kan hete `eksamen_NN_tema.html`, f.eks. `eksamen_03_crypto.html`.
- Hvert sett bør ha en kort innledning øverst (under `<h1>`) med dato og hvilke kapitler som er hovedfokus.
- [exam.js](exam.js) og [exam.css](exam.css) er felles for alle sett — ikke kopier dem inn i hver fil.
- Når et sett er testet, legg eventuelt en `<!-- -->`-kommentar øverst om hva som var for lett/vanskelig, så neste sett kan kalibreres.
