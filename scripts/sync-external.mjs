import { stat, mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import { exec as execCb } from "node:child_process";
import { join } from "node:path";

const exec = promisify(execCb);

const config = {
  root: "external",
  repositories: [
    {
      name: "argos-ci/argos-puppeteer",
      branch: "docs",
      target: "docs/Integrations/puppeteer",
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

// Creating root folders
[config.root].map(async (path) => {
  if (!(await exists(path))) {
    await mkdir(path);
  }
});

await Promise.all(
  config.repositories.map(async (repository) => {
    const { name, branch, target } = repository;
    const [, repo] = name.split("/");
    const path = join(config.root, repo);

    // Syncing repository
    if (!(await exists(path))) {
      await exec(
        `git clone --depth 1 --single-branch --branch ${branch} https://github.com/${name}.git ${path}`
      );
    } else {
      await exec(`git fetch --depth 1 origin ${branch}`, { cwd: path });
      await exec(`git reset --hard origin/${branch}`, { cwd: path });
    }

    // Removing existing docs
    await exec(`rm -rf ${target}`);

    // Copying docs
    await exec(`cp -r ${path}/docs ${target}`);
  })
);
