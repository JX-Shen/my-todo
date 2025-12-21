# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Local dev

- Install: `npm ci`
- Run: `npm run dev`

## GitHub Pages hosting

This repo deploys the app to GitHub Pages from the `main` branch using GitHub Actions.

- CI (PRs): builds on every PR targeting `main`
- Deploy (main): builds and publishes to GitHub Pages on every push to `main`

The Pages URL is typically `https://<owner>.github.io/<repo>/` (repo subpath required).

### Verification checklist (non-technical)

- Open the Pages URL in a private/incognito window.
- Confirm the page is not blank and the UI renders.
- Refresh the page and confirm it still works.
- Open browser devtools (Network tab) and confirm JS/CSS files are not returning 404.
- Note: data is local-only per device/browser (no cloud sync).
- Routing expectation: root-only (`/`); deep links are not guaranteed.

### Rollback

- Revert the commit that introduced the breakage and push to `main` to redeploy a known-good version.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
