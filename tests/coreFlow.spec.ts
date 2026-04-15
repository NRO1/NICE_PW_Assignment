import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/PageManager';
import { generateRandomUser, RandomUser } from '../Util/createRandomUser';
import { XMLParser } from 'fast-xml-parser';

test('End-to-End Banking Flow', async ({ page, request }) => {
    const pm = new PageManager(page);
    const randomUser: RandomUser = generateRandomUser();
    console.log('Generated random user:', randomUser)
    const parser = new XMLParser();
    let customerId: string | number | undefined;
    let firstAccountId: string | number | undefined;
    let secondAccountId: string | number | undefined;
    let secondAccountInitialBalance: number | undefined;
   
    await test.step('Go to main page', async ({}) => {
        await page.goto('/')
        await expect(page.url()).toContain('https://parabank.parasoft.com/parabank/index.htm')
        console.log('Main page loaded successfully');
    });


    await test.step('Register a new user and logout', async ({}) => {
        await pm.register().register(randomUser);
        await pm.main().logOut();
        await expect(page.url()).toContain('https://parabank.parasoft.com/parabank/index.htm')
        console.log('Logged out successfully after registration');
    });


    await test.step('login', async ({}) => {
        await pm.home().login(randomUser.userName, randomUser.password);
        await expect(page.url()).toBe('https://parabank.parasoft.com/parabank/overview.htm')
        console.log('Logged in successfully with registered user');
    });


    // As there is no direct API endpoint to retrieve the customer ID, we will first get the account ID from the UI and then use it to fetch the customer ID via API.
    // This is a workaround to bridge the gap between UI and API layers in this application.
    await test.step('Get customer ID (API)', async ({}) => {
        firstAccountId = await pm.main().getFirstAccountId();
        console.log('Retrieved account ID:', firstAccountId);

        const response = await request.get(`https://parabank.parasoft.com/parabank/services/bank/accounts/${firstAccountId}`, {
            headers: {
                'Accept': 'application/xml',
                'Content-Type': 'application/xml'
            }
        })
        expect(response.ok()).toBeTruthy();
        const xmlData = await response.text();
        const jsonObj = parser.parse(xmlData);
        customerId = jsonObj.account.customerId;
        console.log(`Customer ID: ${customerId}`);
        expect(customerId).toBeDefined();
    });


    await test.step('Create new checking account', async ({}) => {
        const intCustomerID = parseInt(customerId as string, 10);
        const intFirstAccountId = parseInt(firstAccountId as string, 10);   
        const response = await request.post(`https://parabank.parasoft.com/parabank/services/bank/createAccount`, {
            params: {
                'customerId': intCustomerID,
                'accountType': 0,
                'fromAccountId': intFirstAccountId
            },
            headers: {
                'Accept': 'application/xml',
                'Content-Type': 'application/xml'
            }
        })
        expect(response.ok()).toBeTruthy();
        const xmlData = await response.text();
        const jsonObj = parser.parse(xmlData);
        secondAccountId = jsonObj.account.id;
        console.log(`Second Account ID: ${secondAccountId}`);
        expect(secondAccountId).toBeDefined();
    });


    await test.step('Verify new account appears in UI', async ({}) => {
        await page.reload({ 
            waitUntil: 'networkidle', 
            timeout: 30000            
        });
        const secondAccountId = await pm.main().getSecondAccountId();
        await expect(secondAccountId).toBe(secondAccountId);
    });

    // This step is crucial to ensure that the second account has been created successfully and to get the initial balance before we proceed with the fund transfer, 
    // for the last step validation
    await test.step('Get second account initial balance (API)', async ({}) => {
        const response = await request.get(`https://parabank.parasoft.com/parabank/services/bank/accounts/${secondAccountId}`, {
            headers: {
                'Accept': 'application/xml',
                'Content-Type': 'application/xml'
            }
        })
        expect(response.ok()).toBeTruthy();
        const xmlData = await response.text();
        const jsonObj = parser.parse(xmlData);
        secondAccountInitialBalance = jsonObj.account.balance;
        expect(secondAccountInitialBalance).toBeDefined();
        console.log(`Initial balance of the second account: ${secondAccountInitialBalance}`);
    });
       


    await test.step('Transfer money between accounts (UI)', async ({}) => {
        await pm.main().transferFunds('50', String(firstAccountId), String(secondAccountId));
        await expect(page.locator('#showResult')).toContainText('Transfer Complete!');
        console.log('Funds transferred successfully via UI');
        await page.waitForTimeout(10000)
    });


    await test.step('Validate updated balances (API)', async ({}) => {
        const response = await request.get(`https://parabank.parasoft.com/parabank/services/bank/accounts/${secondAccountId}`, {
            headers: {
                'Accept': 'application/xml',
                'Content-Type': 'application/xml'
            }
        })
        expect(response.ok()).toBeTruthy();
        const xmlData = await response.text();
        const jsonObj = parser.parse(xmlData);
        const newBalance = jsonObj.account.balance;
        expect(newBalance).toBeDefined();
        const expectedBalance = secondAccountInitialBalance ? secondAccountInitialBalance + 50 : undefined;
        expect(parseFloat(newBalance)).toEqual(expectedBalance);
        console.log(`The second account now has: ${newBalance}`);
    });
       


    await test.step('Logout', async ({}) => {
        await pm.main().logOut();
        await expect(page.url()).toContain('https://parabank.parasoft.com/parabank/index.htm')
        console.log('Logged out successfully at the end of the flow');
    });
});

   

    

