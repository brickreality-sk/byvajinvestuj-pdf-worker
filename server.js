const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

// Base URL of your Lovable app (update after deployment)
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://id-preview--8023b535-3469-42e8-a195-9ccca6f72af2.lovable.app';

// Simple API key auth (set in Railway env vars)
const API_KEY = process.env.PDF_WORKER_API_KEY || 'dev-key';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// PDF generation endpoint
app.get('/api/pdf', async (req, res) => {
  const { template, reportId } = req.query;
  const authHeader = req.headers['x-api-key'];

  // Validate API key
  if (authHeader !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate template (only A for now)
  if (template !== 'A') {
    return res.status(400).json({ error: 'Only template A is supported' });
  }

  if (!reportId) {
    return res.status(400).json({ error: 'reportId is required' });
  }

  let browser = null;

  try {
    console.log(`Generating PDF for template ${template}, reportId ${reportId}`);

    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext({
      viewport: { width: 1200, height: 1600 }
    });

    const page = await context.newPage();

    // Navigate to the print route
    const printUrl = `${APP_BASE_URL}/print/goal-savings/${template}?reportId=${reportId}`;
    console.log(`Navigating to: ${printUrl}`);

    await page.goto(printUrl, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Additional wait for any animations/rendering
    await page.waitForTimeout(500);

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    console.log(`PDF generated successfully, size: ${pdfBuffer.length} bytes`);

    // Send PDF as download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-${template}-${reportId}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'PDF generation failed', 
      message: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`PDF Worker running on port ${PORT}`);
  console.log(`App base URL: ${APP_BASE_URL}`);
});
