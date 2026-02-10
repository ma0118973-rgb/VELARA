import { Article } from '../types';

/**
 * DATABASE SERVICE (NEON POSTGRESQL SIMULATION)
 * 
 * To connect this to a real Neon PostgreSQL database:
 * 1. Replace the methods below to use `fetch` calling your backend API (e.g., Express/Next.js/Cloudflare).
 * 2. Example: 
 *    const res = await fetch('https://your-api.com/articles', { method: 'POST', body: JSON.stringify(article) });
 * 
 * For this demo, we use an async wrapper around localStorage to mimic network delays and persistence
 * so the UI behaves exactly as it would with a real database.
 */

const STORAGE_KEY = 'velara_articles';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchArticles = async (): Promise<Article[]> => {
  await delay(600); // Simulate network latency
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveArticle = async (article: Article): Promise<void> => {
  await delay(800); // Simulate saving to DB
  const articles = await fetchArticles();
  
  const existingIndex = articles.findIndex(a => a.id === article.id);
  
  if (existingIndex >= 0) {
    articles[existingIndex] = article;
  } else {
    articles.unshift(article); // Add new to top
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
};

export const deleteArticle = async (id: string): Promise<void> => {
  await delay(500);
  const articles = await fetchArticles();
  const filtered = articles.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Simulate Image Upload to a bucket (e.g., AWS S3 or Supabase Storage)
// In a real app, this would return a public URL from the server.
export const uploadImageToRemote = async (file: File): Promise<string> => {
  await delay(1000); // Simulate upload time
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // In a real app, you would upload `file` to your server and return the URL.
      // Here we return the base64 string to simulate a hosted URL.
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
