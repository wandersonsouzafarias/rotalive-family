# Arquitetura — RotaLive Family

## Visão Geral

RotaLive Family é um monorepo de produção organizado em workspaces npm, projetado para escalar de Web (PWA) para iOS e Android sem retrabalho estrutural.

```
rotalive-family/
├── apps/
│   ├── api/        # Backend NestJS
│   ├── web/        # Frontend Next.js 15 (PWA)
│   └── mobile/     # App React Native (Expo)
├── packages/
│   └── shared/     # Tipos, schemas Zod e contratos compartilhados
└── docs/
```

## Princípios Arquiteturais

| Princípio | Aplicação |
|-----------|-----------|
| **Clean Architecture** | Camadas separadas: Controller → Service → Repository |
| **Repository Pattern** | Acesso a dados isolado em repositórios Prisma |
| **SOLID** | Serviços com responsabilidade única, injeção de dependência via NestJS |
| **DRY** | Schemas Zod e tipos compartilhados em `@rotalive/shared` |
| **LGPD** | Dados mínimos, sem revelar existência de e-mail em recuperação de senha |

## Backend (NestJS)

### Camadas

```
src/
├── common/           # Guards, filters, pipes, decorators
├── modules/
│   ├── auth/         # Autenticação via Supabase Auth
│   ├── profile/      # Perfil do usuário
│   ├── families/     # Famílias e convites
│   └── users/        # Repositório de usuários
└── prisma/           # ORM e conexão PostgreSQL
```

### Fluxo de Autenticação

```
Cliente → Supabase Auth (cadastro/login)
       → API NestJS (valida JWT)
       → Prisma (persiste perfil local)
```

1. O cliente autentica via Supabase Auth
2. O token JWT é enviado em cada requisição (`Authorization: Bearer`)
3. O `AuthGuard` valida o token com Supabase
4. O usuário local é resolvido pelo `supabaseId` no PostgreSQL

### API REST

- Prefixo: `/api/v1`
- Documentação Swagger: `/api/docs`
- Resposta padrão: `{ success: boolean, data: T }`

## Frontend Web (Next.js 15)

### Estrutura

```
src/
├── app/
│   ├── (auth)/       # Rotas públicas: login, register, forgot-password
│   └── (app)/        # Rotas protegidas: dashboard, profile, families
├── components/       # UI reutilizável
├── services/         # Chamadas à API
├── stores/           # Zustand (auth, family)
└── lib/              # Utilitários, API client
```

### Estado

- **Zustand**: autenticação (persistido em localStorage) e família ativa
- **React Query**: cache e sincronização de dados do servidor

## Mobile (Expo)

Scaffold base preparado para Fase 2+. Compartilha `@rotalive/shared` e seguirá a mesma estrutura de services/stores do web.

## Banco de Dados (PostgreSQL + Prisma)

### Entidades (Fase 1)

- **User** — perfil local vinculado ao Supabase Auth
- **Family** — grupo familiar
- **FamilyMember** — vínculo usuário ↔ família (com role e status)
- **FamilyInvitation** — convites pendentes por e-mail

### Diagrama ER

```
User ──< FamilyMember >── Family
User ──< Family (owner)
User ──< FamilyInvitation
Family ──< FamilyInvitation
```

## Tempo Real (Fase 2+)

Socket.IO será integrado no módulo `realtime` do NestJS para:
- Atualização de localização em tempo real
- Alertas e notificações push

## Mapas (Fase 2+)

Google Maps Platform será consumido via:
- Web: `@react-google-maps/api`
- Mobile: `react-native-maps`

## Segurança

- Autenticação delegada ao Supabase Auth (JWT RS256)
- Validação de entrada com Zod em todas as rotas
- CORS configurável por ambiente
- Guards em todas as rotas protegidas
- LGPD: respostas genéricas em endpoints sensíveis

## Deploy (Futuro)

| App | Plataforma |
|-----|-----------|
| API | Railway / AWS ECS / Fly.io |
| Web | Vercel (PWA) |
| Mobile | EAS Build → Play Store / App Store |
| DB | Supabase PostgreSQL / Neon / RDS |
