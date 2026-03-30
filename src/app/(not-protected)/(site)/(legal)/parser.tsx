import fs from 'node:fs/promises';

import Markdoc, { Config, Node } from '@markdoc/markdoc';
import { Route } from 'next';
import Link from 'next/link';
import React, { ReactNode } from 'react';

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
        <h2 id={String(children)} className="mt-12 mb-2 text-2xl font-bold">
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
    return <p className="mt-2 mb-5">{children}</p>;
  },
  Heading: Heading,
  Link: ({ href, children }) => {
    const isExternal = !href.startsWith('/');

    if (isExternal) {
      return (
        <a href={href} target="_blank" className="underline underline-offset-2">
          {children}
        </a>
      );
    }

    return (
      <Link href={href as Route} className="underline underline-offset-2">
        {children}
      </Link>
    );
  },
  List: ({ ordered, children }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return <Tag className={cn('mt-1 ml-2 list-inside', ordered ? 'list-decimal' : 'list-disc')}>{children}</Tag>;
  },
};

export default async function getMarkdownContent(filePath: string): Promise<ReactNode> {
  const source = await fs.readFile(filePath, 'utf-8');
  const ast: Node = Markdoc.parse(source);
  const content = Markdoc.transform(ast, config);
  return Markdoc.renderers.react(content, React, { components });
}
