import { AppCommonPage } from "PageObject";
import { Page } from "@playwright/test";

export default class AgentHomePage extends AppCommonPage {
  constructor(page: Page) {
    super(page);
  }

  get bellIcon() {
    return this.element('[data-cy="bell"]');
  }

  get headerNavBar() {
    return this.element('[data-cy="header-navbar"]');
  }

  get headerAvatar() {
    return this.element('[data-cy="header-avatar"]');
  }

  get headerHamburgur() {
    return this.element('[data-cy="header-hamburger"]');
  }

  async verifyHeaderDisplayed() {
    await this.headerNavBar.waitForElement({ state: "visible" });
    await this.headerHamburgur.waitForElement({ state: "visible" });
    await this.headerAvatar.waitForElement({ state: "visible" });
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
