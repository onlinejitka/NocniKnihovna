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
  return "";
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

      // Zjištění obrázku: 1. Cover v Notionu, 2. Sloupec "Obrázek", 3. YouTube thumbnail
      let imageUrl: string | undefined = undefined;

      if (page.cover) {
        imageUrl = page.cover.type === "external" ? page.cover.external.url : page.cover.file?.url;
      } else if (props["Obrázek"]?.files?.[0]) {
        const fileObj = props["Obrázek"].files[0];
        imageUrl = fileObj.type === "external" ? fileObj.external.url : fileObj.file?.url;
      } else if (props["Obrázek URL"]?.url) {
        imageUrl = props["Obrázek URL"].url;
      } else if (youtubeId) {
        imageUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
      }

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
        imageUrl,
      };
    });
  } catch (error: any) {
    console.error("CHYBA NOTION API (getArchiveRecords):", error?.message || error);
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
