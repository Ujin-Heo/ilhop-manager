# Project Instructions

## Styling Conventions
- **Color Variables**: Do not use standard Tailwind CSS color utilities (e.g., `text-gray-500`). Instead, use color variables defined in the `@theme inline` section of `frontend/components/globals.css`.
- **Naming**: Use descriptive color names for variables (e.g., `--color-white`, `--color-dark-gray`), not names based on their usage (e.g., `--color-primary`).
- **Color Format**: Use `oklch` for all new color variable definitions.
- **New Colors**: If a suitable color variable does not exist, create a new one in `globals.css` following the descriptive naming and `oklch` format.
