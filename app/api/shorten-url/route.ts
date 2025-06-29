import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `Failed to shorten URL: ${errorBody}` },
        { status: response.status }
      );
    }

    const shortUrl = await response.text();

    if (shortUrl.startsWith("Error:")) {
      return NextResponse.json({ error: shortUrl }, { status: 400 });
    }

    return NextResponse.json({ shortUrl });
  } catch (error: any) {
    console.error("URL Shortening Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
