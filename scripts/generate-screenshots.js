const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    console.log('🚀 Starting screenshot generation...');
    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1440, height: 900 }
    });
    const page = await browser.newPage();

    // 1. Landing Page - Hero
    console.log('📸 Capturing Landing Page Hero...');
    await page.goto(`file://${path.resolve(__dirname, 'landing.html')}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'assets/screenshots/landing-hero.png' });

    // 2. Landing Page - Features
    console.log('📸 Capturing Landing Page Features...');
    await page.setViewport({ width: 1440, height: 1200 }); // Taller viewport
    await page.evaluate(() => document.getElementById('features').scrollIntoView());
    await new Promise(r => setTimeout(r, 500)); // Wait for scroll
    await page.screenshot({ path: 'assets/screenshots/landing-features.png' });

    // 3. Test Interface
    console.log('📸 Capturing Test Console...');
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(`file://${path.resolve(__dirname, 'test-interface.html')}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'assets/screenshots/console.png' });

    await browser.close();
    console.log('✅ Screenshots generated in assets/screenshots/');
})();
