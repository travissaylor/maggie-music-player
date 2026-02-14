# PRD: Maggie Music Player

## Introduction

A single-page Next.js app that serves as a personal music player for a song made for the user's girlfriend. The app displays album art, song metadata, and playback controls with a clean, minimalist, light-and-airy UI. It includes Open Graph meta tags so the link previews nicely when shared via iMessage, social media, etc.

## Goals

- Deliver a polished, single-purpose music player that plays one song
- Provide a clean, minimalist UI with a light theme and subtle color accents
- Ensure rich link previews via Open Graph, Twitter Card, and standard meta tags
- Support core playback: play, pause, and seek (scrub to position)
- Deploy easily on Vercel with no external dependencies

## User Stories

### ✅ US-001: Audio Playback
**Description:** As a visitor, I want to play and pause the song so I can listen to it.

**Acceptance Criteria:**
- [x] Single play/pause button toggles playback
- [x] Button visually reflects current state (play icon when paused, pause icon when playing)
- [x] Audio plays from `public/love-figured-us-out.mp3`
- [x] Typecheck passes
- [x] Verify in browser using dev-browser skill

### US-002: Seek / Progress Bar
**Description:** As a visitor, I want to see playback progress and scrub to any position in the song.

**Acceptance Criteria:**
- [ ] Progress bar shows current position relative to total duration
- [ ] Clicking/dragging on the progress bar seeks to that position
- [ ] Current time and total duration displayed as `m:ss` format
- [ ] Progress bar updates smoothly during playback
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Song Metadata Display
**Description:** As a visitor, I want to see the song title, artist, and album art so I know what I'm listening to.

**Acceptance Criteria:**
- [ ] Album art displayed prominently (centered, responsive sizing)
- [ ] Song title displayed below the album art
- [ ] Artist name displayed below the title
- [ ] Metadata is configurable via constants (easy to update without code changes)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Open Graph & Meta Tags
**Description:** As the creator, I want rich link previews when the URL is shared so it looks polished in iMessage, Twitter, Facebook, etc.

**Acceptance Criteria:**
- [ ] `og:title` set to song title
- [ ] `og:description` set to a short description (e.g., artist + song name)
- [ ] `og:image` set to the album art image
- [ ] `og:type` set to `music.song`
- [ ] `twitter:card` set to `summary_large_image`
- [ ] Standard `<title>` and `<meta name="description">` tags set
- [ ] Typecheck passes

### US-005: Responsive & Minimalist UI
**Description:** As a visitor on any device, I want the player to look clean and work well on mobile and desktop.

**Acceptance Criteria:**
- [ ] Light background with subtle color accent (soft pastel or muted tone)
- [ ] Player is centered on the page, card-style layout
- [ ] Fully responsive — works on mobile screens (375px+) and desktop
- [ ] Minimal UI: no unnecessary chrome, borders, or clutter
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: The app must play `public/love-figured-us-out.mp3`
- FR-2: A play/pause button must toggle audio playback
- FR-3: A seek bar must show current progress and allow clicking/dragging to seek
- FR-4: Current time and total duration must be displayed in `m:ss` format
- FR-5: Album art must be displayed as a responsive image
- FR-6: Song title and artist name must be displayed
- FR-7: Next.js `metadata` export must include Open Graph, Twitter Card, and standard meta tags
- FR-8: `public/album-art.jpeg` must be used as the `og:image`
- FR-9: The UI must be centered, card-based, and responsive (mobile-first)

## Non-Goals

- No playlist or multi-track support
- No volume control
- No backend API or database
- No user authentication
- No lyrics display
- No animated backgrounds or visualizations
- No download button

## Design Considerations

- **Layout:** Centered card on a light background. Album art on top, metadata below, controls at the bottom.
- **Color:** Light/white background with one subtle accent color (e.g., soft blue, lavender, or rose) used for the progress bar fill and play button.
- **Typography:** Use the already-configured Geist Sans font for a clean, modern look.
- **Icons:** Use simple SVG icons for play/pause — no icon library needed for just two icons.
- **Spacing:** Generous whitespace for a breathable, minimalist feel.

## Technical Considerations

- **Framework:** Next.js 16 with App Router (already set up)
- **Styling:** Tailwind CSS v4 (already configured)
- **Audio:** Use the native HTML `<audio>` element controlled via React refs and state
- **Metadata:** Use Next.js App Router `metadata` export in `layout.tsx` or `page.tsx`
- **Assets:** Song file and album art placed in `public/` directory
- **Deployment:** Vercel (zero-config for Next.js)
- **No additional dependencies required** — built entirely with React, Next.js, and Tailwind

## Success Metrics

- Song plays successfully on mobile and desktop browsers
- Link preview shows album art, title, and description when shared
- Page loads in under 2 seconds on a standard connection
- UI renders correctly on screens 375px and wider

## Assets

- **Album art:** `public/album-art.jpeg`
- **Song file:** `public/love-figured-us-out.mp3`

## Open Questions

- What is the song title and artist name to use for metadata?
- What accent color is preferred? (can be adjusted after initial build)
