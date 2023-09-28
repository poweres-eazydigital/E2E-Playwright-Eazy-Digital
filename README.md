# e2e-eazy-digital

Eazy Digital E2E with Playwright and TypeScript

# How to use

1. Git clone the project `git clone https://github.com/poweres-eazydigital/E2E-Playwright-Eazy-Digital.git`
2. Run `npm install`
3. Run `npx playwright install --with-deps` to make sure the browers got installed
4. Declare necessary environment variables to run local test
   For example,
   - E2E_ENV
   - DEV_AGENT_USERNAME
   - DEV_AGENT_PASSWORD
   - DEV_AGENT_ID
5. To run all the tests with headless-mode, please run `npx playwright test`
6. To run the specific test with headed-mode, please run `npx playwright test password.spec.ts --headed`.
7. Generate Allure result `npx allure generate ./allure-results — clean`
8. Open Allure result `npx allure open ./allure-report`

_If there is an error for Java installation like below. Please download and install Java first._

```
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

This page will be updated later for extensive information.
