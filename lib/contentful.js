// lib/contentful.js

const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Helper aman dari Contentful
function safe(field) {
  if (typeof field === "string") return field;
  if (typeof field === "number") return String(field);
  if (typeof field === "boolean") return String(field);

  if (field && typeof field === "object" && field["en-US"]) {
    return field["en-US"];
  }

  return "";
}

// ==============================
// GET ALL POSTS (kembalian fields lengkap)
// ==============================
export async function getBlogPosts() {
  const entries = await client.getEntries({
    content_type: "rehansparker",
    select: "fields",
    order: "-fields.date",
  });

  return entries.items.map(item => {
    const f = item.fields;

    return {
      fields: {
        title: safe(f.title),
        slug: safe(f.slug),
        excerpt: safe(f.excerpt),
        genre: Array.isArray(f.genre) ? f.genre.map(safe) : [safe(f.genre)],
        date: safe(f.date),
      }
    };
  });
}

// ==============================
// GET SINGLE POST (kembalian fields juga)
// ==============================
export async function getSinglePost(slug) {
  const entries = await client.getEntries({
    content_type: "rehansparker",
    "fields.slug": slug,
    limit: 1,
  });

  const post = entries.items[0];
  if (!post) return null;

  const f = post.fields;

  return {
    fields: {
      title: safe(f.title),
      slug: safe(f.slug),
      excerpt: safe(f.excerpt),
      genre: Array.isArray(f.genre) ? f.genre.map(safe) : [safe(f.genre)],
      date: safe(f.date),
      content: f.content
    }
  };
}

export default client;
