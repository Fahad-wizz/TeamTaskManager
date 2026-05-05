import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const viteRoot = dirname(require.resolve("vite/package.json"));
const viteBin = join(viteRoot, "bin", "vite.js");
const port = process.env.PORT || "4173";

const child = spawn(process.execPath, [viteBin, "preview", "--host", "0.0.0.0", "--port", port], {
  stdio: "inherit",
  shell: false
});

child.on("exit", (code) => process.exit(code || 0));
