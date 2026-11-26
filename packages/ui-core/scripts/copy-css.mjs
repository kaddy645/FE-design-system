import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cssFiles = [
  "components/Button/button.css",
  "components/Input/input.css",
  "components/Modal/modal.css"
];

await Promise.all(cssFiles.map(async (relativePath) => {
  const source = resolve(packageRoot, "src", relativePath);
  const destination = resolve(packageRoot, "dist", relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}));
