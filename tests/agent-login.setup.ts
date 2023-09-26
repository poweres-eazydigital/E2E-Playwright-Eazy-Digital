import { test } from "@playwright/test";
import { AgentHomePage } from "PageObject";
import { AgentCookie } from "@utils/cookieManagement";

test("Login and save agent token on local", async ({ context }) => {
  const agentCookie = new AgentCookie();
  if (await agentCookie.isCookieValid()) {
    console.log("Previous Cookie is still valid. Skip login step!!");
    return;
  }
  console.log("getting the new agent's token");
  const agentHomePage = new AgentHomePage(await context.newPage());
  await agentHomePage.visitEazyAgent();
  await agentHomePage.loginEazyAgent(
    process.env.AGENT_USERNAME,
    process.env.AGENT_PASSWORD
  );
  await agentHomePage.verifyHeaderDisplayed();
  const agentToken = await agentHomePage.getAgentTokenFromBrowser();

  agentHomePage.saveAgentTokenToLocalFile(agentToken);
  agentHomePage.addAgentTokenToPage(agentToken);
});
