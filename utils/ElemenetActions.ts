import { Page, Locator, expect } from "@playwright/test";
import { SecondArgument, ThirdArgument } from "@support/type";

const cacheElementActions = {};

class ElementActions {
  page: Page;
  selector: string;
  constructor(page: Page, selector: string) {
    this.page = page;
    this.selector = selector;
  }

  locator(options: SecondArgument<typeof this.page.locator> = {}): Locator {
    return this.page.locator(this.selector, options);
  }

  async waitForElement(
    options: SecondArgument<typeof this.page.waitForSelector> = {}
  ): ReturnType<typeof this.page.waitForSelector> {
    return await this.page.waitForSelector(this.selector, {
      ...options,
    });
  }

  async clickElement(
    options: SecondArgument<typeof this.page.click> = {}
  ): Promise<void> {
    await this.page.click(this.selector, {
      ...options,
    });
  }

  async fillElement(
    value: string,
    options: ThirdArgument<typeof this.page.fill> = {}
  ): Promise<void> {
    await this.page.fill(this.selector, value, { ...options });
  }

  expect() {
    return expect(this.locator());
  }
}

export default function elementActionsFactory(
  page: Page,
  selector: string
): ElementActions {
  if (!cacheElementActions.hasOwnProperty(selector)) {
    cacheElementActions[selector] = new ElementActions(page, selector);
  }
  return cacheElementActions[selector];
}
