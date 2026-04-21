"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import ChatLauncher from "./ChatLauncher";
import ChatWindow from "./ChatWindow";
import type {
  ChatCta,
  ChatPageContext,
  ChatQuickAction,
  ChatUiMessage,
} from "./chat-types";

const STORAGE_KEY = "huisdirect-chat-messages";

function createMessage(
  role: "user" | "assistant",
  content: string,
): ChatUiMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
  };
}

function getPageType(pathname: string): ChatPageContext["pageType"] {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/hoe-het-werkt")) return "how_it_works";
  if (pathname.startsWith("/listings/new")) return "listing_new";
  if (/^\/listings\/[^/]+$/.test(pathname)) return "listing_detail";

  const sellerRoutes = [
    "/kosten-makelaar",
    "/courtage-makelaar",
    "/huis-verkopen-zonder-makelaar",
    "/huis-verkopen-zonder-funda",
    "/huis-verkopen-zonder-courtage",
    "/zelf-huis-verkopen",
    "/makelaar-of-zelf-verkopen",
    "/wat-doet-een-makelaar",
    "/voor-verkopers",
    "/is-makelaar-nodig",
  ];

  if (sellerRoutes.some((route) => pathname.startsWith(route))) {
    return "seller";
  }

  if (pathname.startsWith("/listings")) return "buyer";

  return "other";
}

function getQuickActions(
  pageType: ChatPageContext["pageType"],
): ChatQuickAction[] {
  if (pageType === "listing_new") {
    return [
      {
        label: "Hulp bij omschrijving",
        prompt: "Kun je mij helpen met een goede woningomschrijving?",
      },
      {
        label: "Foto's maken",
        prompt:
          "Waar moet ik op letten bij foto's van mijn woning als ik die gewoon met een moderne telefoon maak?",
      },
      {
        label: "Vraagprijs aanpak",
        prompt:
          "Hoe kan ik slim nadenken over een vraagprijs zonder direct een bedrag te noemen?",
      },
    ];
  }

  if (pageType === "buyer" || pageType === "listing_detail") {
    return [
      {
        label: "Ik zoek een woning",
        prompt:
          "Ik zoek een woning. Kun je me helpen bepalen waar ik op moet letten?",
      },
      {
        label: "Passende woningen",
        prompt:
          "Kun je me helpen geschikte woningen te vinden op basis van plaats, budget en type?",
      },
      {
        label: "Vraag over deze woning",
        prompt: "Kun je mij helpen deze woning beter te beoordelen?",
      },
    ];
  }

  if (pageType === "seller") {
    return [
      {
        label: "Is dit verstandig?",
        prompt:
          "Ik twijfel of mijn huis verkopen zonder makelaar verstandig is. Kun je eerlijk met me meedenken?",
      },
      {
        label: "Wat bespaar ik?",
        prompt:
          "Wat bespaar ik ongeveer als ik zonder makelaar verkoop?",
      },
      {
        label: "Waar begin ik?",
        prompt:
          "Als ik zonder makelaar wil verkopen, wat is dan de slimste eerste stap?",
      },
    ];
  }

  if (pageType === "how_it_works") {
    return [
      {
        label: "Leg het simpel uit",
        prompt:
          "Kun je kort en simpel uitleggen hoe verkopen via HuisDirect werkt?",
      },
      {
        label: "Wat moet ik zelf doen?",
        prompt:
          "Welke stappen doe ik zelf als ik mijn huis zonder makelaar verkoop?",
      },
      {
        label: "Wat is slim om eerst te doen?",
        prompt:
          "Wat is voor mij slim om eerst te regelen als ik wil starten?",
      },
    ];
  }

  return [
    {
      label: "Ik wil verkopen",
      prompt:
        "Ik overweeg mijn huis zonder makelaar te verkopen. Waar begin ik het beste?",
    },
    {
      label: "Wat bespaar ik?",
      prompt:
        "Wat bespaar ik ongeveer als ik zonder makelaar verkoop?",
    },
    {
      label: "Ik zoek een woning",
      prompt: "Ik zoek een woning. Kun je mij helpen gerichter te zoeken?",
    },
  ];
}

