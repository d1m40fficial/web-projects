export const BASE = import.meta.env.BASE_URL;
export const asset = (path: string): string => `${BASE}${path.replace(/^\//, '')}`;
export const REPO_URL = 'https://github.com/d1m40fficial/web-projects';
export const PAGES_URL = 'https://d1m40fficial.github.io/web-projects/';
export const AUTHOR = 'd1m40fficial';
