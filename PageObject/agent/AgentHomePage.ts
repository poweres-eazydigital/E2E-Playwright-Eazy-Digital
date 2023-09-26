import { AppCommonPage } from "PageObject";
import { Page } from "@playwright/test";

export default class AgentHomePage extends AppCommonPage {
  constructor(page: Page) {
    super(page);
  }

  get headerNavBar() {
    return '[data-cy="header-navbar"]';
  }

  get headerAvatar() {
    return '[data-cy="header-avatar"]';
  }

  get headerHamburgur() {
    return '[data-cy="header-hamburger"]';
  }

  async verifyHeaderDisplayed() {
    await this.page.waitForSelector(this.headerNavBar, {
      timeout: 10000,
    });
    await this.page.waitForSelector(this.headerHamburgur);
    await this.page.waitForSelector(this.headerAvatar);
  }

  async requestAgentProfile() {
    const response = await this.apiActions.requestEazyAgent(
      "get",
      "/api/auth/profile"
    );
    const body = await response.json();
    console.log(body);
  }
}
