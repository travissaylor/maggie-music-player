# Maggie Music Player

A single-page music player built with Next.js for playing a custom love song. Features a minimalist UI with a rose accent, album art display, and rich link previews for sharing.

## Features

- Play/pause audio with interactive seek bar
- Song metadata display with album art, title, and artist
- Open Graph and Twitter Card meta tags for rich link previews
- Responsive, minimalist design (mobile-friendly at 375px+)

## Tech Stack

- Next.js 16 with App Router
- React 19, TypeScript
- Tailwind CSS 4

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the player.

## Customization

To use a different song, update the metadata in `app/constants.ts` and replace the files in `public/`:

- `public/love-figured-us-out.mp3` — audio file
- `public/album-art.jpeg` — album artwork

## Deployment

```bash
pnpm build
```

Deploy the production build to [Vercel](https://vercel.com) or any platform that supports Next.js.
