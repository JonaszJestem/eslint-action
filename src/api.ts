import request from "./request";
import { CHECK_NAME, CREATE_CHECK_BODY, HEADERS } from "./constants";

const { GITHUB_EVENT_PATH, GITHUB_SHA } = process.env;

const getRepositoryPath = () => {
  if (GITHUB_EVENT_PATH) {
    // eslint-disable-next-line import/no-dynamic-require
    const event = require(GITHUB_EVENT_PATH);
    const { repository } = event;
    const {
      owner: { login: owner }
    } = repository;
    const { name: repo } = repository;
    return { owner, repo };
  }
  return {};
};

const { owner, repo } = getRepositoryPath();

export const createCheck = async () => {
  const { data } = await request(
    `https://api.github.com/repos/${owner}/${repo}/check-runs`,
    {
      method: "POST",
      HEADERS,
      CREATE_CHECK_BODY
    }
  );
  const { id } = data;
  return id;
};

export const updateCheck = async (id, conclusion, output) => {
  const body = createCheckBody({ conclusion, output });

  await request(
    `https://api.github.com/repos/${owner}/${repo}/check-runs/${id}`,
    {
      method: "PATCH",
      HEADERS,
      body
    }
  );
};

const createCheckBody = ({ conclusion, output }) => ({
  name: CHECK_NAME,
  head_sha: GITHUB_SHA,
  status: "completed",
  completed_at: new Date(),
  conclusion,
  output
});
