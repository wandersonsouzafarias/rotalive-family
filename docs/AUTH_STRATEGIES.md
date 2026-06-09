# Estratégias de Autenticação — RotaLive Family

## Diagnóstico

| Item                | Arquivo responsável                                | Status                    |
| ------------------- | -------------------------------------------------- | ------------------------- |
| Cadastro            | `apps/api/src/modules/auth/auth.service.ts`        | Depende do provider ativo |
| Login               | `apps/api/src/modules/auth/auth.service.ts`        | Depende do provider ativo |
| Validação JWT       | `apps/api/src/modules/auth/auth.guard.ts`          | Local ou Supabase         |
| Integração Supabase | `apps/api/src/modules/auth/supabase.service.ts`    | Opcional                  |
| JWT local           | `apps/api/src/modules/auth/local-jwt.service.ts`   | Ativo em modo local       |
| Seleção de modo     | `apps/api/src/modules/auth/auth-config.service.ts` | `auto` por padrão         |

### Causa do erro "fetch failed"

**Arquivo:** `apps/api/.env`

**Variáveis com valor inválido:**

```
SUPABASE_URL="https://placeholder.supabase.co"   ← projeto inexistente
SUPABASE_ANON_KEY="placeholder"                ← chave inválida
SUPABASE_SERVICE_ROLE_KEY="placeholder"
SUPABASE_JWT_SECRET="placeholder"
```

**Fluxo que falhava:** `AuthService.register()` → `SupabaseService.signUp()` → fetch para URL placeholder → `fetch failed`

---

## Estratégia A — Supabase (produção recomendada)

### Quando usar

- Ambiente de produção
- Login com Google
- Recuperação de senha por e-mail
- Publicação App Store / Play Store

### Configuração (`apps/api/.env`)

```env
AUTH_PROVIDER=supabase

SUPABASE_URL="https://SEU-PROJETO.supabase.co"
SUPABASE_ANON_KEY="sua-anon-key"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
SUPABASE_JWT_SECRET="seu-jwt-secret"
```

### Supabase Dashboard

1. **Authentication → Providers → Email** → habilitar
2. **Authentication → URL Configuration**
   - Site URL: `http://localhost:3000`
   - Redirect: `http://localhost:3000/auth/callback`
3. Para Google: habilitar provider Google

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key"
```

---

## Estratégia B — Local JWT (desenvolvimento)

### Quando usar

- Testes locais sem conta Supabase
- Desenvolvimento offline
- CI/CD sem credenciais externas

### Configuração (`apps/api/.env`)

```env
AUTH_PROVIDER=local

JWT_SECRET="sua-chave-secreta-local-min-32-chars"
```

> Com `AUTH_PROVIDER=auto` (padrão), o sistema detecta credenciais Supabase placeholder e **ativa local automaticamente**.

### Como funciona

- Senha armazenada com **bcrypt** em `users.password_hash`
- Token JWT assinado com `JWT_SECRET`
- Sem dependência de serviços externos

### Limitações no modo local

- Login com Google → indisponível
- Recuperação de senha por e-mail → indisponível
- Reset de senha → indisponível

---

## Endpoints por provider

| Endpoint                   | Local            | Supabase |
| -------------------------- | ---------------- | -------- |
| POST /auth/register        | ✅               | ✅       |
| POST /auth/login           | ✅               | ✅       |
| POST /auth/logout          | ✅ (client-side) | ✅       |
| GET /auth/me               | ✅               | ✅       |
| POST /auth/forgot-password | ❌               | ✅       |
| POST /auth/reset-password  | ❌               | ✅       |
| POST /auth/sync (Google)   | ❌               | ✅       |

---

## Recomendação

| Ambiente                    | Estratégia                                  |
| --------------------------- | ------------------------------------------- |
| Desenvolvimento local agora | **B (local)** — já aplicada automaticamente |
| Staging / Produção          | **A (Supabase)**                            |

---

## Verificar modo ativo

Ao iniciar a API, observe o log:

```
🔐 Autenticação LOCAL ativa (PostgreSQL + JWT)
```

ou

```
🔐 Autenticação SUPABASE ativa
```
