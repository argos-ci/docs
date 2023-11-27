import { stat, mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import { exec as execCb } from "node:child_process";
import { join } from "node:path";

const exec = promisify(execCb);

const config = {
  root: "external",
  branch: "main",
  repo: "argos-ci/argos-javascript",
  packages: [
    {
      src: "packages/puppeteer/docs",
      target: "docs/api/puppeteer",
    },
    {
      src: "packages/cypress/docs",
      target: "docs/api/cypress",
    },
    {
      src: "packages/playwright/docs",
      target: "docs/api/playwright",
    },
  ],
};

/**
 * Check if a file exists
 * @param {string} path
 */
const exists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
};

async function syncDocs() {
  // Creating root folders
  if (!(await exists(config.root))) {
    await mkdir(config.root);
  }

  const [, repoName] = config.repo.split("/");
  const root = join(config.root, repoName);

  // Syncing repository
  if (!(await exists(root))) {
    await exec(
      `git clone --depth 1 --single-branch --branch ${config.branch} https://github.com/${config.repo}.git ${root}`,
    );
  } else {
    await exec(`git fetch --depth 1 origin ${config.branch}`, { cwd: root });
    await exec(`git reset --hard origin/${config.branch}`, { cwd: root });
  }

  await Promise.all(
    config.packages.map(async ({ src, target }) => {
      // Removing existing docs
      await exec(`rm -rf ${target}`);
      // Copying docs
      await exec(`cp -r ${join(root, src)} ${target}`);
    }),
  );
}

await syncDocs();
