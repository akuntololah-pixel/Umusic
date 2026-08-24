import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('assets/artwork');
const SIZE = 512;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const PALETTES = [
  { a: '#7C5CFF', b: '#2A1E5C', bg: '#0B0B12' },
  { a: '#FF5C8A', b: '#5C1E33', bg: '#120B10' },
  { a: '#39D0D8', b: '#123B44', bg: '#0A1014' },
  { a: '#FFB13D', b: '#5C3A12', bg: '#12100A' },
  { a: '#8AFF80', b: '#1E4A1C', bg: '#0A120A' },
  { a: '#FF7A45', b: '#5C2A12', bg: '#120D0A' },
  { a: '#B28AFF', b: '#33245C', bg: '#0E0B14' },
  { a: '#4DA6FF', b: '#12335C', bg: '#0A0F16' },
  { a: '#FF4D6D', b: '#4A1230', bg: '#140A0E' },
  { a: '#3DDC97', b: '#12403A', bg: '#0A1210' },
  { a: '#F2F2F2', b: '#3A3A44', bg: '#0D0D11' },
  { a: '#FFDE59', b: '#5C4D12', bg: '#12100A' },
];

function vinylSvg(p, rnd) {
  const cx = SIZE / 2;
  const grooves = Array.from({ length: 9 }, (_, i) => {
    const r = 150 - i * 13;
    return `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="#FFFFFF" stroke-opacity="${0.05 + (i % 3) * 0.02}" stroke-width="1.5"/>`;
  }).join('');
  const labelR = 62 + Math.floor(rnd() * 14);
  const dot = 10 + Math.floor(rnd() * 8);
  return `
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bgGrad)"/>
  <circle cx="${cx}" cy="${cx}" r="196" fill="${p.b}"/>
  <circle cx="${cx}" cy="${cx}" r="196" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2"/>
  ${grooves}
  <circle cx="${cx}" cy="${cx}" r="${labelR}" fill="${p.a}"/>
  <circle cx="${cx}" cy="${cx}" r="${dot}" fill="${p.bg}"/>
  <path d="M ${cx - 196} ${cx} A 196 196 0 0 1 ${cx} ${cx - 196}" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;
}

function wavesSvg(p, rnd) {
  const amp = 40 + rnd() * 30;
  const yBase = 300 + rnd() * 40;
  const wave = (offset, color, opacity, width) => {
    let d = `M -20 ${yBase + offset}`;
    for (let x = -20; x <= SIZE + 40; x += 64) {
      d += ` Q ${x + 16} ${yBase + offset - amp} ${x + 32} ${yBase + offset} T ${x + 64} ${yBase + offset}`;
    }
    d += ` L ${SIZE + 20} ${SIZE + 20} L -20 ${SIZE + 20} Z`;
    return `<path d="${d}" fill="${color}" fill-opacity="${opacity}"/>`;
  };
  return `
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bgGrad)"/>
  <circle cx="${90 + rnd() * 80}" cy="${110 + rnd() * 40}" r="46" fill="${p.a}" fill-opacity="0.9"/>
  ${wave(0, p.a, 0.85, 0)}
  ${wave(46, p.b, 0.9, 0)}
  ${wave(92, '#000000', 0.35, 0)}
  `;
}

function barsSvg(p, rnd) {
  const bars = [];
  const n = 12;
  const bw = SIZE / n - 10;
  for (let i = 0; i < n; i++) {
    const h = 60 + rnd() * 240;
    const x = 12 + i * (SIZE / n);
    bars.push(`<rect x="${x}" y="${SIZE - 40 - h}" width="${bw}" height="${h}" rx="${bw / 2}" fill="${i % 2 ? p.a : p.b}"/>`);
  }
  const discR = 54 + rnd() * 20;
  return `
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bgGrad)"/>
  <circle cx="${SIZE / 2}" cy="150" r="${discR}" fill="${p.a}" fill-opacity="0.95"/>
  <circle cx="${SIZE / 2}" cy="150" r="${discR * 0.4}" fill="${p.bg}"/>
  ${bars.join('')}
  `;
}

function orbitSvg(p, rnd) {
  const rings = [];
  const cx = 200 + rnd() * 110;
  const cy = 210 + rnd() * 80;
  for (let i = 0; i < 6; i++) {
    const r = 40 + i * (34 + rnd() * 10);
    rings.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${i % 2 ? p.a : p.b}" stroke-opacity="${0.75 - i * 0.09}" stroke-width="${10 - i}"/>`);
  }
  const sats = Array.from({ length: 3 }, (_, i) => {
    const ang = rnd() * Math.PI * 2;
    const r = 90 + i * 55;
    return `<circle cx="${cx + Math.cos(ang) * r}" cy="${cy + Math.sin(ang) * r}" r="${12 - i * 3}" fill="${p.a}"/>`;
  }).join('');
  return `
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bgGrad)"/>
  ${rings.join('')}
  ${sats}
  `;
}

