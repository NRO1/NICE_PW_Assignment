import { Page } from '@playwright/test';
import { RegisterUtility } from './RegisterUtility';
import { HomePage } from './homePage';
import { MainPage } from './MainPage';

export class PageManager {
    readonly page: Page;
    private readonly registerUtility: RegisterUtility;
    private readonly homePage: HomePage;
    private readonly mainPage: MainPage;



    constructor(page: Page) {
        this.page = page;
        this.registerUtility = new RegisterUtility(page);
        this.homePage = new HomePage(page);
        this.mainPage = new MainPage(page);
    }

    register() {
        return this.registerUtility;
    }

    home() {
        return this.homePage;
    }   

    main() {
        return this.mainPage;
    }   

}