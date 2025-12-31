import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

// @ts-expect-error - pdf-parse does not have types
import pdf from "pdf-parse/lib/pdf-parse.js";

// Constants for rate limiting
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15; // 15 requests per minute

const requestCounts = new Map<string, { count: number; windowStart: number }>();

// Function to get a unique identifier for the client (IP or user-agent) useful for rate limiting
function getClientIdentifier(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    if (ip) {
      return ip;
    }
  }

  // Fallback to user-agent if IP is not available, used to identify unique clients
  const userAgent = req.headers.get("user-agent");
  if (userAgent) {
    return userAgent;
  }

  // Fallback to real-ip if available
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

// Function to check if the client is rate limited, returns true if the client is rate limited
function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const existing = requestCounts.get(identifier);

  if (!existing) {
    requestCounts.set(identifier, { count: 1, windowStart: now });
    return false;
  }

  // Check if the current request is within the rate limit window
  if (now - existing.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestCounts.set(identifier, { count: 1, windowStart: now });
    return false;
  }

  existing.count += 1;
  requestCounts.set(identifier, existing);

  // Check if the client has exceeded the rate limit
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

// POST handler for the roast API endpoint, handles resume roasting requests
export async function POST(req: NextRequest) {
  try {
    // Get the unique identifier for the client (IP or user-agent)
    const clientIdentifier = getClientIdentifier(req);
    // Check if the client is rate limited
    if (isRateLimited(clientIdentifier)) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please wait a minute before roasting another resume.",
        },
        { status: 429 },
      );
    }

    // Parse form data, extract resume file, GitHub URL, and LinkedIn URL
    const formData = await req.formData();
    const file = formData.get("resume");
    const githubUrl = formData.get("githubUrl") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;

    // Validate resume file
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: "File too large. Maximum allowed size is 5MB.",
        },
        { status: 413 },
      );
    }

    // Validate file type
    if (file.type && file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Invalid file type. Please upload a PDF resume.",
        },
        { status: 400 },
      );
    }

    // Convert file to ArrayBuffer for pdf-parse, then to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // Fetch GitHub Data if URL is provided
    let githubData = "";
    if (githubUrl) {
      // Extract username from GitHub URL, e.g., https://github.com/devesh-001
      const match = githubUrl.match(/github\.com\/([^\/]+)/);
      if (match && match[1]) {
        const username = match[1];
        try {
          const ghRes = await fetch(`https://api.github.com/users/${username}`);
          if (ghRes.ok) {
            const ghJson = await ghRes.json();
            // Pick relevant fields to save tokens
            const relevantData = {
              login: ghJson.login,
              bio: ghJson.bio,
              public_repos: ghJson.public_repos,
              followers: ghJson.followers,
              following: ghJson.following,
              created_at: ghJson.created_at,
              company: ghJson.company,
              blog: ghJson.blog,
            };
            githubData = JSON.stringify(relevantData, null, 2);
          }
        } catch (e) {
          console.error("Failed to fetch GitHub data", e);
        }
      }
    }

    const prompt = `
    You are a ruthless, savage tech recruiter. Write a short, brutal, punchy roast of this candidate that really calls out their mediocrity and bad choices.

    Resume:
    ${resumeText}

    ${githubData ? `GitHub profile data:\n${githubData}` : ""}
    ${linkedinUrl ? `LinkedIn URL: ${linkedinUrl}` : ""}

    Output format (Markdown, keep it compact, under ~250 words):

    ## 🔥 Roast Summary
    - **Overall vibe:** 2–4 bullets covering seniority and first impression

    ## Skills & Tech
    - **Stack reality check:** 3–5 bullets roasting their tools, buzzwords, and real ability

    ## 🔗 **GitHub & LinkedIn**
    - **Online presence:** 2–4 bullets about activity, followers, and online presence (or lack of it)

    ## **🤖Final Verdict**
    - **Verdict:** 1–2 short sentences that sum them up in a funny way

    Rules:
    - Be very sarcastic, ruthless, and specific to this candidate.
    - Focus on weaknesses, red flags, and boring or overhyped parts of their profile.
    - Use short, sharp one-liners and punchy phrasing that really stings.
    - Avoid empty compliments unless they are clearly part of the joke.
    - Start each bullet with a short bold label before the explanation.
    - Add blank lines between sections and bullets so it is well spaced.
    - Do not write an essay; keep it tight and easy to skim.
    - Keep it light-hearted and fun, not hateful, slur-based, or genuinely offensive.
    `;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.warn("GOOGLE_GENERATIVE_AI_API_KEY is missing.");
      return NextResponse.json({
        roast:
          "## 🔥 System Roast\n\n**Status: API Key Missing**\n\nYou're asking me to roast you, but you haven't even given me the keys to the kitchen. \n\n**To the Developer:** Please add `GOOGLE_GENERATIVE_AI_API_KEY` to your environment variables.",
      });
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: prompt,
    });

    return NextResponse.json({ roast: text });
  } catch (error: unknown) {
    console.error("Error roasting resume:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // If it's an API error (401, 404, etc.) provide a helpful roast about the setup
    if (
      errorMessage.includes("API key") ||
      errorMessage.includes("401") ||
      errorMessage.includes("404") ||
      errorMessage.includes("not found")
    ) {
      return NextResponse.json({
        roast:
          "## 🔥 System Roast\n\n**Status: Missing or Invalid API Configuration**\n\nI'd roast your resume, but your developer forgot to set up the Gemini API key correctly. \n\nIt's like your career: full of potential, but currently throwing a 404. \n\n**To the Developer:** Please check your `GOOGLE_GENERATIVE_AI_API_KEY` and ensure the model `gemini-2.5-flash` is available.",
      });
    }

    return NextResponse.json(
      { error: "Failed to roast resume" },
      { status: 500 },
    );
  }
}
