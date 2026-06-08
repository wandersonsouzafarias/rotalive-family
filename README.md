# RotaLive Family

Plataforma de localização familiar em tempo real — produção desde o dia 1.

[![Stack](https://img.shields.io/badge/Monorepo-npm_workspaces-CB3837)]()
[![API](https://img.shields.io/badge/API-NestJS-E0234E)]()
[![Web](https://img.shields.io/badge/Web-Next.js_15-000000)]()
[![Mobile](https://img.shields.io/badge/Mobile-Expo-000020)]()

## Visão Geral

RotaLive Family permite que responsáveis criem famílias, convidem membros e acompanhem a localização em tempo real. Inspirado em Life360, Google Family e Find My.

**Fase 1 (atual):** Autenticação, perfil, famílias, dashboard e convites.

## Estrutura do Monorepo

```
rotalive-family/
├── apps/
│   ├── api/          # Backend NestJS + Prisma + Swagger
│   ├── web/          # Frontend Next.js 15 (PWA)
│   └── mobile/       # App React Native (Expo) — scaffold
├── packages/
│   └── shared/       # Tipos TypeScript + schemas Zod
├── docs/             # Documentação de produto e arquitetura
├── docker-compose.yml
└── package.json      # Workspaces npm
```

## Pré-requisitos

- **Node.js** >= 20
- **npm** >= 10
- **Docker** (para PostgreSQL local) ou instância PostgreSQL existente
- **Conta Supabase** (Auth gratuito em [supabase.com](https://supabase.com))

## Setup Rápido

### 1. Clonar e instalar dependências

```bash
cd rotalive-family
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Edite os arquivos `.env` com suas credenciais do Supabase:

| Variável | Onde obter |
|----------|-----------|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `SUPABASE_JWT_SECRET` | Supabase → Settings → API → JWT Secret |

### 3. Subir o PostgreSQL

```bash
docker compose up -d
```

### 4. Rodar migrations e gerar Prisma Client

```bash
npm run build:shared
npm run db:generate
npm run db:migrate
```

> Na primeira execução, o Prisma pedirá um nome para a migration. Use `init` ou confirme a migration existente.

### 5. Iniciar os serviços

Em terminais separados:

```bash
# API (porta 3001)
npm run dev:api

# Web (porta 3000)
npm run dev:web
```

### 6. Acessar

| Serviço | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| API | http://localhost:3001/api/v1 |
| Swagger | http://localhost:3001/api/docs |
| Prisma Studio | `npm run db:studio` |

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev:api` | Inicia API em modo watch |
| `npm run dev:web` | Inicia Next.js em dev |
| `npm run dev:mobile` | Inicia Expo (scaffold) |
| `npm run build` | Build de todos os workspaces |
| `npm run build:shared` | Compila package compartilhado |
| `npm run db:generate` | Gera Prisma Client |
| `npm run db:migrate` | Executa migrations |
| `npm run db:push` | Push schema sem migration |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run lint` | ESLint em todo o monorepo |
| `npm run format` | Prettier em todo o monorepo |
| `npm run typecheck` | Verificação de tipos |

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Monorepo | npm workspaces |
| Backend | NestJS, TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL |
| Auth | Supabase Auth |
| Validação | Zod |
| Docs API | Swagger |
| Frontend | Next.js 15, Tailwind CSS |
| Estado | Zustand + React Query |
| Mobile | React Native, Expo |
| Tempo real | Socket.IO (Fase 2) |
| Mapas | Google Maps (Fase 2) |

## Arquitetura

- **Clean Architecture** com camadas Controller → Service → Repository
- **Repository Pattern** para acesso a dados via Prisma
- **Schemas compartilhados** em `@rotalive/shared` (Zod + TypeScript)
- **Guards** JWT em todas as rotas protegidas
- **LGPD**: respostas genéricas em endpoints sensíveis

Documentação completa em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## API — Endpoints (Fase 1)

### Autenticação

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout          (Bearer)
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me              (Bearer)
```

### Perfil

```
GET    /api/v1/profile              (Bearer)
PATCH  /api/v1/profile              (Bearer)
```

### Famílias

```
POST   /api/v1/families             (Bearer)
GET    /api/v1/families             (Bearer)
GET    /api/v1/families/:id         (Bearer)
PATCH  /api/v1/families/:id         (Bearer)
POST   /api/v1/families/:id/invite  (Bearer)
GET    /api/v1/families/:id/dashboard (Bearer)
```

## Configuração Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Em **Authentication → Providers**, habilite Email
3. Em **Authentication → URL Configuration**, adicione:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/reset-password`
4. Copie as chaves para os arquivos `.env`

## Mobile (Expo)

O scaffold mobile está preparado para a Fase 2. Para iniciar:

```bash
npm run dev:mobile
```

> Adicione os assets em `apps/mobile/assets/` (icon.png, splash-icon.png, adaptive-icon.png, favicon.png) antes de buildar para as lojas.

## Qualidade de Código

- **ESLint** + **Prettier** configurados no monorepo
- **Husky** — pre-commit com lint-staged
- **Commitlint** — conventional commits

Formato de commit:

```
feat: adicionar geofence
fix: corrigir validação de telefone
docs: atualizar roadmap
```

## Roadmap

| Fase | Escopo | Status |
|------|--------|--------|
| 1 | Auth, perfil, famílias, dashboard | ✅ |
| 2 | Localização em tempo real + mapas | Planejado |
| 3 | Geofence, SOS, alertas | Planejado |
| 4 | Assinaturas e pagamentos | Planejado |
| 5 | App iOS/Android nas lojas | Planejado |

Detalhes em [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Arquitetura técnica
- [`docs/PRODUCT.md`](docs/PRODUCT.md) — Visão de produto
- [`docs/MVP.md`](docs/MVP.md) — Critérios da Fase 1
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Roadmap completo

## Licença

Proprietário — RotaLive Family © 2026
