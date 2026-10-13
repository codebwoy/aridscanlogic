import {
  composeDisplayText,
  formatLanguagePairLabel,
} from '@storyforge/shared'
import { buildZip, dataUrlToBuffer } from './zipPack.js'
import { attachSignedDownload } from './exportStore.js'
import { fetchImageBuffer } from '../providers/imageUtils.js'

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function slugify(title) {
  return (
    String(title || 'storyforge-flipbook')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'storyforge-flipbook'
  )
}

async function resolveImageBuffer(url) {
  if (!url) return null
  try {
    if (url.startsWith('data:')) {
      const buf = dataUrlToBuffer(url)
      return buf
    }
    const { buffer } = await fetchImageBuffer(url)
    return buffer
  } catch {
    return null
  }
}

function placeholderPngNote() {
  // Minimal 1×1 transparent PNG — flipbook UI shows caption-only when missing.
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )
}

/**
 * Build a self-contained digital flipbook ZIP: index.html + assets/*.png + README.
 * For online sharing / digital reading — not a KDP print file.
 */
export async function buildFlipbookZip({ project, userId, includeCover = true } = {}) {
  const title = project?.title || 'StoryForge Book'
  const pages = Array.isArray(project?.pages) ? project.pages : []
  const pageCount = Math.max(1, Number(project?.page_count) || pages.length || 1)
  const langLabel = formatLanguagePairLabel(
    project?.language || 'de',
    project?.secondary_language || null,
  )

  const slides = []
  const files = []

  if (includeCover) {
    const coverUrl = project?.pinned_anchor?.heroUrl || pages[0]?.asset?.url || null
    const coverBuf = (await resolveImageBuffer(coverUrl)) || placeholderPngNote()
    const coverName = 'assets/cover.png'
    files.push({ name: coverName, data: coverBuf, compress: false })
    slides.push({
      kind: 'cover',
      image: coverName,
      text: title,
      subtitle: project?.premise || project?.emotional_core || '',
    })
  }

  for (let i = 0; i < pageCount; i++) {
    const page = pages[i] || {}
    const text = composeDisplayText(
      { ...page, page_index: i },
      {
        language: project?.language || 'de',
        secondary_language: project?.secondary_language || null,
        bilingual_layout: project?.bilingual_layout || 'stacked',
      },
    )
    const imgBuf =
      (await resolveImageBuffer(page?.asset?.url || page?.asset?.remoteUrl)) || placeholderPngNote()
    const imgName = `assets/page-${String(i + 1).padStart(2, '0')}.png`
    files.push({ name: imgName, data: imgBuf, compress: false })
    slides.push({
      kind: 'page',
      image: imgName,
      text: text || page?.illustration_brief || `Page ${i + 1}`,
      pageNumber: i + 1,
    })
  }

  const html = renderFlipbookHtml({
    title,
    langLabel,
    slides,
    author: project?.meta?.author || '',
  })
  files.push({ name: 'index.html', data: html, compress: true })
  files.push({
    name: 'README.txt',
    data: [
      `${title} — StoryForge digital flipbook`,
      '',
      'Open index.html in any modern browser (Chrome, Safari, Firefox, Edge).',
      'Use ← → buttons or arrow keys to turn pages.',
      '',
      `Languages: ${langLabel}`,
      `Pages: ${pageCount}${includeCover ? ' + cover' : ''}`,
      '',
      'This is a digital share pack — not a print-ready KDP PDF.',
      'For Amazon KDP upload, use Export interior / cover wrap / Finish pack in Studio.',
      '',
      'Not affiliated with Amazon. StoryForge does not auto-upload.',
    ].join('\n'),
    compress: true,
  })

  const zipBytes = buildZip(files)
  const filename = `${slugify(title)}-flipbook.zip`
  const zip = attachSignedDownload(
    {
      mime: 'application/zip',
      filename,
      bytes: zipBytes,
      byteLength: zipBytes.length,
      dataUrl: `data:application/zip;base64,${zipBytes.toString('base64')}`,
    },
    { userId, stripDataUrlAbove: 400_000 },
  )

  return {
    zip,
    pageCount,
    hasCover: Boolean(includeCover),
    note: 'Digital flipbook for online sharing — not a KDP print file',
    checklist: [
      'Unzip and open index.html locally or host the folder',
      'Share the link / folder with family (not Amazon KDP)',
      'For print: use Finish pack / interior + cover PDFs instead',
    ],
  }
}

