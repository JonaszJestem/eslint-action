import request from "./request";

const { GITHUB_EVENT_PATH } = process.env;
// eslint-disable-next-line import/no-dynamic-require
const event = require(GITHUB_EVENT_PATH);
const { repository } = event;
const {
  owner: { login: owner }
} = repository;
const { name: repo } = repository;

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
