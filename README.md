# UseGrant

> Effortless and dynmaic client credentials grant implementation.

## Prerequisites

- [Node.js](https://nodejs.org/en)
- [Docker](https://www.docker.com/products/docker-desktop/)

## Getting Started

First, copy the `.env.example` file to `.env.development` and set the correct values:

Then, start the db server:

```bash
npm run db
```

this will run a
[local postgres prisma dev server](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#dev).
Also copy the connection urls provided to the `.env.development` file.

and then start the app:

```bash
npm run dev
```

Open [http://localhost:7500](http://localhost:7500) in your browser to see the result. If you have
specific port settings, you can override them by setting the `PORT` environment variable.

## Tooling docs

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Testing webhooks

To test webhooks locally, you can use [smee.io](https://smee.io) to forward webhook events from
external services to your local development server.

Install and start smee client globally if you haven't already:

```bash
# install
npm install -g smee-client

# run smee client
smee -u https://smee.io/YOUR_CHANNEL_ID --target http://localhost:7500/api/webhooks/polar
```

Replace `YOUR_CHANNEL_ID` with your actual Smee channel ID.

## Deployment

This project is automatically deployed to a VPS on Hetzner on every push to the `master` branch.
Refer the [github actions](./.github/workflows/deploy.yml) for more details.
