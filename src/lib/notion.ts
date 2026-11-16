import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { marked } from "marked";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

marked.setOptions({
  breaks: true,
  gfm: true,
});

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

export interface ArchiveRecord {
  id: string;
  slug: string;
  title: string;
  annotation: string;
  status: string;
  category: string;
  century: string;
  date: string;
  youtubeId?: string;
  spotifyUrl?: string;
  duration?: string;
  seznamUrl?: string;
  hasMedia: boolean;
  imageUrl?: string;
}

export interface MovieRecord {
  id: string;
  title: string;
  type: string;
  era: string;
  year: string;
  platform: string;
  description: string;
  csfdUrl?: string;
  link?: string;
  imageUrl?: string;
  order: number;
}

export type Episode = ArchiveRecord;
export type Article = ArchiveRecord;

const getPlainText = (property: any): string => {
  if (!property) return "";
  if (property.type === "title" && property.title?.length > 0) {
    return property.title.map((t: any) => t.plain_text).join("");
  }
  if (property.type === "rich_text" && property.rich_text?.length > 0) {
    return property.rich_text.map((t: any) => t.plain_text).join("");
  }
  if (property.type === "number" && property.number !== null) {
    return String(property.number);
  }
  return "";
};

const getUrlValue = (property: any): string | undefined => {
  if (!property) return undefined;
  if (property.type === "url" && property.url) {
    return property.url.trim();
  }
  const textVal = getPlainText(property).trim();
  if (textVal && (textVal.startsWith("http://") || textVal.startsWith("https://"))) {
    return textVal;
  }
  return undefined;
};

const getOrderValue = (props: any): number => {
  const prop = props["Pořadí"] || props["Poradi"] || props["Order"] || props["#"];
  if (!prop) return Number.MAX_SAFE_INTEGER;
  if (prop.type === "number" && typeof prop.number === "number") {
    return prop.number;
  }
  if (prop.type === "unique_id" && typeof prop.unique_id?.number === "number") {
    return prop.unique_id.number;
  }
  const textVal = getPlainText(prop).trim();
  if (textVal) {
    const parsed = Number(textVal.replace(",", "."));
    if (!Number.isNaN(parsed)) return parsed;
  }
  return Number.MAX_SAFE_INTEGER;
};

const extractImage = (page: any, props: any, youtubeId?: string): string | undefined => {
  if (page.cover) {
    return page.cover.type === "external" ? page.cover.external.url : page.cover.file?.url;
  }
  if (props["Obrázek"]?.files?.[0]) {
    const fileObj = props["Obrázek"].files[0];
    return fileObj.type === "external" ? fileObj.external.url : fileObj.file?.url;
  }
  if (props["Obrázek URL"]?.url) {
    return props["Obrázek URL"].url;
  }
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return undefined;
};

export async function getArchiveRecords(limit?: number): Promise<ArchiveRecord[]> {
  try {
    const dbId = (process.env.NOTION_EPISODES_DB_ID || process.env.NOTION_DATABASE_ID)?.trim();
    if (!dbId) {
      console.error("CHYBA: Není nastaveno ID Notion databáze.");
      return [];
    }

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
      const title = getPlainText(props["Název epizody"] || props["Název"]) || "Bez názvu";
      const manualSlug = getPlainText(props["Slug"]);
      const youtubeId = getPlainText(props["YouTube ID"]);
      const spotifyUrl = props["Spotify URL"]?.url || "";

      return {
        id: page.id,
        slug: manualSlug ? slugify(manualSlug) : slugify(title),
        title,
        annotation: getPlainText(props["Anotace"] || props["Perex"]),
        status: props["Stav"]?.status?.name || "",
        category: props["Kategorie"]?.multi_select?.[0]?.name || "Kronika",
        century: props["Staletí"]?.select?.name || "Neznámé",
        date: props["Datum publikace"]?.date?.start || props["Datum"]?.date?.start || "",
        youtubeId: youtubeId || undefined,
        spotifyUrl: spotifyUrl && spotifyUrl !== "#" ? spotifyUrl : undefined,
        duration: getPlainText(props["Stopáž"]),
        seznamUrl: props["Seznam Médium URL"]?.url || undefined,
        hasMedia: Boolean(youtubeId || spotifyUrl),
        imageUrl: extractImage(page, props, youtubeId),
      };
    });
  } catch (error: any) {
    console.error("CHYBA NOTION API (getArchiveRecords):", error?.message || error);
    return [];
  }
}

