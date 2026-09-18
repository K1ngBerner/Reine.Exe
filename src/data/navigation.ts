import {
  Home,
  UserRound,
  Gamepad2,
  Disc3,
  Trophy,
  BookOpen,
  Archive,
  Radio,
  BriefcaseBusiness,
} from "lucide-react";
export const navigation = [
  { id: "home", name: "HOME", place: "HOME TOWN", icon: Home },
  { id: "about", name: "ABOUT", place: "PLAYER HOUSE", icon: UserRound },
  { id: "games", name: "GAMES", place: "ARCADE DISTRICT", icon: Gamepad2 },
  { id: "pokemon", name: "POKÉMON", place: "ROUTE ???", icon: Disc3 },
  { id: "sports", name: "SPORTS", place: "STADIUM", icon: Trophy },
  { id: "books", name: "BOOKS", place: "LIBRARY", icon: BookOpen },
  { id: "collection", name: "COLLECTION", place: "STORAGE", icon: Archive },
  { id: "2doods", name: "2DOODS", place: "BROADCAST", icon: Radio },
  {
    id: "work",
    name: "WORK",
    place: "WORK.EXE",
    icon: BriefcaseBusiness,
  },
] as const;
