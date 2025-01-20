import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const knowledgeData = [
  { id: 1, name: "Supreme Court", image: "assets/legal-knowledge/1.png", url: "" },
  { id: 2, name: "High Court", image: "assets/legal-knowledge/2.jpg", url: "" },
  { id: 3, name: "District Court", image: "assets/legal-knowledge/3.jpg", url: "" },
  { id: 4, name: "NCLT", image: "assets/legal-knowledge/4.png", url: "" },
  { id: 5, name: "Consumer Forum", image: "assets/legal-knowledge/5.png", url: "" },
  { id: 7, name: "RBI", image: "assets/legal-knowledge/7.png", url: "/integration/rbi-chat" },
  { id: 8, name: "SEBI", image: "assets/legal-knowledge/8.png", url: "" },
  { id: 16, name: "NCLAT", image: "assets/legal-knowledge/16.png", url: "" },
  { id: 9, name: "MCA", image: "assets/legal-knowledge/9.jpg", url: "" },
  { id: 10, name: "EPFO", image: "assets/legal-knowledge/10.png", url: "" },
  { id: 11, name: "FSSAI", image: "assets/legal-knowledge/11.png", url: "" },
  { id: 12, name: "Cybersafe", image: "assets/legal-knowledge/12.jpeg", url: "" },
  { id: 14, name: "Voter", image: "assets/legal-knowledge/14.png", url: "" },
  { id: 15, name: "Vehicle Number", image: "assets/legal-knowledge/15.png", url: "" },
  { id: "oneclechat", name: "onecle", image: "assets/knowledge/onecle.svg", url: "/oneclechat" }
];
