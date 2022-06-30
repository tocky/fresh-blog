import { Client } from "postgress";
import "dotenv/load.ts";

/**
 * Type of articles table
 */
export interface IArticle {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

// Create database client
const client = new Client({
  hostname: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
});

// Connect to database
await client.connect();

/**
 * Get all articles from database
 */
export const findAllArticles = async (): Promise<IArticle[]> => {
  try {
    const result = await client.queryObject<IArticle>("SELECT * FROM articles ORDER BY created_at DESC");
    return result.rows;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Get the specified article from database
 */
export const findArticleById = async (id: string): Promise<IArticle | null> => {
  try {
    const result = await client.queryObject<IArticle>("SELECT * FROM articles WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Create a new article in database
 */
export const createArticle = async (article: Pick<IArticle, 'title' | 'content'>): Promise<IArticle | null> => {
  try {
    const result = await client.queryObject<IArticle>("INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *", [article.title, article.content]);
    return result.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}
