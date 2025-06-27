# Aampere EV Platform

A Next.js-based vehicle marketplace with listings, search, filtering, and adding features.

## Features
- Browse EV listings with search/filter capabilities
- View detailed vehicle information
- Add new vehicles to the marketplace
- Delete existing listings
- Responsive design for all devices

## Tech Stack
- Frontend: Next.js 15, React 19
- Styling: Tailwind CSS, Material UI
- State Management: Apollo Client
- Data Layer: GraphQL API with local JSON storage
- Linting: ESLint, Prettier

## Getting Started

### Prerequisites
- Node.js v18+
- Yarn

### Installation
yarn install

### Running Locally
yarn start

Visit `http://localhost:3000`

### Build for Production
```bash
yarn build
```

### Linting
```bash
yarn lint
```

## Project Structure
```
src/
├── app/               # Application routes
├── components/        # Reusable components
├── data/              # Vehicle data storage
├── lib/               # Utility functions
└── types/             # TypeScript definitions
