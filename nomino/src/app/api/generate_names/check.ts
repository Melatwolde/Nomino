import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Ensure this runs in Node.js for fetch reliability

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map<string, string>();
const rateLimit = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

const platforms = [
  { name: "YouTube", url: (username: string) => `https://www.youtube.com/@${username}` },
  { name: "X", url: (username: string) => `https://x.com/${username}` },
  { name: "Instagram", url: (username: string) => `https://www.instagram.com/${username}` },
  { name: "TikTok", url: (username: string) => `https://www.tiktok.com/@${username}` },
];

async function checkAvailability(name: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

    for (const platform of platforms) {
      try {
        const response = await fetch(platform.url(name), {
          method: "HEAD",
          signal: controller.signal,
        });
        if (response.status !== 404) {
          clearTimeout(timeout);
          return false;
        }
      } catch (err) {
        console.warn(`Fetch error for ${platform.name}:`, err);
        clearTimeout(timeout);
        return false;
      }
    }

    clearTimeout(timeout);
    return true;
  } catch (err) {
    console.error("Availability check failed:", err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const userRate = rateLimit.get(ip) || { count: 0, lastRequest: 0 };

    if (now - userRate.lastRequest < RATE_LIMIT_WINDOW) {
      if (userRate.count >= RATE_LIMIT_MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
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
      console.log("Cache hit for:", description);
      const cached = cache.get(description);
      return NextResponse.json({ namesAndMeanings: JSON.parse(cached!) });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a branding assistant. Create 4 totally new, made-up brand names for a social media channel based on the user's idea. They should be catchy, easy to pronounce, very short (one or two words), and must not be real English dictionary words. Provide a short one-line vibe or explanation for each.",
        },
        {
          role: "user",
          content: `The channel idea: ${description}. Suggest 5 unique name ideas and their meanings.`,
        },
      ],
      max_tokens: 200,
    });

    const generatedResponse = completion.choices[0].message?.content;

    const namesAndMeanings = generatedResponse
      ?.split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const lineWithoutNumber = line.replace(/^\d+\.\s*/, "").trim();
        const match = lineWithoutNumber.match(/^([A-Za-z0-9]+)\s*[-:]\s*(.*)$/);
        if (match) {
          return {
            name: match[1].trim(),
            meaning: match[2].trim(),
          };
        } else {
          return {
            name: lineWithoutNumber,
            meaning: "",
          };
        }
      });

    const availableNames = [];
    for (const item of namesAndMeanings || []) {
      const isAvailable = await checkAvailability(item.name);
      if (isAvailable) {
        availableNames.push(item);
      }
    }

    cache.set(description, JSON.stringify(availableNames));

    return NextResponse.json({ namesAndMeanings: availableNames });
  } catch (error: any) {
    console.error("Error in POST handler:", error);

    if (error?.statusCode === 429 || error?.message?.includes("quota")) {
      return NextResponse.json(
        {
          error:
            "Quota exceeded. Please check your OpenAI account or try again later.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate names. Please try again later." },
      { status: 500 }
    );
  }
}
