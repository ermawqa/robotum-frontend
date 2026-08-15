import { Fragment } from "react";

/**
 * Matches URLs (http/https or bare www.) and bare email addresses inside plain
 * text so they can be turned into real anchors.
 */
const TOKEN_REGEX =
  /((?:https?:\/\/|www\.)[^\s<>]+|[^\s<>@]+@[^\s<>@]+\.[a-z]{2,}[^\s<>]*)/gi;

const CLOSERS = { ")": "(", "]": "[", "}": "{" };

function count(str, char) {
  let total = 0;
  for (const c of str) if (c === char) total += 1;
  return total;
}

/**
 * Trailing punctuation usually belongs to the sentence, not the URL:
 * "see https://robotum.info." -> link is "https://robotum.info", "." is text.
 */
function splitTrailingPunctuation(token) {
  let url = token;
  let trailing = "";

  while (url.length > 0) {
    const last = url[url.length - 1];
    const isSentencePunctuation = ".,;:!?\"'".includes(last);
    const isUnbalancedCloser =
      last in CLOSERS && count(url, last) > count(url, CLOSERS[last]);

    if (!isSentencePunctuation && !isUnbalancedCloser) break;

    trailing = last + trailing;
    url = url.slice(0, -1);
  }

  return [url, trailing];
}

function toHref(token) {
  if (/^https?:\/\//i.test(token)) return token;
  if (/^www\./i.test(token)) return `https://${token}`;
  return `mailto:${token}`;
}

/**
 * Renders plain text with URLs and email addresses as clickable links.
 * Line breaks are preserved by the caller via `whitespace-pre-line`.
 */
export default function LinkifiedText({
  text,
  as: Tag = "span",
  className = "",
  linkClassName = "text-blue-400 underline underline-offset-2 decoration-blue-400/50 transition-colors hover:text-blue-300 hover:decoration-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm break-words",
}) {
  if (!text) return null;

  const parts = String(text).split(TOKEN_REGEX);

  return (
    <Tag className={className}>
      {parts.map((part, index) => {
        // Odd indices are the captured tokens; even indices are plain text.
        if (index % 2 === 0 || !part) return <Fragment key={index}>{part}</Fragment>;

        const [href, trailing] = splitTrailingPunctuation(part);
        if (!href) return <Fragment key={index}>{part}</Fragment>;

        const isEmail = !/^(https?:\/\/|www\.)/i.test(href);

        return (
          <Fragment key={index}>
            <a
              href={toHref(href)}
              className={linkClassName}
              {...(isEmail
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {href}
            </a>
            {trailing}
          </Fragment>
        );
      })}
    </Tag>
  );
}
