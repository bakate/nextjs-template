# Next.js Project Template

This is a comprehensive Next.js project template designed for building modern, scalable, and feature-rich web applications. It comes pre-configured with a robust tech stack and follows a feature-based architecture to promote modularity and maintainability.

## ✨ Features

- **Next.js 15+ (App Router)**: Leverages the latest Next.js features for server components, routing, and more.
- **TypeScript**: For strong typing and improved developer experience.
- **shadcn/ui**: Beautifully designed components that you can copy and paste into your apps.
- **tRPC**: End-to-end typesafe APIs made easy.
- **Drizzle ORM**: TypeScript ORM for SQL databases, designed for type safety and ease of use.
- **next-intl**: Internationalization (i18n) for Next.js, with a per-feature translation file setup and automatic aggregation.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Feature-based Architecture**: Organizes code by features for better separation of concerns.
- **ESLint & Prettier**: For code linting and formatting.
- **Husky & lint-staged**: For pre-commit checks to ensure code quality.
- **Bun**: Fast JavaScript runtime, bundler, and package manager.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17 or later recommended for Next.js 15)
- [Bun](https://bun.sh/) (v1.0 or later)

### Installation

1.  **Clone the repository or use it as a template:**

    ```bash
    git clone https://github.com/bakate/nextjs-template.git
    cd nextjs-template
    ```

    Or, click the "Use this template" button on GitHub.

2.  **Install dependencies using Bun:**

    This will also automatically run `bun run merge-i18n` to compile initial translations.

    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project by copying the `.env.example` file:

    ```bash
    cp .env.example .env.local
    ```

    Update the `.env.local` file with your specific configuration (e.g., database connection strings, API keys).

4.  **Database Setup (Drizzle ORM):**

    - Ensure your database server is running.
    - Push schema changes to your database (typically for development):
      ```bash
      bun run db:push
      ```
    - For production or more controlled migrations, generate migration files and then apply them:
      ```bash
      bun run db:generate # Generates migration files
      bun run db:migrate  # Applies pending migrations
      ```

### Running the Development Server

To start the development server, run:

```bash
bun dev
```

This command will concurrently:

- Start the Next.js development server (with Turbopack) on [http://localhost:3000](http://localhost:3000).
- Watch for changes in your i18n files (`src/features/**/i18n/*.json`) and automatically re-compile them into `src/messages`.

The page auto-updates as you edit Next.js files.

## 📁 Project Structure

This project follows a feature-based directory structure:

```
.
├── public/                 # Static assets
├── scripts/                # Build/utility scripts (e.g., for i18n)
│   ├── merge-i18n.ts
│   └── watch-i18n.ts
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, etc.)
│   ├── components/         # Shared UI components (using shadcn/ui)
│   │   └── ui/             # shadcn/ui components
│   ├── features/           # Feature-specific modules
│   │   └── [feature-name]/
│   │       ├── components/   # Components specific to this feature
│   │       ├── screens/      # Screen components (used by Next.js pages)
│   │       ├── procedures/   # tRPC procedures for this feature
│   │       ├── types/        # TypeScript types for this feature
│   │       └── i18n/         # Internationalization files (e.g., en.json, fr.json)
│   ├── lib/                # Utility functions, helpers, etc.
│   │── trpc/               # tRPC router setup
│   │── db/                 # Drizzle ORM setup and schema
│   │── providers/          # Different Providers
│   └── middleware.ts       # Next.js middleware (e.g., for i18n)
├── .env.example            # Example environment variables
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── messages                # Global translation files (auto-generated) and you can add your global translations directly
└── bun.lockb               # Bun lockfile
```

### Key Directories:

- **`scripts/`**: Contains utility scripts, such as `merge-i18n.ts` for combining feature translations and `watch-i18n.ts` for doing so automatically during development.
- **`src/features/[feature-name]/i18n/`**: Store your feature-specific translations here (e.g., `en.json`, `fr.json`). These are automatically merged into `src/messages/` by the helper scripts.
- **`src/messages/`**: Contains aggregated translation files used by `next-intl`. **Do not edit these files directly**, as they are auto-generated.

## 🌍 Internationalization (i18n)

This template uses `next-intl` for internationalization. Translations are managed on a per-feature basis and automatically compiled.

1.  **Add/Edit Translations**: Modify or create JSON files within each feature's `i18n` directory (e.g., `src/features/user/i18n/fr.json`).
2.  **Automatic Compilation**:
    - On `bun install` (via `postinstall` script), all feature translations are merged by `bun scripts/merge-i18n.ts`.
    - During `bun dev`, the `bun scripts/watch-i18n.ts` script monitors these files for changes and automatically re-merges them into `src/messages/`.

This setup ensures that your global translation files in `src/messages/` are always up-to-date with your feature-specific translations.

## 🛠️ Available Scripts

Your `package.json` includes the following scripts:

- `bun dev`: Starts the Next.js development server with Turbopack and concurrently watches i18n files for changes.
- `bun build`: Builds the application for production.
- `bun start`: Starts a production server (after `bun build`).
- `bun lint`: Lints the codebase using ESLint and Next Lint.
- `bun format`: (Implicit via lint-staged) Formats code using Prettier.
- **Database (Drizzle ORM):**
  - `bun db:push`: Pushes schema changes directly to the database (useful for development).
  - `bun db:generate`: Generates SQL migration files based on schema changes.
  - `bun db:migrate`: Applies pending migrations to the database.
  - `bun db:studio`: Opens Drizzle Studio to browse your database.
- **Internationalization (i18n):**
  - `bun merge-i18n`: Manually triggers the merging of feature-specific translation files.
  - `bun watch-i18n`: Watches feature-specific translation files and merges them on change. (Used by `bun dev`).
- **Git Hooks:**
  - `bun prepare`: Installs Husky Git hooks.
  - `lint-staged` is configured to run Prettier and ESLint on pre-commit.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Ensure your code passes linting and type checks.
5. Commit your changes (`git commit -m 'Add some feature'`).
6. Push to the branch (`git push origin feature/your-feature-name`).
7. Open a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE.md). (You can choose another license if you prefer, and ensure to add the corresponding `LICENSE.md` file).
