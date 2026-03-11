/**
 * parseGameHtml — converts a sanitized game-server HTML string to Preact VNodes.
 *
 * Game messages may contain simple inline formatting: <b>, <i>, <em>, <strong>,
 * <u>, <s>, <br>, <span style="color:…">, <a href="https://…">, and block
 * elements <p>, <div>, <ul>, <ol>, <li>.
 *
 * This avoids dangerouslySetInnerHTML by parsing via a temporary DOM element
 * (browser's built-in HTML parser) and converting the resulting DOM tree into
 * Preact VNodes. sanitizeGameHtml() is applied first to strip any unsafe
 * attributes or elements.
 */
import { type ComponentChild } from 'preact';
import { sanitizeGameHtml } from './safeHtml';

export function parseGameHtml(html: string): ComponentChild[] {
  if (!html) return [];
  const tmp = document.createElement('div');
  tmp.innerHTML = sanitizeGameHtml(html);
  return nodeListToVNodes(tmp.childNodes);
}

function nodeListToVNodes(nodes: NodeList): ComponentChild[] {
  const result: ComponentChild[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) result.push(text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result.push(elementToVNode(node as Element));
    }
  }
  return result;
}

function elementToVNode(el: Element): ComponentChild {
  const tag = el.tagName.toLowerCase();
  const children = nodeListToVNodes(el.childNodes);

  switch (tag) {
    case 'br':   return <br />;
    case 'b':
    case 'strong': return <strong>{children}</strong>;
    case 'i':
    case 'em':   return <em>{children}</em>;
    case 'u':    return <u>{children}</u>;
    case 's':
    case 'strike': return <s>{children}</s>;
    case 'span': {
      const style = el.getAttribute('style');
      return style ? <span style={style}>{children}</span> : <span>{children}</span>;
    }
    case 'font': {
      // <font color="#RRGGBB"> used in Freeciv server chat messages → <span style="color:...">
      const color = el.getAttribute('color');
      return color ? <span style={`color:${color}`}>{children}</span> : <span>{children}</span>;
    }
    case 'a': {
      const href = el.getAttribute('href') ?? '';
      if (/^https?:\/\//i.test(href)) {
        return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
      }
      // Non-http links (sanitized to '#' or empty) — render children only
      return <>{children}</>;
    }
    case 'p':    return <p>{children}</p>;
    case 'div':  return <div>{children}</div>;
    case 'ul':   return <ul>{children}</ul>;
    case 'ol':   return <ol>{children}</ol>;
    case 'li':   return <li>{children}</li>;
    default:     return <>{children}</>;
  }
}
