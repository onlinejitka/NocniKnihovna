import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { marked } from "marked";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export interface Episode {
  id: string;
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
  title: string;
  perex: string;
  date: string;
  seznamUrl?: string;
}

// Pomocná funkce pro bezpečné vytažení textu
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
    const response = await notion.databases.query({
      database_id: process.env.NOTION_EPISODES_DB_ID as string,
      filter: {
        property: "Stav",
        status: {
          equals: "Publikováno",
        },
      },
      sorts: [
        {
          property: "Datum publikace",
          direction: "descending",
        },
      ],
      page_size: limit || 50,
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: getPlainText(props["Název epizody"]),
        annotation: getPlainText(props["Anotace"]),
        status: props["Stav"]?.status?.name || "",
        category: props["Kategorie"]?.multi_select?.[0]?.name || "Kronika",
        century: props["Staletí"]?.select?.name || "Neznámé",
        date: props["Datum publikace"]?.date?.start || "",
        youtubeId: getPlainText(props["YouTube ID"]),
        spotifyUrl: props["Spotify URL"]?.url || "#",
        duration: getPlainText(props["Stopáž"]) || "45:00",
      };
    });
  } catch (error) {
    console.error("Chyba při stahování epizod z Notionu:", error);
    return [];
  }
}

// Získání nejnovější epizody pro Hero sekci
export async function getLatestEpisode(): Promise<Episode | null> {
  const episodes = await getEpisodes(1);
  return episodes.length > 0 ? episodes[0] : null;
}

// Získání obsahu a metadat jedné konkrétní epizody
export async function getEpisodeById(id: string) {
  try {
    const page: any = await notion.pages.retrieve({ page_id: id });
    const mdBlocks = await n2m.pageToMarkdown(id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    const htmlContent = marked.parse(mdString.parent);

    const props = page.properties;
    const episode: Episode = {
      id: page.id,
      title: getPlainText(props["Název epizody"]),
      annotation: getPlainText(props["Anotace"]),
      status: props["Stav"]?.status?.name || "",
      category: props["Kategorie"]?.multi_select?.[0]?.name || "Archiv",
      century: props["Staletí"]?.select?.name || "Neznámé",
      date: props["Datum publikace"]?.date?.start || "",
      youtubeId: getPlainText(props["YouTube ID"]),
      spotifyUrl: props["Spotify URL"]?.url || "#",
      duration: getPlainText(props["Stopáž"]) || "00:00",
    };

    return { episode, content: htmlContent };
  } catch (error) {
    console.error(`Chyba při stahování epizody ${id}:`, error);
    return null;
  }
}

// Získání článků pro blog a homepage
export async function getArticles(limit?: number): Promise<Article[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_ARTICLES_DB_ID as string,
      filter: {
        property: "Stav",
        status: {
          equals: "Publikováno",
        },
      },
      sorts: [
        {
          property: "Datum",
          direction: "descending",
        },
      ],
      page_size: limit || 10,
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: getPlainText(props["Název článku"]),
        perex: getPlainText(props["Perex"]),
        date: props["Datum"]?.date?.start || "",
        seznamUrl: props["Seznam Médium URL"]?.url || "",
      };
    });
  } catch (error) {
    console.error("Chyba při načítání článků:", error);
    return [];
  }
}
