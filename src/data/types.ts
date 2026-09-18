export interface Entry {
  id: string;
  name: string;
  subtitle: string;
  image?: string;
  clip?: string;
  year?: string;
  series?: string;
  originalTitle?: string;
  usTitle?: string;
  germanTitle?: string;
  creator?: string;
  platform?: string;
  genre?: string;
  score?: number;
  source?: string;
  context: string;
  significance?: string;
  personal: string;
  memory?: string;
  features?: string[];
  needsMetadata?: boolean;
  status?: string;
  cover?: string;
  coverWidth?: number;
  coverHeight?: number;
  sportMeta?: SportMeta;
}

export interface SportTeam {
  name: string;
  logo?: string;
  fallback: string;
}

export interface SportMeta {
  variant: "football" | "basketball" | "baseball" | "f1";
  overview?: string;
  teams?: SportTeam[];
  otherConnection?: string;
  favorites?: string[];
  seenIrl?: string[];
  leagues?: string[];
  players?: string[];
  sideAccount?: { handle: string; url: string };
}
export type Area =
  | "home"
  | "about"
  | "games"
  | "pokemon"
  | "sports"
  | "books"
  | "collection"
  | "2doods"
  | "work";
