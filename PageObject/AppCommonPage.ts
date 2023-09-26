import { Page } from "@playwright/test";
import { AgentCookie, AgentTokenType } from "@utils/cookieManagement";
import APIActions from "@utils/APIActions";
import ElementActions from "@utils/ElemenetActions";

export default class AppCommonPage {
  readonly page: Page;
  readonly agentCookie: AgentCookie;
  readonly apiActions: APIActions;

  constructor(page: Page) {
    this.page = page;
    this.agentCookie = new AgentCookie();
    this.apiActions = new APIActions(page);
  }

  get agentUserNameInput() {
    return this.element('[data-testid="email"]');
  }

  get agentPasswordInput() {
    return this.element('[data-testid="password"]');
  }

  get agentSubmitLoginButton() {
    return this.element('[data-cy="primary"]');
  }

  get fildIsRequiredWarning() {
    return this.element('//div[contains(text(),"This fied is required")]');
  }

  element(selector: string) {
    return ElementActions(this.page, selector);
  }

  getElementActionByText(text: string) {
    return ElementActions(this.page, `//*[contains(text(),'${text}')]`);
  }

  async visitEazyAgent(slug: string = "", options = {}): Promise<void> {
    await this.page.goto(`${process.env.EAZY_AGENT_URL}${slug}`, options);
  }

  async visitEazyProfile(slug: string = "", options = {}): Promise<void> {
    await this.page.goto(`${process.env.EAZY_PROFILE_URL}${slug}`, options);
  }

  async visitEazyConnect(slug: string = "", options = {}): Promise<void> {
    await this.page.goto(`${process.env.EAZY_CONNECT_URL}${slug}`, options);
  }

  async loginEazyAgent(username: string, password: string): Promise<void> {
    await this.agentUserNameInput.fillElement(username);
    await this.agentPasswordInput.fillElement(password);
    await this.agentSubmitLoginButton.clickElement();
  }

  async getAgentTokenFromBrowser(): Promise<AgentTokenType[]> {
    return await this.agentCookie.getAgentTokenFromBrowser(this.page);
  }

  async getAgentTokenFromLocaFile(): Promise<AgentTokenType[]> {
    return this.agentCookie.getAgentTokenFromLocalFile() as AgentTokenType[];
  }

  async addAgentTokenToPage(agentToken: AgentTokenType[]) {
    await this.agentCookie.addAgentTokenToPage(this.page, agentToken);
    console.log("Succesfully Adding Agent Cookie to Browser");
  }

  async addAgentToAPIAction(tokenValue: AgentTokenType[]) {
    this.apiActions.addAgentToken(tokenValue[0].value);
    console.log("Succesfully Adding Agent Cookie to API Action");
  }

  saveAgentTokenToLocalFile(cookie: AgentTokenType[]) {
    this.agentCookie.storeCookiesToLocalFile(cookie);
  }
}
