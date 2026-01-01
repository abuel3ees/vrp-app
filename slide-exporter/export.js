const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');

// CONFIGURATION
const TOTAL_SLIDES = 20; // Update this if you add more slides
const APP_URL = 'http://127.0.0.1:8000/presentation'; // Your local URL
const OUTPUT_FILE = 'Quantum_Logistics_Presentation.pptx';
const VIEWPORT = { width: 1920, height: 1080 };

(async () => {
  console.log('🚀 Starting Export Process...');
  
  // 1. Launch Browser
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // 2. Initialize PowerPoint
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  // 3. Loop through slides
  // We assume your app supports navigating via arrow keys.
  // We load the page once, then press "ArrowRight" to advance.
  
  console.log(`navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  
  // Wait for initial load animation (Zen mode logic helps here)
  await new Promise(r => setTimeout(r, 2000));

  // Enter "Zen Mode" (Press 'z') to hide UI controls if you added that feature
  await page.keyboard.press('z');
  await new Promise(r => setTimeout(r, 500));

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    console.log(`📸 Capturing Slide ${i + 1}/${TOTAL_SLIDES}...`);

    // Wait for transition to finish (1.5 seconds)
    await new Promise(r => setTimeout(r, 1500));

    // Take Screenshot (Binary)
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    // Add to PPTX
    const slide = pptx.addSlide();
    
    // Add the image filling the whole slide
    slide.addImage({ 
        data: `data:image/png;base64,${screenshotBuffer.toString('base64')}`, 
        x: 0, 
        y: 0, 
        w: '100%', 
        h: '100%' 
    });

    // Move to next slide
    if (i < TOTAL_SLIDES - 1) {
        await page.keyboard.press('ArrowRight');
    }
  }

  // 4. Save File
  await browser.close();
  console.log('💾 Saving PowerPoint...');
  await pptx.writeFile({ fileName: OUTPUT_FILE });
  console.log(`✅ Done! Saved to ${OUTPUT_FILE}`);
})();