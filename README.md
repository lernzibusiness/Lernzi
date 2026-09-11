# Lernzi

The public website is `/`. Get Started opens `/signup`; Log in opens `/login`. Both screens continue into the app at `/dashboard` (or the requested study route).

## Account-screen preview

Real authentication and Firebase are **not connected**. The forms validate example input, discard it, and set only `lernzi.preview-session.v1=active` in sessionStorage. This marker is navigation state, not a security boundary or an account. Exit app preview clears it. Do not enter a real password in the preview.

Study notes, reviewed terms, cards and progress remain in the existing `lernzi.study.v1` localStorage library. No account or cloud backup is created. The local library is shared within this browser profile; signing out of a future real account will require account-scoped storage and a migration strategy.

## Run locally

Use Node 22–24 and the package manager version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The development server runs at http://127.0.0.1:3000. The service worker is registered in production mode only, so development changes are not hidden by an offline cache.

## Build and test the PWA

```sh
pnpm typecheck
pnpm test
pnpm build
pnpm start
pnpm test:e2e
```

For browser tests, Windows uses installed Edge. On other platforms run `pnpm exec playwright install chromium`; `PLAYWRIGHT_CHANNEL` can select another installed browser. Run the browser tests against a production server, not `pnpm dev`.

The build prepares the local PDF worker, compiles Next.js, then generates `public/sw.js` from `scripts/service-worker.template.js`. The worker precaches the public app shell, built JS/CSS/fonts, icons and local PDF resources. It never caches API responses, account submissions or uploaded files. Offline navigation uses cached documents and the existing browser library. An update waits until the student chooses Reload app.

The manifest starts the installed app at `/dashboard` in standalone mode. App icons reuse Lernzi’s existing logo. Use HTTPS when hosted (localhost works for local tests). Installation availability depends on the browser; iOS users can use Safari → Share → Add to Home Screen. Keep the app online until “Ready for offline study” appears before disconnecting.

Generated service-worker/PDF files, browser traces and test screenshots are ignored by Git. Deploy the complete Next.js build with `pnpm build` and `pnpm start`; GitHub Pages alone does not run this Next.js server.

When real Firebase Authentication is requested later, replace the preview marker with the Firebase auth observer and sign-in calls. Add public Firebase web configuration through environment settings, enable the desired sign-in provider, and enforce authorization separately for any future cloud storage or server APIs.
