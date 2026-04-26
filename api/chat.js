import { readFileSync } from "fs";
import { join } from "path";

let chunks = null;
function loadChunks() {
  if (chunks) return chunks;
  const raw = readFileSync(join(process.cwd(), "public", "chunks.json"), "utf-8");
  chunks = JSON.parse(raw);
  return chunks;
}

function cosine(a, b) {
  let d = 0, ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; ma += a[i] * a[i]; mb += b[i] * b[i]; }
  return d / (Math.sqrt(ma) * Math.sqrt(mb));
}

async function embed(text, apiKey) {
  const r = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
      input: [text], encoding_format: "float",
    }),
  });
  if (!r.ok) throw new Error(`embed ${r.status}: ${await r.text()}`);
  const d = await r.json();
  return d.data[0].embedding;
}

function topChunks(qEmb, all, n, chapterHint) {
  const scored = all.filter(c => c.embedding).map(c => {
    let s = cosine(qEmb, c.embedding);
    if (chapterHint && c.chapter && c.chapter.toLowerCase().includes(chapterHint.toLowerCase())) s += 0.03;
    return { text: c.text, chapter: c.chapter, score: s };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n);
}

const PRESETS = {
  fast: "liquid/lfm-2.5-1.2b-instruct:free",
  balanced: "google/gemma-4-26b-a4b-it:free",
  quality: "openai/gpt-oss-120b:free",
};

function modelFor(preset) {
  const envKey = `OPENROUTER_CHAT_MODEL_${preset.toUpperCase()}`;
  return process.env[envKey] || PRESETS[preset] || PRESETS.balanced;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

const NDJSON = {
  "Content-Type": "application/x-ndjson; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Accel-Buffering": "no"
};

function sseToNdjson(upstream) {
  const enc = new TextEncoder(), dec = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader();
      let buf = "";
      const write = o => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      try {
        while (true) {
          const { done, value } = await reader.read();
          buf += dec.decode(value ?? new Uint8Array(), { stream: !done });
          if (done) break;
          buf = buf.replace(/\r\n/g, "\n");
          while (true) {
            const sep = buf.indexOf("\n\n");
            if (sep === -1) break;
            const block = buf.slice(0, sep);
            buf = buf.slice(sep + 2);
            for (const line of block.split("\n")) {
              if (!line.startsWith("data:")) continue;
              const raw = line.slice(5).trimStart();
              if (raw === "[DONE]") continue;
              try {
                const j = JSON.parse(raw);
                if (j.error) {
                  write({ e: typeof j.error === "string" ? j.error : j.error.message });
                  controller.close(); return;
                }
                const piece = j.choices?.[0]?.delta?.content;
                if (typeof piece === "string" && piece) write({ t: piece });
              } catch { }
            }
          }
        }
        write({ d: true });
        controller.close();
      } catch (err) {
        try { write({ e: err.message || String(err) }); } catch { }
        controller.close();
      }
    }
  });
}

export async function POST(request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return json({ error: "OPENROUTER_API_KEY not satt" }, 500);

  try {
    const { question, page_context, history, preset } = await request.json();
    if (!question) return json({ error: "Mangler question" }, 400);

    const locale = (page_context?.locale || "no").startsWith("en") ? "en" : "no";

    let searchQuery = question;
    if (page_context?.section?.title) searchQuery = `[${page_context.chapter} – ${page_context.section.title}] ${question}`;
    else if (page_context?.chapter) searchQuery = `[${page_context.chapter}] ${question}`;

    const embPromise = embed(searchQuery, apiKey);
    const all = loadChunks();
    const qEmb = await embPromise;
    const top = topChunks(qEmb, all, 3, page_context?.chapter || null);
    let bookCtx = top.map(c => c.text).join("\n\n---\n\n");
    if (bookCtx.length > 12000) bookCtx = bookCtx.slice(0, 12000) + "\n\n[… forkortet …]";

    const intro = locale === "en"
      ? `You are a study assistant for TDT4237 — Software Security and Data Privacy at NTNU. Ground answers in the textbook excerpts and the visible page text below.`
      : `Du er en studieassistent for TDT4237 — Programvaresikkerhet og datapersonvern ved NTNU. Bygg svaret på utdragene fra pensumboka (Security Engineering, Ross Anderson) og den synlige teksten under.`;

    const rules = locale === "en"
      ? `Answer in English. Be concise — 2–4 sentences for simple questions, a short bullet list only when listing 3+ distinct items. If the answer isn't in the context, say so in one sentence. Keep technical terms (SQL injection, XSS, CSRF, OWASP, JWT, mTLS, SAST, STRIDE, etc.) in English.`
      : `Svar på norsk (bokmål). Vær kortfattet — 2–4 setninger for enkle spørsmål, kort punktliste kun ved 3+ elementer. Si ifra i én setning hvis svaret ikke finnes i konteksten. Behold etablerte fagbegrep på engelsk: SQL injection, XSS, CSRF, OWASP, JWT, mTLS, SAST, DAST, STRIDE, threat modeling, supply chain attack, prompt injection osv.`;

    const locInfo = page_context?.chapter
      ? (locale === "en"
        ? `The user is reading: ${page_context.chapter}${page_context.section?.title ? ` — section: "${page_context.section.title}"` : ""}`
        : `Brukeren leser: ${page_context.chapter}${page_context.section?.title ? ` — seksjon: «${page_context.section.title}»` : ""}`)
      : "";

    const visible = page_context?.visible_text || "(none)";
    const system = `${intro}\n${rules}\n${locInfo}\n\n## Synlig tekst:\n${visible}\n\n## Utdrag fra pensumboka:\n${bookCtx}`;

    const messages = [
      { role: "system", content: system },
      ...(history || []),
      { role: "user", content: question },
    ];

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelFor(preset || "balanced"), messages, stream: true }),
    });
    if (!r.ok || !r.body) return json({ error: `LLM ${r.status}: ${await r.text()}` }, 502);

    return new Response(sseToNdjson(r.body), { status: 200, headers: NDJSON });
  } catch (err) {
    console.error(err);
    return json({ error: err.message }, 500);
  }
}
