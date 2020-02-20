const { GITHUB_SHA, GITHUB_TOKEN } = process.env;

const CHECK_NAME = "ESLint check";

const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/vnd.github.antiope-preview+json",
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  "User-Agent": "eslint-action"
};

const CREATE_CHECK_BODY = {
  name: CHECK_NAME,
  head_sha: GITHUB_SHA,
  status: "in_progress",
  started_at: new Date()
};

const ESLINT_OPTIONS = {
  extensions: [".js", ".jsx", ".tsx"],
  ignorePath: ".gitignore"
};
