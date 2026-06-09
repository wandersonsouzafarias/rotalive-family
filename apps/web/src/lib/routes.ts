export const ROUTES = {
  login: '/login',
  register: '/register',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  families: '/families',
  profile: '/profile',
} as const;

export const POST_AUTH_ROUTE = ROUTES.onboarding;
