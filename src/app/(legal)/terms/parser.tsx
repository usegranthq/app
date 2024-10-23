import fs from 'node:fs/promises';
import Markdoc, { Config } from '@markdoc/markdoc';
import React from 'react';

type HeadingProps = {
  children: any;
  level: number;
};
function Heading({ children, level }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  switch (level) {
    case 2:
      return (
        <h2 id={children} className="mb-2 mt-12 text-2xl font-bold">
          {children}
        </h2>
      );
    default:
      return <Tag id={children}>{children}</Tag>;
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
  },
};

const components = {
  Paragraph: ({ children }: any) => {
    return <p className="my-2 first:mb-2">{children}</p>;
  },
  Heading: Heading,
};

export default async function getMarkdownContent(filePath: string): Promise<any> {
  const source = await fs.readFile(filePath, 'utf-8');
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast, config);
  return Markdoc.renderers.react(content, React, { components });
}
