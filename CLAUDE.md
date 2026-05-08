# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

There is no test suite configured.

## Environment Setup

Create a `.env` file in the root with:

```env
GEMINI_API_KEY=your_api_key_here
```

This key is required — the app will fail at the `/api/generate` step without it.

## Architecture

This is a Next.js 16 (App Router) application with two sequential API calls orchestrated from a single client page.

**Data flow:**

1. User pastes a blog URL into `InputSection`
2. `app/page.tsx` calls `POST /api/scrape` → `lib/scraper.ts` fetches and parses the HTML with `cheerio`, returning `{ title, content, originalUrl }` (content capped at 15k chars)
3. `app/page.tsx` calls `POST /api/generate` with the scraped content → uses Vercel AI SDK's `generateObject` with Google Gemini (`gemini-3-flash-preview`) to produce structured JSON conforming to `contentSchema` (defined inline in `route.ts`)
4. `ResultsSection` renders the four output types (LinkedIn posts, Twitter thread, SEO metadata, Video strategy) in tabbed cards

**Key files:**

- `app/page.tsx` — client component that owns state (`data`, `isLoading`, `error`) and drives both API calls
- `app/api/scrape/route.ts` — thin wrapper around `lib/scraper.ts`
- `app/api/generate/route.ts` — Zod schema (`contentSchema`) + Gemini prompt + `generateObject` call
- `lib/scraper.ts` — cheerio-based scraper with selector cascade (WordPress → semantic HTML5 → generic classes → body fallback), 10s timeout, content min-length guard
- `components/ResultsSection.tsx` — exports `GeneratedContent` interface (the canonical type for AI output); tab-based UI
- `components/InputSection.tsx` — URL form with loading state

**UI stack:** Tailwind CSS v4 + shadcn/ui components (in `components/ui/`). `lib/utils.ts` exports the `cn` helper.

## AI Integration Notes

- Model: `gemini-3-flash-preview` via `@ai-sdk/google`
- Blog content is capped at 20k chars in the prompt (15k from scraper, hardcoded substring in `route.ts`)
- Rate limit (429) and content safety errors bubble up as plain `error.message` strings; `app/page.tsx` pattern-matches these strings to show user-friendly messages
- `contentSchema` in `app/api/generate/route.ts` is the single source of truth for the AI output shape — changing it requires updating both the Zod schema and `GeneratedContent` interface in `ResultsSection.tsx`
