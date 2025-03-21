import fs from 'node:fs/promises';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import Markdoc, { Config, Node } from '@markdoc/markdoc';

import { cn } from '@/shadcn/lib/utils';

type HeadingProps = {
  children: ReactNode;
  level: number;
};

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function Heading({ children, level }: HeadingProps) {
  const Tag = `h${level}` as HeadingTag;

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
    list: {
      render: 'List',
      attributes: {
        ordered: { type: Boolean },
      },
    },
  },
};

type Components = {
  Paragraph: React.FC<{ children: ReactNode }>;
  Heading: React.FC<HeadingProps>;
  Link: React.FC<{ href: string; children: ReactNode }>;
  List: React.FC<{ ordered: boolean; children: ReactNode }>;
};

const components: Components = {
  Paragraph: ({ children }) => {
    return <p className="mb-5 mt-2">{children}</p>;
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
  List: ({ ordered, children }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return <Tag className={cn('ml-2 mt-1 list-inside', ordered ? 'list-decimal' : 'list-disc')}>{children}</Tag>;
  },
};

export default async function getMarkdownContent(filePath: string): Promise<ReactNode> {
  const source = await fs.readFile(filePath, 'utf-8');
  const ast: Node = Markdoc.parse(source);
  const content = Markdoc.transform(ast, config);
  return Markdoc.renderers.react(content, React, { components });
}
