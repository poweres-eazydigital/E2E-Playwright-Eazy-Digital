import * as path from "path";
import * as fs from "fs";
import { Cookie } from "@playwright/test";
import { Page } from "@playwright/test";

export interface AgentTokenType {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
  expireAt?: number;
}

export class AgentCookie {
  cookieFilePath: string;

  constructor() {
    this.cookieFilePath = path.join(
      path.resolve(__dirname, ".."),
      "agent_cookies.json"
    );
  }
  storeCookiesToLocalFile(cookies: AgentTokenType[]): void {
    const cookieJson = JSON.stringify(cookies);
    fs.writeFileSync(this.cookieFilePath, cookieJson);
    console.log("Save Agent's Cookie in Local File Successfully!!");
  }

  async isCookieValid(): Promise<boolean> {
    const agentCookie = this.getAgentTokenFromLocalFile();
    if (!agentCookie) return false;
    const TEN_HOURS = 60000 * 60 * 10;
    return Date.now() - agentCookie[0].expireAt <= TEN_HOURS;
  }

  getAgentTokenFromLocalFile(): AgentTokenType[] | false {
    if (!fs.existsSync(this.cookieFilePath)) return false;
    const rawData = fs.readFileSync(this.cookieFilePath, "utf8");
    return JSON.parse(rawData);
  }

  async addAgentTokenToPage(
    page: Page,
    agentCookie: AgentTokenType[]
  ): Promise<void> {
    await page.context().addCookies(agentCookie as any);
  }

  async getAgentTokenFromBrowser(page: Page): Promise<AgentTokenType[]> {
    const agentCookies = await page.context().cookies();
    const tokenCookie: AgentTokenType[] = agentCookies.filter(
      (cookie) => cookie.name === "token"
    );
    tokenCookie[0]["expireAt"] = Date.now();
    return tokenCookie;
  }
}
