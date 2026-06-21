const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = configuredUrl ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");
