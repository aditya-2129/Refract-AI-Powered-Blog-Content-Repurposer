"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2 } from "lucide-react";

export function InputSection({ onGenerate, isLoading }: { onGenerate: (url: string) => void, isLoading: boolean }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onGenerate(url);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-8 pt-20 pb-16 space-y-10">
      <div className="space-y-4 max-w-2xl">
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.06]">
          Turn blog posts into{" "}
          <span className="text-primary italic">social assets</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
          Paste a URL. Get LinkedIn posts, a Twitter thread, SEO metadata, and a video script — ready to publish.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <label htmlFor="blog-url" className="sr-only">Blog post URL</label>
        <Input
          id="blog-url"
          type="url"
          placeholder="https://yourblog.com/post-title"
          className="h-11 text-sm flex-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button className="h-11 px-5 sm:shrink-0 w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Generating
            </>
          ) : (
            <>
              Generate <ArrowRight className="ml-2 w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </form>
    </section>
  );
}
