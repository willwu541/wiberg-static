/**
 * Export all Wiberg catalog HTML files to PDF
 * Usage: npm install puppeteer && node export-pdf.js
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const files = [
  { html: 'general-brochure.html', pdf: 'Wiberg-General-Brochure-2026.pdf', landscape: false },
  { html: 'product-catalog.html', pdf: 'Wiberg-Product-Catalog-2026.pdf', landscape: false },
  { html: 'technical-manual.html', pdf: 'Wiberg-Technical-Manual-2026.pdf', landscape: false },
  // Datasheets
  ...fs.readdirSync('datasheets').filter(f => f.endsWith('.html')).map(f => ({
    html: `datasheets/${f}`,
    pdf: `Wiberg-${f.replace('.html', '').toUpperCase()}.pdf`,
    landscape: false,
  })),
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  
  for (const file of files) {
    const htmlPath = path.resolve(__dirname, file.html);
    if (!fs.existsSync(htmlPath)) {
      console.log(`⏭ Skipping ${file.html} (not found)`);
      continue;
    }
    
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: path.resolve(__dirname, 'pdf', file.pdf),
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      landscape: file.landscape,
    });
    
    console.log(`✅ ${file.pdf}`);
    await page.close();
  }
  
  await browser.close();
  console.log('\nDone! PDFs saved to ./pdf/');
})();