function renderFlipbookHtml({ title, langLabel, slides, author }) {
  const slidesJson = JSON.stringify(
    slides.map((s) => ({
      kind: s.kind,
      image: s.image,
      text: s.text || '',
      subtitle: s.subtitle || '',
      pageNumber: s.pageNumber || null,
    })),
  )

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} — Flipbook</title>
  <style>
    :root {
      --bg: #1a1410;
      --fg: #f7f1e8;
      --muted: #c4b8a8;
      --accent: #e8a54b;
      --card: #2a221c;
      --shadow: rgba(0,0,0,.45);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: radial-gradient(ellipse at top, #3a2c22, var(--bg));
      color: var(--fg);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
    header { text-align: center; margin-bottom: 0.75rem; max-width: 52rem; }
    header h1 { margin: 0 0 0.25rem; font-size: clamp(1.25rem, 3vw, 1.85rem); }
    header p { margin: 0; color: var(--muted); font-size: 0.9rem; }
    .stage {
      width: min(920px, 100%);
      perspective: 1600px;
    }
    .book {
      position: relative;
      aspect-ratio: 4 / 3;
      background: var(--card);
      border-radius: 12px;
      box-shadow: 0 24px 60px var(--shadow);
      overflow: hidden;
      transform-style: preserve-3d;
    }
    .spread {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-rows: 1fr auto;
      opacity: 0;
      pointer-events: none;
      transform: rotateY(-28deg);
      transform-origin: left center;
      transition: opacity .35s ease, transform .45s ease;
    }
    .spread.active {
      opacity: 1;
      pointer-events: auto;
      transform: rotateY(0);
    }
    .spread img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #0f0c0a;
      display: block;
    }
    .caption {
      padding: 0.85rem 1.1rem 1.1rem;
      background: linear-gradient(180deg, transparent, rgba(0,0,0,.55) 18%, rgba(0,0,0,.75));
      white-space: pre-wrap;
      font-size: clamp(0.95rem, 2.2vw, 1.15rem);
      line-height: 1.45;
    }
    .caption .sub { color: var(--muted); font-size: 0.85em; margin-top: 0.35rem; }
    .nav {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    button {
      min-height: 48px;
      min-width: 48px;
      padding: 0.55rem 1.1rem;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,.18);
      background: var(--accent);
      color: #1a1410;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
    }
    button:disabled { opacity: 0.4; cursor: not-allowed; }
    .counter { color: var(--muted); min-width: 7rem; text-align: center; }
    footer { margin-top: 1.25rem; color: var(--muted); font-size: 0.75rem; text-align: center; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(langLabel)}${author ? ` · ${escapeHtml(author)}` : ''} · StoryForge flipbook</p>
  </header>
  <div class="stage" id="stage" aria-live="polite"></div>
  <div class="nav">
    <button type="button" id="prev" aria-label="Previous page">← Prev</button>
    <span class="counter" id="counter"></span>
    <button type="button" id="next" aria-label="Next page">Next →</button>
  </div>
  <footer>Digital share pack — not a KDP print file. Made with StoryForge.</footer>
  <script>
    const slides = ${slidesJson};
    let i = 0;
    const stage = document.getElementById('stage');
    const book = document.createElement('div');
    book.className = 'book';
    stage.appendChild(book);
    const spreads = slides.map((s, idx) => {
      const el = document.createElement('div');
      el.className = 'spread' + (idx === 0 ? ' active' : '');
      el.innerHTML = '<img alt="" src="' + s.image + '" />' +
        '<div class="caption">' + escapeHtml(s.text) +
        (s.subtitle ? '<div class="sub">' + escapeHtml(s.subtitle) + '</div>' : '') +
        '</div>';
      book.appendChild(el);
      return el;
    });
    function escapeHtml(t) {
      return String(t || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function render() {
      spreads.forEach((el, idx) => el.classList.toggle('active', idx === i));
      document.getElementById('counter').textContent = (i + 1) + ' / ' + slides.length;
      document.getElementById('prev').disabled = i <= 0;
      document.getElementById('next').disabled = i >= slides.length - 1;
    }
    function go(d) {
      i = Math.max(0, Math.min(slides.length - 1, i + d));
      render();
    }
    document.getElementById('prev').onclick = () => go(-1);
    document.getElementById('next').onclick = () => go(1);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    render();
  </script>
</body>
</html>
`
}
