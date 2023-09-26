import { AppCommonPage } from "PageObject";
import { APIResponse, Page } from "@playwright/test";

export default class MePage extends AppCommonPage {
  constructor(page: Page) {
    super(page);
  }

  get currentPasswordInput() {
    return this.element(`[data-cy="currentpassword"]`);
  }

  get newPasswordInput() {
    return this.element(`[data-cy="newpassword"]`);
  }

  get confirmNewPasswordInput() {
    return this.element(`[data-cy="confirmpassword"]`);
  }

  get savePasswordChangedButton() {
    return this.element(`#changePasswordButtonSave`);
  }

  get minimumPaswordCharactersWarning() {
    return this.element(
      '//div[contains(text(),"Password should have at least 8 characters")]'
    );
  }

  get passwordMatchingWarning() {
    return this.element(
      '//div[contains(text(),"Both Passwords should match")]'
    );
  }

  async fillChangePasswordForm(details: {
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }) {
    const { currentPassword, newPassword, confirmNewPassword } = details;
    if (currentPassword) {
      await this.currentPasswordInput.fillElement(currentPassword);
    }
    if (newPassword) {
      await this.newPasswordInput.fillElement(newPassword);
    }
    if (confirmNewPassword) {
      await this.confirmNewPasswordInput.fillElement(confirmNewPassword);
    }
  }

  async verifyChangePasswordResponseStatus(status: number) {
    return await this.apiActions.waitForResponseByURL(
      "/api/profile/change_password",
      {
        status,
      }
    );
  }

  changePasswordByAPI(
    userId: string,
    current_password: string,
    new_password: string
  ): Promise<APIResponse> {
    return this.apiActions.requestEazyAgent(
      "put",
      "/api/profile/change_password",
      {
        id: userId,
        current_password,
        confirm_password: new_password,
        mode: "CHANGE_PASSWORD",
        new_password,
      }
    );
  }
}
