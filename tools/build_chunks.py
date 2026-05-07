"""
Ekstraher -> chunk -> embed pensumboka til public/chunks.json.
Bruk: python tools/build_chunks.py book/security-engineering.pdf

Krever: pip install pdfplumber requests
"""
import json, os, re, sys, time
from pathlib import Path
import pdfplumber
import requests

if not API_KEY:
    raise SystemExit("Sett miljøvariabelen OPENROUTER_API_KEY")
MODEL = "nvidia/llama-nemotron-embed-vl-1b-v2:free"
OUT = Path("public/chunks.json")
TARGET_LEN = 1000
MIN_LEN = 600

# Mapping fra Anderson-kapittelnummer til kapitteletikett på nettstedet.
# Juster etter bokas faktiske innhold — kapittelnumre fra TOC.
CHAPTER_LABELS = {
    1:  "Kapittel 1: Introduksjon og sikkerhetsprinsipper",
    2:  "Kapittel 1: Introduksjon og sikkerhetsprinsipper",
    3:  "Kapittel 4: Autentisering og autorisasjon",   # Protocols
    4:  "Kapittel 4: Autentisering og autorisasjon",   # Access Control
    5:  "Kapittel 3: Kryptografi",                     # Cryptography
    6:  "Kapittel 8: Mikrotjenester og supply chain",  # Distributed Systems
    7:  "Kapittel 6: Risikohåndtering og SDL",         # Economics
    8:  "Kapittel 2: OWASP Top 10",                    # Multilevel Security
    10: "Kapittel 2: OWASP Top 10",                    # Banking
    16: "Kapittel 2: OWASP Top 10",                    # Network Attack
    18: "Kapittel 4: Autentisering og autorisasjon",   # Passwords
    19: "Kapittel 4: Autentisering og autorisasjon",   # API Security
    20: "Kapittel 1: Introduksjon og sikkerhetsprinsipper",  # Social Engineering
    21: "Kapittel 6: Risikohåndtering og SDL",         # Systems Engineering
    22: "Kapittel 6: Risikohåndtering og SDL",         # Assurance
    25: "Kapittel 9: Personvern og databeskyttelse",   # Privacy
    26: "Kapittel 9: Personvern og databeskyttelse",   # Privacy and Data Protection
}


def extract_text_by_chapter(pdf_path):
    """Returner liste av (kapittelnummer, tekst)-tupler.
    Anderson-boka bruker CHAPTER på én linje, nummeret på neste."""
    buffers = {}
    current = None
    saw_chapter_keyword = False

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for line in text.split("\n"):
                stripped = line.strip()

                if stripped.upper() == "CHAPTER":
                    saw_chapter_keyword = True
                    continue

                if saw_chapter_keyword and stripped:
                    saw_chapter_keyword = False
                    if re.match(r"^\d+$", stripped):
                        current = int(stripped)
                        buffers.setdefault(current, [])
                        continue

                # Hopp over running headers: "4 Chapter1 ■ ..." eller "Chapter1 ■ ..."
                if re.search(r"Chapter\d+\s*■", stripped):
                    continue

                if current is not None and stripped:
                    buffers[current].append(stripped)

    return [(n, "\n".join(lines)) for n, lines in sorted(buffers.items())]


def chunk(text, target=TARGET_LEN, min_len=MIN_LEN):
    words = text.split()
    out, cur, cur_len = [], [], 0
    for w in words:
        wl = len(w) + 1
        if cur_len + wl > target and cur_len >= min_len:
            out.append(" ".join(cur))
            cur, cur_len = [w], wl
        else:
            cur.append(w)
            cur_len += wl
    if cur:
        out.append(" ".join(cur))
    return out


def embed(text):
    r = requests.post(
        "https://openrouter.ai/api/v1/embeddings",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={"model": MODEL, "input": [text], "encoding_format": "float"},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()["data"][0]["embedding"]


def main(pdf_path):
    sections = extract_text_by_chapter(pdf_path)
    records = []
    for num, text in sections:
        label = CHAPTER_LABELS.get(num, f"Kapittel {num}: (uten mapping)")
        for c in chunk(text):
            records.append({"text": c, "chapter": label})

    print(f"{len(records)} chunks; embedder…")
    for i, rec in enumerate(records):
        for attempt in range(5):
            try:
                rec["embedding"] = embed(rec["text"])
                break
            except Exception as e:
                wait = 2 ** attempt
                print(f"  chunk {i}: {e}; prøver igjen om {wait}s")
                time.sleep(wait)
        if i % 20 == 0:
            print(f"  {i}/{len(records)}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(records, ensure_ascii=False), encoding="utf-8")
    print(f"Skrev {OUT} ({len(records)} chunks)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Bruk: python tools/build_chunks.py book/security-engineering.pdf")
        sys.exit(1)
    main(sys.argv[1])
