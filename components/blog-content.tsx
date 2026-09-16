import { Fragment } from "react";

type Token = { type: "text"; value: string } | { type: "bold"; value: string } | { type: "code"; value: string };

function tokenizeInline(text: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;

  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type: "text", value: text.slice(last, m.index) });
    const seg = m[0];
    if (seg[0] === "`") tokens.push({ type: "code", value: seg.slice(1, -1) });
    else tokens.push({ type: "bold", value: seg.slice(2, -2) });
    last = m.index + seg.length;
  }
  if (last < text.length) tokens.push({ type: "text", value: text.slice(last) });
  return tokens;
}

function renderInline(text: string) {
  return tokenizeInline(text).map((t, i) => {
    if (t.type === "code")
      return (
        <code
          key={i}
          className="rounded-md bg-foreground/5 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/10"
        >
          {t.value}
        </code>
      );
    if (t.type === "bold")
      return (
        <strong key={i} className="font-semibold">
          {t.value}
        </strong>
      );
    return <Fragment key={i}>{t.value}</Fragment>;
  });
}

export default function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="mt-8 space-y-6 text-[1.05rem] leading-relaxed">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");

        if (lines.every((l) => l.startsWith("> "))) {
          return (
            <blockquote
              key={bi}
              className="border-l-4 border-indigo-500/60 pl-5 text-[0.95em] italic text-muted"
            >
              {lines.map((l, li) => (
                <p key={li} className="mt-2 first:mt-0">
                  {renderInline(l.replace(/^>\s?/, ""))}
                </p>
              ))}
            </blockquote>
          );
        }

        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={bi} className="list-decimal space-y-2 pl-6">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^\d+\.\s/, ""))}</li>
              ))}
            </ol>
          );
        }

        if (lines.every((l) => /^[-*]\s/.test(l))) {
          return (
            <ul key={bi} className="list-disc space-y-2 pl-6">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^[-*]\s/, ""))}</li>
              ))}
            </ul>
          );
        }

        if (/^### /.test(block)) {
          return (
            <h3 key={bi} className="text-2xl font-bold tracking-tight">
              {renderInline(block.replace(/^###\s/, ""))}
            </h3>
          );
        }

        if (/^##?\s/.test(block)) {
          return (
            <h2 key={bi} className="text-3xl font-bold tracking-tight">
              {renderInline(block.replace(/^##?\s/, ""))}
            </h2>
          );
        }

        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}