# Routes

TanStack Router uses **file-based routing**. Every `.jsx` file in this directory
defines a client-side route. Do **not** create `src/pages/`, `src/routes/_app/index.jsx`,
or `app/layout.jsx` — those are Next.js / Remix conventions. The root layout is
`src/routes/__root.jsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.jsx` | `/` |
| `about.jsx` | `/about` |
| `users/index.jsx` | `/users` |
| `users/$id.jsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.jsx` | `/posts/:category?` (optional segment) |
| `files/$.jsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.jsx` | layout route (renders children via `<Outlet />`) |
| `__root.jsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand. Route loaders and UI
run in the browser; connect them to your backend when it is ready.
