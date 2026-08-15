import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

type InsightInput = {
  clientName: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
  daysOverdue: number;
};

type InsightsResult = {
  summary: string;
  trends: string[];
  slowestPayingClient: string | null;
  totalOverdueAmount: number;
  recommendations: string[];
};

const insightSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    trends: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    slowestPayingClient: {
      type: SchemaType.STRING,
      nullable: true,
    },
    totalOverdueAmount: { type: SchemaType.NUMBER },
    recommendations: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: ["summary", "trends", "slowestPayingClient", "totalOverdueAmount", "recommendations"],
};

const apiKey = process.env.GEMINI_API_KEY;
const gemini = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const RETRY_DELAYS_MS = [1000, 2000, 4000];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPrompt(invoices: InsightInput[]) {
  return `Analyze the following invoice payment data and return a structured JSON object with the shape { summary, trends, slowestPayingClient, totalOverdueAmount, recommendations }.

Return only the JSON object, not additional explanatory text.

Invoice data:
${JSON.stringify(invoices, null, 2)}

For each entry, use clientName, amount, status, dueDate, and daysOverdue to identify payment patterns, overdue exposure, and which clients are slowest to pay.`;
}

function isValidInsightsResult(value: unknown): value is InsightsResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.trends) &&
    candidate.trends.every((trend) => typeof trend === "string") &&
    (candidate.slowestPayingClient === null || typeof candidate.slowestPayingClient === "string") &&
    typeof candidate.totalOverdueAmount === "number" &&
    Array.isArray(candidate.recommendations) &&
    candidate.recommendations.every((recommendation) => typeof recommendation === "string")
  );
}

async function fetchInsightsWithRetry(invoices: InsightInput[]): Promise<InsightsResult> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      if (!gemini) {
        throw new Error("Gemini API key is not configured.");
      }

      const model = gemini.getGenerativeModel({
        model: "gemini-flash-latest",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: insightSchema,
        },
      });

      const result = await model.generateContent(buildPrompt(invoices));
      const responseText = result.response.text().trim();
      const parsed = JSON.parse(responseText) as unknown;

      if (!isValidInsightsResult(parsed)) {
        throw new Error("Gemini returned malformed structured data.");
      }

      return parsed;
    } catch (error) {
      lastError = error;

      const message = error instanceof Error ? error.message : "Unknown error.";
      const isRetryable = /(503|429|timeout|network|fetch|unavailable|temporar)/i.test(message);

      if (attempt >= RETRY_DELAYS_MS.length || !isRetryable) {
        throw error;
      }

      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw lastError ?? new Error("Gemini request failed.");
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key is not configured." }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be an array of invoices." }, { status: 400 });
  }

  const invoices = body.map((item) => ({
    clientName: typeof item === "object" && item !== null && "clientName" in item ? (item as any).clientName : undefined,
    amount: typeof item === "object" && item !== null && "amount" in item ? (item as any).amount : undefined,
    status: typeof item === "object" && item !== null && "status" in item ? (item as any).status : undefined,
    dueDate: typeof item === "object" && item !== null && "dueDate" in item ? (item as any).dueDate : undefined,
    daysOverdue: typeof item === "object" && item !== null && "daysOverdue" in item ? (item as any).daysOverdue : undefined,
  })) as InsightInput[];

  const invalidItem = invoices.find(
    (invoice) =>
      typeof invoice.clientName !== "string" ||
      typeof invoice.amount !== "number" ||
      !["paid", "unpaid", "overdue"].includes(invoice.status) ||
      typeof invoice.dueDate !== "string" ||
      typeof invoice.daysOverdue !== "number",
  );

  if (invalidItem) {
    return NextResponse.json({ error: "Every invoice must include clientName, amount, status, dueDate, and daysOverdue." }, { status: 400 });
  }

  try {
    const parsed = await fetchInsightsWithRetry(invoices);
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    const status = /(503|timeout|network|fetch|unavailable)/i.test(message) ? 503 : 502;
    return NextResponse.json({ error: `Insights generation failed: ${message}` }, { status });
  }
}
