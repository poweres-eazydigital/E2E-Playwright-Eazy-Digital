import { test } from "@playwright/test";
import { MePage } from "PageObject";

test.describe("verify changing password flow", async () => {
  let agentMePage: MePage;
  let NEW_PASSWORD = "password1";
  let CURRENT_PASSWORD = process.env.AGENT_PASSWORD;

  test.beforeEach(async ({ context }) => {
    await test.step("Set up PageObject", async () => {
      const page = await context.newPage();
      agentMePage = new MePage(page);
      const token = await agentMePage.getAgentTokenFromLocaFile();
      await agentMePage.addAgentTokenToPage(token);
      await agentMePage.addAgentToAPIAction(token);
    });

    await test.step("Revert Password to original in case test failed", async () => {
      await agentMePage.changePasswordByAPI(
        process.env.AGENT_ID,
        NEW_PASSWORD,
        CURRENT_PASSWORD
      );
    });

    await test.step("Visit the page", async () => {
      await agentMePage.visitEazyAgent("/profile/me/password");
      await agentMePage.currentPasswordInput.waitForElement({
        state: "visible",
      });
      await agentMePage.page.waitForLoadState("networkidle");
    });
  });

  test("Verify Changing Password functionality", async () => {
    await test.step("Change to new Password", async () => {
      await agentMePage.fillChangePasswordForm({
        currentPassword: CURRENT_PASSWORD,
        newPassword: NEW_PASSWORD,
        confirmNewPassword: NEW_PASSWORD,
      });

      await Promise.all([
        agentMePage.verifyChangePasswordResponseStatus(200),
        agentMePage.savePasswordChangedButton.clickElement(),
      ]);
    });
    await test.step("Change Password back to original", async () => {
      await agentMePage.fillChangePasswordForm({
        currentPassword: NEW_PASSWORD,
        newPassword: CURRENT_PASSWORD,
        confirmNewPassword: CURRENT_PASSWORD,
      });

      await Promise.all([
        agentMePage.verifyChangePasswordResponseStatus(200),
        agentMePage.savePasswordChangedButton.clickElement(),
      ]);
    });
  });

  test("Verify Changing Password Unsuccessfully", async () => {
    await agentMePage.fillChangePasswordForm({
      newPassword: "123",
      confirmNewPassword: "12345",
    });
    await agentMePage.savePasswordChangedButton.clickElement();
    await agentMePage.fildIsRequiredWarning.expect().toBeVisible();
    await agentMePage.minimumPaswordCharactersWarning.expect().toBeVisible();
    await agentMePage.passwordMatchingWarning.expect().toBeVisible();
  });
});
