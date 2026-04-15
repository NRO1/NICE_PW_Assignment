import { Page, type Locator } from '@playwright/test';

export class MainPage {
    readonly page: Page;
    readonly logOutLink: Locator;
    readonly firstAccountID: Locator;
    readonly accountOverviewLink: Locator;
    readonly secondAccountID: Locator;
    readonly transferFundsLink: Locator;
    readonly amountTOTransferInput: Locator;
    readonly fromAccountSelect: Locator;
    readonly toAccountSelect: Locator
    readonly transferButton: Locator;

  constructor (page: Page) {
    this.page = page;
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });
    this.firstAccountID = page.locator('#accountTable tbody tr:first-child td:first-child a').first();
    this.accountOverviewLink = page.getByRole('link', { name: 'Accounts Overview' });
    this.secondAccountID = page.locator('#accountTable tbody tr:nth-child(2) td:first-child a')
    this.transferFundsLink = page.getByRole('link', { name: 'Transfer Funds' });
    this.amountTOTransferInput = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
  }

    async logOut() {        
        await this.logOutLink.click();
    }

    async getFirstAccountId() {
        const accountId = await this.firstAccountID.textContent();
        return accountId?.trim()
    } 

    async goToAccountsOverview() {
        await this.accountOverviewLink.click();
    }

    async getSecondAccountId() {
        const accountId = await this.secondAccountID.textContent();
        return accountId?.trim()
    } 

    async goToTransferFunds() {
        await this.transferFundsLink.click();
    }

    async transferFunds(amount: string, fromAccountId: string, toAccountId: string) {
        await this.goToTransferFunds();
        await this.amountTOTransferInput.fill(amount);
        await this.fromAccountSelect.selectOption(fromAccountId);
        await this.toAccountSelect.selectOption(toAccountId) ;
        await this.transferButton.click();
    }
    

}


