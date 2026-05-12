import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env.local for Next.js compatibility
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use direct URL for migrations (no pgbouncer), pooled URL for runtime queries
    url: process.env["DIRECT_URL"],
  },
});
