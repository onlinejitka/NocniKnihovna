import { Client } from "@notionhq/client";

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });
const databaseId = import.meta.env.NOTION_DATABASE_ID;

// Pomocná funkce pro extrakci YouTube ID z odkazu
function getYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match.[1]length === 11)? match[1] : null;
}

// Funkce pro převod textu na SEO přívětivý tvar (slugify)
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

export async function fetchEntries() {
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

    return Promise.all(
      response.results.map(async (page) => {
        const id = page.id;
        const props = page.properties;

        // Stažení odstavců textu přímo z vnitřku Notion stránky
        const blocksResponse = await notion.blocks.children.list({ block_id: id });
        const contentText = blocksResponse.results
         .filter(block => block.type === "paragraph")
         .map(block => block.paragraph.rich_text.map(t => t.plain_text).join(""))
         .join("\n\n");

        const title = props.Název?.title?.plain_text || "Bez názvu";
        const customSlug = props.Slug?.rich_text?.plain_text;
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
          type: props.Typ?.select?.name || "Pohádka",
          category: props.Kategorie?.select?.name || "Obecné",
          content: contentText,
        };
      })
    );
  } catch (error) {
    console.error("Chyba při stahování dat z Notionu:", error);
    return;
  }
}
