# 사정원안 생성기 (Student Attendance Excel Processing Application)

## Overview

This is a web-based application that processes student attendance data from the Korean NEIS (National Education Information System) and generates "사정원안" (attendance assessment documents) as Excel files. The application replaces existing Python desktop scripts with a modern web interface, allowing teachers to paste attendance data and receive formatted Excel documents for 1st-2nd grade or 3rd grade students.

The core functionality involves:
- Parsing tab-separated attendance data pasted from NEIS
- Processing attendance records to identify students qualifying for perfect attendance (개근) or good attendance (정근) awards
- Generating formatted Excel documents matching the official 사정원안 template format

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for Korean educational context
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints under /api prefix
- **Excel Generation**: ExcelJS library for creating formatted .xlsx files server-side

### Data Flow Pattern
1. User pastes NEIS attendance data into the frontend textarea
2. Client-side parsing converts tab-separated data into structured StudentData objects
3. Processing logic determines attendance award eligibility (1-year/3-year perfect/good attendance)
4. Results sent to POST /api/generate-excel endpoint
5. Server generates formatted Excel workbook and returns as downloadable file

### Key Design Decisions

**Client-side data parsing**: Attendance data is parsed in the browser rather than on the server because:
- Reduces server load for simple text processing
- Provides immediate feedback to users
- No sensitive data storage required

**ExcelJS for server-side generation**: Chosen over client-side alternatives to:
- Handle complex Excel formatting (merged cells, borders, fonts)
- Match exact column widths and row heights from original Python implementation
- Support Korean fonts and character encoding

**Single-page application**: The app uses a simple SPA structure with one main route because:
- Single-purpose utility tool with linear workflow
- No authentication or persistent user sessions needed
- Simpler deployment and maintenance

### File Structure
```
client/src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── GradeSelector   # Radio buttons for 1-2학년/3학년
│   ├── PasteArea       # Textarea for NEIS data input
│   ├── ExcelGrid       # Grid preview of pasted data
│   ├── DataPreviewTable # Parsed student data table
│   └── SajungwonanPreview # Document preview component
├── pages/              # Route pages (home, not-found)
├── hooks/              # Custom React hooks
└── lib/                # Utilities (queryClient, utils)

server/
├── index.ts            # Express app setup
├── routes.ts           # API route handlers
├── static.ts           # Static file serving
└── vite.ts             # Vite dev server integration

shared/
└── schema.ts           # Drizzle ORM schema definitions
```

## External Dependencies

### Database
- **PostgreSQL**: Database configured via Drizzle ORM
- **Drizzle Kit**: Schema migrations via `db:push` command
- Schema currently defines basic users table (minimal usage in current feature set)

### Key NPM Packages
- **ExcelJS**: Excel file generation with formatting support
- **TanStack React Query**: Data fetching and caching
- **Radix UI**: Accessible component primitives (dialog, radio-group, toast, etc.)
- **Tailwind CSS**: Utility-first styling
- **Wouter**: Client-side routing
- **Zod**: Schema validation (with drizzle-zod integration)

### Development Tools
- **Vite**: Frontend build and dev server
- **tsx**: TypeScript execution for server
- **esbuild**: Production server bundling
- **Replit plugins**: Runtime error overlay, cartographer, dev banner

### Fonts
- **Inter**: Primary UI font
- **Roboto Mono**: Monospace font for data display
- **Dotum/Malgun Gothic**: Korean fonts for Excel output matching official document style