export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  category: string;
  status: 'published' | 'draft';
  date: string;
}

export interface User {
  isAuthenticated: boolean;
  token?: string;
}

export enum AppRoute {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  EDITOR = 'editor',
}
