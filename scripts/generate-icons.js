import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp SVG template for the application logo (Wallet + Trend Growth + Coin)
const createSvg = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.15 : size * 0.05;
  const innerSize = size - padding * 2;
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#2563eb" />
      <stop offset="100%" stopColor="#4f46e5" />
    </linearGradient>
    <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#f59e0b" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${size * 0.03}" stdDeviation="${size * 0.04}" flood-color="#000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Background container -->
  <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : size * 0.22}" fill="url(#bgGrad)" />

  <!-- Inner Content Group -->
  <g transform="translate(${padding}, ${padding}) scale(${innerSize / 100})">
    <!-- Wallet Main Body with shadow -->
    <path d="M12 25 C12 20, 16 16, 22 16 L78 16 C84 16, 88 20, 88 25 L88 75 C88 80, 84 84, 78 84 L22 84 C16 84, 12 80, 12 75 Z" fill="#ffffff" filter="url(#shadow)" opacity="0.95" />
    
    <!-- Wallet Flap Pocket -->
    <path d="M52 38 C52 35, 55 33, 60 33 L88 33 L88 67 L60 67 C55 67, 52 65, 52 62 Z" fill="#e0e7ff" />
    
    <!-- Pocket Lock / Button -->
    <circle cx="68" cy="50" r="5" fill="#2563eb" />
    <circle cx="68" cy="50" r="2.5" fill="#ffffff" />

    <!-- Upward Trend Arrow / Growth Chart -->
    <path d="M26 62 L42 46 L54 55 L74 35" fill="none" stroke="#2563eb" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M64 35 L74 35 L74 45" fill="none" stroke="#2563eb" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Golden Coin -->
    <circle cx="34" cy="30" r="10" fill="url(#coinGrad)" />
    <text x="34" y="34" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">$</text>
  </g>
</svg>
`;
};

async function generate() {
  console.log('Generating PWA icons...');

  // 192x192 PNG
  const svg192 = Buffer.from(createSvg(192));
  await sharp(svg192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 512x512 PNG
  const svg512 = Buffer.from(createSvg(512));
  await sharp(svg512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // Apple Touch Icon 180x180 PNG
  const svg180 = Buffer.from(createSvg(180));
  await sharp(svg180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Maskable 512x512 PNG
  const svgMaskable = Buffer.from(createSvg(512, true));
  await sharp(svgMaskable).png().toFile(path.join(publicDir, 'maskable-icon-512x512.png'));
  console.log('Created maskable-icon-512x512.png');

  // Favicon SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), createSvg(64));
  console.log('Created favicon.svg');

  console.log('All PWA icons generated successfully!');
}

generate().catch(console.error);
