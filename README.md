# UseGrant

> Effortless and dynmaic client credentials grant implementation.

## Prerequisites

- [Node.js](https://nodejs.org/en)
- [Docker](https://www.docker.com/products/docker-desktop/)

## Getting Started

First, copy the `.env.example` file to `.env` and set the correct values:

Then, start the db server:

```bash
make db
```

and then start the app:

```bash
make dev
```

Open [http://localhost:7500](http://localhost:7500) in your browser to see the result. If you have specific port settings, you can override them by setting the `PORT` environment variable.

## Tooling docs

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This project is automatically deployed to Vercel on every push to the `master` branch.
