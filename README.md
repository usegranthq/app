# UseGrant

> Effortless and dynmaic client credentials grant implementation.

## Prerequisites

- [mise](https://mise.jdx.dev)
- [Node.js](https://nodejs.org/en)
- [Docker](https://www.docker.com/products/docker-desktop)

## Getting Started

Install mise

```bash
brew install mise
```

Run the setup

```bash
mise run setup
```

Then, copy the `.env.example` file to `.env.development` and set the correct values:

Then, start the db server:

```bash
mise run db
```

this will run a
[local postgres prisma dev server](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#dev).
Also copy the connection urls provided to the `.env.development` file.

and then start the app:

```bash
mise run dev
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

```bash
# run smee client
smee -u https://smee.io/YOUR_CHANNEL_ID --target http://localhost:7500/api/webhooks/polar
```

Replace `YOUR_CHANNEL_ID` with your actual Smee channel ID.

## Deployment

This project is automatically deployed to a VPS on Hetzner on every push to the `master` branch.
Refer the [github actions](./.github/workflows/deploy.yml) for more details.

## Others

To find unused items in the codebase, run [knip](https://knip.dev)

```bash
knip
```

## Docker Rootless Mode

Follow the instructions here https://docs.docker.com/engine/security/rootless/ to setup docker
rootless mode

```bash
export PATH=/usr/bin:$PATH
export DOCKER_HOST=unix:///run/user/1000/docker.sock
```

Make sure the above environment variables are at the top of the `~/.bashrc` file so SSH works via
remote host
