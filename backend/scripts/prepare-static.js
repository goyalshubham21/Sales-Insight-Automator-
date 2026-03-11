import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const sourceDir = path.join(projectRoot, "frontend", "dist");
const targetDir = path.join(projectRoot, "backend", "public");

if (!fs.existsSync(sourceDir)) {
  throw new Error(`Frontend build output not found at ${sourceDir}`);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`Copied frontend assets from ${sourceDir} to ${targetDir}`);
