import { Builder, By, Key, until } from 'selenium-webdriver';

(async function testMiningApp() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // User Login
        await driver.get('http://localhost:3000/login');
        await driver.findElement(By.name('username')).sendKeys('zubair', Key.RETURN);
        await driver.findElement(By.name('password')).sendKeys('123', Key.RETURN);

        // Wait for redirection to the mining management page
        await driver.sleep(2000); // Adjust this if needed

        // Start Mining Session
        await driver.findElement(By.xpath("//button[contains(text(), 'Start Mining')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Check Mining Status
        await driver.findElement(By.xpath("//button[contains(text(), 'Check Status')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Check Mining Progress
        await driver.findElement(By.xpath("//button[contains(text(), 'Check Progress')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Claim Rewards
        await driver.findElement(By.xpath("//button[contains(text(), 'Claim Rewards')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Stop Mining Session
        await driver.findElement(By.xpath("//button[contains(text(), 'Complete Mining')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Try to start a mining session again to check API handling
        await driver.findElement(By.xpath("//button[contains(text(), 'Start Mining')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Check Mining Status again
        await driver.findElement(By.xpath("//button[contains(text(), 'Check Status')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Check Mining Progress again
        await driver.findElement(By.xpath("//button[contains(text(), 'Check Progress')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Attempt to claim rewards without a session (if applicable)
        await driver.findElement(By.xpath("//button[contains(text(), 'Claim Rewards')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Stop Mining Session again to ensure it handles stopping a session that doesn't exist
        await driver.findElement(By.xpath("//button[contains(text(), 'Complete Mining')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

        // Additional cases for invalid actions (if your app supports such checks)
        // Trying to claim rewards without a session
        await driver.findElement(By.xpath("//button[contains(text(), 'Claim Rewards')]")).click();
        await driver.sleep(2000);
        await driver.navigate().back();

    } catch (err) {
        console.error(err);
    } finally {
        await driver.quit();
    }
})();
