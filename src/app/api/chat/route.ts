import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../../../lib/chat/system-prompt";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function detectIntent(message: string) {
  const lower = message.toLowerCase();

  if (
    lower.includes("zoek") ||
    lower.includes("huis in") ||
    lower.includes("woning in")
  ) {
    return "buyer_search";
  }

  if (
    lower.includes("verkopen") ||
    lower.includes("makelaar") ||
    lower.includes("zelf doen")
  ) {
    return "seller";
  }

  return "general";
}

function buildSystemContext(intent: string) {
  if (intent === "seller") {
    return `
De gebruiker denkt aan verkopen.

Focus op:
- simpel maken
- vertrouwen geven
- laten voelen dat dit goed te doen is
- subtiel richting actie sturen
`;
  }

  if (intent === "buyer_search") {
    return `
De gebruiker zoekt een woning.

Focus op:
- kort antwoord
- vraag verduidelijken indien nodig
- geen lange uitleg
`;
  }

  return `
Algemene vraag.

Antwoord kort en stuur richting actie waar mogelijk.
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const pageContext = body.pageContext || {};

    if (!messages.length) {
      return NextResponse.json(
        { error: "Geen messages ontvangen" },
        { status: 400 }
      );
    }

    const safeMessages: IncomingMessage[] = messages
      .filter(
        (message: IncomingMessage) =>
          message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0
      )
      .slice(-10);

    const lastUserMessage =
      safeMessages.filter((m) => m.role === "user").slice(-1)[0]?.content || "";

    const intent = detectIntent(lastUserMessage);

    const contextLines: string[] = [];

    if (pageContext?.pathname) {
      contextLines.push(`Huidige route: ${pageContext.pathname}`);
    }

    if (pageContext?.pageType) {
      contextLines.push(`Paginatype: ${pageContext.pageType}`);
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5.4-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "system",
          content: `Intent: ${intent}`,
        },
        {
          role: "system",
          content: buildSystemContext(intent),
        },
        ...(contextLines.length
          ? [
              {
                role: "system" as const,
                content: `Paginacontext:\n${contextLines.join("\n")}`,
              },
            ]
          : []),
        ...safeMessages,
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Er kwam geen antwoord terug.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      { error: "Er ging iets mis bij de chatbot." },
      { status: 500 }
    );
  }
}