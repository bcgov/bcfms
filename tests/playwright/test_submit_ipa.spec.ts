import { test, expect } from '@playwright/test';

test.use({
    ignoreHTTPSErrors: true,
    headless: false,
});

test('test_submit_ipa', async ({ page }) => {
    const idir_username = process.env.IDIR_USERNAME;
    const idir_password = process.env.IDIR_PASSWORD;
    // defensive check
    if (!idir_username || !idir_password)
        throw new Error('Missing TEST_USER/TEST_PASSWORD env vars');
    await page.goto('http://localhost:81/bc-fossil-management/');
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'IDIR' }).click();
    await page.locator('#user').fill(idir_username);
    await page.locator('#user').press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(idir_password);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForSelector('a.auth-welcome');
    await page.goto('http://localhost:81/bc-fossil-management/submissions/');
    await page.getByRole('link', { name: 'Add a new project' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Start' }).first().click();

    await page
        .getByRole('textbox', { name: 'Project Name Project Name' })
        .click();
    await page
        .getByRole('textbox', { name: 'Project Name Project Name' })
        .fill('This is a test project');
    // await page.getByRole('combobox', { name: 'Select Resources' }).click();
    await page.locator('#project_initiator').click();
    await page.getByRole('option', { name: 'Ager, J.' }).click();
    await page.getByRole('textbox', { name: 'Industry Company Name' }).click();
    await page
        .getByRole('textbox', { name: 'Industry Company Name' })
        .fill('Industry Company - QED Systems');
    await page
        .locator('#project_authorizing_agency')
        .getByText('Select an option')
        .click();
    await page.getByText('Front Counter BC (FCBC)').click();
    await page
        .getByRole('textbox', { name: 'Land Act File Number Land Act' })
        .click();
    await page
        .getByRole('textbox', { name: 'Land Act File Number Land Act' })
        .fill('LAFN1');
    await page
        .getByRole('combobox', { name: 'Expected Project Start Date' })
        .click();
    await page.getByText('11', { exact: true }).click();
    await page.getByRole('button', { name: 'Next' }).nth(1).click();
    await page.getByText('Select an option').click();
    await page
        .locator('div')
        .filter({ hasText: /^Airport$/ })
        .click();
    await page
        .getByRole('textbox', { name: 'Proposed Activity Proposed' })
        .click();
    await page
        .getByRole('textbox', { name: 'Proposed Activity Proposed' })
        .fill('Fly away little donkeya');
    await page
        .getByRole('textbox', { name: 'Other Project Type Other' })
        .click();
    await page
        .getByRole('textbox', { name: 'Other Project Type Other' })
        .fill(' ');
    await page.getByRole('button', { name: 'Next' }).nth(1).click();
    await page
        .getByRole('textbox', { name: 'Location Description Location' })
        .click();
    await page
        .getByRole('textbox', { name: 'Location Description Location' })
        .fill('Somewhere, sometime, somehow');
    await page.getByText('Select meaning of feature if').click();
    await page
        .locator('div')
        .filter({ hasText: /^datum point$/ })
        .click();
    await page.getByRole('paragraph').click();
    await page.locator('.ql-editor').fill("There's only one!");
    await page.getByRole('button', { name: 'Next' }).nth(1).click();
    // await page.getByRole('button', { name: 'Choose File' }).click();
    // await page.getByRole('button', { name: 'Choose File' }).setInputFiles('/Users/brett/Downloads/99 E Cordova 2.jpg');
    await page.setInputFiles(
        'input[type="file"]',
        '/Users/brett/Downloads/99 E Cordova 2.jpg',
    );
    await page.getByRole('button', { name: 'Next' }).first().click();
    await page.pause();
    await page.getByRole('button', { name: 'Submit' }).first().click();
});
