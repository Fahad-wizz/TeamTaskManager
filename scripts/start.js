const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const isWindows = process.platform === "win32";
const railway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_ID);
const singleService = railway || process.env.TTM_SINGLE_SERVICE === "true";
const children = [];

function run(label, args, env = {}) {
  const command = isWindows ? "cmd.exe" : npm;
  const commandArgs = isWindows ? ["/d", "/s", "/c", npm, ...args] : args;
  const child = spawn(command, commandArgs, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: false
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${label} exited with code ${code}`);
      shutdown(code);
    }
  });

  children.push(child);
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

function buildFrontendThen(callback) {
  if (existsSync(join(root, "frontend", "dist"))) {
    callback();
    return;
  }

  console.log("Frontend dist not found; building before start...");
  const buildArgs = ["run", "build", "--workspace", "frontend"];
  const command = isWindows ? "cmd.exe" : npm;
  const commandArgs = isWindows ? ["/d", "/s", "/c", npm, ...buildArgs] : buildArgs;
  const build = spawn(command, commandArgs, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
    shell: false
  });

  build.on("exit", (code) => {
    if (code !== 0) shutdown(code || 1);
    callback();
  });
}

function startSingleService() {
  buildFrontendThen(() => {
    run("backend", ["run", "start", "--workspace", "backend"], {
      FRONTEND_DIST: join(root, "frontend", "dist")
    });
  });
}

function startLocalServices() {
  buildFrontendThen(() => {
    run("backend", ["run", "start", "--workspace", "backend"], {
      PORT: process.env.BACKEND_PORT || process.env.PORT || "5000"
    });
    run("frontend", ["run", "preview", "--workspace", "frontend"], {
      PORT: process.env.FRONTEND_PORT || "4173"
    });
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

if (singleService) {
  startSingleService();
} else {
  startLocalServices();
}
