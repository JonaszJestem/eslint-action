const { GITHUB_SHA, GITHUB_TOKEN } = process.env;

export const CHECK_NAME = "ESLint check";

export const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/vnd.github.antiope-preview+json",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  "User-Agent": "eslint-action"
};

export const CREATE_CHECK_BODY = {
  name: CHECK_NAME,
  head_sha: GITHUB_SHA,
  status: "in_progress",
  started_at: new Date()
};

function getIgnorePattern() {
  if (process.env.ESLINT_ACTION_DEV_ENVIRONMENT) {
    return ["node_modules", "lib"];
  }
  return ["node_modules"];
}

export const ESLINT_OPTIONS = {
  extensions: [".js"],
  ignorePath: ".gitignore",
  ignorePattern: getIgnorePattern()
};
