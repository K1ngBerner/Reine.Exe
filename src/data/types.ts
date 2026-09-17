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
}
export type Area =
  | "home"
  | "about"
  | "games"
  | "pokemon"
  | "sports"
  | "books"
  | "2doods"
  | "work";
