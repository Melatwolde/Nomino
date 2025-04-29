import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map<string, string>();
const rateLimit = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; 
const RATE_LIMIT_MAX_REQUESTS = 5;

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
      console.log("Cache hit for description:", description);
      return NextResponse.json({ names: cache.get(description) });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
          "You are a branding assistant. Create 4 totally new, made-up brand names for a social media channel based on the user's idea. They should be catchy, easy to pronounce, very short (one or two words), and **must not** be real English dictionary words. Provide a short one-line vibe or explanation for each.",
        },
        {
          role: "user",
          content: `The channel idea: ${description}. Suggest 5 unique name ideas and their meanings.`,
        },
      ],
      max_tokens: 200,
    });

    const generatedResponse = completion.choices[0].message?.content;

    // Cache the response to avoid hitting the quota
    cache.set(description, generatedResponse || "No names generated");

    const namesAndMeanings = generatedResponse
  ?.split("\n")
  .filter((line) => line.trim() !== "")
  .map((line) => {
    // Remove number prefix if present
    const lineWithoutNumber = line.replace(/^\d+\.\s*/, "").trim();

    // Split at the first dash or colon
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


    return NextResponse.json({ namesAndMeanings });
  } catch (error: any) {
    console.error("Error generating names:", error);

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