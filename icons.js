/*
 * Site-wide icon system. Every visible arrow / mark is an inline SVG with the
 * same viewBox, stroke weight and line caps. The text-symbol replacement is a
 * fallback for labels added by scripts; templates should use portfolioIcon().
 *
 * Arrow, chevron, close, refresh, plus and minus paths are derived from Lucide
 * (https://lucide.dev), ISC License. Copyright (c) for portions of Lucide are
 * held by Cole Bemis 2013-2022 as part of Feather (MIT); all other copyright
 * (c) is held by Lucide Contributors 2022. Permission to use, copy, modify,
 * and/or distribute this software for any purpose with or without fee is
 * hereby granted, provided that this notice appears in all copies. The
 * software is provided "as is", without warranty of any kind.
 * The identity star is a custom path, not from Lucide.
 */
(() => {
  const namespace = 'http://www.w3.org/2000/svg';
  const paths = {
    star: 'M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07',
    up: 'M12 19V5M5 12l7-7 7 7',
    down: 'M12 5v14M19 12l-7 7-7-7',
    left: 'M12 19l-7-7 7-7M19 12H5',
    right: 'M5 12h14M12 5l7 7-7 7',
    'up-right': 'M7 7h10v10M7 17 17 7',
    'up-left': 'M7 17V7h10M17 17 7 7',
    'down-right': 'M7 7l10 10M17 7v10H7',
    'down-left': 'M17 7 7 17M17 17H7V7',
    refresh: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5',
    'refresh-ccw': 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5',
    close: 'M18 6 6 18M6 6l12 12',
    plus: 'M5 12h14M12 5v14',
    range: 'M5 12h14',
    chevron: 'M9 18l6-6-6-6'
  };
  const aliases = {
    '✳': 'star', '↑': 'up', '↓': 'down', '←': 'left', '→': 'right',
    '↗': 'up-right', '↖': 'up-left', '↘': 'down-right', '↙': 'down-left',
    '↻': 'refresh', '↺': 'refresh-ccw'
  };
  const symbols = /[✳↑↓←→↗↖↘↙↻↺]/g;

  function resolve(name) {
    return aliases[name] || name;
  }

  function strokeFor(name) {
    return name === 'star' ? '1.35' : '1.6';
  }

  function svgMarkup(name, className = 'portfolio-icon') {
    const key = resolve(name);
    const d = paths[key];
    if (!d) return '';
    return `<svg class="${className}" data-icon="${key}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeFor(key)}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${d}"></path></svg>`;
  }

  window.portfolioIcon = svgMarkup;

  function makeIcon(symbol) {
    const key = resolve(symbol);
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('class', 'portfolio-icon');
    svg.setAttribute('data-icon', key);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', strokeFor(key));
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(namespace, 'path');
    path.setAttribute('d', paths[key]);
    svg.append(path);
    return svg;
  }

  function replaceSymbols(node) {
    const content = node.nodeValue;
    symbols.lastIndex = 0;
    if (!symbols.test(content)) return;
    symbols.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let previous = 0;
    for (const match of content.matchAll(symbols)) {
      if (match.index > previous) fragment.append(document.createTextNode(content.slice(previous, match.index)));
      fragment.append(makeIcon(match[0]));
      previous = match.index + match[0].length;
    }
    if (previous < content.length) fragment.append(document.createTextNode(content.slice(previous)));
    node.replaceWith(fragment);
  }

  function decorateToc(root) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('.reader-toc nav button').forEach(button => {
      if (button.querySelector('.reader-toc-chevron')) return;
      button.insertAdjacentHTML('beforeend', svgMarkup('chevron', 'portfolio-icon reader-toc-chevron'));
    });
  }

  function scan(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (!root.parentElement?.closest('script, style, svg, textarea')) replaceSymbols(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    decorateToc(root);
    if (root.closest?.('script, style, svg, textarea')) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement?.closest('script, style, svg, textarea')) textNodes.push(node);
    }
    textNodes.forEach(replaceSymbols);
  }

  function start() {
    scan(document.body);
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') scan(record.target);
        else record.addedNodes.forEach(scan);
      }
    }).observe(document.body, { childList: true, characterData: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
