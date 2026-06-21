# dexa-frontend

Stack: React 19 + TypeScript 6 + Vite 8 + Tailwind 4 + daisyUI 5 + React Router 7.

## Comandos

- `npm run dev` — dev server
- `npm run build` — `tsc -b && vite build` (typecheck + build)
- `npm run lint` — ESLint 10 flat config
- No hay test runner configurado

## TypeScript (tsconfig.app.json)

- `verbatimModuleSyntax` → usa `import type` para imports solo de tipos
- `erasableSyntaxOnly` → prohibido: enums, namespaces, parameter properties
- `noUnusedLocals` / `noUnusedParameters` → error en compilación si sobran

## Tailwind 4 + daisyUI 5

- `src/index.css` usa `@import "tailwindcss"` + `@plugin "daisyui"` (no `@tailwind`)
- Variables CSS globales (colores, tipografía) definidas en `:root` en `index.css`

## Enrutamiento

- `BrowserRouter` en `main.tsx`; rutas en `App.tsx` con `<Routes>` / `<Route>`
- Sidebar usa `<NavLink>` con callback `isActive`
- Navegación inline usa `<Link>` de `react-router-dom`

## Arquitectura

```
src/
  components/layout/   → Layout, Sidebar
  modules/{domain}/    → pages/ + components/  (activo: products)
  services/            → API layer (vacio)
  types/               → interfaces TS (vacio)
```

## Estado del proyecto

Fase temprana de maquetación UI. Placeholders sin implementar:
- `src/services/productService.ts`
- `src/types/product.ts`
- `src/modules/products/components/ProductForm.tsx`
- `src/modules/products/components/ProductTable.tsx`

## Skill disponible

`fill-basic-component` — scaffolding rápido de componentes funcionales sin props.

## Notas

- `opencode.json` y `maquetas/` están en `.gitignore`
- No hay Prettier, no hay CI
- CSS Modules disponibles (`Layout.module.css`) pero sin uso activo
