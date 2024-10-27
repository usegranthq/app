import { codeToHtml } from 'shiki';

interface CodeblockProps {
  code: string;
}

export default async function Codeblock({ code }: CodeblockProps) {
  const out = await codeToHtml(code.trim(), {
    lang: 'ts',
    theme: 'plastic',
    transformers: [
      {
        pre(node) {
          this.addClassToHast(node, 'p-3 max-sm:overflow-x-auto');
          return node;
        },
      },
    ],
  });

  return (
    <div
      dangerouslySetInnerHTML={{ __html: out }}
      className="overflow-hidden rounded-xl border border-border text-sm shadow-md"
    />
  );
}
