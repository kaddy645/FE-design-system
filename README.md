# Acme Design System

A pnpm/Turborepo workspace for a token-driven React component library, its Storybook documentation, and a consuming example app.


 Enterprise React design-system monorepo for sharing accessible, consistent UI components across multiple applications. It uses pnpm workspaces and Turborepo, a publishable TypeScript component package, token-driven themes, Storybook documentation, and automated unit, visual, accessibility, and browser testing. It also includes a sample consumer app and Changesets-based release automatio
 
## Workspace map

```text
.
├── apps/
│   ├── docs/                 # Storybook 8, including the a11y addon
│   └── example-app/          # Vite consumer used by browser tests
├── packages/
│   └── ui-core/              # Published component package
│       └── src/
│           ├── components/
│           │   ├── Button/   # Generic polymorphic action
│           │   ├── Input/    # Label, hint, and error semantics
│           │   └── Modal/    # Compound dialog with portal and focus management
│           ├── styles/       # CSS custom properties, themes, and brands
│           └── tokens/       # Canonical token values in JSON
├── tests/e2e/                # Playwright browser, accessibility-flow, and visual tests
├── .changeset/               # Package release metadata
├── .github/workflows/        # CI and Changesets release automation
├── package.json              # Root scripts and dev tooling
├── pnpm-workspace.yaml
├── tailwind.config.js        # Maps utility classes to runtime tokens
└── turbo.json                # Build graph and caching policy
```

## Getting started

Requires Node.js 22+ and pnpm 9.15.4.

```sh
pnpm install
pnpm dev
```

This runs Storybook at `http://localhost:6006` and the example app on Vite's default port. Run `pnpm --filter @acme/example-app dev` to work on the consumer alone.

## Quality and releases

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

Playwright checks the app flow, dialog keyboard behavior, and a screenshot baseline. After an intentional visual change, review the screenshot diff and refresh the baseline with `pnpm test:e2e:update`; commit the reviewed snapshot. Storybook's a11y addon runs axe checks in stories and is configured to treat violations as errors. Unit tests cover the component interactions and semantics.

For a component release, add a Changeset (`pnpm changeset`) and commit it with the change. The release workflow opens a version PR; after it is merged, Changesets publishes packages using the repository's `NPM_TOKEN` secret. Configure `@acme/ui-core`'s npm organization/access policy before the first publish.

## Architecture notes

- **Tokens:** `tokens/tokens.json` is the canonical design-token inventory. Runtime components consume stable `--ds-*` CSS variables, which can be overridden with `data-theme="dark"` or `data-brand="violet"` on an ancestor. Keep the JSON values and the CSS variable layer synchronized until a token build step is introduced.
- **Styling:** components ship CSS with token references, avoiding a runtime Tailwind dependency for consuming applications. Tailwind config maps those variables for apps that use utility classes.
- **Accessibility:** `Modal` is composed from `Root`, `Trigger`, `Portal`, `Overlay`, `Content`, `Title`, `Description`, and `Close`. `Content` supplies dialog semantics, Escape/backdrop dismissal, initial focus, focus containment, and focus restoration. Consumers should provide a visible title and description; keep dialog actions and validation messages inside the content.
- **Polymorphism:** `Button`'s `as` generic infers element-specific props (for example `href` for `as="a"`). Avoid polymorphism when the semantic element is fixed, as it is for the modal trigger, input, and close controls.
- **Growth:** add each primitive with colocated styles/tests/stories; extract shared behavior when a second component needs it. For production menus/tabs, use a well-maintained keyboard/floating-positioning primitive rather than maintaining a second homegrown focus and positioning engine.
- **Visual baselines:** screenshot comparison is deterministic only with a pinned browser, OS/font set, viewport, and reviewed baseline. CI installs Playwright Chromium; keep local baseline updates and CI on the same Playwright version.
