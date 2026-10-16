/**
 * src/index.html  ->  www/index.html
 * فونت وزیرمتن و Chart.js را دانلود و داخل اپ قرار می‌دهد تا اپ آفلاین هم کار کند.
 * اگر دانلود ممکن نبود، همان لینک‌های CDN اصلی باقی می‌مانند.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'index.html');
const OUT = path.join(ROOT, 'www');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

async function get(url, asText) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(url + ' -> ' + res.status);
  return asText ? res.text() : Buffer.from(await res.arrayBuffer());
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });

  let html = fs.readFileSync(SRC, 'utf8');

  // Chart.js
  try {
    const m = html.match(/<script[^>]*src="(https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js[^"]+)"[^>]*><\/script>/);
    if (m) {
      fs.writeFileSync(path.join(OUT, 'vendor', 'chart.umd.min.js'), await get(m[1], false));
      html = html.replace(m[1], 'vendor/chart.umd.min.js');
      console.log('OK Chart.js bundled');
    }
  } catch (e) { console.warn('WARN Chart.js stays on CDN:', e.message); }

  // Google Fonts (Vazirmatn)
  try {
    const m = html.match(/<link[^>]*href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"[^>]*>/);
    if (m) {
      let css = await get(m[1].replace(/&amp;/g, '&'), true);
      const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(x => x[1]))];
      let i = 0;
      for (const u of urls) {
        const ext = (u.match(/\.(woff2|woff|ttf)/) || [null, 'woff2'])[1];
        const name = `font-${i++}.${ext}`;
        fs.writeFileSync(path.join(OUT, 'fonts', name), await get(u, false));
        css = css.split(u).join(name);
      }
      fs.writeFileSync(path.join(OUT, 'fonts', 'fonts.css'), css);
      html = html.replace(m[0], '<link rel="stylesheet" href="fonts/fonts.css">');
      html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, '');
      console.log(`OK Fonts bundled (${urls.length} files)`);
    }
  } catch (e) { console.warn('WARN Fonts stay on Google Fonts:', e.message); }

  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log('OK www/index.html ready');
})();
