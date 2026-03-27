# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Folder Structure

├── assets/               # Static assets like images, fonts, etc.
├── components/           # Reusable Vue components
│   ├── ui/               # UI components (buttons, inputs, modals, etc.)
│   ├── layout/           # Layout-related components (header, footer)
├── composables/          # Reusable logic and functions
├── constants/            # Project-wide constants (roles, statuses)
├── layouts/              # Application layouts (default, admin, etc.)
├── middleware/           # Nuxt middleware (authentication, redirects)
├── modules/              # Nuxt modules (plugins and custom modules)
├── pages/                # Nuxt pages (each file is a route)
│   ├── admin/            # Admin-specific pages
│   ├── auth/             # Authentication-related pages
├── plugins/              # Vue/Nuxt plugins (Axios, Auth, etc.)
├── public/               # Publicly available files (favicon, robots.txt)
├── server/               # API and server-side logic
│   ├── api/              # API routes (Nuxt server API)
│   ├── middleware/       # Server-side middleware (logging, authentication)
├── stores/               # State management (Pinia stores)
├── utils/                # Utility functions (formatters, validators)
├── tests/                # Unit and integration tests
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
├── nuxt.config.ts        # Nuxt configuration file
├── package.json          # Project metadata and dependencies
├── tsconfig.json         # TypeScript configuration (if using TypeScript)
└── README.md             # Project documentation