# CampusConnect

CampusConnect is a modern campus lost-and-found platform built with React and Vite. It helps students report lost or found items, search the campus community feed, and quickly surface likely matches between missing belongings and recovered items.

The app is designed as a front-end prototype that stores all submitted reports locally in the browser using `localStorage`, making it easy to run, demo, and extend without setting up a backend.

## Overview

CampusConnect gives students a simple, friendly way to:

- Report a lost item with a category, description, and location
- Report a found item and attach an image if needed
- Search submitted reports by keyword, item type, and category
- View matching suggestions between lost and found entries
- Mark items as returned and remove outdated records
- Keep data available in the browser between sessions

This project is intentionally lightweight and suitable for campus hackathons, prototypes, demos, and early-stage product validation.

## Features

### 1. Report lost and found items
Users can submit a new report with:

- Item name
- Report type (Lost or Found)
- Category
- Campus location
- Description
- Optional photo upload
- Date of report

The form validates required fields and shows a success message upon submission.

### 2. Smart item matching
Each item is compared against other records using:

- Shared keywords
- Category similarity
- Location similarity

The matching algorithm calculates a score and shows up to two likely matches for each item card. This helps users quickly identify potential reunions between lost and found reports.

### 3. Advanced search and filtering
The search panel supports:

- Free-text search over name, location, category, and description
- Type filter for All, Lost, Found, and Returned items
- Category filter to narrow the results by item type

### 4. Report statistics dashboard
The app displays summary cards for:

- Total reports
- Lost items
- Found items
- Returned items

### 5. Browser persistence
Reports are saved in `localStorage` so the data persists while the user stays in the browser without requiring a database or API.

### 6. Photo upload support
Users can upload an image file for a report, with a 5 MB size limit. The preview is shown before submission.

### 7. Responsive campus UI
The design is responsive and works well across desktop and mobile layouts, with clean sections for hero content, forms, stats, card lists, and footer.

## Tech Stack

- React 19
- Vite 8
- JavaScript (ES modules)
- CSS for styling
- Browser `localStorage` for persistence

## Project Structure

```text
campusconnect/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── assets/
│       ├── hero.png
│       ├── react.svg
│       └── vite.svg
└── README.md
```

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js (preferably v18 or newer)
- npm or another package manager compatible with the project

### Installation

From the project directory:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

This starts the Vite dev server. By default, it is usually available at:

```text
http://localhost:5173
```

If you want to expose it on a different host or network interface:

```bash
npm run dev -- --host
```

### Production build

```bash
npm run build
```

This generates a production-ready build in the `dist` folder.

### Preview the production build

```bash
npm run preview
```

This serves the built application locally for previewing the optimized bundle.

### Linting

```bash
npm run lint
```

The project uses `oxlint` for code linting.

## How the App Works

### Form submission
A user fills out the report form and clicks Submit Report. The app creates a new item object and prepends it to the current item list.

### Data model
Each item contains:

- `id`
- `name`
- `type`
- `category`
- `location`
- `description`
- `image`
- `date`

### Matching logic
The app evaluates potential matches between a given item and all other active items. It ignores:

- The same item
- Items of the same report type
- Returned items

It then checks shared words along with category and location matches to compute a percentage score. The top matches are displayed on the card.

### Return flow
Users can click "Mark Returned" to update a lost or found item as returned. Once marked returned, the item is excluded from further matching logic and is visually marked as returned.

### Delete flow
Users can delete reports after confirmation. This removes the item from the feed immediately.

## Local Storage Behavior

The app stores items in browser local storage under the key:

```text
campusconnect-items
```

This means:

- Items remain after refresh
- Data is tied to the browser/device where it was created
- Clearing browser storage removes the saved reports
- There is no server-side database or multi-user sync yet

## UI Sections

### Navigation
A sticky top navbar provides quick links to:

- Home
- Report Item
- Find Items
- Recent Reports

### Hero section
The landing area contains the main value proposition for the app and calls users to action.

### Statistics section
Summary cards show totals for active reporting activity.

### Report form
The form collects structured information for new lost or found records.

### Search section
The search area contains input and filter controls to refine results quickly.

### Reports grid
Each item is shown as a card that includes:

- image or placeholder
- status badge
- date
- item title
- description
- location
- category
- match suggestions
- return and delete actions

### Footer
The footer adds a final branded closing message for the product.

## Development Notes

### Styling approach
The project uses custom CSS in `src/App.css` with a modern green-themed visual identity and responsive design patterns.

### App state and logic
Core app logic is contained in `src/App.jsx`, including:

- state management
- report creation
- search/filter logic
- item matching
- return handling
- deletion
- localStorage synchronization

### Extending the app
Potential enhancements for a production-ready version include:

- Real backend and database integration
- User authentication
- Admin moderation
- Search indexing
- Geographic filtering
- Cloud image hosting
- Notifications and email/SMS updates
- API-based match recommendations
- Export and analytics dashboards

## Example Use Cases

CampusConnect is useful for:

- Universities managing lost-and-found desks
- Student communities sharing found items
- Orientation programs and campus logistics teams
- Prototypes for digital campus services

## License

This project does not currently declare a license in `package.json` or project files. If you plan to distribute or publish it, add an appropriate open-source license before release.

## Contributing

If you want to contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Validate the app with the project scripts
5. Open a pull request with a clear summary

## Summary

CampusConnect is a polished front-end lost-and-found app for college campuses. It offers an easy report flow, intelligent matching, filtering, and a clean responsive interface, while remaining easy to run locally with Vite and React.

It is a strong starting point for a real campus service and can be extended into a full-stack application with persistence, user accounts, moderation, and richer matching capabilities.
