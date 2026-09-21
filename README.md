# MediaFlow

MediaFlow is a browser-based media organizer for photos and videos. It helps users select files, review metadata, group them by date, detect duplicates, and export an organized ZIP structure while keeping the workflow primarily client-side.

## Features

- Multi-file photo and video selection
- Metadata review and extraction for file type, size, date, time, dimensions, and duration
- Duplicate detection and cleanup
- Bulk metadata editing
- Date-based grouping and folder organization
- Approval-style review before export
- Structured ZIP export with JSZip
- Client-side processing with privacy-first behavior

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- JSZip

## Architecture

The project keeps the UI layer separate from the media-processing logic. Core date parsing, file-type detection, and grouping are centralized in utility functions so the app remains maintainable as more media features are added.

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Testing

Run the unit tests once:

```bash
npm test
```

Run Vitest in watch mode while developing:

```bash
npm run test:watch
```

The suite covers byte formatting, folder naming, media type detection, display-date fallbacks, duplicate detection, date grouping, gallery interactions, detail rendering, grouped-media states, bulk controls, shared components, search filtering, and deletion workflows. Browser-only behavior such as the native file picker and ZIP download should be covered with an end-to-end browser runner when those workflows become part of CI.

## How It Works

1. User selects photos or videos from the browser.
2. Files are validated and assigned a media type.
3. Creation date and basic metadata are derived from the file and fallback values.
4. Media is grouped by date for review.
5. User can bulk edit metadata, remove duplicates, or delete selected items.
6. Organized media is exported as a ZIP archive.

## Privacy

Files remain in the browser during processing and are never uploaded to a remote server unless a user intentionally adds that functionality. Object URLs are cleaned up when no longer needed.

## Future Improvements

- real EXIF parsing for photos
- stronger duplicate detection with content hashing
- drag-and-drop upload area
- local persistence via IndexedDB
- improved preview cards and file-status badges
- real cloud sync integration
