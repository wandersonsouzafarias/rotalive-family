# Roadmap — RotaLive Family

## Q2 2026 — Fase 1: Fundação ✅

**Status:** Concluída

- Monorepo de produção
- Autenticação (Supabase Auth)
- Perfil de usuário
- CRUD de famílias + convites
- Dashboard de membros
- Swagger + Prisma + PostgreSQL

---

## Q3 2026 — Fase 2: Localização em Tempo Real

**Objetivo:** O produto passa a rastrear e exibir localização.

- [ ] Módulo de localização no backend
- [ ] Socket.IO para updates em tempo real
- [ ] Integração Google Maps Platform (Web)
- [ ] Tela de mapa com pins dos membros
- [ ] Permissões de localização (Web Geolocation API)
- [ ] Histórico de localização (últimas 24h)
- [ ] Background location no mobile (Expo Location)

**Entregáveis:**
- Mapa funcional no dashboard
- Atualização de posição a cada 30s
- Histórico consultável

---

## Q4 2026 — Fase 3: Segurança e Alertas

**Objetivo:** Funcionalidades de proteção familiar.

- [ ] Geofence (áreas seguras)
- [ ] Alertas de entrada/saída de zona
- [ ] Botão SOS com notificação imediata
- [ ] Push notifications (Expo Notifications + FCM/APNs)
- [ ] Configuração de alertas por membro
- [ ] Modo "cheguei em segurança"

**Entregáveis:**
- Criação de zonas no mapa
- Alertas push funcionais
- Fluxo SOS end-to-end

---

## Q1 2027 — Fase 4: Monetização

**Objetivo:** Modelo de negócio SaaS.

- [ ] Planos Free / Family / Premium
- [ ] Integração Stripe ou Mercado Pago
- [ ] Limites por plano (membros, histórico, zonas)
- [ ] Página de pricing
- [ ] Billing portal
- [ ] Trial de 14 dias

---

## Q2 2027 — Fase 5: Mobile Nativo

**Objetivo:** Publicação nas lojas.

- [ ] App Expo completo (paridade com Web)
- [ ] Background location tracking
- [ ] EAS Build para iOS e Android
- [ ] Publicação Play Store
- [ ] Publicação App Store
- [ ] Deep links e universal links
- [ ] Onboarding nativo

---

## Q3 2027 — Fase 6: Inteligência

**Objetivo:** Diferenciação com IA.

- [ ] Detecção de padrões de movimento
- [ ] Alertas preditivos ("não chegou na escola")
- [ ] Resumo diário para o responsável
- [ ] Sugestões de zonas seguras automáticas

---

## Métricas de Sucesso

| Fase | Métrica | Meta |
|------|---------|------|
| 1 | Setup local funcional | 100% |
| 2 | Latência de localização | < 5s |
| 3 | Tempo de resposta SOS | < 10s |
| 4 | Conversão free → paid | > 5% |
| 5 | Rating nas lojas | > 4.5 |
| 6 | Retenção D30 | > 40% |
