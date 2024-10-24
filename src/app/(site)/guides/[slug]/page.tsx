import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { Metadata } from 'next';
import yaml from 'js-yaml';

const contentDir = path.join(process.cwd(), 'src/resources/guides');

const readFile = async (file: string) => await fs.readFile(path.join(contentDir, file), 'utf-8');
const getFiles = async () => await fs.readdir(contentDir);
const getSlug = (file: string) => file.split('.')[0];

export async function generateStaticParams() {
  const files = await getFiles();

  return files.map((file) => ({
    slug: getSlug(file),
  }));
}

const getFrontmatter = (source: string) => {
  const ast = Markdoc.parse(source);
  return ast.attributes.frontmatter ? (yaml.load(ast.attributes.frontmatter) as Record<string, string>) : {};
};

interface GuideDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: GuideDetailProps): Promise<Metadata> {
  const { slug } = await props.params;
  const source = await readFile(`${slug}.md`);
  const frontmatter = getFrontmatter(source);

  return {
    title: frontmatter.title || 'useGrant.dev',
    description: frontmatter.description || 'Effortlessly setup your machine to machine authentication',
  };
}

export default async function Page(props: GuideDetailProps) {
  const { slug } = await props.params;
  const files = await getFiles();
  const slugs = files.map(getSlug);

  if (!slugs.includes(slug)) {
    notFound();
  }

  const source = await readFile(`${slug}.md`);
  const ast = Markdoc.parse(source);
  const frontmatter = getFrontmatter(source);

  const content = Markdoc.transform(ast, {
    variables: {
      markdoc: {
        frontmatter,
      },
    },
  });

  return <div className="prose dark:prose-invert">{Markdoc.renderers.react(content, React, {})}</div>;
}
