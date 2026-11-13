export interface Profile {
  name: string;
  aka: string[];
  tagline: string;
  intro: string;
}

export interface Link {
  label: string;
  url: string;
}

// サイト名(title・検索結果・ヘッダーのロゴで共通に使う)
export const siteName = "huraru(home)";

export const profile: Profile = {
  name: "ふらるにうむ",
  aka: ["huraru", "ふらる"],
  tagline: "Geometric Never-Ending Creating",
  intro: "ゲームを作ったり。ツールを作ったり。 思ったものを作ることが好きです。",
};

export const links: Link[] = [
  { label: "X", url: "https://x.com/hurarunium_sabu" },
  { label: "GitHub", url: "https://github.com/hurarunium" },
  { label: "Portfolio", url: "https://portfolio.huraru.com" },
  { label: "note", url: "https://note.com/huraru" },
];

// 背景に流れて出てくる言葉(記事の本文ページ以外で、ランダムな位置に1文字ずつ打ち出す)
export const backgroundMessages: string[] = [
  "Never-Ending Creating",
  "Hello! 2026!",
  "Hello World!!",
  "The longing won't stop",
  "Creating the world",
  "huraru.com",
  "In search of the future...",
  "Embrace the unknown",
  "Code is poetry",
  "Dream, Code, Repeat",
  "Crafting digital dreams",
  "Designing the future",
  "Exploring endless",
  "Antigravity",
];
