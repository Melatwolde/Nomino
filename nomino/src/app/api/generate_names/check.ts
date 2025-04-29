import { NextResponse } from "next/server";

const platforms = [
  { name: "YouTube", url: (username: string) => `https://www.youtube.com/@${username}` }, 
  { name: "X", url: (username: string) => `https://x.com/${username}` },
  { name: "Instagram", url: (username: string) => `https://www.instagram.com/${username}` },
  { name: "TikTok", url: (username: string) => `https://www.tiktok.com/@${username}` },
];

export async function POST(req: Request) {
  try {
    const { names } = await req.json();

    if (!Array.isArray(names) || names.length === 0) {
      return NextResponse.json({ error: "Names array is required" }, { status: 400 });
    }

    const uniqueNames: { name: string; availableOn: string[] }[] = [];

    for (const name of names) {
      const availability = await Promise.all(
        platforms.map(async (platform) => {
          try {
            const response = await fetch(platform.url(name), { method: "HEAD" });
            return response.status === 404 ? platform.name : null;
          } catch {
            return null; // Treat as unavailable if fetch error
          }
        })
      );

      const availableOn = availability.filter(Boolean) as string[];

      if (availableOn.length === platforms.length) {
        uniqueNames.push({ name, availableOn });
      }
    }

    return NextResponse.json({ uniqueNames });
  } catch (error: any) {
    console.error("Error checking name availability:", error);
    return NextResponse.json({ error: "Failed to check name availability" }, { status: 500 });
  }
}
