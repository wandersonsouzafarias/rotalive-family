# MVP — Fase 1

## Objetivo

Construir a fundação do produto: autenticação, perfil, famílias e dashboard. Sem localização, geofence, SOS ou pagamentos.

## Critérios de Aceite

### Autenticação

- [x] Usuário pode se cadastrar com e-mail, senha e nome
- [x] Usuário pode fazer login
- [x] Usuário pode fazer logout
- [x] Usuário pode solicitar recuperação de senha
- [x] Usuário pode redefinir senha via link/token
- [x] Token JWT validado em rotas protegidas

### Perfil

- [x] Usuário pode visualizar seu perfil
- [x] Usuário pode editar nome, foto (URL) e telefone
- [x] Validação de telefone em formato internacional

### Famílias

- [x] Responsável pode criar uma família
- [x] Responsável pode editar o nome da família
- [x] Responsável pode convidar membro por e-mail
- [x] Convite gera registro pendente no banco
- [x] Apenas owner/admin pode editar e convidar

### Dashboard

- [x] Lista todos os membros da família ativa
- [x] Exibe status de cada membro (ativo, pendente, inativo)
- [x] Cards com métricas (total, ativos, pendentes)

### Infraestrutura

- [x] Monorepo com workspaces npm
- [x] PostgreSQL com Prisma e migrations
- [x] API documentada com Swagger
- [x] ESLint, Prettier, Husky, Commitlint
- [x] Package shared com Zod schemas
- [x] README com instruções de setup

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/auth/register` | Cadastro |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/logout` | Logout |
| POST | `/api/v1/auth/forgot-password` | Recuperar senha |
| POST | `/api/v1/auth/reset-password` | Redefinir senha |
| GET | `/api/v1/auth/me` | Usuário autenticado |
| GET | `/api/v1/profile` | Obter perfil |
| PATCH | `/api/v1/profile` | Atualizar perfil |
| POST | `/api/v1/families` | Criar família |
| GET | `/api/v1/families` | Listar famílias |
| GET | `/api/v1/families/:id` | Obter família |
| PATCH | `/api/v1/families/:id` | Editar família |
| POST | `/api/v1/families/:id/invite` | Convidar membro |
| GET | `/api/v1/families/:id/dashboard` | Dashboard |

## Fora do Escopo (Fase 1)

- Geofence / áreas seguras
- SOS
- Alertas e notificações
- Histórico de localização
- Mapas e tracking GPS
- Assinaturas e pagamentos
- IA
- App mobile funcional (apenas scaffold)

## Próximo Passo

Fase 2: integrar Google Maps + Socket.IO para localização em tempo real.
