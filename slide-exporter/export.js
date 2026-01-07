const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');

// --- CONFIGURATION ---
// Update this to match your actual number of slides
const TOTAL_SLIDES = 28; 
const APP_URL = 'http://127.0.0.1:8000/presentation';
const OUTPUT_FILE = 'Quantum_Logistics_Full.pptx';
const VIEWPORT = { width: 1920, height: 1080 };

// CRITICAL: Time to wait after slide change before taking picture
// 4000ms = 4 seconds. This ensures all Framer Motion entrance animations are done.
const TRANSITION_DELAY = 4000; 

(async () => {
  console.log('🚀 Starting Robust Export Process...');
  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  console.log(`navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  
  // Wait for the app to "hydrate" completely
  await new Promise(r => setTimeout(r, 2000));

  // Enter Zen Mode to hide the UI controls
  await page.keyboard.press('z');
  
  // Wait for the UI to slide away
  await new Promise(r => setTimeout(r, 1000));

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    console.log(`⏳ Waiting for animations on Slide ${i + 1}...`);
    
    // 1. THE FIX: Wait for all transitions to settle
    await new Promise(r => setTimeout(r, TRANSITION_DELAY));

    console.log(`📸 Capturing Slide ${i + 1}/${TOTAL_SLIDES}...`);

    // 2. Take the screenshot
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    // 3. Add to PPTX
    const slide = pptx.addSlide();
    slide.addImage({ 
        data: `data:image/png;base64,${screenshotBuffer.toString('base64')}`, 
        x: 0, y: 0, w: '100%', h: '100%' 
    });

    // 4. Move to next slide (if not the last one)
    if (i < TOTAL_SLIDES - 1) {
        console.log('➡️ Moving next...');
        await page.keyboard.press('ArrowRight');
    }
  }

  await browser.close();
  console.log('💾 Saving PowerPoint...');
  await pptx.writeFile({ fileName: OUTPUT_FILE });
  console.log(`✅ Done! Saved to ${OUTPUT_FILE}`);
})();