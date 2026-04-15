import { Page, type Locator, expect } from '@playwright/test';
import { RandomUser } from '../Util/createRandomUser';

export class RegisterUtility {
    readonly page: Page;
    readonly registerLink: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneInput: Locator;
    readonly ssInput: Locator;   
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly repeatedPasswordInput: Locator;
    readonly registerButton: Locator; 
    readonly successMessage: Locator;  

  constructor (page: Page) {
    this.page = page;
    this.registerLink = page.getByText('Register');
    // The ID selectors are used as such because of the "." in the name attribute which makes it difficult .
    // to use other selector strategies without escaping characters
    this.firstNameInput = page.locator('[id="customer.firstName"]');
    this.lastNameInput = page.locator('[id="customer.lastName"]');
    this.addressInput = page.locator('[id="customer.address.street"]');
    this.cityInput = page.locator('[id="customer.address.city"]');
    this.stateInput = page.locator('[id="customer.address.state"]');
    this.zipCodeInput = page.locator('[id="customer.address.zipCode"]');
    this.phoneInput = page.locator('[id="customer.phoneNumber"]');
    this.ssInput = page.locator('[id="customer.ssn"]');
    this.userNameInput = page.locator('[id="customer.username"]');
    this.passwordInput = page.locator('[id="customer.password"]');
    this.repeatedPasswordInput = page.locator('[id="repeatedPassword"]');
    this.registerButton = page.locator('input[value="Register"]');
    this.successMessage = page.getByText('Your account was created successfully. You are now logged in.');
  }
  
  // This method will handle the entire registration flow for a new user 
  // considering the random user data generated from the utility function and we are on the home page
  async register(user: RandomUser) {
    await this.registerLink.click();
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.addressInput.fill(user.address);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.zipCodeInput.fill(user.zipCode);
    await this.phoneInput.fill(user.phone);
    await this.ssInput.fill(user.ss);
    await this.userNameInput.fill(user.userName);
    await this.passwordInput.fill(user.password);
    await this.repeatedPasswordInput.fill(user.password);
    await this.registerButton.click();
        // Validate successful registration and login
    await expect(this.page.locator('text=Your account was created successfully. You are now logged in.')).toBeVisible({ timeout: 7000 });
    console.log('User registered successfully');
  }
}


