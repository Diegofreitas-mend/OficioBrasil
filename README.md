# Ofício Brasil

Plataforma de cursos técnicos profissionalizantes — MVP com dados mockados.


## Estrutura

```
oficio-brasil/
├── backend/      Node.js + Express  (porta 3001)
└── frontend/     React + Vite       (porta 5173)
```

## Como rodar

```bash
npm install        # uma vez, na raiz
npm run dev        # backend + frontend juntos
```

Ou separados:

```bash
npm run dev:backend
npm run dev:frontend
```

## Fluxo

1. Abrir `http://localhost:5173` redireciona para `/login` (única rota pública).
2. Clicar em **Entrar** autentica via mock e leva ao Dashboard.
3. **Sair** no header desautentica e volta para `/login`.

## Rotas

| Rota | Descrição |
|------|-----------|
| `/login` | Tela de login (pública) |
| `/` | Dashboard — Meus Cursos + Todos os Cursos |
| `/curso/:id` | Página do curso com aulas |
| `/curso/:id/aula/:lessonId` | Player + outras aulas |
| `/avaliacoes` | Avaliações do usuário |
| `/historico` | Histórico de cursos concluídos |
| `/configuracoes` | Configurações (placeholder) |

## API

| Endpoint | Descrição |
|----------|-----------|
| `GET /api/user` | Dados do usuário logado |
| `GET /api/courses` | Todos os cursos |
| `GET /api/courses/my` | Cursos adquiridos |
| `GET /api/courses/:id` | Detalhe + aulas |
| `GET /api/courses/:id/lessons/:lessonId` | Detalhe de uma aula |
| `GET /api/reviews` | Avaliações |
| `GET /api/history` | Histórico de conclusões |
