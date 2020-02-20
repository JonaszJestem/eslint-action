import { createCheck, updateCheck } from "./api";
import { CHECK_NAME, ESLINT_OPTIONS } from "./constants";
import { CLIEngine as eslintEngine } from "eslint";

const { GITHUB_WORKSPACE = [] } = process.env;

const lint = () => {
  const cli = new eslintEngine(ESLINT_OPTIONS);
  const report = cli.executeOnFiles(["."]);
  const { results, errorCount, warningCount } = report;

  const levels = ["", "warning", "failure"];

  const annotations = [];
  results.forEach(result => {
    const { filePath, messages } = result;
    const path = filePath.substring(GITHUB_WORKSPACE.length + 1);
    messages.forEach(msg => {
      const { line, severity, ruleId, message } = msg;
      const annotationLevel = levels[severity];
      annotations.push({
        path,
        start_line: line,
        end_line: line,
        annotation_level: annotationLevel,
        message: `[${ruleId}] ${message}`
      });
    });
  });

  return {
    conclusion: errorCount > 0 ? "failure" : "success",
    output: {
      title: CHECK_NAME,
      summary: `${errorCount} error(s), ${warningCount} warning(s) found`,
      annotations
    }
  };
};

export const exitWithError = err => {
  console.error("Error", err.stack);
  if (err.data) {
    console.error(err.data);
  }
  process.exit(1);
};

export const run = async () => {
  const id = await createCheck();
  try {
    const { conclusion, output } = lint();
    console.log(output.summary);
    await updateCheck(id, conclusion, output);
    if (conclusion === "failure") {
      process.exit(78);
    }
  } catch (err) {
    await updateCheck(id, "failure", undefined);
    exitWithError(err);
  }
};
