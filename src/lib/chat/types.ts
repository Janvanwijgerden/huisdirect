export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatPageContext = {
  pathname: string;
  pageType:
    | "home"
    | "seller"
    | "buyer"
    | "listing_detail"
    | "listing_new"
    | "how_it_works"
    | "other";
  listingTitle?: string;
  listingCity?: string;
};

export type ChatRequestBody = {
  messages: ChatMessage[];
  pageContext: ChatPageContext;
};

export type ChatResponseBody = {
  reply: string;
};