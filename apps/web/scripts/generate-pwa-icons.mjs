import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const logoPath = join(publicDir, 'logo-rotalive-family.png');

const BRAND_BLUE = { r: 37, g: 99, b: 235, alpha: 1 };

async function generateSquareIcon(size, outputName) {
  const logo = await sharp(logoPath)
    .resize(Math.round(size * 0.82), Math.round(size * 0.82), { fit: 'inside' })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_BLUE,
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(join(publicDir, outputName));

  console.log(`✓ ${outputName} (${size}x${size})`);
}

async function main() {
  await generateSquareIcon(512, 'icon-512.png');
  await generateSquareIcon(192, 'icon-192.png');
  await generateSquareIcon(180, 'apple-touch-icon.png');
  await generateSquareIcon(32, 'favicon-32.png');

  await sharp(join(publicDir, 'favicon-32.png')).toFile(join(publicDir, 'favicon.ico'));

  console.log('✓ favicon.ico');
  console.log('PWA icons generated successfully.');
}

main().catch((err) => {
  console.error('Failed to generate PWA icons:', err);
  process.exit(1);
});
