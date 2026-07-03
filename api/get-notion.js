import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

function getYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match.[1]length === 11)? match[1] : null;
}

function slugify(text) {
  return text
   .toString()
   .toLowerCase()
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/\s+/g, "-")
   .replace(/[^\w\-]+/g, "")
   .replace(/\-\-+/g, "-")
   .replace(/^-+/, "")
   .replace(/-+$/, "");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!process.env.NOTION_TOKEN ||!process.env.NOTION_DATABASE_ID) {
    res.status(500).json({ error: "Missing Notion credentials in Vercel environment." });
    return;
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Zveřejněno",
        checkbox: {
          equals: true,
        },
      },
    });

    const entries = await Promise.all(
      response.results.map(async (page) => {
        const id = page.id;
        const props = page.properties;

        const blocksResponse = await notion.blocks.children.list({ block_id: id });
        const contentText = blocksResponse.results
         .filter(block => block.type === "paragraph")
         .map(block => block.paragraph.rich_text.map(t => t.plain_text).join(""))
         .join("\n\n");

        const title = props["Název"]?.title?.map(t => t.plain_text).join("") || "Bez názvu";
        const customSlug = props?.rich_text?.map(t => t.plain_text).join("");
        const slug = customSlug? slugify(customSlug) : slugify(title);

        const youtubeLink = props?.url || "";
        const youtubeId = getYoutubeId(youtubeLink);
        const thumbnail = youtubeId? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;

        return {
          id,
          title,
          slug,
          youtube: youtubeLink,
          youtubeId,
          thumbnail,
          spotify: props?.url || "",
          herohero: props["Herohero Link"]?.url || "",
          etsy: props["Etsy Link"]?.url || "",
          alza: props["Alza Link"]?.url || "",
          type: props?.select?.name || "Pohádka",
          category: props["Kategorie"]?.select?.name || "Obecné",
          content: contentText || "Tento příspěvek zatím nemá žádný doprovodný text.",
        };
      })
    );

    res.status(200).json(entries);
  } catch (error) {
    console.error("Notion fetch failed:", error);
    res.status(500).json({ error: error.message });
  }
}
