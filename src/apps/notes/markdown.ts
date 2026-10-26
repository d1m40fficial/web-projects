import { escapeHtml } from '../../core/dom';

const safeUrl = (raw: string): string => {
  const url = raw.trim();
  if (/^(https?:\/\/|mailto:|#|\/|\.\/)/i.test(url)) return url;
  return '#';
};

function inline(source: string): string {
  const codes: string[] = [];
  let text = source.replace(/`([^`\n]+)`/g, (_match, code: string) => {
    const index = codes.length;
    codes.push(`<code>${code}</code>`);
    return `\u0000C${index}\u0000`;
  });

  text = text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, url: string) => {
      const safe = safeUrl(url);
      return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>');

  text = text.replace(/\u0000C(\d+)\u0000/g, (_match, index: string) => codes[Number(index)] ?? '');
  return text;
}

/** A deliberately small, safe Markdown subset. HTML in the source is escaped. */
export function renderMarkdown(source: string): string {
  const codeBlocks: string[] = [];
  let text = source.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_match, _lang: string, code: string) => {
    const index = codeBlocks.length;
    codeBlocks.push(`<pre class="md-pre"><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`);
    return `\u0000B${index}\u0000`;
  });

  text = escapeHtml(text);

  const lines = text.split(/\r?\n/);
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: 'ul' | 'ol' | null = null;
  let quote: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inline(paragraph.join('\n')).replace(/\n/g, '<br>')}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!list) return;
    html.push(`</${list}>`);
    list = null;
  };
  const flushQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote>${inline(quote.join('\n')).replace(/\n/g, '<br>')}</blockquote>`);
    quote = [];
  };

  for (const line of lines) {
    const blockMatch = line.match(/^\u0000B(\d+)\u0000$/);
    if (blockMatch) {
      flushParagraph();
      closeList();
      flushQuote();
      html.push(codeBlocks[Number(blockMatch[1])] ?? '');
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      flushQuote();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      flushQuote();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      flushParagraph();
      closeList();
      flushQuote();
      html.push('<hr />');
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      closeList();
      quote.push(line.replace(/^>\s?/, ''));
      continue;
    }
    flushQuote();

    const task = line.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (task) {
      flushParagraph();
      if (list !== 'ul') {
        closeList();
        html.push('<ul class="md-tasks">');
        list = 'ul';
      }
      const checked = task[1].toLowerCase() === 'x';
      html.push(
        `<li class="md-task ${checked ? 'is-done' : ''}"><input type="checkbox" disabled ${checked ? 'checked' : ''} /><span>${inline(task[2])}</span></li>`,
      );
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (list !== 'ul') {
        closeList();
        html.push('<ul>');
        list = 'ul';
      }
      html.push(`<li>${inline(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (list !== 'ol') {
        closeList();
        html.push('<ol>');
        list = 'ol';
      }
      html.push(`<li>${inline(ordered[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line);
  }

  flushParagraph();
  closeList();
  flushQuote();

  return html.join('\n');
}
