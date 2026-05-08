"use client";

import { useRef, useState } from "react";
import { InputSection } from "@/components/InputSection";
import { GeneratedContent, ResultsSection } from "@/components/ResultsSection";

export default function Home() {
  const [data, setData] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // 1. Scrape
      const scrapeRes = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
      });
      const scrapeData = await scrapeRes.json();
      if (!scrapeData.success) throw new Error(scrapeData.error || "Failed to scrape content. Please check the URL.");

      // 2. Generate
      const genRes = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
              content: scrapeData.data.content, 
              originalUrl: url 
          })
      });
      const genData = await genRes.json();
      if (!genData.success) throw new Error(genData.error || "Failed to generate content. Please try again.");

      setData(genData.data);
      setTimeout(() => resultsRef.current?.focus(), 50);

    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full border-b px-6 py-3.5 flex items-center bg-card sticky top-0 z-10">
        <div className="text-xl tracking-tight leading-none font-bold italic text-primary">
          Refract
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center w-full">
        <InputSection onGenerate={handleGenerate} isLoading={isLoading} />
        
        {error && (
            <div role="alert" aria-live="assertive" className="w-full max-w-lg p-4 mb-8 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center">
                {error.toLowerCase().includes("quota") || error.includes("429") ? (
                  <>
                    <strong>High Traffic! 🚦</strong>
                    <p className="text-sm mt-1">We're on the free tier of Google Gemini. Please wait 60 seconds and try again.</p>
                  </>
                ) : error.toLowerCase().includes("scrape") || error.includes("404") || error.toLowerCase().includes("url") ? (
                  <>
                    <strong>Unable to Read Blog 🚫</strong>
                    <p className="text-sm mt-1">Is the URL public? Sometimes firewalls block scrapers. Try a different article.</p>
                  </>
                ) : error.toLowerCase().includes("safety") || error.toLowerCase().includes("blocked") ? (
                  <>
                    <strong>Content Flagged ⚠️</strong>
                    <p className="text-sm mt-1">The AI refused to process this content due to safety guidelines.</p>
                  </>
                ) : (
                  <>
                    <strong>Error</strong>
                    <p className="text-sm mt-1">{error}</p>
                  </>
                )}
            </div>
        )}

        {isLoading && <GeneratingSkeleton />}

        {data && !isLoading && (
          <div
            ref={resultsRef}
            tabIndex={-1}
            className="w-full flex-1 border-t focus:outline-none"
          >
            <ResultsSection data={data} />
          </div>
        )}
      </div>
    </main>
  );
}

function GeneratingSkeleton() {
  return (
    <div className="w-full flex-1 border-t" aria-busy="true" aria-label="Generating content">
      <div className="w-full max-w-4xl mx-auto px-8 py-10 space-y-8">
        <div className="flex flex-wrap gap-2">
          {[80, 72, 76, 64].map((w, i) => (
            <div key={i} className={`h-11 w-${w === 80 ? '24' : w === 72 ? '20' : w === 76 ? '24' : '18'} rounded-md bg-muted animate-pulse`} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-4">
              <div className="h-5 w-28 rounded bg-muted animate-pulse" />
              <div className="space-y-2.5">
                <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-5/6 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-4/6 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-full rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-3/6 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Reading and repurposing your blog post…
        </p>
      </div>
    </div>
  );
}
