export type ChatRole = "user" | "assistant";

export type ChatUiMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ChatQuickAction = {
  label: string;
  prompt: string;
};

export type ChatCta = {
  label: string;
  href?: string;
  action?: "open_calculator";
  variant?: "primary" | "secondary";
};

export type ChatPageType =
  | "home"
  | "seller"
  | "buyer"
  | "listing_detail"
  | "listing_new"
  | "how_it_works"
  | "other";

export type ChatPageContext = {
  pathname: string;
  pageType: ChatPageType;
};
