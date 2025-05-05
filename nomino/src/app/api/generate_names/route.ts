import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generateUsernamesPrompt } from "./prompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cache = new Map<string, string>();
const rateLimit = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_RETRIES = 5;

const platforms = [
  { name: "YouTube", url: (u: string) => `https://www.youtube.com/@${u}` },
  { name: "X", url: (u: string) => `https://x.com/${u}` },
  { name: "Instagram", url: (u: string) => `https://www.instagram.com/${u}` },
  { name: "TikTok", url: (u: string) => `https://www.tiktok.com/@${u}` },
];

async function checkPlatform(url: string, timeout = 1000): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { method: "HEAD", signal: controller.signal });
    return res.status === 404;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function isUsernameAvailableEverywhere(username: string, platformCount = platforms.length): Promise<boolean> {
  const results = await Promise.allSettled(
    platforms.slice(0, platformCount).map(p => checkPlatform(p.url(username)))
  );
  return results.every(r => r.status === "fulfilled" && r.value);
}

async function generateUnusedNames(description: string): Promise<{ name: string; meaning: string }[]> {
  const seen = new Set<string>();
  const prompt = await generateUsernamesPrompt.format({ description });

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a branding assistant that returns structured JSON with usernames and meanings.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = completion.choices[0].message?.content || "";

    let suggestions: { name: string; meaning: string }[] = [];

    try {
      const json = JSON.parse(content);
      suggestions = json.usernames;
    } catch (err) {
      console.error("Failed to parse JSON, retrying...", err);
      
    

    suggestions = content
    .split("\n")
    .map(line => {
      const match = line.match(/"name":\s*"([^"]+)",\s*"meaning":\s*"([^"]+)"/);
      return match ? { name: match[1], meaning: match[2] } : null;
    })
    .filter(Boolean) as { name: string; meaning: string }[];
  }
    const available: { name: string; meaning: string }[] = [];

    for (const { name, meaning } of suggestions) {
      const username = name.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (seen.has(username)) continue;
      seen.add(username);

      const isFree = await isUsernameAvailableEverywhere(username, platforms.length - attempt);
      if (isFree) {
        available.push({ name, meaning });
        if (available.length === 3) break;
      }
    }

    if (available.length > 0) return available;
  }

  return [];
}


export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description)
      return NextResponse.json({ error: "Description is required" }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const userRate = rateLimit.get(ip) || { count: 0, lastRequest: 0 };

    if (now - userRate.lastRequest < RATE_LIMIT_WINDOW) {
      if (userRate.count >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again later." },
          { status: 429 }
        );
      }
      userRate.count++;
    } else {
      userRate.count = 1;
      userRate.lastRequest = now;
    }
    rateLimit.set(ip, userRate);

    if (cache.has(description)) {
      console.log("Cache hit:", description);
      return NextResponse.json({ namesAndMeanings: JSON.parse(cache.get(description)!) });
    }

    const namesAndMeanings = await generateUnusedNames(description);

    if (namesAndMeanings.length === 0) {
      return NextResponse.json(
        { error: "Could not generate unique, unused names after several tries." },
        { status: 404 }
      );
    }

    cache.set(description, JSON.stringify(namesAndMeanings));
    return NextResponse.json({ namesAndMeanings });
  } catch (error: any) {
    console.error("Error:", error);

    if (error?.statusCode === 429 || error?.message?.includes("quota")) {
      return NextResponse.json({ error: "Quota exceeded." }, { status: 429 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
