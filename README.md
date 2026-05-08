# Refract — AI-Powered Blog Content Repurposer

**Transform any blog post URL into high-performing social media assets instantly.**

![Stack](https://img.shields.io/badge/Stack-Next.js_16-black) ![AI](https://img.shields.io/badge/AI-Gemini_Flash-blue)

## Live Demo

[https://up-growth-assessment-ai-powered-blo.vercel.app](https://up-growth-assessment-ai-powered-blo.vercel.app)

## What it does

Paste a public blog URL. Refract scrapes the content and uses Google Gemini to generate:

- **LinkedIn Posts (3 variations)** — Educational, Controversial, and Story angles
- **Twitter Thread** — 5–7 tweet cohesive thread with hook and CTA
- **SEO Metadata** — Optimized meta title and description with character-count validation
- **Video Strategy** — YouTube-ready title and numbered script outline

## Tech Stack

| Choice | Reasoning |
| :--- | :--- |
| **Next.js 16 (App Router)** | API routes live alongside the UI — no CORS, single deployment. |
| **Tailwind CSS + shadcn/ui** | Accessible components out of the box, amber design system on top. |
| **Vercel AI SDK + `generateObject`** | Structured JSON output with Zod schema validation — no hallucinated formatting. |
| **Google Gemini Flash** | Fast, generous free tier, handles long blog contexts well. |
| **Cheerio** | Lightweight HTML scraper — faster than headless browsers for text extraction. |

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/aditya-2129/Refract-AI-Powered-Blog-Content-Repurpose.git
   cd Refract-AI-Powered-Blog-Content-Repurpose
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment**:

   Create a `.env` file in the root:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
User pastes URL
  → POST /api/scrape   (cheerio scraper, 15k char cap)
  → POST /api/generate (Gemini generateObject, Zod schema)
  → ResultsSection renders 4 tabs
```

Key files: `app/page.tsx` (state + orchestration), `app/api/scrape/route.ts`, `app/api/generate/route.ts`, `lib/scraper.ts`, `components/ResultsSection.tsx`.

---

**Built by:** Aditya Fulzele
