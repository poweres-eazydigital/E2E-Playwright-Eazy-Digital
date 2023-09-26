import {
  request,
  APIRequestContext,
  APIResponse,
  Page,
  expect,
  Response,
} from "@playwright/test";

export default class APIActions {
  page: Page;
  agentToken: string;
  private cacheContext: { [key: string]: APIRequestContext } = {};
  constructor(page: Page) {
    this.page = page;
  }

  addAgentToken(agentTokenValue: string) {
    this.agentToken = `Bearer ${agentTokenValue}`;
    console.log(`Successfully adding Token to APIAction`);
  }

  async getAndCacheContext(baseURL: string): Promise<APIRequestContext> {
    if (baseURL in this.cacheContext) {
      return this.cacheContext[baseURL];
    }

    this.cacheContext[baseURL] = await request.newContext({
      baseURL,
    });
    return this.cacheContext[baseURL];
  }

  async requestEazyAgent(
    method: string,
    slug: string = "",
    data?: object
  ): Promise<APIResponse> {
    const agentRequestContext = await this.getAndCacheContext(
      process.env.EAZY_AGENT_ENDPOINT
    );
    const headers = {
      Authorization: this.agentToken,
    };
    return await agentRequestContext[method](slug, { headers, data });
  }

  async waitForResponseByURL(
    url: string,
    options: { timeout?: number; status?: number } = {}
  ): Promise<Response> {
    return this.page.waitForResponse(
      (response) => {
        if (options.status) {
          expect(options.status).toEqual(response.status());
        }
        return response.url().includes(url);
      },
      { timeout: options.timeout || 5000 }
    );
  }
}