function shouldShowCalculatorCta(messages: ChatUiMessage[]) {
  const lastUserMessage =
    [...messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content.toLowerCase() || "";

  const lastAssistantMessage =
    [...messages]
      .reverse()
      .find((message) => message.role === "assistant")
      ?.content.toLowerCase() || "";

  const calculatorKeywords = [
    "bespaar",
    "besparing",
    "bereken",
    "berekenen",
    "kosten",
    "courtage",
    "makelaarskosten",
  ];

  const userWantsSavings = calculatorKeywords.some((keyword) =>
    lastUserMessage.includes(keyword),
  );

  const assistantTalksAboutSavings = calculatorKeywords.some((keyword) =>
    lastAssistantMessage.includes(keyword),
  );

  return userWantsSavings || assistantTalksAboutSavings;
}

function getCtas(
  pageType: ChatPageContext["pageType"],
  messages: ChatUiMessage[],
): ChatCta[] {
  if (shouldShowCalculatorCta(messages)) {
    return [
      {
        label: "Bereken besparing",
        action: "open_calculator",
        variant: "primary",
      },
      {
        label: "Plaats je woning",
        href: "/auth/register",
        variant: "secondary",
      },
    ];
  }

  if (pageType === "listing_new") {
    return [
      {
        label: "Hoe het werkt",
        href: "/hoe-het-werkt",
        variant: "secondary",
      },
      {
        label: "Plaats je woning",
        href: "/auth/register",
        variant: "primary",
      },
    ];
  }

  if (pageType === "buyer" || pageType === "listing_detail") {
    return [
      {
        label: "Bekijk aanbod",
        href: "/listings",
        variant: "primary",
      },
      {
        label: "Voor verkopers",
        href: "/voor-verkopers",
        variant: "secondary",
      },
    ];
  }

  if (pageType === "seller") {
    return [
      {
        label: "Plaats je woning",
        href: "/auth/register",
        variant: "primary",
      },
      {
        label: "Hoe het werkt",
        href: "/hoe-het-werkt",
        variant: "secondary",
      },
    ];
  }

  if (pageType === "how_it_works") {
    return [
      {
        label: "Plaats je woning",
        href: "/auth/register",
        variant: "primary",
      },
      {
        label: "Wat bespaar ik?",
        action: "open_calculator",
        variant: "secondary",
      },
    ];
  }

  return [
    {
      label: "Plaats je woning",
      href: "/auth/register",
      variant: "primary",
    },
    {
      label: "Bekijk aanbod",
      href: "/listings",
      variant: "secondary",
    },
  ];
}

function getDefaultMessages(
  pageType: ChatPageContext["pageType"],
): ChatUiMessage[] {
  if (pageType === "listing_new") {
    return [
      createMessage(
        "assistant",
        "Ik kan je hier helpen met de basis van je advertentie. Je hoeft het niet meteen perfect te hebben. Met goede foto's en een duidelijke omschrijving kom je al ver.",
      ),
    ];
  }

  if (pageType === "buyer" || pageType === "listing_detail") {
    return [
      createMessage(
        "assistant",
        "Zoek je een woning of wil je ergens gericht op letten? Ik help je graag om sneller de juiste keuze te maken.",
      ),
    ];
  }

  if (pageType === "seller") {
    return [
      createMessage(
        "assistant",
        "Twijfel je of verkopen zonder makelaar bij jou past? Voor veel mensen is het overzichtelijker dan ze vooraf denken. Ik help je stap voor stap.",
      ),
    ];
  }

  if (pageType === "how_it_works") {
    return [
      createMessage(
        "assistant",
        "Ik kan het proces hier eenvoudig voor je samenvatten en met je meedenken over wat in jouw situatie slim is.",
      ),
    ];
  }

  return [
    createMessage(
      "assistant",
      "Wil je weten wat je ongeveer kunt besparen of hoe je slim start met verkopen zonder makelaar? Ik help je graag overzicht krijgen.",
    ),
  ];
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatUiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pageContext = useMemo<ChatPageContext>(() => {
    return {
      pathname,
      pageType: getPageType(pathname),
    };
  }, [pathname]);

  const quickActions = useMemo(() => {
    return getQuickActions(pageContext.pageType);
  }, [pageContext.pageType]);

  const ctas = useMemo(() => {
    return getCtas(pageContext.pageType, messages);
  }, [pageContext.pageType, messages]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      setMessages(getDefaultMessages(pageContext.pageType));
      return;
    }

    try {
      const parsed = JSON.parse(stored) as ChatUiMessage[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
        return;
      }

      setMessages(getDefaultMessages(pageContext.pageType));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      setMessages(getDefaultMessages(pageContext.pageType));
    }
  }, [pageContext.pageType]);

  useEffect(() => {
    if (messages.length === 0) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function sendMessage(overrideMessage?: string) {
    const finalMessage = (overrideMessage ?? input).trim();

    if (!finalMessage || isLoading) return;

    const userMessage = createMessage("user", finalMessage);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          pageContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Onbekende fout bij chatverzoek.");
      }

      const assistantMessage = createMessage(
        "assistant",
        data.reply || "Er kwam geen antwoord terug.",
      );

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      const fallbackMessage = createMessage(
        "assistant",
        "Er ging iets mis met de chat. Probeer het zo nog een keer.",
      );

      setMessages((current) => [...current, fallbackMessage]);
      console.error("ChatWidget error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <ChatWindow
          messages={messages}
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={sendMessage}
          quickActions={quickActions}
          ctas={ctas}
        />
      )}

      <ChatLauncher
        isOpen={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      />
    </div>
  );
}