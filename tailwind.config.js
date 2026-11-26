/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      "./apps/docs/stories/**/*.{ts,tsx,mdx}",
      "./apps/example-app/index.html",
      "./apps/example-app/src/**/*.{ts,tsx}",
      "./packages/ui-core/src/**/*.{ts,tsx}"
    ]
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--ds-color-brand-50)",
          500: "var(--ds-color-brand-500)",
          600: "var(--ds-color-brand-600)"
        },
        surface: "var(--ds-color-neutral-0)",
        foreground: "var(--ds-color-neutral-900)",
        focus: "var(--ds-color-focus)"
      },
      borderRadius: {
        sm: "var(--ds-radius-sm)",
        md: "var(--ds-radius-md)",
        lg: "var(--ds-radius-lg)"
      },
      spacing: {
        1: "var(--ds-space-1)",
        2: "var(--ds-space-2)",
        3: "var(--ds-space-3)",
        4: "var(--ds-space-4)",
        6: "var(--ds-space-6)",
        8: "var(--ds-space-8)"
      }
    }
  },
  plugins: []
};