export async function getMovies(): Promise<MovieRecord[]> {
  try {
    const moviesDbId = process.env.NOTION_MOVIES_DB_ID?.trim();
    if (!moviesDbId) {
      return [];
    }

    const response = await notion.databases.query({
      database_id: moviesDbId,
      page_size: 100,
    });

    const movies = response.results
      .filter((page: any) => {
        const props = page.properties;
        const statusName = props["Stav"]?.status?.name || props["Stav"]?.select?.name;
        return !statusName || statusName === "Publikováno";
      })
      .map((page: any) => {
        const props = page.properties;
        const title = getPlainText(props["Název"] || props["Name"]) || "Bez názvu";
        
        let platform = "";
        if (props["Kde sledovat"]?.multi_select?.length > 0) {
          platform = props["Kde sledovat"].multi_select.map((s: any) => s.name).join(", ");
        } else {
          platform = getPlainText(props["Kde sledovat"]);
        }

        const csfdUrl = getUrlValue(
          props["ČSFD"] || props["ČSFD URL"] || props["CSFD"] || props["CSFD URL"]
        );
        const link = getUrlValue(props["Odkaz"] || props["Trailer"]);

        return {
          id: page.id,
          title,
          type: props["Typ"]?.select?.name || "Film",
          era: props["Období"]?.select?.name || props["Staletí"]?.select?.name || "Historie",
          year: getPlainText(props["Rok"]),
          platform,
          description: getPlainText(props["Popis"] || props["Anotace"]),
          csfdUrl,
          link,
          imageUrl: extractImage(page, props),
          order: getOrderValue(props),
        };
      });

    return movies.sort((a, b) => a.order - b.order);
  } catch (error: any) {
    console.error("CHYBA NOTION API (getMovies):", error?.message || error);
    return [];
  }
}

export async function getLatestRecord(): Promise<ArchiveRecord | null> {
  const records = await getArchiveRecords(1);
  return records.length > 0 ? records[0] : null;
}

export async function getRecordBySlug(param: string) {
  try {
    if (!param) return null;
    const records = await getArchiveRecords();
    const cleanParam = param.trim().toLowerCase();
    const normalizedParam = cleanParam.replace(/-/g, "");

    const record = records.find((rec) => {
      const recSlug = rec.slug.toLowerCase();
      const recIdNormalized = rec.id.replace(/-/g, "").toLowerCase();
      return recSlug === cleanParam || recIdNormalized === normalizedParam;
    });

    if (!record) return null;

    let htmlContent = "";
    try {
      const mdBlocks = await n2m.pageToMarkdown(record.id);
      const mdString = n2m.toMarkdownString(mdBlocks);
      htmlContent = (await marked.parse(mdString?.parent || "")) as string;
    } catch {
      htmlContent = "<p class='italic text-parchment-600'>K tomuto spisu zatím nebyl připojen textový přepis.</p>";
    }

    return { record, episode: record, article: record, content: htmlContent };
  } catch (error: any) {
    console.error(`CHYBA při stahování spisu (${param}):`, error?.message || error);
    return null;
  }
}

export const getEpisodes = getArchiveRecords;
export const getLatestEpisode = getLatestRecord;
export const getEpisodeBySlug = getRecordBySlug;
export const getArticles = getArchiveRecords;
export const getArticleBySlug = getRecordBySlug;
