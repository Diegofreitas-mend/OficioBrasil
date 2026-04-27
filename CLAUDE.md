# CLAUDE.md

Guia de convenções e arquitetura do **Ofício Brasil**. Siga este documento ao alterar o código.

## Stack

- **Backend**: Node.js + Express 5 (ES modules), JSON como persistência mockada
- **Frontend**: React 18 + Vite + React Router DOM 6
- **Estilização**: CSS Modules (sem Tailwind, sem libs de UI)
- **HTTP**: `fetch` nativo via wrapper em `services/api.js`
- **Linguagem**: JavaScript puro (sem TypeScript)

## Estrutura

```
oficio-brasil/
├── backend/
│   ├── server.js              entry point — monta routers em /api
│   ├── routes/                um router Express por recurso
│   └── data/                  JSON mocks
└── frontend/
    └── src/
        ├── App.jsx            BrowserRouter + árvore de rotas
        ├── main.jsx           renderiza <App /> dentro de <AuthProvider>
        ├── components/        componentes reutilizáveis (PascalCase)
        ├── pages/             views por rota (PascalCase)
        ├── contexts/          providers de Context
        ├── hooks/             hooks customizados (useXxx)
        ├── services/          clientes HTTP
        ├── constants/         tabelas/maps compartilhados
        ├── utils/             helpers puros (formatadores, etc.)
        └── styles/
            ├── variables.css  design tokens (CSS custom properties)
            ├── global.css     resets + estilos base
            ├── components/    *.module.css espelhando /components
            └── pages/         *.module.css espelhando /pages
```

## Regras de CSS

- **Todo CSS fica em `/src/styles`**. Nada de `.css` ao lado do componente.
- Cada `.jsx` importa seu module assim:
  ```js
  import styles from '../styles/components/Sidebar.module.css';
  import styles from '../styles/pages/Dashboard.module.css';
  ```
- `variables.css` é importado uma única vez por `global.css`.
- `global.css` é importado uma única vez por `main.jsx`.
- Classes em `.module.css` usam **camelCase** (mapeia direto para `styles.foo`).

## Roteamento e Auth

- `/login` é a **única rota pública**.
- Todo o resto fica dentro de `<ProtectedRoute />` → redireciona para `/login` quando não autenticado.
- `<Layout />` envolve as rotas protegidas (Sidebar + Header + `<Outlet />`).
- Auth mockado em `contexts/AuthContext.jsx`, com `sessionStorage` como backing store.
- `useAuth()` expõe `{ isAuthenticated, login, logout }`.

## Data fetching

- Hooks customizados (`useCourses`, `useCourse`, `useLesson`) encapsulam `fetch + loading + error`.
- Hooks chamam `api.get(path)` de `services/api.js` (wrapper sobre `fetch`).
- Páginas consomem o hook e renderizam os 3 estados (loading / error / success).

## Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente / Página | PascalCase | `CourseCard.jsx`, `Dashboard.jsx` |
| Hook | camelCase começando com `use` | `useCourses.js` |
| Constante exportada | SCREAMING_SNAKE_CASE | `CATEGORIES` |
| Classe de CSS Module | camelCase | `styles.cardBody` |

## Backend

- Cada router exporta `{ router }` (named export).
- Routers montam em `/api/<resource>` em `server.js`.
- Routers aninhados usam `Router({ mergeParams: true })`.
- Dados são lidos do disco em cada request (mock — basta).

## Como rodar

```bash
npm install         # uma vez, na raiz
npm run dev         # backend (3001) + frontend (5173) em paralelo
```

## O que NÃO fazer

- Não criar CSS ao lado de componentes.
- Não introduzir Redux / Zustand / outros state managers — Context + hooks bastam.
- Não migrar para TypeScript.
- Não conectar banco de dados — manter JSON mocks.
- Não criar pastas `client/` ou `server/` — a estrutura canônica é `frontend/` e `backend/`.
