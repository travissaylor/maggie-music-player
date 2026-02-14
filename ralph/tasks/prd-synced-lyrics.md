# PRD: Synced Lyrics Display

## Introduction

Add a synced lyrics feature to the music player that displays timestamped lyrics synchronized with audio playback. Users can toggle a scrolling lyrics panel that highlights the current line as the song plays, providing a karaoke-like follow-along experience. Lyrics are sourced from standard LRC files stored alongside the audio in `/public`.

## Goals

- Display lyrics synchronized to the current playback position
- Provide a smooth scrolling experience with the current line visually highlighted
- Allow users to toggle lyrics visibility on/off via a button near playback controls
- Use the standard LRC file format for easy authoring and replacement
- Maintain the clean, minimal aesthetic of the existing player UI

## User Stories

### ✅ US-001: Add LRC file path to song constants
**Description:** As a developer, I want to reference the LRC file path in the song configuration so that the player knows where to load lyrics from.

**Acceptance Criteria:**
- [x] Add `lyricsSrc` field to `SONG` constant in `constants.ts` (e.g., `"/love-figured-us-out.lrc"`)
- [x] Place the corresponding `.lrc` file in `/public`
- [x] Typecheck passes

### ✅ US-002: Parse LRC file into timestamped lyrics
**Description:** As a developer, I need to fetch and parse the LRC file into a structured array of `{ time: number, text: string }` entries so the UI can look up the current line by playback time.

**Acceptance Criteria:**
- [x] Fetch the LRC file from the public URL on component mount
- [x] Parse each line matching the `[mm:ss.xx] text` format into `{ time, text }` objects
- [x] Sort parsed entries by timestamp ascending
- [x] Ignore metadata tags (`[ti:`, `[ar:`, `[al:`, etc.) and blank lines
- [x] Store parsed lyrics in React state
- [x] Handle fetch errors gracefully (don't break the player if LRC is missing)
- [x] Typecheck passes

### ✅ US-003: Add lyrics toggle button
**Description:** As a user, I want a button near the play controls to show or hide the lyrics panel so I can choose whether to see lyrics.

**Acceptance Criteria:**
- [x] Add a small icon button (lyrics/text icon) near the play/pause button
- [x] Button toggles a `showLyrics` boolean state
- [x] Button has a visual active/inactive state so the user knows if lyrics are on
- [x] Button has an accessible `aria-label` ("Show lyrics" / "Hide lyrics")
- [x] Lyrics panel is hidden by default
- [x] Typecheck passes

### ✅ US-004: Display scrolling lyrics panel below controls
**Description:** As a user, I want to see the song lyrics in a scrollable panel below the player controls so I can follow along while listening.

**Acceptance Criteria:**
- [x] Lyrics panel appears below the progress bar / time display when toggled on
- [x] Panel has a fixed max-height with vertical scrolling
- [x] Each lyric line is rendered as a separate element
- [x] Panel matches the existing player card styling (font, colors, spacing)
- [x] Panel animates in/out smoothly when toggled
- [x] Typecheck passes

### US-005: Highlight and auto-scroll to current lyric line
**Description:** As a user, I want the currently playing lyric line to be highlighted and automatically scrolled into view so I can easily follow along with the song.

**Acceptance Criteria:**
- [ ] Determine the current lyric line by comparing `currentTime` to lyrics timestamps
- [ ] Current line is visually highlighted (e.g., bolder text, rose accent color, larger size)
- [ ] Non-current lines are dimmed/muted
- [ ] Panel auto-scrolls smoothly to keep the current line centered/visible
- [ ] Scrolling updates in real-time as the song plays
- [ ] If the user seeks to a new position, the highlighted line updates immediately
- [ ] Typecheck passes

## Functional Requirements

- FR-1: Add `lyricsSrc` string field to the `SONG` constant in `constants.ts`
- FR-2: Fetch and parse LRC files using the standard `[mm:ss.xx] text` format
- FR-3: Determine the active lyric line by finding the last timestamp ≤ `currentTime`
- FR-4: Render a lyrics panel below the player controls showing all parsed lines
- FR-5: Highlight the active lyric line with distinct styling (rose color, bold/larger text)
- FR-6: Dim non-active lyric lines with reduced opacity or lighter color
- FR-7: Auto-scroll the lyrics panel to keep the active line centered using `scrollIntoView` with smooth behavior
- FR-8: Provide a toggle button near the play/pause button to show/hide the lyrics panel
- FR-9: Lyrics panel should have a max-height (~200-250px) and overflow-y scroll
- FR-10: Gracefully handle missing or malformed LRC files without affecting playback

## Non-Goals

- No manual lyrics editing or user-submitted lyrics
- No word-by-word karaoke highlighting (line-level sync only)
- No lyrics search or fetching from external APIs
- No support for multiple languages or translations
- No click-on-lyric-to-seek functionality (may be added later)

## Design Considerations

- Keep styling consistent with existing rose accent color and minimal aesthetic
- Toggle button should use a simple text/lyrics SVG icon, sized similarly to the play button but smaller (~32-40px)
- Current line styling: rose-colored text (`text-rose-500`), slightly larger or bolder
- Non-current lines: muted gray (`text-zinc-400`), normal weight
- Smooth scroll behavior for auto-scrolling to active line
- Panel should have subtle top/bottom fade edges (CSS mask or gradient) to indicate scrollability

## Technical Considerations

- **LRC format:** Standard `[mm:ss.xx]` timestamps. Example: `[01:23.45] These are the lyrics`
- **Parsing:** Simple regex match on each line: `/\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/`
- **Current line lookup:** Binary search or simple linear scan through sorted timestamps to find the last entry where `time <= currentTime`
- **Auto-scroll:** Use `ref.scrollIntoView({ behavior: 'smooth', block: 'center' })` on the active line element
- **State:** Add to existing component: `showLyrics` (boolean), `lyrics` (parsed array), `currentLyricIndex` (number)
- **Performance:** Lyrics lookup runs on every `timeupdate` event — keep it lightweight (simple comparison, not re-parsing)
- **All logic goes in `app/page.tsx`** to match existing single-component architecture

## Success Metrics

- Lyrics stay in sync with audio playback (correct line highlighted within ~200ms)
- Toggle button shows/hides lyrics panel without affecting playback
- Auto-scroll keeps current line visible without user intervention
- No performance degradation during playback
- Player remains functional if LRC file is missing or malformed

## Open Questions

- Should clicking a lyric line seek to that timestamp? (Deferred as non-goal for now)
- Should the lyrics panel remember its visibility state across page reloads?
