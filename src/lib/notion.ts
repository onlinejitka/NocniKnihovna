import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { marked } from "marked";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Převod českého textu na čistý URL slug (odstraní háčky, čárky, tečky a mezery nahradí pomlčkou)
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export interface Episode {
  id: string;
  slug: string;
  title: string;
  annotation: string;
  status: string;
  category: string;
  century: string;
  date: string;
  youtubeId: string;
  spotifyUrl: string;
  duration: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  perex: string;
  date: string;
  seznamUrl?: string;
}

const getPlainText = (property: any): string => {
  if (!property) return "";
  if (property.type === "title" && property.title?.length > 0) {
    return property.title.map((t: any) => t.plain_text).join("");
  }
  if (property.type === "rich_text" && property.rich_text?.length > 0) {
    return property.rich_text.map((t: any) => t.plain_text).join("");
  }
  return "";
};

// Získání publikovaných epizod
export async function getEpisodes(limit?: number): Promise<Episode[]> {
  try {
    const dbId = process.env.NOTION_EPISODES_DB_ID?.trim();
    if (!dbId) return [];

    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Stav",
        status: { equals: "Publikováno" },
      },
      sorts: [
        {
          property: "Datum publikace",
          direction: "descending",
        },
      ],
      page_size: limit || 100,
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      const title = getPlainText(props["Název epizody"]) || "Bez názvu";
      const manualSlug = getPlainText(props["Slug"]);

      return {
        id: page.id,
        slug: manualSlug ? slugify(manualSlug) : slugify(title),
        title,
        annotation: getPlainText(props["Anotace"]),
        status: props["Stav"]?.status?.name || "",
        category: props["Kategorie"]?.multi_select?.[0]?.name || "Kronika",
        century: props["Staletí"]?.select?.name || "Neznámé",
        date: props["Datum publikace"]?.date?.start || "",
        youtubeId: getPlainText(props["YouTube ID"]),
        spotifyUrl: props["Spotify URL"]?.url || "#",
        duration: getPlainText(props["Stopáž"]) || "00:00",
      };
    });
  } catch (error: any) {
    console.error("CHYBA NOTION API (getEpisodes):", error?.message || error);
    return [];
  }
}

export async function getLatestEpisode(): Promise<Episode | null> {
  const episodes = await getEpisodes(1);
  return episodes.length > 0 ? episodes[0] : null;
}

// Vyhledání epizody (podporuje slug i ID)
export async function getEpisodeBySlug(param: string) {
  try {
    if (!param) return null;
    const episodes = await getEpisodes();
    const cleanParam = param.trim().toLowerCase();
    const normalizedParam = cleanParam.replace(/-/g, "");

    const episode = episodes.find((ep) => {
      const epSlug = ep.slug.toLowerCase();
      const epIdNormalized = ep.id.replace(/-/g, "").toLowerCase();
      return epSlug === cleanParam || epIdNormalized === normalizedParam;
    });

    if (!episode) return null;

    let htmlContent = "";
    try {
      const mdBlocks = await n2m.pageToMarkdown(episode.id);
      const mdString = n2m.toMarkdownString(mdBlocks);
      htmlContent = (await marked.parse(mdString?.parent || "")) as string;
    } catch {
      htmlContent = "<p class='italic text-parchment-600'>K tomuto záznamu zatím nebyl přiložen textový přepis.</p>";
    }

    return { episode, content: htmlContent };
  } catch (error: any) {
    console.error(`CHYBA při stahování epizody (${param}):`, error?.message || error);
    return null;
  }
}

// Získání publikovaných článků
export async function getArticles(limit?: number): Promise<Article[]> {
  try {
    const dbId = process.env.NOTION_ARTICLES_DB_ID?.trim();
    if (!dbId) return [];

    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Stav",
        status: { equals: "Publikováno" },
      },
      sorts: [
        {
          property: "Datum",
          direction: "descending",
        },
      ],
      page_size: limit || 50,
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      const title = getPlainText(props["Název článku"]) || "Bez názvu";
      const manualSlug = getPlainText(props["Slug"]);

      return {
        id: page.id,
        slug: manualSlug ? slugify(manualSlug) : slugify(title),
        title,
        perex: getPlainText(props["Perex"]),
        date: props["Datum"]?.date?.start || "",
        seznamUrl: props["Seznam Médium URL"]?.url || "",
      };
    });
  } catch (error: any) {
    console.error("CHYBA NOTION API (getArticles):", error?.message || error);
    return [];
  }
}

// Vyhledání článku (podporuje slug i ID)
export async function getArticleBySlug(param: string) {
  try {
    if (!param) return null;
    const articles = await getArticles();
    const cleanParam = param.trim().toLowerCase();
    const normalizedParam = cleanParam.replace(/-/g, "");

    const article = articles.find((art) => {
      const artSlug = art.slug.toLowerCase();
      const artIdNormalized = art.id.replace(/-/g, "").toLowerCase();
      return artSlug === cleanParam || artIdNormalized === normalizedParam;
    });

    if (!article) return null;

    let htmlContent = "";
    try {
      const mdBlocks = await n2m.pageToMarkdown(article.id);
      const mdString = n2m.toMarkdownString(mdBlocks);
      htmlContent = (await marked.parse(mdString?.parent || "")) as string;
    } catch {
      htmlContent = "<p class='italic text-parchment-600'>Text článku se připravuje.</p>";
    }

    return { article, content: htmlContent };
  } catch (error: any) {
    console.error(`CHYBA při stahování článku (${param}):`, error?.message || error);
    return null;
  }
}