function prismSvg(p, rnd) {
  const cx = SIZE / 2;
  const shapes = [];
  for (let i = 0; i < 5; i++) {
    const r = 90 + i * 34;
    const ox = (rnd() - 0.5) * 60;
    const oy = (rnd() - 0.5) * 60;
    shapes.push(`<circle cx="${cx + ox}" cy="${cx + oy}" r="${r}" fill="${i % 2 ? p.a : p.b}" fill-opacity="0.34"/>`);
  }
  const bar = `<rect x="${cx - 130}" y="${cx - 7}" width="260" height="14" rx="7" fill="#FFFFFF" fill-opacity="0.85" transform="rotate(${Math.floor(rnd() * 40 - 20)} ${cx} ${cx})"/>`;
  return `
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bgGrad)"/>
  ${shapes.join('')}
  ${bar}
  `;
}

const TEMPLATES = [vinylSvg, wavesSvg, barsSvg, orbitSvg, prismSvg];

async function render(name, svg) {
  await sharp(Buffer.from(svg))
    .resize(SIZE, SIZE)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, `${name}.png`));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const groups = {
    artists: ['aurora-waves', 'neon-pulse', 'midnight-echo', 'velvet-static', 'solar-drift', 'lunar-tide', 'iron-crescent', 'paper-moons', 'glass-atlas', 'wild-signal', 'crimson-fables', 'static-fields', 'hollow-sun', 'marble-sky', 'quiet-machines', 'ember-lane'],
    albums: ['afterglow', 'night-drive', 'paper-hearts', 'static-bloom', 'echo-chamber', 'golden-hour', 'low-orbit', 'midnight-snack', 'neon-cathedral', 'slow-motion'],
    playlists: ['late-night-coding', 'morning-coffee', 'gym-rage', 'rainy-window', 'road-trip', 'focus-flow'],
  };
  const manifest = { artists: {}, albums: {}, playlists: {} };
  for (const [group, names] of Object.entries(groups)) {
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const seed = hashSeed(`${group}:${name}`);
      const rnd = mulberry32(seed);
      const palette = PALETTES[seed % PALETTES.length];
      const template = TEMPLATES[(seed >>> 3) % TEMPLATES.length];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${palette.bg}"/>
          <stop offset="1" stop-color="${palette.b}"/>
        </linearGradient>
      </defs>
      ${template(palette, rnd)}
    </svg>`;
      const file = `${group.slice(0, -1)}-${name}`;
      await render(file, svg);
      manifest[group][name] = { file, tint: palette.a };
    }
  }
  const ts = `export type ArtworkEntry = { file: string; tint: string };

export const ARTWORK_TINTS = ${JSON.stringify(manifest, null, 2)} as const;

export function tintFor(group: keyof typeof ARTWORK_TINTS, name: string): string {
  return (ARTWORK_TINTS[group] as Record<string, ArtworkEntry>)[name]?.tint ?? '#7C5CFF';
}
`;
  fs.writeFileSync(path.resolve('src/data/mock/artworkManifest.ts'), ts);
  const total = Object.values(manifest).reduce((n, g) => n + Object.keys(g).length, 0);
  console.log(`Generated ${total} artwork PNGs + manifest`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
