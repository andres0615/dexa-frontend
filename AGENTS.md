# dexa-frontend

Stack: React 19 + TypeScript 6 + Vite 8 + Tailwind 4 + daisyUI 5 + React Router 7, con react-hook-form y framer-motion.

## Comandos

- `npm run dev` — dev server (proxy `/api` → `http://dexa-backend.test`; sirve en `dexa.test`)
- `npm run build` — `tsc -b && vite build` (typecheck + build)
- `npm run lint` — ESLint 10 flat config
- No hay test runner configurado

## TypeScript (tsconfig.app.json)

- Alias `@/` → `src/`; en el código se mezclan imports relativos y con `@/`
- `verbatimModuleSyntax` → usa `import type` para imports solo de tipos
- `erasableSyntaxOnly` → prohibido: enums, namespaces, parameter properties
- `noUnusedLocals` / `noUnusedParameters` → error en compilación si sobran

## Tailwind 4 + daisyUI 5

- `src/index.css` usa `@import "tailwindcss"` + `@plugin "daisyui"` (no `@tailwind`)
- Variables CSS globales (colores, fuentes Lexend/Inter) definidas en `:root` en `index.css`

## API (src/api + src/services)

- `src/api/apiClient.ts`: wrapper de `fetch` que agrega headers JSON + token, serializa el body y, ante 401, refresca el token vía POST `/refresh` y reintenta una vez (los reintentos concurrentes se encolan hasta que el refresh termine).
- Token en `localStorage` bajo `access_token`. Si el refresh falla, limpia el token y redirige a `/login`.
- `BASE_URL = import.meta.env.VITE_API_URL || '/api'` (no hay `.env` en el repo).
- Convención de respuesta del backend: `{ success, data, message, errors }`. Los servicios lanzan `Error(message + errors)` cuando `success` es `false` (el back devuelve 500/422 con `success: false`).
- Paginación: query params `page` / `per_page`; el back devuelve el objeto paginado al estilo Laravel y los servicios lo mapean a `PaginatedResult<T>` / `PaginationMeta` (`src/types/pagination.ts`).
- Un archivo de servicio por dominio en `src/services/` con exports nombrados (`fetchX`, `createX`, `updateX`, `deleteX`).
- Endpoints de auth: POST `/login`, POST `/logout`, POST `/me`, POST `/refresh`.

## Arquitectura

```
src/
  api/               → apiClient.ts (único wrapper fetch)
  components/        → layout/, sidebar/, guards/, toast/, ui/ (compartidos)
  constants/         → global.ts: ids (tipos de movimiento, tipos de tercero, estados), DEMO_VALUES, USE_DEMO_VALUES
  contexts/          → AuthContext (user, login, logout, loading), LayoutContext (maxWidth)
  modules/{domain}/  → pages/ + components/
  services/          → un archivo por dominio
  types/             → interfaces por dominio + api-response.ts, pagination.ts
  utils/             → ucfirst, sleep, formatDateToInput
```

Módulos: `auth`, `products`, `movements`, `users`, `third-party`, `product-category`.

## Enrutamiento y auth

- `BrowserRouter` en `main.tsx`; rutas en `App.tsx`.
- `AuthGuard` protege las rutas admin (envueltas en `LayoutAdmin`); `GuestGuard` protege `/login`.
- Patrón de rutas: `/{module}`, `/{module}/create`, `/{module}/:id/edit` (+ `movements/:id/view`). `/` redirige a `/products`.
- Sidebar usa `<NavLink>` con callback `isActive`; navegación inline usa `<Link>`.
- `LayoutAdmin` usa `useLayoutContext().maxWidth` para el ancho del contenido (las páginas lo ajustan con `setMaxWidth`).

## Formularios

- `react-hook-form` con `useForm`; usar la opción `values` (no `defaultValues`) para que re-renderice con datos asíncronos.
- Antes del submit, convertir strings vacíos a `null` para que el back los interprete como "sin valor".
- `ToggleField` (`src/components/ui/ToggleField.tsx`) para checkboxes.
- Las páginas envuelven el form y manejan el submit (crear/editar) con `useNavigate`.

## Convenciones

- Comentarios y textos de UI en español; identificadores en inglés.
- Skill `load-convention-files` → archivos de referencia para interfaces, servicios y formularios.
- Reglas globales en `~\.config\opencode\rules.md` (cargadas por la skill `load-rules`).

## Skills del proyecto

`docs-products`, `enumerate-modifications`, `execute-plan-point`, `fill-basic-component`, `load-convention-files`, `load-rules`, `read-files-constraints`.

## Notas

- `.gitignore` excluye: `opencode.json`, `maquetas/`, `otros/`, `.opencode/`
- `opencode.json` configura el MCP `mcp-obsidian` apuntando al vault de documentación de dexa (la skill `docs-products` lee la nota `Modulos/Productos/Productos.md`)
- No hay Prettier, no hay CI

## Context7 (consulta de documentación)

- React: `/reactjs/react.dev`
- React Hook Form: `/react-hook-form/react-hook-form`
- DaisyUI: `/websites/daisyui`
