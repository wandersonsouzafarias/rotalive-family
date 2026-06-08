# Produto — RotaLive Family

## Visão

RotaLive Family é uma plataforma SaaS de localização familiar em tempo real, inspirada em Life360, Google Family Link e Find My.

O responsável (pai/mãe/tutor) cria uma família, convida membros e acompanha a localização de todos em um painel unificado.

## Público-Alvo

- Famílias com crianças e adolescentes
- Cuidadores de idosos
- Grupos que precisam de visibilidade de localização com consentimento

## Proposta de Valor

| Benefício | Descrição |
|-----------|-----------|
| **Tranquilidade** | Saber onde estão os entes queridos em tempo real |
| **Segurança** | Áreas seguras, alertas e botão SOS |
| **Simplicidade** | Interface intuitiva para todas as idades |
| **Privacidade** | Controle total sobre quem vê sua localização (LGPD) |

## Funcionalidades

### Fase 1 — Fundação ✅

- [x] Cadastro, login, logout e recuperação de senha
- [x] Perfil (nome, foto, telefone)
- [x] Criar e editar família
- [x] Convidar membros por e-mail
- [x] Dashboard com lista de membros

### Fase 2 — Localização

- [ ] Compartilhamento de localização em tempo real
- [ ] Mapa com posição dos membros
- [ ] Histórico de localização
- [ ] Socket.IO para atualizações live

### Fase 3 — Segurança

- [ ] Áreas seguras (geofence)
- [ ] Alertas de entrada/saída
- [ ] Botão SOS
- [ ] Notificações push

### Fase 4 — Monetização

- [ ] Planos de assinatura
- [ ] Integração de pagamentos
- [ ] Limites por plano

### Fase 5 — Mobile Nativo

- [ ] App iOS (App Store)
- [ ] App Android (Play Store)
- [ ] Background location tracking

## Plataformas

| Plataforma | Status | Tecnologia |
|-----------|--------|-----------|
| Web (PWA) | Fase 1 | Next.js 15 |
| API | Fase 1 | NestJS |
| iOS | Fase 5 | Expo → EAS |
| Android | Fase 5 | Expo → EAS |

## Modelo de Negócio (Futuro)

- **Free**: 1 família, até 3 membros, localização básica
- **Family**: Famílias ilimitadas, histórico 30 dias, geofence
- **Premium**: Histórico completo, SOS, suporte prioritário

## Conformidade LGPD

- Consentimento explícito para compartilhamento de localização
- Direito de exclusão de dados (endpoint futuro)
- Dados mínimos necessários
- Política de privacidade e termos de uso (a criar)
