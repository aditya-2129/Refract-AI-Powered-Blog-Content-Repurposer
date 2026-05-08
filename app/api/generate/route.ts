
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

// Configure Google Generative AI with the API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the schema for the output
const contentSchema = z.object({
  linkedin: z.array(z.object({
    type: z.string().describe("The style of the post (e.g., Educational, Controversial, Story)"),
    content: z.string().describe("The full text of the LinkedIn post. USE PARAGRAPH BREAKS (\\n\\n) to make it readable. Do not produce a single block of text.")
  })).describe("3 distinct LinkedIn post variations"),
  
  twitter: z.array(z.string()).describe("A Twitter thread consisting of 5-7 tweets. Each string is one tweet."),
  
  seo: z.object({
    title: z.string().describe("An SEO-optimized meta title (max 60 chars)"),
    description: z.string().describe("An SEO-optimized meta description (max 160 chars)")
  }),
  
  video: z.object({
    title: z.string().describe("A catchy YouTube video title based on the blog"),
    scriptOutline: z.string().describe("A bulleted outline for a video script explaining the blog's key points")
  })
});

export async function POST(req: NextRequest) {
  try {
    const { content, originalUrl } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert Content Marketer and Social Media Strategist.
      
      Your task is to repurpose the following blog post content into high-performing social media assets.
      
      Original Blog URL: ${originalUrl || "N/A"}
      
      BLOG CONTENT:
      ${content.substring(0, 20000)}
      
      INSTRUCTIONS:
      1. Analyze the core message, hook, and value pillars of the blog.
      2. For LinkedIn: Create 3 distinct posts. One educational, one controversial/opinionated, and one personal/story-driven hook. USE SHORT PARAGRAPHS AND CLEAR LINE BREAKS.
      3. For Twitter: Create a cohesive thread that breaks down the blog into bite-sized insights.
      4. For SEO: Create a click-worthy title/desc.
      5. For Video: Imagine this as a YouTube video. Give me a title and a script outline.
      
      Tone: Professional but engaging, Viral-optimized, "Vibe Coder" style (modern, punchy).
    `;

    const result = await generateObject({
      model: google("gemini-3-flash-preview"), // specific version
      schema: contentSchema,
      prompt: prompt,
    });

    return NextResponse.json({ success: true, data: result.object });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
