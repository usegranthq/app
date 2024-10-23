import fs from 'node:fs/promises';
import Markdoc, { Config, Node } from '@markdoc/markdoc';
import React, { ReactNode } from 'react';
import Link from 'next/link';

type HeadingProps = {
  children: ReactNode;
  level: number;
};

function Heading({ children, level }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  switch (level) {
    case 2:
      return (
        <h2 id={String(children)} className="mb-2 mt-12 text-2xl font-bold">
          {children}
        </h2>
      );
    default:
      return <Tag id={String(children)}>{children}</Tag>;
  }
}

const config: Config = {
  nodes: {
    paragraph: {
      render: 'Paragraph',
    },
    heading: {
      render: 'Heading',
      attributes: {
        level: { type: String },
      },
    },
    link: {
      render: 'Link',
      attributes: {
        href: { type: String },
      },
    },
  },
};

type Components = {
  Paragraph: React.FC<{ children: ReactNode }>;
  Heading: React.FC<HeadingProps>;
  Link: React.FC<{ href: string; children: ReactNode }>;
};

const components: Components = {
  Paragraph: ({ children }) => {
    return <p className="my-2 first:mb-2">{children}</p>;
  },
  Heading: Heading,
  Link: ({ href, children }) => {
    const target = href.startsWith('http') ? '_blank' : undefined;
    return (
      <Link href={href} target={target} className="underline underline-offset-2">
        {children}
      </Link>
    );
  },
};

export default async function getMarkdownContent(filePath: string): Promise<ReactNode> {
  const source = await fs.readFile(filePath, 'utf-8');
  const ast: Node = Markdoc.parse(source);
  const content = Markdoc.transform(ast, config);
  return Markdoc.renderers.react(content, React, { components });
}
