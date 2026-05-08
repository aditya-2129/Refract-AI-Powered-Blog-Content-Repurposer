"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Linkedin, Twitter, Video, Search, BookOpen, Flame, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface GeneratedContent {
  linkedin: { type: string; content: string }[];
  twitter: string[];
  seo: { title: string; description: string };
  video: { title: string; scriptOutline: string };
}

export function ResultsSection({ data }: { data: GeneratedContent }) {
    const [activeTab, setActiveTab] = useState<"linkedin" | "twitter" | "seo" | "video">("linkedin");
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-8 py-10 space-y-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-300">
            {/* Tabs */}
            <div role="tablist" aria-label="Generated content types" className="flex flex-wrap gap-2">
                {[
                    { id: "linkedin", label: "LinkedIn", icon: Linkedin },
                    { id: "twitter", label: "Twitter", icon: Twitter },
                    { id: "seo", label: "SEO Meta", icon: Search },
                    { id: "video", label: "Video", icon: Video },
                ].map((tab) => (
                    <Button
                        key={tab.id}
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        variant={activeTab === tab.id ? "default" : "outline"}
                        onClick={() => setActiveTab(tab.id as any)}
                        className="gap-2 min-h-11"
                    >
                        <tab.icon className="w-4 h-4" aria-hidden="true" />
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Content Area */}
            <div
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                className="grid gap-6"
            >
                {activeTab === "linkedin" && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {data.linkedin.map((post, i) => (
                            <LinkedInCard
                                key={i}
                                index={i}
                                type={post.type}
                                content={post.content}
                                onCopy={() => handleCopy(post.content, `li-${i}`)}
                                isCopied={copied === `li-${i}`}
                            />
                        ))}
                    </div>
                )}

                {activeTab === "twitter" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle>Twitter Thread</CardTitle>
                                <CardDescription>{data.twitter.length} tweets</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(data.twitter.join("\n\n"), "tw-all")}
                            >
                                {copied === "tw-all" ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                Copy all
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {data.twitter.map((tweet, i) => (
                                <div key={i} className="flex gap-3 group">
                                    <span className="text-xs font-mono text-muted-foreground/50 w-4 shrink-0 pt-3.5 text-right select-none">{i + 1}</span>
                                    <div className="flex-1 relative p-3.5 bg-muted/40 rounded-xl text-sm border leading-relaxed">
                                        {tweet}
                                        <span className={cn(
                                            "absolute bottom-2 right-3 text-xs tabular-nums",
                                            tweet.length > 280 ? "text-destructive font-medium" : "text-muted-foreground/40"
                                        )}>
                                            {tweet.length}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {activeTab === "seo" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Metadata</CardTitle>
                            <CardDescription>Search result preview + raw values</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Google SERP Preview */}
                            <div className="rounded-xl border bg-card p-5 space-y-1.5 shadow-sm">
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Search Preview</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-yellow-400 shrink-0" />
                                    <span>yourwebsite.com › blog</span>
                                </div>
                                <h3 className="text-[#1a0dab] text-xl font-normal leading-snug hover:underline cursor-default">
                                    {data.seo.title}
                                </h3>
                                <p className="text-sm text-[#4d5156] leading-relaxed">
                                    {data.seo.description}
                                </p>
                            </div>

                            {/* Raw values */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meta Title</label>
                                        <span className={cn("text-xs tabular-nums", data.seo.title.length > 60 ? "text-destructive" : "text-muted-foreground")}>
                                            {data.seo.title.length}/60
                                        </span>
                                    </div>
                                    <div className="p-3 bg-muted rounded-lg text-sm font-mono">{data.seo.title}</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meta Description</label>
                                        <span className={cn("text-xs tabular-nums", data.seo.description.length > 160 ? "text-destructive" : "text-muted-foreground")}>
                                            {data.seo.description.length}/160
                                        </span>
                                    </div>
                                    <div className="p-3 bg-muted rounded-lg text-sm font-mono">{data.seo.description}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "video" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Strategy</CardTitle>
                            <CardDescription>YouTube-ready title and script outline</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* YouTube-style title block */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video Title</label>
                                <div className="p-4 bg-muted rounded-xl">
                                    <p className="text-lg font-semibold leading-snug">{data.video.title}</p>
                                </div>
                            </div>

                            {/* Script outline as numbered steps */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Script Outline</label>
                                <div className="divide-y divide-border rounded-xl border overflow-hidden">
                                    {data.video.scriptOutline
                                        .split('\n')
                                        .filter(line => line.trim())
                                        .map((line, i) => (
                                            <div key={i} className="flex gap-3 p-3.5 bg-card hover:bg-muted/30 transition-colors">
                                                <span className="text-xs font-mono text-primary/60 mt-0.5 shrink-0 w-5 text-right">{i + 1}</span>
                                                <span className="text-sm leading-relaxed">{line.replace(/^[\d•\-\.]+\s*/, '')}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

const linkedInVariants = [
    {
        icon: BookOpen,
        accent: "border-t-4 border-t-primary",
        badge: "bg-accent text-accent-foreground",
        label: "Educational",
    },
    {
        icon: Flame,
        accent: "border-t-4 border-t-destructive",
        badge: "bg-destructive/10 text-destructive",
        label: "Controversial",
    },
    {
        icon: Heart,
        accent: "border-t-4 border-t-emerald-500",
        badge: "bg-emerald-50 text-emerald-700",
        label: "Story",
    },
] as const;

function LinkedInCard({
    index,
    type,
    content,
    onCopy,
    isCopied,
}: {
    index: number;
    type: string;
    content: string;
    onCopy: () => void;
    isCopied: boolean;
}) {
    const variant = linkedInVariants[index % linkedInVariants.length];
    const Icon = variant.icon;
    return (
        <Card className={cn("h-full flex flex-col overflow-hidden", variant.accent)}>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded", variant.badge)}>
                        <Icon className="w-3 h-3" aria-hidden="true" />
                        {type || variant.label}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {content.replace(/\\n/g, '\n')}
            </CardContent>
            <div className="p-4 pt-0 mt-auto">
                <Button variant="secondary" className="w-full" onClick={onCopy}>
                    {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {isCopied ? "Copied" : "Copy to Clipboard"}
                </Button>
            </div>
        </Card>
    );
}
