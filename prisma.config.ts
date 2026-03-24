import { defineConfig } from "prisma/config";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env file locally; on Vercel, env vars are already in process.env
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = process.env[key] || value;
    }
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: (process.env.DIRECT_URL || process.env.DATABASE_URL) as string,
  },
});
