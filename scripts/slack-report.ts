import fs from "fs";
import path from "path";
import axios from "axios";

interface Step {
  name: string;
  status: "passed" | "failed" | "skipped" | "broken";
  statusDetails: unknown;
  stage: "pending";
  attachments: unknown[];
  parameters: unknown[];
  start: number;
  stop: number;
  steps: Step[];
}

export interface TestSuiteResult extends Step {
  uuid: string;
  historyId: string;
  labels: {
    name: "language" | "framework" | "parentSuite" | "suite" | "subSuite";
    value: string;
  }[];
  links: unknown[];
  fullName: string;
}

export type PraseData = {
  uid: string;
  project: string;
  file: string;
  status: "passed" | "failed" | "skipped" | "broken";
  testName: string;
  finishTime: number;
};

const allureResultsPath = path.join(__dirname, "../allure-results");

const { GITHUB_RUN_ID, SLACK_WEBHOOK, NETLIFY_URL } = process.env;

let slackPayload = {};

(async () => {
  // filter out to get only allure result
  const testSuiteResultFiles = fs
    .readdirSync(allureResultsPath)
    .filter((o) => !o.startsWith(".") && o.endsWith("-result.json"));

  let parsedData: PraseData[] = await Promise.all(
    testSuiteResultFiles.map(async (file) => {
      const content: TestSuiteResult = JSON.parse(
        await fs.promises.readFile(path.join(allureResultsPath, file), "utf-8")
      );

      const suiteLabel = content.labels.find((o) => o.name === "suite").value;

      return {
        uid: content.uuid,
        project: suiteLabel.split("/")[0],
        file: path.basename(suiteLabel),
        status: content.status,
        testName: content.fullName,
        finishTime: content.stop,
      };
    })
  );
  const getSum = (
    statuses: TestSuiteResult["status"][],
    key: TestSuiteResult["status"]
  ) => statuses.filter((o) => o === key).length;

  const getLastRetryTestUid = (retry: number): string[] => {
    const retryCount: Partial<PraseData & { totalCount: number }> = {};
    const latestUid: string[] = [];

    parsedData.forEach((o) => {
      const { status, testName } = o;
      if (status === "failed" || status === "broken") {
        if (testName in retryCount) {
          const lastRunResult =
            retryCount[testName].finishTime > o.finishTime
              ? retryCount[testName]
              : o;
          retryCount[testName] = {
            ...lastRunResult,
            totalCount: retryCount[testName].totalCount + 1,
          };
        } else {
          retryCount[testName] = {
            ...o,
            totalCount: 1,
          };
        }

        if (retryCount[testName].totalCount === retry) {
          latestUid.push(retryCount[testName].uid);
        }
      } else {
        latestUid.push(o.uid);
      }
    });

    return latestUid;
  };
  const RETRY_NUM = 3;
  const validUid = getLastRetryTestUid(RETRY_NUM);
  parsedData = parsedData.filter((item) => validUid.includes(item.uid));

  /**
    Build slack messages
   */

  const overall = [
    [
      getSum(
        parsedData.map((o) => o.status),
        "passed"
      ),
      "✅",
    ],
    [
      getSum(
        parsedData.map((o) => o.status),
        "failed"
      ),
      "❌",
    ],
    [
      getSum(
        parsedData.map((o) => o.status),
        "skipped"
      ),
      "🏃",
    ],
    [
      getSum(
        parsedData.map((o) => o.status),
        "broken"
      ),
      "💣",
    ],
  ];

  // build notification payload
  slackPayload = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `E2E result is ${
            getSum(
              parsedData.map((o) => o.status),
              "failed"
            ) +
              getSum(
                parsedData.map((o) => o.status),
                "broken"
              ) >
            0
              ? "Failed"
              : "Passed"
          }`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: overall
              .map(([count, emoji]) => `${count.toLocaleString()} ${emoji}`)
              .join(" / "),
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "GitHub Actions",
              emoji: true,
            },
            url: `https://github.com/poweres-eazydigital/E2E-Playwright-Eazy-Digital/actions/runs/${GITHUB_RUN_ID}`,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Report",
              emoji: true,
            },
            url: NETLIFY_URL,
          },
        ],
      },
    ],
  };

  if (process.env.CI === "true") await axios.post(SLACK_WEBHOOK, slackPayload);
  else {
    console.log("Not CI ENV");
  }
})();
